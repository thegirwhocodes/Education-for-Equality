import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  findOrCreateStudentByPhone,
  getStudentMemory,
  SABI_SYSTEM_PROMPT,
  VOICE_SYSTEM_ADDENDUM,
} from "@/lib/voice/sabi-shared";

// Allow up to 60 seconds for Claude streaming
export const maxDuration = 60;

const anthropic = new Anthropic();

/**
 * POST /api/sabi/voice/llm
 *
 * OpenAI-compatible chat completions endpoint for ElevenLabs Custom LLM.
 * ElevenLabs sends requests in OpenAI format; we translate to Claude,
 * inject student memory, and stream back in OpenAI format.
 *
 * This gives us: ElevenLabs voice (Olufunmilola) + our Sabi curriculum + persistent memory.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ElevenLabs sends OpenAI-format: { model, messages, stream, ... }
    const incomingMessages: Array<{ role: string; content: string }> = body.messages || [];
    const shouldStream = body.stream !== false;

    // Log what ElevenLabs transcribed so we can debug STT issues
    const lastUserMsg = incomingMessages.filter(m => m.role === "user").pop();
    if (lastUserMsg) {
      console.log(`[Sabi LLM] Child said: "${lastUserMsg.content}"`);
    }
    console.log(`[Sabi LLM] Total messages: ${incomingMessages.length}, stream: ${shouldStream}`);

    // Extract phone number from the conversation or dynamic variables
    // ElevenLabs can pass custom variables; phone comes from Twilio integration
    let phoneNumber = "";

    // Check for phone number in dynamic_variables or metadata
    if (body.dynamic_variables?.phone_number) {
      phoneNumber = body.dynamic_variables.phone_number;
    } else if (body.metadata?.phone_number) {
      phoneNumber = body.metadata.phone_number;
    }

    // Check the system message for phone number
    // ElevenLabs injects {{system__caller_id}} into the system prompt
    const systemMsg = incomingMessages.find((m) => m.role === "system");
    if (systemMsg && !phoneNumber) {
      // Match various formats: "caller_id: +234...", "phone_number: +234...", "phone number is: +1..."
      const phonePatterns = [
        /caller[_\s]?id[:\s]+(\+?[\d]+)/i,
        /phone[_\s]?number[:\s]+(\+?[\d]+)/i,
        /phone[_\s]?number\s+is[:\s]+(\+?[\d]+)/i,
        /(\+\d{10,15})/,  // Any international phone number
      ];
      for (const pattern of phonePatterns) {
        const match = systemMsg.content.match(pattern);
        if (match) {
          phoneNumber = match[1];
          break;
        }
      }
    }

    console.log(`[Sabi LLM] Phone: ${phoneNumber || "none"}, System msg: ${systemMsg ? "yes" : "no"}`);

    // Look up or create student by phone number
    let studentId: string | null = null;
    let memoryContext = "";

    if (phoneNumber) {
      try {
        const student = await findOrCreateStudentByPhone(phoneNumber);
        studentId = student.id;
        memoryContext = await getStudentMemory(studentId);
      } catch (err) {
        console.error("Student lookup error:", err);
      }
    }

    // Build system prompt with memory
    const systemPrompt = SABI_SYSTEM_PROMPT + VOICE_SYSTEM_ADDENDUM + memoryContext;

    // Convert OpenAI messages to Claude format (skip system messages)
    const claudeMessages = incomingMessages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      }));

    // Ensure at least one user message
    if (claudeMessages.length === 0) {
      claudeMessages.push({ role: "user", content: "Hi, I want to learn!" });
    }

    // Ensure messages alternate properly (Claude requirement)
    const validMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
    for (const msg of claudeMessages) {
      if (validMessages.length === 0) {
        if (msg.role === "assistant") {
          // First message must be user
          validMessages.push({ role: "user", content: "Hi!" });
        }
        validMessages.push(msg);
      } else {
        const lastRole = validMessages[validMessages.length - 1].role;
        if (msg.role === lastRole) {
          // Same role twice — merge content
          validMessages[validMessages.length - 1].content += " " + msg.content;
        } else {
          validMessages.push(msg);
        }
      }
    }

    if (shouldStream) {
      // Streaming response in OpenAI SSE format
      const stream = await anthropic.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: validMessages,
      });

      const encoder = new TextEncoder();
      const responseId = `chatcmpl-${Date.now()}`;

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                const chunk = {
                  id: responseId,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "sabi-tutor",
                  choices: [
                    {
                      index: 0,
                      delta: { content: event.delta.text },
                      finish_reason: null,
                    },
                  ],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              }
            }

            // Send final chunk
            const finalChunk = {
              id: responseId,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model: "sabi-tutor",
              choices: [
                {
                  index: 0,
                  delta: {},
                  finish_reason: "stop",
                },
              ],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            console.error("Stream error:", err);
            controller.error(err);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: validMessages,
      });

      const text = response.content[0]?.type === "text" ? response.content[0].text : "";

      return Response.json({
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: "sabi-tutor",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: text || "Hello! I'm Sabi, your learning friend. What is your name?" },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      });
    }
  } catch (error) {
    console.error("Custom LLM error:", error instanceof Error ? error.message : error);

    // Return a valid OpenAI-format error response
    return Response.json(
      {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: "sabi-tutor",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Hello! I'm Sabi, your learning friend. What is your name?",
            },
            finish_reason: "stop",
          },
        ],
      },
      { status: 200 } // Return 200 even on error so ElevenLabs doesn't break
    );
  }
}

import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Detect which SMS provider to use based on available env vars.
 * Africa's Talking is preferred for Nigerian numbers.
 */
function getSMSProvider(): "at" | "twilio" {
  if (process.env.AT_API_KEY && process.env.AT_USERNAME) return "at";
  return "twilio";
}

/**
 * Send an SMS via Africa's Talking
 */
async function sendATSMS(to: string, message: string): Promise<void> {
  const response = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      apiKey: process.env.AT_API_KEY!,
      Accept: "application/json",
    },
    body: new URLSearchParams({
      username: process.env.AT_USERNAME!,
      to,
      message,
      from: process.env.AT_SENDER_ID || "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AT SMS failed: ${response.status} ${errorText}`);
  }
}

/**
 * Send an SMS via Twilio or Africa's Talking (auto-detected)
 */
export async function sendSMS(
  to: string,
  message: string,
  smsType?: string
): Promise<void> {
  try {
    const provider = getSMSProvider();

    if (provider === "at") {
      await sendATSMS(to, message);
    } else {
      const client = getTwilioClient();
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to,
      });
    }

    // Log the SMS
    const supabase = getSupabase();
    await supabase.from("sabi_sms_log").insert({
      phone_number: to,
      direction: "outbound",
      message,
      sms_type: smsType || "general",
      channel: provider,
    });
  } catch (error) {
    console.error("SMS send error:", error);
  }
}

/**
 * Send a post-call session summary SMS
 */
export async function sendSessionSummary(
  phoneNumber: string,
  studentName: string,
  summary: string,
  correctCount: number,
  wrongCount: number,
  callbackNumber: string
): Promise<void> {
  const total = correctCount + wrongCount;
  const scoreText = total > 0 ? ` You got ${correctCount}/${total} correct!` : "";

  const message =
    `Great job today, ${studentName}! ${summary}${scoreText} ` +
    `Call ${callbackNumber} tomorrow for your next lesson!`;

  await sendSMS(phoneNumber, message, "summary");
}

/**
 * Send a practice question SMS
 */
export async function sendPracticeQuestion(
  phoneNumber: string,
  studentId: string,
  question: string,
  expectedAnswer: string
): Promise<void> {
  const message = `Quick practice: ${question} Reply with your answer!`;

  const supabase = getSupabase();

  // Send SMS
  await sendSMS(phoneNumber, message, "practice");

  // Store expected answer for checking when they reply
  await supabase.from("sabi_sms_log").insert({
    student_id: studentId,
    phone_number: phoneNumber,
    direction: "outbound",
    message,
    sms_type: "practice",
    expected_answer: expectedAnswer,
  });
}

/**
 * Send a daily reminder SMS
 */
export async function sendReminder(
  phoneNumber: string,
  studentName: string,
  lastTopic: string,
  callbackNumber: string
): Promise<void> {
  const message =
    `Hi ${studentName}! Ready for today's lesson? ` +
    `Last time you learned about ${lastTopic}. ` +
    `Call ${callbackNumber} now!`;

  await sendSMS(phoneNumber, message, "reminder");
}

/**
 * Check a student's SMS reply against expected answer
 */
export async function checkPracticeAnswer(
  phoneNumber: string,
  answer: string
): Promise<{ isCorrect: boolean; feedback: string } | null> {
  const supabase = getSupabase();

  // Find the most recent unanswered practice question for this phone
  const { data: question } = await supabase
    .from("sabi_sms_log")
    .select("*")
    .eq("phone_number", phoneNumber)
    .eq("sms_type", "practice")
    .eq("direction", "outbound")
    .is("actual_answer", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!question) return null;

  // Normalize answers for comparison
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const isCorrect = normalize(answer) === normalize(question.expected_answer);

  // Update the record
  await supabase
    .from("sabi_sms_log")
    .update({
      actual_answer: answer,
      is_correct: isCorrect,
    })
    .eq("id", question.id);

  const feedback = isCorrect
    ? "Correct! You're doing great. Keep it up!"
    : `Not quite — the answer is ${question.expected_answer}. You'll get it next time!`;

  return { isCorrect, feedback };
}

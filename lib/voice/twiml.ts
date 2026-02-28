import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

// Voice configuration — Nigerian-accented English
const VOICE_CONFIG = {
  voice: "Polly.Aditi" as const, // Indian English female — closest to Nigerian accent in Polly
  language: "en-IN" as const, // Closer to Nigerian English intonation than US/UK
};

// Speech recognition configuration
const SPEECH_CONFIG = {
  input: "speech" as const,
  speechTimeout: "auto" as const,
  language: "en-GH", // Ghanaian English — closest supported African English in Twilio
  speechModel: "phone_call" as const,
};

/**
 * Create a TwiML response that speaks text and gathers speech input
 */
export function createGatherResponse(
  sayText: string,
  actionUrl: string,
  options?: {
    hints?: string;
    timeout?: number;
    callSid?: string;
  }
): string {
  const response = new VoiceResponse();

  const gatherOpts: Record<string, string | number> = {
    ...SPEECH_CONFIG,
    action: actionUrl,
    method: "POST",
  };

  if (options?.hints) {
    gatherOpts.hints = options.hints;
  }
  if (options?.timeout) {
    gatherOpts.timeout = options.timeout;
  }
  if (options?.callSid) {
    gatherOpts.action = `${actionUrl}${actionUrl.includes("?") ? "&" : "?"}callSid=${options.callSid}`;
  }

  const gather = response.gather(gatherOpts);
  gather.say(VOICE_CONFIG, sayText);

  // If no input received, retry once
  response.say(VOICE_CONFIG, "I didn't hear you. Let me try again.");
  response.redirect({ method: "POST" }, actionUrl);

  return response.toString();
}

/**
 * Create a TwiML response that speaks text and ends the call
 */
export function createEndCallResponse(sayText: string): string {
  const response = new VoiceResponse();
  response.say(VOICE_CONFIG, sayText);
  response.hangup();
  return response.toString();
}

/**
 * Create a TwiML response that just speaks and redirects
 * (for intermediate responses that don't need input)
 */
export function createSayResponse(
  sayText: string,
  redirectUrl?: string
): string {
  const response = new VoiceResponse();
  response.say(VOICE_CONFIG, sayText);
  if (redirectUrl) {
    response.redirect({ method: "POST" }, redirectUrl);
  }
  return response.toString();
}

/**
 * Parse form-encoded body from Twilio webhook
 */
export function parseTwilioBody(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = body.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value !== undefined) {
      params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, " "));
    }
  }
  return params;
}

/**
 * Validate that a request comes from Twilio (signature check)
 */
export function validateTwilioRequest(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  return twilio.validateRequest(authToken, signature, url, params);
}

/**
 * Return TwiML content type header
 */
export function twimlHeaders(): HeadersInit {
  return {
    "Content-Type": "text/xml",
  };
}

/**
 * Verify an incoming request is actually from Twilio.
 * Returns true if valid, false if spoofed.
 * Skips validation in development (no auth token set).
 */
export function isTwilioRequest(req: { headers: Headers; url: string }, body: Record<string, string>): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return true; // skip in dev

  const signature = req.headers.get("x-twilio-signature") || "";
  if (!signature) return false;

  // Use the public URL for validation (Twilio signs against the full URL including query string)
  const parsed = new URL(req.url);
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}${parsed.pathname}${parsed.search}`
    : req.url;

  return twilio.validateRequest(authToken, signature, publicUrl, body);
}

#!/usr/bin/env tsx

type TestArgs = {
  baseUrl: string;
  concurrency: number;
  turns: number;
  recordingUrl: string;
  recordingTarget: "callback" | "incoming-completed";
  callerPrefix: string;
  sessionPrefix: string;
  timeoutMs: number;
  json: boolean;
};

type StepResult = {
  name: string;
  ok: boolean;
  status: number;
  latencyMs: number;
  hasRecord: boolean;
  hasPlay: boolean;
  hasSay: boolean;
  hasReject: boolean;
  error?: string;
  bodyPreview?: string;
};

type CallResult = {
  sessionId: string;
  callerNumber: string;
  ok: boolean;
  steps: StepResult[];
};

const DEFAULT_BASE_URL = "https://eduforequality.org";

function printHelp() {
  console.log(`Sabi Africa's Talking webhook stress test

Usage:
  npx tsx scripts/sabi-at-stress-test.ts [options]

Examples:
  # Low-cost smoke: incoming greeting only
  npx tsx scripts/sabi-at-stress-test.ts --turns 0

  # One synthetic full turn using a public recording URL
  npx tsx scripts/sabi-at-stress-test.ts --turns 1 --recording-url "https://example.com/child-answer.mp3"

  # Simulate AT's observed completed-call recording POST behavior
  npx tsx scripts/sabi-at-stress-test.ts --turns 1 --recording-url "https://example.com/child-answer.mp3" --recording-target incoming-completed

  # Small load ramp
  npx tsx scripts/sabi-at-stress-test.ts --concurrency 5 --turns 1 --recording-url "https://example.com/child-answer.mp3"

Options:
  --base-url <url>                Default: ${DEFAULT_BASE_URL}
  --concurrency <n>               Concurrent synthetic callers. Default: 1
  --turns <n>                     Recording turns after greeting. Default: 0
  --recording-url <url>           Public MP3/WAV URL for /at/recording tests
  --recording-target <mode>       callback | incoming-completed. Default: callback
  --caller-prefix <prefix>        Default: +234800000
  --session-prefix <prefix>       Default: stress
  --timeout-ms <n>                Per-request timeout. Default: 90000
  --json                          Print machine-readable results
  --help                          Show this message

Notes:
  - This hits real deployed webhooks by default and can consume LLM/TTS/STT credits.
  - Without --recording-url, turns > 0 will exercise the no-recording retry path only.
`);
}

function parseArgs(argv: string[]): TestArgs {
  const args: TestArgs = {
    baseUrl: DEFAULT_BASE_URL,
    concurrency: 1,
    turns: 0,
    recordingUrl: "",
    recordingTarget: "callback",
    callerPrefix: "+234800000",
    sessionPrefix: "stress",
    timeoutMs: 90_000,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }

    switch (arg) {
      case "--base-url":
        args.baseUrl = next.replace(/\/$/, "");
        break;
      case "--concurrency":
        args.concurrency = positiveInt(next, arg);
        break;
      case "--turns":
        args.turns = nonNegativeInt(next, arg);
        break;
      case "--recording-url":
        args.recordingUrl = next;
        break;
      case "--recording-target":
        if (next !== "callback" && next !== "incoming-completed") {
          throw new Error("--recording-target must be callback or incoming-completed");
        }
        args.recordingTarget = next;
        break;
      case "--caller-prefix":
        args.callerPrefix = next;
        break;
      case "--session-prefix":
        args.sessionPrefix = next;
        break;
      case "--timeout-ms":
        args.timeoutMs = positiveInt(next, arg);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
    i += 1;
  }

  return args;
}

function positiveInt(value: string, flag: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

function nonNegativeInt(value: string, flag: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${flag} must be a non-negative integer`);
  }
  return parsed;
}

function formBody(fields: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => params.append(key, value));
  return params.toString();
}

async function postForm(
  url: string,
  fields: Record<string, string>,
  timeoutMs: number,
  name: string
): Promise<StepResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody(fields),
      signal: controller.signal,
    });
    const text = await response.text();
    const latencyMs = Date.now() - startedAt;

    return {
      name,
      ok: response.ok && !/something went wrong|failed|error/i.test(text),
      status: response.status,
      latencyMs,
      hasRecord: /<Record\b/i.test(text),
      hasPlay: /<Play\b/i.test(text),
      hasSay: /<Say\b/i.test(text),
      hasReject: /<Reject\b/i.test(text),
      bodyPreview: compact(text).slice(0, 500),
    };
  } catch (error) {
    return {
      name,
      ok: false,
      status: 0,
      latencyMs: Date.now() - startedAt,
      hasRecord: false,
      hasPlay: false,
      hasSay: false,
      hasReject: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function compact(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractCallbackUrl(xml: string | undefined): string {
  if (!xml) return "";
  const match = xml.match(/\bcallBackUrl="([^"]+)"/i) || xml.match(/\bcallbackUrl="([^"]+)"/i);
  return match ? decodeXml(match[1]) : "";
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function simulateCall(index: number, args: TestArgs): Promise<CallResult> {
  const timestamp = Date.now();
  const sessionId = `${args.sessionPrefix}-${timestamp}-${index}`;
  const callerNumber = `${args.callerPrefix}${String(index).padStart(4, "0")}`;
  const steps: StepResult[] = [];

  const incomingFields = {
    callSessionState: "Ringing",
    direction: "Inbound",
    callerCountryCode: "234",
    callerNumber,
    sessionId,
    destinationNumber: "+2342017001459",
    callerCarrierName: "stress-test",
    callStartTime: new Date().toISOString(),
    isActive: "1",
  };

  const incoming = await postForm(
    `${args.baseUrl}/api/sabi/at/incoming`,
    incomingFields,
    args.timeoutMs,
    "incoming"
  );
  steps.push(incoming);

  let callbackUrl = extractCallbackUrl(incoming.bodyPreview);
  if (callbackUrl && callbackUrl.startsWith("/")) {
    callbackUrl = `${args.baseUrl}${callbackUrl}`;
  }

  for (let turn = 1; turn <= args.turns; turn += 1) {
    const recordingFields = {
      callSessionState: args.recordingTarget === "incoming-completed" ? "Completed" : "InProgress",
      direction: "Inbound",
      callerCountryCode: "234",
      callerNumber,
      sessionId,
      destinationNumber: "+2342017001459",
      callerCarrierName: "stress-test",
      isActive: args.recordingTarget === "incoming-completed" ? "0" : "1",
      durationInSeconds: String(20 + turn * 8),
      recordingUrl: args.recordingUrl,
    };

    const targetUrl =
      args.recordingTarget === "incoming-completed"
        ? `${args.baseUrl}/api/sabi/at/incoming`
        : callbackUrl || `${args.baseUrl}/api/sabi/at/recording?session=${encodeURIComponent(sessionId)}`;

    const recording = await postForm(
      targetUrl,
      recordingFields,
      args.timeoutMs,
      `recording-${turn}`
    );
    steps.push(recording);
    callbackUrl = extractCallbackUrl(recording.bodyPreview) || callbackUrl;
  }

  const ok = steps.every((step) => step.ok) && steps.every((step, stepIndex) => {
    if (stepIndex === 0 || stepIndex <= args.turns) {
      return step.hasRecord || step.hasReject;
    }
    return true;
  });

  return { sessionId, callerNumber, ok, steps };
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
}

function printHumanSummary(results: CallResult[], args: TestArgs) {
  const allSteps = results.flatMap((result) => result.steps);
  const failures = allSteps.filter((step) => !step.ok);
  const latencies = allSteps.map((step) => step.latencyMs);

  console.log("\nSabi AT Stress Test");
  console.log(`Base URL:          ${args.baseUrl}`);
  console.log(`Concurrent calls:  ${args.concurrency}`);
  console.log(`Turns per call:    ${args.turns}`);
  console.log(`Recording target:  ${args.recordingTarget}`);
  console.log(`Recording URL:     ${args.recordingUrl ? "provided" : "none; retry path only"}`);
  console.log("");
  console.log(`Calls OK:          ${results.filter((result) => result.ok).length}/${results.length}`);
  console.log(`Steps OK:          ${allSteps.length - failures.length}/${allSteps.length}`);
  console.log(`Latency p50/p95/p99: ${percentile(latencies, 50)}ms / ${percentile(latencies, 95)}ms / ${percentile(latencies, 99)}ms`);

  for (const result of results) {
    console.log(`\n${result.ok ? "PASS" : "FAIL"} ${result.sessionId} ${result.callerNumber}`);
    for (const step of result.steps) {
      const flags = [
        step.hasPlay ? "Play" : "",
        step.hasSay ? "Say" : "",
        step.hasRecord ? "Record" : "",
        step.hasReject ? "Reject" : "",
      ].filter(Boolean).join("+") || "none";
      console.log(
        `  ${step.ok ? "OK  " : "FAIL"} ${step.name.padEnd(12)} ${String(step.status).padStart(3)} ${String(step.latencyMs).padStart(6)}ms ${flags}`
      );
      if (!step.ok) {
        console.log(`      ${step.error || step.bodyPreview || "No error body"}`);
      }
    }
  }

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.turns > 0 && !args.recordingUrl) {
    console.warn("Warning: --turns > 0 without --recording-url exercises only the no-recording retry path.");
  }

  const results = await Promise.all(
    Array.from({ length: args.concurrency }, (_, index) => simulateCall(index + 1, args))
  );

  if (args.json) {
    console.log(JSON.stringify({ args, results }, null, 2));
  } else {
    printHumanSummary(results, args);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

"use client";

import { useState } from "react";

const API_LINES = [
  { kind: "command", text: "curl --request POST https://api.eduforequality.org/v1/voice/process \\" },
  { kind: "header", text: '  --header "Authorization: Bearer $SABI_API_KEY" \\' },
  { kind: "header", text: '  --header "Content-Type: application/json" \\' },
  { kind: "data", text: `  --data '{"audio":"BASE64_AUDIO","voice":"bukola","language":"en-NG"}'` },
] as const;

const API_SAMPLE = API_LINES.map((line) => line.text).join("\n");

export default function ApiCodeSample() {
  const [copyStatus, setCopyStatus] = useState("Copy request");

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(API_SAMPLE);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy request"), 1800);
    } catch {
      setCopyStatus("Copy unavailable");
      window.setTimeout(() => setCopyStatus("Copy request"), 1800);
    }
  }

  return (
    <div className="sabi-v2-terminal">
      <div className="sabi-v2-terminal__chrome">
        <div className="sabi-v2-terminal__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="sabi-v2-terminal__title">VOICE API <span>/</span> EXAMPLE REQUEST</span>
        <button type="button" onClick={copyRequest} aria-live="polite">
          {copyStatus}
        </button>
      </div>

      <pre className="sabi-v2-terminal__code" aria-label="Example curl request for the Sabi voice API">
        {API_LINES.map((line, index) => (
          <span key={line.kind + index} className={`sabi-v2-terminal__line is-${line.kind}`}>
            <span className="sabi-v2-terminal__line-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <code>{line.text}</code>
          </span>
        ))}
      </pre>

      <div className="sabi-v2-terminal__foot">
        <span>EN-NG · VOICE IN / VOICE OUT</span>
        <span>AUTHENTICATED REQUEST</span>
      </div>
    </div>
  );
}

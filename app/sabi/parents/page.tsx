"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PARENT_TEMPLATES,
  buildMessage,
  smsSegments,
  CAREGIVER_STATUS_LABELS,
  type CaregiverMessageStatus,
} from "@/lib/parent-sms";

type HistoryItem = {
  direction: string;
  message: string;
  smsType: string | null;
  channel: string | null;
  createdAt: string;
};

type Caregiver = {
  id: string;
  studentId: string | null;
  childCode: string;
  childName: string;
  caregiverName: string | null;
  caregiverPhone: string;
  network: string | null;
  callWindow: string | null;
  consentStatus: string | null;
  status: CaregiverMessageStatus;
  lastOutboundAt: string | null;
  lastInboundAt: string | null;
  history: HistoryItem[];
};

type Roster = {
  provider: { provider: string; ready: boolean; live: boolean; detail: string };
  sabiLine: string;
  setupNeeded: boolean;
  caregivers: Caregiver[];
};

const STATUS_KIND: Record<CaregiverMessageStatus, string> = {
  not_contacted: "soft",
  sent: "gold",
  replied: "good",
  follow_up_due: "warn",
};

function fmt(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function ParentsPage() {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("reminder");
  const [message, setMessage] = useState<string>("");
  const [confirm, setConfirm] = useState<null | { caregiver: Caregiver; message: string }>(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<null | { text: string; kind: string }>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sabi/parents");
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: Roster = await res.json();
      setRoster(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = useMemo(
    () => roster?.caregivers.find((c) => c.id === selectedId) || null,
    [roster, selectedId],
  );

  const ctx = useMemo(
    () =>
      selected
        ? {
            childName: selected.childName,
            caregiverName: selected.caregiverName || undefined,
            callWindow: selected.callWindow || undefined,
            sabiLine: roster?.sabiLine,
          }
        : { childName: "your child" },
    [selected, roster],
  );

  const applyTemplate = useCallback(
    (id: string) => {
      setTemplateId(id);
      setMessage(buildMessage(id, ctx));
    },
    [ctx],
  );

  useEffect(() => {
    if (selected) setMessage(buildMessage(templateId, ctx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function showToast(text: string, kind = "ink") {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3800);
  }

  async function doSend() {
    if (!confirm) return;
    setSending(true);
    try {
      const res = await fetch("/api/sabi/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          caregiverId: confirm.caregiver.id,
          to: confirm.caregiver.caregiverPhone,
          templateId,
          message: confirm.message,
          studentId: confirm.caregiver.studentId,
          confirmSend: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `${res.status}`);
      showToast(data.live ? "Message sent." : "Sent in test mode (sandbox) — it did not reach a real phone.", data.live ? "good" : "warn");
      setConfirm(null);
      load();
    } catch (e) {
      showToast(`Could not send: ${e instanceof Error ? e.message : String(e)}`, "bad");
    } finally {
      setSending(false);
    }
  }

  const seg = smsSegments(message);
  const provider = roster?.provider;

  return (
    <div className="pp-root">
      <style>{css}</style>
      <header className="pp-top">
        <div>
          <h1>Parent Messages</h1>
          <p>Text caregivers to remind, follow up, and gather feedback during the pre-pilot.</p>
        </div>
        <button className="pp-btn" onClick={load}>Refresh</button>
      </header>

      {provider && (
        <div className={`pp-banner ${provider.live ? "good" : provider.ready ? "warn" : "bad"}`}>
          <strong>{provider.live ? "Live delivery is on" : provider.ready ? "Test mode" : "Not configured"}</strong>
          <span>{provider.detail}</span>
        </div>
      )}

      {roster?.setupNeeded && (
        <div className="pp-banner warn">
          <strong>Pre-pilot roster not set up yet</strong>
          <span>Run the pre-pilot Supabase migration and add caregivers in the control room to populate this list.</span>
        </div>
      )}

      {error && <div className="pp-banner bad"><strong>Could not load</strong><span>{error}</span></div>}

      <div className="pp-grid">
        <section className="pp-list">
          <div className="pp-list-head">
            <h2>Caregivers</h2>
            <span className="pp-count">{roster?.caregivers.length || 0}</span>
          </div>
          {loading ? (
            <div className="pp-empty">Loading caregivers...</div>
          ) : roster && roster.caregivers.length ? (
            roster.caregivers.map((c) => (
              <button
                key={c.id}
                className={`pp-card ${selectedId === c.id ? "active" : ""}`}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="pp-card-top">
                  <span className="pp-child">{c.childName}</span>
                  <span className={`pp-pill ${STATUS_KIND[c.status]}`}>{CAREGIVER_STATUS_LABELS[c.status]}</span>
                </div>
                <div className="pp-care">{c.caregiverName || "Caregiver"} &middot; {c.caregiverPhone}</div>
                <div className="pp-meta">
                  {c.network ? <span>{c.network}</span> : null}
                  {c.callWindow ? <span>{c.callWindow}</span> : null}
                  {c.lastOutboundAt ? <span>Last text {fmt(c.lastOutboundAt)}</span> : <span>Not texted yet</span>}
                </div>
              </button>
            ))
          ) : (
            <div className="pp-empty">No caregivers with phone numbers yet. Add them in the pre-pilot control room.</div>
          )}
        </section>

        <section className="pp-compose">
          {!selected ? (
            <div className="pp-empty tall">Select a caregiver to write them a message.</div>
          ) : (
            <>
              <div className="pp-compose-head">
                <div>
                  <h2>{selected.childName}&rsquo;s caregiver</h2>
                  <div className="pp-sub">{selected.caregiverName || "Caregiver"} &middot; {selected.caregiverPhone}</div>
                </div>
                <span className={`pp-pill ${STATUS_KIND[selected.status]}`}>{CAREGIVER_STATUS_LABELS[selected.status]}</span>
              </div>

              <label className="pp-label">Template</label>
              <div className="pp-templates">
                {PARENT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className={`pp-chip ${templateId === t.id ? "active" : ""}`}
                    title={t.description}
                    onClick={() => applyTemplate(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <label className="pp-label">Message</label>
              <textarea
                className="pp-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Write your message to the caregiver..."
              />
              <div className="pp-segline">
                {seg.chars} characters &middot; {seg.segments} SMS{seg.segments === 1 ? "" : " segments"} &middot; {seg.encoding}
                {seg.segments > 1 ? <span className="pp-warn-text"> &middot; longer messages cost more</span> : null}
              </div>

              <div className="pp-actions">
                <button
                  className="pp-btn primary"
                  disabled={!message.trim() || !selected.caregiverPhone}
                  onClick={() => setConfirm({ caregiver: selected, message })}
                >
                  Send SMS
                </button>
                <span className="pp-hint">Goes to {selected.caregiverPhone}. Sabi line: {roster?.sabiLine}</span>
              </div>

              <div className="pp-history">
                <h3>Message history</h3>
                {selected.history.length ? (
                  selected.history.map((h, i) => (
                    <div key={i} className={`pp-msg ${h.direction === "inbound" ? "in" : "out"}`}>
                      <div className="pp-msg-meta">
                        <span>{h.direction === "inbound" ? "They wrote" : "We sent"}</span>
                        <span>{fmt(h.createdAt)}</span>
                      </div>
                      <div className="pp-msg-body">{h.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="pp-empty">No messages yet with this caregiver.</div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {confirm && (
        <div className="pp-modal-wrap" onClick={() => !sending && setConfirm(null)}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Send this text?</h2>
            <div className="pp-modal-to">To {confirm.caregiver.caregiverName || "caregiver"} &middot; <strong>{confirm.caregiver.caregiverPhone}</strong></div>
            <div className="pp-modal-msg">{confirm.message}</div>
            <div className={`pp-banner ${provider?.live ? "good" : "warn"}`}>
              <span>{provider?.live ? "This will send a real SMS to this caregiver." : "Provider is in test mode — this will not reach a real phone."}</span>
            </div>
            <div className="pp-modal-actions">
              <button className="pp-btn" onClick={() => setConfirm(null)} disabled={sending}>Cancel</button>
              <button className="pp-btn primary" onClick={doSend} disabled={sending}>{sending ? "Sending..." : "Yes, send"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`pp-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}

const css = `
.pp-root { max-width: 1180px; margin: 0 auto; padding: 28px 22px 60px; font-family: "Lexend", ui-sans-serif, system-ui, sans-serif; color: #201a13; }
.pp-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.pp-top h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 34px; font-weight: 600; margin: 0; }
.pp-top p { margin: 4px 0 0; color: #857a68; font-size: 14px; }
.pp-btn { font: inherit; font-weight: 400; border: 1px solid #d9cdaf; border-radius: 9px; background: #fffdf8; color: #201a13; min-height: 38px; padding: 8px 16px; cursor: pointer; transition: background 140ms, border-color 140ms; }
.pp-btn:hover { border-color: #cba868; background: #faf4e6; }
.pp-btn.primary { background: #201a13; border-color: #201a13; color: #f6efe0; }
.pp-btn.primary:hover { background: #33291c; }
.pp-btn:disabled { opacity: .5; cursor: not-allowed; }
.pp-banner { display: flex; flex-direction: column; gap: 2px; border: 1px solid; border-radius: 12px; padding: 12px 15px; margin-bottom: 14px; font-size: 13px; line-height: 1.45; }
.pp-banner strong { font-size: 13.5px; }
.pp-banner.good { background: #e6f3ea; color: #1e7b43; border-color: #b9dcc6; }
.pp-banner.warn { background: #faf0da; color: #9b5b00; border-color: #ecd3a2; }
.pp-banner.bad { background: #fbeeec; color: #b42318; border-color: #f0c1ba; }
.pp-grid { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 16px; align-items: start; }
.pp-list { display: grid; gap: 8px; }
.pp-list-head { display: flex; align-items: center; justify-content: space-between; padding: 2px 4px; }
.pp-list-head h2 { font-size: 15px; font-weight: 600; margin: 0; }
.pp-count { font-size: 12px; color: #857a68; background: #f4ead4; border-radius: 99px; padding: 2px 9px; }
.pp-card { text-align: left; border: 1px solid #e8dfc9; background: #fffdf8; border-radius: 13px; padding: 13px 15px; cursor: pointer; display: grid; gap: 5px; transition: border-color 140ms, background 140ms; }
.pp-card:hover { border-color: #cba868; background: #faf4e6; }
.pp-card.active { border-color: #cba868; background: #f4ead4; box-shadow: inset 3px 0 0 #cba868; }
.pp-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pp-child { font-weight: 500; font-size: 14.5px; }
.pp-care { color: #4c4438; font-size: 12.5px; }
.pp-meta { display: flex; flex-wrap: wrap; gap: 8px; color: #857a68; font-size: 11.5px; }
.pp-meta span::after { content: ""; }
.pp-pill { font-size: 11px; border-radius: 99px; padding: 2px 9px; border: 1px solid #d9cdaf; background: #fff; color: #4c4438; white-space: nowrap; }
.pp-pill.good { background: #e6f3ea; color: #1e7b43; border-color: #b9dcc6; }
.pp-pill.warn { background: #faf0da; color: #9b5b00; border-color: #ecd3a2; }
.pp-pill.gold { background: #f4ead4; color: #9a7536; border-color: #e0cd9f; }
.pp-pill.soft { background: #faf6ec; color: #857a68; border-color: #e8dfc9; }
.pp-compose { border: 1px solid #e8dfc9; background: #fffdf8; border-radius: 15px; padding: 18px 20px; min-height: 300px; box-shadow: 0 6px 22px rgba(45,36,20,.06); }
.pp-compose-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.pp-compose-head h2 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 23px; font-weight: 600; margin: 0; }
.pp-sub { color: #857a68; font-size: 13px; margin-top: 2px; }
.pp-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #857a68; font-weight: 600; margin: 12px 0 7px; }
.pp-templates { display: flex; flex-wrap: wrap; gap: 7px; }
.pp-chip { font: inherit; font-size: 12.5px; border: 1px solid #d9cdaf; background: #fff; color: #4c4438; border-radius: 99px; padding: 6px 13px; cursor: pointer; transition: background 140ms, border-color 140ms; }
.pp-chip:hover { border-color: #cba868; background: #faf4e6; }
.pp-chip.active { background: #201a13; border-color: #201a13; color: #f6efe0; }
.pp-textarea { width: 100%; border: 1px solid #d9cdaf; border-radius: 11px; padding: 12px 13px; font: inherit; font-size: 14px; line-height: 1.5; resize: vertical; background: #fff; color: #201a13; }
.pp-textarea:focus { outline: 2px solid #cba868; outline-offset: 1px; }
.pp-segline { font-size: 11.5px; color: #857a68; margin-top: 6px; }
.pp-warn-text { color: #9b5b00; }
.pp-actions { display: flex; align-items: center; gap: 12px; margin: 16px 0 6px; flex-wrap: wrap; }
.pp-hint { font-size: 11.5px; color: #857a68; }
.pp-history { margin-top: 20px; border-top: 1px solid #e8dfc9; padding-top: 14px; }
.pp-history h3 { font-size: 13px; font-weight: 600; margin: 0 0 10px; }
.pp-msg { border: 1px solid #e8dfc9; border-radius: 11px; padding: 9px 12px; margin-bottom: 8px; background: #fffdf8; }
.pp-msg.in { background: #e6f3ea; border-color: #b9dcc6; }
.pp-msg.out { background: #faf4e6; border-color: #e0cd9f; }
.pp-msg-meta { display: flex; justify-content: space-between; gap: 10px; font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; color: #857a68; font-weight: 600; margin-bottom: 4px; }
.pp-msg-body { font-size: 13.5px; line-height: 1.45; white-space: pre-wrap; }
.pp-empty { color: #857a68; padding: 22px; text-align: center; border: 1px dashed #d9cdaf; border-radius: 11px; background: #fbf8ef; font-size: 13px; }
.pp-empty.tall { padding: 60px 22px; }
.pp-modal-wrap { position: fixed; inset: 0; background: rgba(30,22,12,.4); display: grid; place-items: center; z-index: 60; padding: 20px; }
.pp-modal { background: #fffdf8; border: 1px solid #d9cdaf; border-radius: 16px; padding: 22px; max-width: 460px; width: 100%; box-shadow: 0 24px 60px rgba(45,36,20,.24); }
.pp-modal h2 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 24px; font-weight: 600; margin: 0 0 6px; }
.pp-modal-to { font-size: 13px; color: #4c4438; margin-bottom: 10px; }
.pp-modal-msg { background: #faf4e6; border: 1px solid #e0cd9f; border-radius: 10px; padding: 12px; font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; margin-bottom: 12px; }
.pp-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
.pp-toast { position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); z-index: 80; padding: 11px 18px; border-radius: 99px; font-size: 13px; font-weight: 500; box-shadow: 0 10px 30px rgba(45,36,20,.22); border: 1px solid #201a13; background: #1b1610; color: #f1e6cd; }
.pp-toast.good { background: #e6f3ea; color: #1e7b43; border-color: #b9dcc6; }
.pp-toast.warn { background: #faf0da; color: #9b5b00; border-color: #ecd3a2; }
.pp-toast.bad { background: #fbeeec; color: #b42318; border-color: #f0c1ba; }
@media (max-width: 900px) { .pp-grid { grid-template-columns: 1fr; } }
`;

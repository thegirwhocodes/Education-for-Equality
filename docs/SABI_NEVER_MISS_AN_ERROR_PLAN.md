# Sabi — "No User Error Ever Slips Again" Monitoring Plan

**Owner:** Naomi (non-technical operator). **Built + run by:** the monitoring agent + Claude Code.
**Promise:** every error a real user hits is captured, understood, and brought to Naomi in plain
English — automatically, with nothing depending on her ability to code or open Sentry.

---

## 0. The core insight (why the login bug slipped)

The broken login was **not a crash**. The server was healthy; the app simply told the user
"wrong password." Ordinary crash-tracking (Sentry's default) never fires on that, because nothing
threw an exception. **So "catch every error" cannot mean "catch every crash."** It has to mean:

1. Catch crashes **and** every *handled* failure a user is shown (error banners, failed submits).
2. **Drive the real flows ourselves** on a schedule so we notice breakage even when no user reports it.
3. Make the whole thing **self-watching**, so the monitor can't quietly die.

Everything below is built on those three ideas.

---

## 1. What must be true (the three guarantees)

1. **Total capture** — nothing a user experiences as a failure is invisible.
2. **The agent does the work** — triage, root cause, and a proposed fix, in plain language.
3. **Lock-proof** — if any part stops working, Naomi is told; the monitor is itself monitored.

---

## 2. Architecture — five layers

### Layer 1 — Capture every user-facing failure (not just crashes)
- **Web app (Vercel):** Sentry browser SDK already installed. Add explicit reporting so **every error
  banner shown to a user also reports to Sentry** — "sign-in failed: wrong password", "couldn't load
  tasks", "sign-off failed". A helper (`reportUserFacingError()`) wraps every `setMessage(error)` call
  site. Tag each with the flow (sign-in, sign-up, sign-off, dashboard) and the user's role.
- **Phone pipeline (Hetzner sabi-server):** Sentry already installed. Ensure every call that ends
  badly (STT unclear, LLM/TTS failure, dropped call, false-wrong) reports a structured event with the
  call id + failure reason (the sidecars already hold this).
- **Real-user signals:** track failed logins, repeated retries, "rage" repeats, and dropped calls as
  first-class events so patterns ("5 users failed login this morning") surface, not just one-offs.

### Layer 2 — A synthetic "robot user" (this is what would have caught the login bug)
A scheduled robot that **actually performs the critical journeys** every few minutes and screams if
one breaks:
- **Web:** sign up a throwaway account → confirm → log in → open dashboard → open advisor board →
  sign off a test task. If any step fails, alert **before a real user ever sees it.**
- **Phone:** a known-answer canary call through the AudioSocket path (the replay harness already
  exists) → verify Sabi hears + grades correctly.
- **Uptime:** ping `api.eduforequality.org/health`, `eduforequality.org`, and the Supabase project
  every minute. (This is exactly the Jun-2026 "Supabase down" failure — it would have been caught in
  60 seconds instead of by accident.)

### Layer 3 — The autonomous monitoring agent (does all the thinking)
Runs **on a schedule (daily) and on every alert.** It:
1. Pulls from Sentry (via the **Sentry MCP**), the robot-user results, and uptime.
2. **Triages** — groups + dedupes + ranks by *how many real users are affected*.
3. **Diagnoses root cause** — Sentry **Seer/Autofix** + Claude read the traces and explain *why*.
4. **Reports to Naomi in plain English** (see Layer 5).
5. **Proposes or drafts the fix** — a PR with the change + a test. Ships automatically only for
   safe, low-risk fixes; **anything on the call path or child-safety waits for Naomi's one-tap OK.**

### Layer 4 — Lock-proof (the monitor is itself monitored)
The part that makes it *bulletproof*, not just "set up once and hope":
- **Dead-man's switch / heartbeat.** The monitoring agent checks in on every run via a **Sentry Cron
  Monitor**. If it *misses* a run — i.e. the monitor itself died — **Naomi gets alerted about the
  silence.** A monitor that stops silently is the classic failure; this closes it.
- **Redundant alert channels.** Critical alerts go out **two ways** (SMS **and** email, optionally
  Slack) so one channel failing can't swallow an alert.
- **Coverage is enforced, not hoped for.** A checklist test asserts that every user-facing error path
  reports; if a new page ships without reporting, CI flags it.
- **Escalation ladder.** Info → daily digest. User-facing breakage → immediate SMS. Child-safety or
  "phone pipeline down" → immediate SMS to Naomi **and** the backup focal point.

### Layer 5 — How Naomi experiences it (zero technical work)
She never opens Sentry. It all comes to her, in plain language:
- **Real-time SMS** when a real user hits a wall: *"⚠️ 2 people couldn't sign in in the last hour —
  looks like unconfirmed emails. I've drafted a fix. Reply OK to ship it."*
- **A daily plain-English health text/email:** *"Sabi is healthy. 47 calls, 0 failed. Web sign-in
  working. 1 minor issue auto-fixed."*
- **One-tap approvals** for agent-proposed fixes — reply "OK" / tap a link. No dashboards, no code.
- **A weekly digest** with the week's errors, what was fixed, and what needs her.

---

## 3. Sabi coverage map (every surface a user touches)

| Surface | What we watch | How |
|---|---|---|
| **Sign up / sign in / Google / magic link** | broken flows, failed logins, email delivery | robot-user journey every few min + user-facing-error capture |
| **Confirmation / reset emails (Resend)** | do they actually send + arrive | synthetic send + delivery check |
| **Dashboard / lessons** | load failures, blank states | error capture + robot user |
| **Advisor board / task sign-off** | Notion errors, failed sign-offs | error capture + robot user |
| **Phone call pipeline** | STT/LLM/TTS failures, dropped calls, false-wrong | sidecar events + canary call |
| **Uptime** | server/app/Supabase down | 1-min health pings |
| **Child-safety alerts** | any risk-flag firing | immediate dual-channel escalation |
| **Scheduled jobs (callbacks, crons)** | a job silently stops | Sentry Cron Monitors |

---

## 4. What "lock proof" means concretely (the guarantees)

- If a **user hits any error**, it is captured within seconds and, if it affects more than one person,
  Naomi gets an SMS.
- If a **critical flow breaks** (login, calls), the robot user catches it within minutes — **before**
  most real users do.
- If **the monitoring itself stops**, the dead-man's switch alerts Naomi about the silence.
- If **one alert channel fails**, a second delivers.
- **No action requires Naomi to code or open Sentry** — she reads plain English and taps approve.

---

## 5. What I build vs. what only Naomi can do

**I (agent) build/run everything technical:** the user-facing-error capture, the robot user,
the scheduled agent, the Sentry MCP wiring, the plain-English reporter, the dead-man's switch, the
escalation ladder, all code + deploys.

**Naomi does ~3 one-time clicks (I'll hand you exact steps):**
1. In Sentry: enable the **Seer** add-on + the **Claude Agent** integration (paste the Anthropic key).
2. Confirm the **phone number(s)** for SMS alerts (yours + backup).
3. Approve the first couple of agent-proposed fixes so we calibrate what auto-ships vs. asks first.

---

## 6. Rollout (fastest value first)

- **Phase 1 (day 1): Stop the bleeding.** Turn on Seer/Autofix; add user-facing-error capture to the
  web app (would have caught the login bug); stand up uptime pings + the daily plain-English health
  text. → *You immediately hear about any user error.*
- **Phase 2 (week 1): The robot user.** Synthetic sign-up→login→dashboard journey + phone canary +
  email-delivery check on a schedule. → *Breakage is caught before real users.*
- **Phase 3 (week 2): The autonomous agent + lock-proof.** Scheduled triage agent with Sentry MCP,
  root-cause + drafted fixes, dead-man's switch, dual-channel escalation, one-tap approvals.
- **Phase 4 (ongoing): Tighten.** Expand coverage, tune what auto-ships, weekly digest.

---

## 7. Success criteria

- Time from "a user hits an error" → "Naomi knows" drops from **days/accidental** to **seconds–minutes.**
- Every critical flow has a robot-user check; every user-facing error path reports.
- The monitor has a monitor (dead-man's switch proven by a drill).
- Naomi operates it entirely through plain-English messages + one-tap approvals.

---

*Human-in-the-loop stays mandatory for anything on the call path or child-safety: the agent triages
and drafts, Naomi approves before it ships to children.*

import Link from "next/link";
import ApiCodeSample from "@/components/sabi/marketing/ApiCodeSample";
import VoiceCallDemo from "@/components/sabi/marketing/VoiceCallDemo";
import { ArrowIcon, MicIcon } from "@/components/sabi/marketing/Icons";
import { FOUNDER_QUOTE, PHONE_FACTS, PILOT, PROBLEM_STATS } from "@/lib/sabi/content";
import { SABI_ROUTES } from "@/lib/sabi/site";

const METRICS = [
  {
    value: PROBLEM_STATS[0].value,
    label: PROBLEM_STATS[0].label,
    source: PROBLEM_STATS[0].source,
    tag: "LEARNING GAP",
  },
  {
    value: "600M",
    label: "people in Africa have no internet access.",
    source: "Connectivity gap",
    tag: "OFFLINE BY DEFAULT",
  },
  {
    value: `${PHONE_FACTS[2].value}%`,
    label: "2G network coverage across the continent.",
    source: "Infrastructure already in place",
    tag: "VOICE-READY",
  },
];

const PIPELINE_STEPS = [
  {
    label: "USER DIALS",
    title: "Any phone can call.",
    body: "A child uses the handset already at home. No app, account, or data bundle to install.",
  },
  {
    label: "VOICE ID",
    title: "Sabi knows who is speaking.",
    body: "New callers introduce themselves once. Returning learners are recognized and welcomed back.",
  },
  {
    label: "LOW-LATENCY LESSON",
    title: "A tutor adapts in real time.",
    body: "Speech recognition and a curriculum-aware lesson meet a warm Nigerian voice on the line.",
  },
  {
    label: "LEARNING STATE",
    title: "Progress carries forward.",
    body: "Sabi remembers the learner’s level and last mistakes, then picks up where the next call should begin.",
  },
] as const;

export default function SabiHome() {
  return (
    <div className="sabi-v2">
      <section className="sabi-v2-hero">
        <div className="sabi-v2-container sabi-v2-hero-grid">
          <div className="sabi-v2-hero-copy">
            <p className="sabi-v2-kicker">
              <span className="sabi-v2-kicker__dot" aria-hidden="true" />
              VOICE-FIRST LEARNING · BUILT FOR 2G
            </p>
            <h1 className="sabi-v2-title">
              The tutor who
              <span>picks up the phone.</span>
            </h1>
            <p className="sabi-v2-lede">
              Sabi teaches children to read and count through focused five-minute voice calls. It works on an ordinary
              handset over 2G, with no smartphone, internet connection, or data plan.
            </p>
            <div className="sabi-v2-actions">
              <Link href={SABI_ROUTES.talk} className="sabi-v2-button sabi-v2-button--primary">
                <span className="sabi-v2-button__icon"><MicIcon size={14} /></span>
                Launch voice demo
                <ArrowIcon size={15} />
              </Link>
              <Link href={SABI_ROUTES.evidence} className="sabi-v2-text-link">
                Read the evidence
                <ArrowIcon size={15} />
              </Link>
            </div>
            <div className="sabi-v2-meaning">
              <span className="sabi-v2-meaning__mark" aria-hidden="true">sa·bi</span>
              <div>
                <p>/sah-bee/ · Nigerian Pidgin</p>
                <span>To know; to understand.</span>
              </div>
            </div>
          </div>

          <VoiceCallDemo />
        </div>
      </section>

      <section className="sabi-v2-proof-strip" aria-label="Designed for any phone">
        <ul>
          {["Any handset", "No internet", "No data plan", "Free for families"].map((item) => (
            <li key={item}>
              <span className="sabi-v2-proof-check" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="sabi-v2-section" id="evidence">
        <div className="sabi-v2-container">
          <div className="sabi-v2-section-head">
            <div>
              <p className="sabi-v2-eyebrow">01 / THE ACCESS GAP</p>
              <h2>Talent is everywhere.<br /><span>Access isn&apos;t.</span></h2>
            </div>
            <div>
              <p>
                Learning should not depend on a smartphone or a stable connection. Sabi starts with the technology
                millions of families already know how to use: a phone call.
              </p>
              <Link href={SABI_ROUTES.evidence} className="sabi-v2-inline-link">
                Explore the evidence and methodology <ArrowIcon size={15} />
              </Link>
            </div>
          </div>

          <div className="sabi-v2-metrics">
            {METRICS.map((metric, index) => (
              <article
                key={metric.value}
                className={`sabi-v2-metric ${index === 0 ? "sabi-v2-metric--lead" : ""}`}
              >
                <div className="sabi-v2-metric__top">
                  <span className="sabi-v2-metric__index">0{index + 1} / IMPACT</span>
                  <span className="sabi-v2-metric__badge">{metric.tag}</span>
                </div>
                <div className="sabi-v2-metric__bottom">
                  <p className="sabi-v2-metric__value">{metric.value}</p>
                  <p className="sabi-v2-metric__label">{metric.label}</p>
                  <p className="sabi-v2-metric__source">{metric.source}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sabi-v2-distribution">
        <div className="sabi-v2-container">
          <div className="sabi-v2-distribution-card">
            <div className="sabi-v2-distribution-copy">
              <p className="sabi-v2-eyebrow">02 / THE DISTRIBUTION ADVANTAGE</p>
              <h2>Don&apos;t wait for a new device. Teach on the one already there.</h2>
              <p>
                A phone line is already familiar, already shared, and already within reach. We built a tutor for the
                network families have—not another app to find and download.
              </p>
              <blockquote className="sabi-v2-founder-quote">
                “{FOUNDER_QUOTE}”
                <cite>Naomi Ivie · Founder, Education for Equality</cite>
              </blockquote>
            </div>
            <div className="sabi-v2-distribution-data" aria-label="Mobile phone access">
              {PHONE_FACTS.slice(0, 2).map((fact) => (
                <div key={fact.label} className="sabi-v2-phone-fact">
                  <strong>{fact.value}%</strong>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sabi-v2-section sabi-v2-pipeline" id="how-it-works">
        <div className="sabi-v2-container">
          <div className="sabi-v2-section-head">
            <div>
              <p className="sabi-v2-eyebrow">03 / THE VOICE PIPELINE</p>
              <h2>From a hello<br /><span>to a lesson that remembers.</span></h2>
            </div>
            <div>
              <p>
                One short call becomes a personal learning loop: identity, a responsive lesson, and a next step ready
                for tomorrow.
              </p>
              <Link href={SABI_ROUTES.howItWorks} className="sabi-v2-inline-link">
                See the complete call flow <ArrowIcon size={15} />
              </Link>
            </div>
          </div>

          <div className="sabi-v2-pipeline-grid">
            {PIPELINE_STEPS.map((step, index) => (
              <article className="sabi-v2-step" key={step.label}>
                <div className="sabi-v2-step__top">
                  <span className="sabi-v2-step__number">0{index + 1}</span>
                  <span className="sabi-v2-step__signal"><i aria-hidden="true" />{step.label}</span>
                </div>
                <div className="sabi-v2-step__content">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="sabi-v2-pipeline-foot">
            <span><strong>One idea per call.</strong> The next lesson starts where the learner left off.</span>
            <span><strong>Lagos pilot:</strong> {PILOT.when} · {PILOT.size}</span>
          </div>
        </div>
      </section>

      <section className="sabi-v2-api-section" id="developers">
        <div className="sabi-v2-container">
          <div className="sabi-v2-api-card">
            <div className="sabi-v2-api-copy">
              <p className="sabi-v2-eyebrow">04 / FOR DEVELOPERS</p>
              <h2>Rent the voice layer. Build for the last mile.</h2>
              <p>
                Speech recognition, a tutor-ready language model, and a Nigerian voice in one call-ready pipeline.
                Designed for low-bandwidth voice experiences.
              </p>
              <div className="sabi-v2-api-pricing">
                <div>
                  <span>VOICE PIPELINE</span>
                  <strong>$0.06 <small>/ minute</small></strong>
                </div>
                <div>
                  <span>MONTHLY SANDBOX</span>
                  <strong>1,000 <small>minutes included</small></strong>
                </div>
              </div>
              <Link href={SABI_ROUTES.developers} className="sabi-v2-api-link">
                Explore developer access <ArrowIcon size={15} />
              </Link>
            </div>
            <ApiCodeSample />
          </div>
        </div>
      </section>

      <section className="sabi-v2-final">
        <div className="sabi-v2-container">
          <div className="sabi-v2-final-card">
            <div>
              <p className="sabi-v2-eyebrow">LAGOS PILOT · {PILOT.when}</p>
              <h2>Make the next call count.</h2>
              <p>
                Sabi is preparing a pilot for {PILOT.size} {PILOT.detail}. Bring the voice tutor to a community, or build
                with the pipeline.
              </p>
            </div>
            <div className="sabi-v2-final-actions">
              <Link href={SABI_ROUTES.partners} className="sabi-v2-button sabi-v2-button--primary">
                Partner on a pilot <ArrowIcon size={15} />
              </Link>
              <Link href={SABI_ROUTES.families} className="sabi-v2-text-link">
                For families <ArrowIcon size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

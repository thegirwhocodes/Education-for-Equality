/**
 * Canonical hosts and shared structured data.
 *
 * The app is served on two hosts:
 *   - eduforequality.org      — the Education for Equality organisation site
 *   - sabi.eduforequality.org — the Sabi product site (middleware rewrites
 *                               `/` -> `/sabi`, `/pricing` -> `/sabi/pricing`, etc.)
 *
 * Both hosts serve the same Sabi pages, so every page must declare exactly one
 * canonical URL or Google will treat them as duplicates and pick its own.
 * Sabi pages canonicalise to the sabi. subdomain; organisation pages to the apex.
 */

export const SITE_URL = "https://eduforequality.org";
export const SABI_URL = "https://sabi.eduforequality.org";

export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;
export const SABI_ID = `${SABI_URL}/#sabi`;

const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/educationforequality/",
  "https://www.instagram.com/_educationforequality/",
];

export const AWARDS = [
  "MIT Sloan Africa Business Challenge — 2nd place",
  "Wesleyan New Venture Awards — Grand Prize",
  "UNICEF AI Ventures Accelerator — inaugural cohort",
  "Schmidt Futures x Rhodes Trust Rise for the World — finalist",
  "Patricelli Center for Entrepreneurship — Social Impact Fellow",
];

/**
 * Next.js only auto-attaches a file-based `opengraph-image` to segments that do
 * not declare their own `openGraph` object. Any page overriding `openGraph`
 * (to set its own `url`) must therefore name the image explicitly, or it ships
 * with no social/preview card at all.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Education for Equality — the nonprofit building Sabi, an AI tutor children reach by phone call",
};

export const SABI_OG_IMAGE = {
  url: `${SITE_URL}/sabi/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Sabi — the AI tutor children reach by phone call",
};

/** Open Graph block for an Education for Equality page. */
export function orgOpenGraph(path = "") {
  return { url: `${SITE_URL}${path}`, images: [OG_IMAGE] };
}

/** Open Graph block for a Sabi product page (canonical host is the subdomain). */
export function sabiOpenGraph(path = "") {
  return { url: `${SABI_URL}${path}`, images: [SABI_OG_IMAGE] };
}

/** The founder, so search engines can tie the brand to a real person. */
export const founderNode = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Naomi Ivie",
  jobTitle: "Founder",
  affiliation: { "@type": "CollegeOrUniversity", name: "Wesleyan University" },
  worksFor: { "@id": ORG_ID },
};

/** The publishing organisation. */
export const organizationNode = {
  "@type": ["Organization", "NGO"],
  "@id": ORG_ID,
  name: "Education for Equality",
  url: SITE_URL,
  email: "info@eduforequality.org",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    caption: "Education for Equality",
  },
  description:
    "Education for Equality is a nonprofit building Sabi, an AI tutor that teaches children over an ordinary phone call — reaching learners with no internet and no smartphone.",
  slogan: "Quality education for every child, over any phone.",
  areaServed: [
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Place", name: "Africa" },
  ],
  founder: { "@id": FOUNDER_ID },
  award: AWARDS,
  nonprofitStatus: "Nonprofit501c3",
  sameAs: SOCIAL_PROFILES,
};

/**
 * Sabi itself, as a named product entity. Declared with a stable @id so the
 * organisation site and the product subdomain describe *one* entity rather
 * than two competing ones.
 */
export const sabiProductNode = {
  "@type": "SoftwareApplication",
  "@id": SABI_ID,
  name: "Sabi",
  alternateName: ["Sabi AI", "Sabi AI tutor", "Sabi by Education for Equality"],
  url: SABI_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any phone — voice call only, no app and no internet",
  description:
    "Sabi is an AI tutor a child reaches by calling a phone number. It teaches foundational literacy and numeracy in short spoken lessons, remembers each learner between calls, and needs no smartphone, internet, or data.",
  disambiguatingDescription:
    "Sabi (pronounced /sah-bee/, Nigerian Pidgin for \"to know\") is a voice AI tutor for children in Nigeria, an initiative of Education for Equality.",
  featureList: [
    "Works on any phone, including a basic feature phone on 2G",
    "No app, no internet connection, and no data cost to the family",
    "Adaptive 5–7 minute literacy and numeracy lessons",
    "Remembers each child's name, level, and past mistakes between calls",
    "Nigerian-English and Pidgin speech recognition and voice",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: "Primary-school children in Nigeria and across Africa",
  },
  inLanguage: ["en-NG", "en"],
  publisher: { "@id": ORG_ID },
  creator: { "@id": FOUNDER_ID },
  award: AWARDS,
};

/** The recorded demo call, so the video can surface on brand queries. */
export const sabiVideoNode = {
  "@type": "VideoObject",
  name: "Sabi — an AI tutor a child reaches by phone call",
  description:
    "A recorded demonstration of Sabi, the AI tutor children in Nigeria reach by dialling an ordinary phone number.",
  embedUrl: "https://www.youtube.com/embed/KUGy9RsFXzA",
  contentUrl: "https://www.youtube.com/watch?v=KUGy9RsFXzA",
  thumbnailUrl: "https://i.ytimg.com/vi/KUGy9RsFXzA/maxresdefault.jpg",
  uploadDate: "2026-04-01",
  publisher: { "@id": ORG_ID },
  about: { "@id": SABI_ID },
};

/**
 * Questions people actually type about Sabi. Every answer here is also rendered
 * as visible copy on /sabi — structured data must not describe hidden content.
 */
export const SABI_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is Sabi?",
    answer:
      "Sabi is an AI tutor that a child reaches by calling an ordinary phone number. It teaches foundational reading and maths in short spoken lessons, with no smartphone, no internet, and no data cost to the family. Sabi is an initiative of Education for Equality.",
  },
  {
    question: "What does the name Sabi mean?",
    answer:
      "Sabi is pronounced /sah-bee/ and means \"to know\" in Nigerian Pidgin.",
  },
  {
    question: "How does Sabi work?",
    answer:
      "A child dials the number. Sabi greets them by name — new callers introduce themselves once, returning callers are recognised instantly — then teaches one concept in a focused five to seven minute lesson, using scenarios the child knows such as market transactions and Naira. Sabi gets harder when the child is ready and slows down when they struggle, and remembers where they left off for the next call.",
  },
  {
    question: "Do you need internet or a smartphone to use Sabi?",
    answer:
      "No. Sabi runs entirely over a voice call, so it works on a five-dollar feature phone with 2G coverage. There is no app to download, no data to buy, and no account to create.",
  },
  {
    question: "How much does Sabi cost?",
    answer:
      "Families pay no subscription and need no data plan. Developers and organisations can license the same African-accent voice pipeline from $0.06 per minute, with 1,000 minutes included every month.",
  },
  {
    question: "Where does Sabi operate?",
    answer:
      "Sabi is built for Nigeria and the wider African continent. A Lagos pilot is planned for Q4 2026 with 100 to 500 students in high-burden local government areas.",
  },
  {
    question: "Who built Sabi?",
    answer:
      "Sabi is an initiative of Education for Equality, the organisation founded by Naomi Ivie. Its work has been recognised by the MIT Sloan Africa Business Challenge, the Wesleyan New Venture Awards, the UNICEF AI Ventures Accelerator, and Schmidt Futures x Rhodes Trust Rise for the World.",
  },
];

export const sabiFaqNode = {
  "@type": "FAQPage",
  "@id": `${SABI_URL}/#faq`,
  mainEntity: SABI_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

/** Serialise a @graph for a <script type="application/ld+json"> tag. */
export function jsonLdGraph(nodes: object[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}

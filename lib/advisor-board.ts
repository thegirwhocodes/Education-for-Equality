export type AdvisorStatus = 'not_contacted' | 'drafted' | 'sent' | 'responded' | 'follow_up_due' | 'blocked';

export type AdvisorRole =
  | 'education-policy'
  | 'curriculum-operations'
  | 'field-education'
  | 'legal'
  | 'governance'
  | 'technology';

export interface AdvisorProfile {
  id: string;
  name: string;
  shortName: string;
  role: AdvisorRole;
  title: string;
  email?: string;
  agreementFile: string;
  focus: string[];
  firstMeetingAsk: string;
  relationshipNote: string;
}

export interface AdvisorTask {
  id: string;
  title: string;
  status: 'todo' | 'waiting' | 'done';
  dueLabel: string;
}

export interface AdvisorRuntimeState {
  status: AdvisorStatus;
  lastSentAt?: string;
  lastResponseAt?: string;
  lastSubject?: string;
  gmailThreadId?: string;
  notes: string;
  tasks: AdvisorTask[];
}

export const advisorProfiles: AdvisorProfile[] = [
  {
    id: 'adefisayo',
    name: 'Hon. Mrs. Folasade Adefisayo',
    shortName: 'Adefisayo',
    role: 'education-policy',
    title: 'Former Lagos Commissioner of Education',
    agreementFile: '7. Legal & IP/advisor-agreements/01_Adefisayo.pdf',
    focus: ['Lagos education policy', 'LASUBEB path', 'government credibility'],
    firstMeetingAsk:
      'Invite her to the first advisory meeting and ask for guidance on Lagos government positioning.',
    relationshipNote:
      'High-prestige education-policy advisor. Keep the tone formal, concise, and deeply respectful.',
  },
  {
    id: 'sonia-ivie',
    name: 'Dr. Sonia Ivie, EdD',
    shortName: 'Sonia',
    role: 'field-education',
    title: 'Former Director of Schools, EKOEXCEL/NewGlobe',
    email: 'simplysonia30@gmail.com',
    agreementFile: '7. Legal & IP/advisor-agreements/02_Sonia_Ivie.pdf',
    focus: ['Lagos school reality', 'child assessment', 'field access'],
    firstMeetingAsk:
      'Ask her to help shape the first advisory meeting agenda and confirm field-review priorities.',
    relationshipNote:
      "Naomi's mom. Warm, familiar, not corporate. This relationship gets benefit-of-the-doubt language.",
  },
  {
    id: 'odigboh',
    name: 'Rhoda Odigboh',
    shortName: 'Rhoda',
    role: 'curriculum-operations',
    title: 'CEO, Kizazi; former Regional Director of Academics, NewGlobe',
    agreementFile: '7. Legal & IP/advisor-agreements/03_Odigboh.pdf',
    focus: ['curriculum operations', 'government adoption', 'school-system scale'],
    firstMeetingAsk:
      'Invite her to advise on turning Sabi from prototype into a school-system-ready intervention.',
    relationshipNote:
      'Operator with pedagogy and scale experience. Emphasize practical build-review, not vague prestige.',
  },
  {
    id: 'tanimola',
    name: 'Remi Tanimola',
    shortName: 'Remi',
    role: 'field-education',
    title: 'Public primary school practitioner',
    agreementFile: '7. Legal & IP/advisor-agreements/04_Tanimola.pdf',
    focus: ['child fit', 'teacher reality', 'age appropriateness'],
    firstMeetingAsk:
      'Invite her to bring the practical child-facing lens to the first advisory conversation.',
    relationshipNote:
      'Use plain, warm language. Her value is practical experience with children, not institutional branding.',
  },
  {
    id: 'richard-ivie',
    name: 'Richard Ivie',
    shortName: 'Richard',
    role: 'governance',
    title: 'Executive Director, Corruption Observatory',
    email: 'ceo@corruptionobservatory.com',
    agreementFile: '7. Legal & IP/advisor-agreements/05_Richard_Ivie.pdf',
    focus: ['governance', 'anti-corruption', 'institutional trust'],
    firstMeetingAsk:
      'Invite him to advise on clean governance, public-sector credibility, and funder-facing controls.',
    relationshipNote:
      'Governance advisor. Keep it respectful, clear, and oriented around institutional integrity.',
  },
  {
    id: 'joshua-ivie',
    name: 'Joshua Ivie',
    shortName: 'Joshua',
    role: 'technology',
    title: 'Head of Innovation, Bluechip Technologies',
    email: 'joshuaivie.me@gmail.com',
    agreementFile: '7. Legal & IP/advisor-agreements/06_Joshua_Ivie.pdf',
    focus: ['technical architecture', 'Africa enterprise tech', 'scale readiness'],
    firstMeetingAsk:
      'Invite him to review the first advisory meeting through the lens of infrastructure and scale.',
    relationshipNote:
      'Technical family advisor. Warm but direct; ask for practical review of systems and risks.',
  },
  {
    id: 'ogunlewe',
    name: 'Barrister Adejoke Ogunlewe',
    shortName: 'Ogunlewe',
    role: 'legal',
    title: "NGO and children's-rights law specialist",
    agreementFile: '7. Legal & IP/advisor-agreements/07_Ogunlewe.pdf',
    focus: ['CAC/501(c)(3)', 'child safeguarding', 'legal risk'],
    firstMeetingAsk:
      "Invite her to advise on legal structure, children's data, and regulatory hygiene.",
    relationshipNote:
      'Formal legal advisor. Keep claims careful and avoid overpromising what the board has approved.',
  },
];

export function createInitialAdvisorState(profile: AdvisorProfile): AdvisorRuntimeState {
  return {
    status: 'not_contacted',
    notes: profile.relationshipNote,
    tasks: [
      {
        id: `${profile.id}-first-meeting`,
        title: 'Invite to first advisory meeting',
        status: 'todo',
        dueLabel: 'Now',
      },
      {
        id: `${profile.id}-agreement`,
        title: 'Confirm advisor agreement/signature status',
        status: 'waiting',
        dueLabel: 'This week',
      },
    ],
  };
}

export function firstMeetingEmail(profile: AdvisorProfile): { subject: string; body: string } {
  const greeting = profile.id === 'sonia-ivie' ? 'Mum,' : `Dear ${profile.shortName},`;
  const closing = profile.id === 'sonia-ivie' ? 'Love,\nNaomi' : 'With gratitude,\nNaomi Ivie';

  return {
    subject: 'First Education for Equality advisory meeting',
    body: [
      greeting,
      'I am pulling together the first Education for Equality advisory meeting and would be grateful to have you in that conversation.',
      'The goal is practical: align the advisory board around what Sabi is now, what we need before the Lagos pilot, and where I most need guidance from each person.',
      profile.firstMeetingAsk,
      'I will send a short agenda before the meeting so the ask is clear and respectful of your time. For now, I just wanted to confirm your availability and bring everyone into one coordinated advisory rhythm.',
      'Would you be open to joining the first call if I send a few time options?',
      closing,
    ].join('\n\n'),
  };
}

export function followUpEmail(profile: AdvisorProfile): { subject: string; body: string } {
  const greeting = profile.id === 'sonia-ivie' ? 'Mum,' : `Dear ${profile.shortName},`;
  const closing = profile.id === 'sonia-ivie' ? 'Love,\nNaomi' : 'With gratitude,\nNaomi Ivie';

  return {
    subject: 'Following up on Education for Equality advisory meeting',
    body: [
      greeting,
      'Just following up on my note about the first Education for Equality advisory meeting.',
      'No pressure if this week is full. I am trying to get the advisory board into one clear rhythm before the Lagos pilot work accelerates, and your perspective would really help shape the next steps.',
      'Would you be open to joining if I send a few time options?',
      closing,
    ].join('\n\n'),
  };
}

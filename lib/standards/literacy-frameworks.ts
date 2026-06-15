import type { ExternalStandardRef } from './types';

const CAMBRIDGE_ENGLISH = 'Cambridge Primary English 0058 / English as a Second Language 0057';
const NERDC_BASIC_ENGLISH = 'NERDC Basic Education Curriculum - English Studies';
const GPF_READING = 'Global Proficiency Framework - Reading';
const CAMBRIDGE_ENGLISH_FRAMEWORK_URL =
  'https://static1.squarespace.com/static/59edc421bff200ece07aaea0/t/60dad8440bfa8e5dd66dbdec/1624954952253/English+Curriculum+Framework+0058.pdf';
const GPF_READING_MATH_URL =
  'https://uis.unesco.org/sites/default/files/medias/fichiers/2025/08/Global-Proficiency-Framework-18Oct2019_KD%20%281%29.pdf';

export const cambridgePrimaryEnglishFoundations = {
  phonologicalAwareness: {
    id: 'cambridge-english-phonological-awareness-foundational',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Primary Stages 1-3 foundation; supports Stage 4 reading',
    strand: 'Reading',
    topic: 'Sounds, words, and early decoding readiness',
    description:
      'Learners hear and manipulate sounds in words, blend sounds orally, segment words, and build readiness for print decoding.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  vocabularyOralLanguage: {
    id: 'cambridge-english-vocabulary-oral-language-foundational',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Primary Stages 1-4',
    strand: 'Speaking and listening',
    topic: 'Vocabulary and oral expression',
    description:
      'Learners understand and use vocabulary in everyday contexts, describe experiences, and speak clearly for different purposes.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  listeningComprehension: {
    id: 'cambridge-english-listening-comprehension-foundational',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Primary Stages 1-4',
    strand: 'Speaking and listening',
    topic: 'Listening comprehension and response',
    description:
      'Learners listen to stories or information, recall details, infer meaning, retell events, and answer questions orally.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  grammarOralComposition: {
    id: 'cambridge-english-grammar-oral-composition-foundational',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Primary Stages 1-4',
    strand: 'Writing readiness / Speaking',
    topic: 'Sentence grammar and oral composition',
    description:
      'Learners produce complete sentences, use tense and descriptive language, ask and answer questions, and organize spoken ideas.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
} satisfies Record<string, ExternalStandardRef>;

export const cambridgePrimaryEnglishStage4Objectives = {
  readUnfamiliarWords: {
    id: 'cambridge-english-0058-4Rw.01',
    code: '4Rw.01',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Reading',
    topic: 'Word reading',
    description:
      'Use effective strategies to read unfamiliar words accurately and confidently, including using phonic, morphological and grammatical knowledge, segmenting and contextual information.',
    relation: 'supports',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
    reviewNotes:
      'Phase 1 voice lessons support the phonological/oral foundation for this objective; full reading mastery requires Phase 2 print/app support.',
  },
  useContextForSynonyms: {
    id: 'cambridge-english-0058-4Rv.01',
    code: '4Rv.01',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Reading',
    topic: 'Vocabulary and language',
    description: 'Use context to suggest synonyms for unfamiliar words.',
    relation: 'supports',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  commonRootsMeanings: {
    id: 'cambridge-english-0058-4Rv.02',
    code: '4Rv.02',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Reading',
    topic: 'Vocabulary and language',
    description: 'Explore words with common roots and compare their meanings.',
    relation: 'supports',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  specialisedVocabulary: {
    id: 'cambridge-english-0058-4Wv.01',
    code: '4Wv.01',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Writing',
    topic: 'Vocabulary and language',
    description: 'Use specialised vocabulary accurately to match a familiar topic.',
    relation: 'teaches',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  speakAccuratelyAtLength: {
    id: 'cambridge-english-0058-4SLm.01',
    code: '4SLm.01',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Speaking and Listening',
    topic: 'Making yourself understood',
    description: 'Speak with accuracy and sometimes at length in a range of familiar contexts.',
    relation: 'teaches',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  sequenceForListener: {
    id: 'cambridge-english-0058-4SLm.02',
    code: '4SLm.02',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Speaking and Listening',
    topic: 'Making yourself understood',
    description: "Sequence relevant information to aid the listener's understanding.",
    relation: 'teaches',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  preciseVocabularyInSpeech: {
    id: 'cambridge-english-0058-4SLm.03',
    code: '4SLm.03',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Speaking and Listening',
    topic: 'Making yourself understood',
    description: 'Use vocabulary precisely to make the meaning clear.',
    relation: 'teaches',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
  listenAndRespond: {
    id: 'cambridge-english-0058-4SLs.01',
    code: '4SLs.01',
    framework: CAMBRIDGE_ENGLISH,
    subject: 'English',
    stageOrBand: 'Stage 4',
    strand: 'Speaking and Listening',
    topic: 'Showing understanding',
    description: 'Listen and respond appropriately, including asking and answering questions to develop ideas.',
    relation: 'teaches',
    verificationStatus: 'verified_official',
    sourceUrl: CAMBRIDGE_ENGLISH_FRAMEWORK_URL,
  },
} satisfies Record<string, ExternalStandardRef>;

export const nerdcEnglishFoundations = {
  phonicsAndSounds: {
    id: 'nerdc-english-phonics-sound-awareness-foundational',
    framework: NERDC_BASIC_ENGLISH,
    subject: 'English Studies',
    stageOrBand: 'Lower Basic to Middle Basic support',
    theme: 'Reading and phonics',
    topic: 'Sounds, letters, and word recognition readiness',
    description:
      'Learners develop awareness of speech sounds, sound-letter relationships, blending, segmentation, and early reading readiness.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  oralEnglishVocabulary: {
    id: 'nerdc-english-oral-vocabulary-foundational',
    framework: NERDC_BASIC_ENGLISH,
    subject: 'English Studies',
    stageOrBand: 'Lower Basic to Middle Basic support',
    theme: 'Oral English',
    topic: 'Vocabulary, speaking, and listening',
    description:
      'Learners build oral vocabulary, listen and respond to spoken English, and use clear expressions in familiar contexts.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  comprehension: {
    id: 'nerdc-english-listening-reading-comprehension-foundational',
    framework: NERDC_BASIC_ENGLISH,
    subject: 'English Studies',
    stageOrBand: 'Lower Basic to Middle Basic support',
    theme: 'Comprehension',
    topic: 'Listening and reading comprehension readiness',
    description:
      'Learners answer literal, inferential, and main-idea questions from oral stories and short informational passages.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  grammar: {
    id: 'nerdc-english-grammar-sentence-structure-foundational',
    framework: NERDC_BASIC_ENGLISH,
    subject: 'English Studies',
    stageOrBand: 'Lower Basic to Middle Basic support',
    theme: 'Grammar and structure',
    topic: 'Sentence formation, tenses, and descriptive language',
    description:
      'Learners form complete sentences, use common tenses, ask and answer questions, and use describing/comparing words.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
} satisfies Record<string, ExternalStandardRef>;

export const gpfReadingFoundations = {
  preReading: {
    id: 'gpf-reading-pre-reading-oral-foundations',
    framework: GPF_READING,
    subject: 'Reading',
    stageOrBand: 'Pre-A1 / emergent foundational skill',
    topic: 'Oral language and phonological awareness',
    description:
      'Learner demonstrates oral-language and sound-awareness foundations that prepare for decoding and reading comprehension.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
    sourceUrl: GPF_READING_MATH_URL,
    reviewNotes:
      'GPF is a measurement/proficiency reference. Sabi Phase 1 maps to oral precursor skills, not a certification or full print-reading claim.',
  },
  comprehensionOral: {
    id: 'gpf-reading-listening-comprehension-foundational',
    framework: GPF_READING,
    subject: 'Reading',
    stageOrBand: 'Foundational comprehension support',
    topic: 'Oral comprehension as reading-readiness proxy',
    description:
      'Learner listens to short texts, recalls facts, makes simple inferences, and identifies main ideas before print reading is secure.',
    relation: 'assesses',
    verificationStatus: 'working_crosswalk',
    sourceUrl: GPF_READING_MATH_URL,
    reviewNotes:
      'Listening comprehension is useful as a pre-reading signal; reading comprehension must be tested with print/app once available.',
  },
} satisfies Record<string, ExternalStandardRef>;

export const foundationalLiteracyStandardRefs = {
  cambridge: cambridgePrimaryEnglishFoundations,
  cambridgeStage4: cambridgePrimaryEnglishStage4Objectives,
  nerdc: nerdcEnglishFoundations,
  gpf: gpfReadingFoundations,
};

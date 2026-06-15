import type { ExternalStandardRef } from './types';

const CAMBRIDGE_ENGLISH = 'Cambridge Primary English 0058 / English as a Second Language 0057';
const NERDC_BASIC_ENGLISH = 'NERDC Basic Education Curriculum - English Studies';
const GPF_READING = 'Global Proficiency Framework - Reading';

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
  },
} satisfies Record<string, ExternalStandardRef>;

export const foundationalLiteracyStandardRefs = {
  cambridge: cambridgePrimaryEnglishFoundations,
  nerdc: nerdcEnglishFoundations,
  gpf: gpfReadingFoundations,
};

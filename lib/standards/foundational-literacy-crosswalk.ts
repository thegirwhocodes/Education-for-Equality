import type { SabiLessonAlignment, SabiModuleAlignment, SabiSkill } from './types';
import {
  cambridgePrimaryEnglishFoundations as cambridge,
  gpfReadingFoundations as gpf,
  nerdcEnglishFoundations as nerdc,
} from './literacy-frameworks';

export const foundationalLiteracySkills: SabiSkill[] = [
  {
    id: 'fl-phonemic-awareness-basic',
    subject: 'foundational-literacy',
    name: 'Basic phonemic and phonological awareness',
    description:
      'Hear differences between sounds and words, identify beginning/ending sounds, recognize rhymes, count syllables, and blend sounds orally.',
    deliverySuitability: 'voice_only',
    prerequisiteSkillIds: [],
    masteryCriteria: [
      {
        id: 'fl-phonemic-awareness-basic-mastery',
        description:
          'Learner identifies beginning/ending sounds, recognizes/produces rhymes, counts syllables, and blends 2-4 sounds orally.',
        evidence: ['beginning_sound_prompts', 'rhyming_prompts', 'syllable_prompts', 'module_1_assessment'],
      },
    ],
    standardRefs: [cambridge.phonologicalAwareness, nerdc.phonicsAndSounds, gpf.preReading],
  },
  {
    id: 'fl-oral-vocabulary',
    subject: 'foundational-literacy',
    name: 'Oral vocabulary and everyday expression',
    description:
      'Build practical vocabulary for body, health, home, family, community, market, transport, nature, and daily routines.',
    deliverySuitability: 'voice_only',
    prerequisiteSkillIds: [],
    masteryCriteria: [
      {
        id: 'fl-oral-vocabulary-mastery',
        description:
          'Learner understands target words, uses them in meaningful spoken sentences, and explains simple relationships or categories.',
        evidence: ['word_meaning_prompts', 'sentence_generation_prompts', 'module_2_vocabulary_assessment'],
      },
    ],
    standardRefs: [cambridge.vocabularyOralLanguage, nerdc.oralEnglishVocabulary, gpf.preReading],
  },
  {
    id: 'fl-listening-comprehension',
    subject: 'foundational-literacy',
    name: 'Listening comprehension and oral retelling',
    description:
      'Listen to short stories and informational passages, retell events, identify problem/solution, infer feelings, and identify main ideas.',
    deliverySuitability: 'voice_only',
    prerequisiteSkillIds: ['fl-oral-vocabulary'],
    masteryCriteria: [
      {
        id: 'fl-listening-comprehension-mastery',
        description:
          'Learner answers literal and inferential questions, retells a short passage in order, and identifies the main idea.',
        evidence: ['retell_prompts', 'inference_prompts', 'main_idea_prompts', 'module_3_assessment'],
      },
    ],
    standardRefs: [cambridge.listeningComprehension, nerdc.comprehension, gpf.comprehensionOral],
  },
  {
    id: 'fl-oral-grammar',
    subject: 'foundational-literacy',
    name: 'Oral grammar and sentence control',
    description:
      'Use complete sentences, verb tenses, question words, answers, adjectives, comparatives, and superlatives in speech.',
    deliverySuitability: 'voice_only',
    prerequisiteSkillIds: ['fl-oral-vocabulary', 'fl-listening-comprehension'],
    masteryCriteria: [
      {
        id: 'fl-oral-grammar-mastery',
        description:
          'Learner forms complete spoken sentences, shifts tense correctly in common cases, asks/answers questions, and describes/compares objects.',
        evidence: ['sentence_expansion_prompts', 'tense_prompts', 'question_answer_prompts', 'module_4_assessment'],
      },
    ],
    standardRefs: [cambridge.grammarOralComposition, nerdc.grammar, nerdc.oralEnglishVocabulary],
  },
  {
    id: 'fl-advanced-phonemic-awareness',
    subject: 'foundational-literacy',
    name: 'Advanced phonemic awareness and sound-letter readiness',
    description:
      'Segment phonemes, delete/substitute sounds, and connect first sound-letter pairs orally as preparation for print-supported decoding.',
    deliverySuitability: 'voice_supported',
    prerequisiteSkillIds: ['fl-phonemic-awareness-basic'],
    masteryCriteria: [
      {
        id: 'fl-advanced-phonemic-awareness-mastery',
        description:
          'Learner segments 3-4 sound words, manipulates first/last/middle sounds, and demonstrates readiness for print-supported sound-letter mapping.',
        evidence: ['segmentation_prompts', 'deletion_prompts', 'substitution_prompts', 'phase_1_exit_assessment'],
      },
    ],
    standardRefs: [cambridge.phonologicalAwareness, nerdc.phonicsAndSounds, gpf.preReading],
  },
];

export const foundationalLiteracyModuleCrosswalk: SabiModuleAlignment[] = [
  {
    moduleId: 'fl-module-1',
    title: 'Phonemic Awareness',
    pathway: 'foundational',
    levelBand: 'Oral pre-reading foundation',
    lessonRange: 'Lessons 1-16',
    deliveryModes: ['voice'],
    skillIds: ['fl-phonemic-awareness-basic'],
    standardRefs: [cambridge.phonologicalAwareness, nerdc.phonicsAndSounds, gpf.preReading],
    exitCriteria: [
      {
        id: 'fl-module-1-exit',
        description:
          'Learner identifies beginning/ending sounds, recognizes rhymes, counts syllables, and blends 2-4 sounds orally.',
        evidence: ['lesson_16_module_assessment', 'diagnostic_phonemic_awareness'],
      },
    ],
    notes: 'Strong voice-only fit. This is reading readiness, not full print reading.',
  },
  {
    moduleId: 'fl-module-2',
    title: 'Oral Vocabulary Building',
    pathway: 'foundational',
    levelBand: 'Oral language foundation',
    lessonRange: 'Lessons 17-32',
    deliveryModes: ['voice'],
    skillIds: ['fl-oral-vocabulary'],
    standardRefs: [cambridge.vocabularyOralLanguage, nerdc.oralEnglishVocabulary, gpf.preReading],
    exitCriteria: [
      {
        id: 'fl-module-2-exit',
        description:
          'Learner understands and uses practical vocabulary across body, home, community, market, transport, nature, and routines.',
        evidence: ['lesson_32_vocabulary_assessment', 'sentence_generation_prompts'],
      },
    ],
  },
  {
    moduleId: 'fl-module-3',
    title: 'Listening Comprehension',
    pathway: 'foundational',
    levelBand: 'Comprehension foundation',
    lessonRange: 'Lessons 17b-32b',
    deliveryModes: ['voice'],
    skillIds: ['fl-listening-comprehension'],
    standardRefs: [cambridge.listeningComprehension, nerdc.comprehension, gpf.comprehensionOral],
    exitCriteria: [
      {
        id: 'fl-module-3-exit',
        description:
          'Learner retells, identifies problem/solution, makes simple inferences, and identifies main idea from oral texts.',
        evidence: ['lesson_32b_module_assessment', 'retell_and_inference_score'],
      },
    ],
    notes: 'Use as a reading-comprehension precursor until print/app support is present.',
  },
  {
    moduleId: 'fl-module-4',
    title: 'Oral English and Grammar',
    pathway: 'foundational',
    levelBand: 'Oral grammar and expression foundation',
    lessonRange: 'Lessons 33-48',
    deliveryModes: ['voice'],
    skillIds: ['fl-oral-grammar'],
    standardRefs: [cambridge.grammarOralComposition, nerdc.grammar, nerdc.oralEnglishVocabulary],
    exitCriteria: [
      {
        id: 'fl-module-4-exit',
        description:
          'Learner forms complete spoken sentences, uses common tenses, asks/answers questions, and describes/compares items.',
        evidence: ['lesson_48_module_assessment', 'sentence_and_tense_score'],
      },
    ],
  },
  {
    moduleId: 'fl-module-5',
    title: 'Advanced Phonemic Awareness',
    pathway: 'foundational',
    levelBand: 'Phase 1 exit into print-supported decoding',
    lessonRange: 'Lessons 33b-48b',
    deliveryModes: ['voice', 'app', 'print_bridge'],
    skillIds: ['fl-advanced-phonemic-awareness'],
    standardRefs: [cambridge.phonologicalAwareness, nerdc.phonicsAndSounds, gpf.preReading],
    exitCriteria: [
      {
        id: 'fl-module-5-exit',
        description:
          'Learner segments, deletes, and substitutes sounds and is ready for Phase 2 print-supported phonics/decoding.',
        evidence: ['lesson_48b_phase_1_exit_assessment', 'sound_letter_readiness_score'],
      },
    ],
    notes:
      'This module may introduce sound-letter associations orally, but full reading claims require print, app, or adult-supported visual materials.',
  },
];

const lesson = (
  lessonId: string,
  title: string,
  skillIds: string[],
  standardRefs: SabiLessonAlignment['standardRefs'],
  voiceSuitability: SabiLessonAlignment['voiceSuitability'] = 'voice_only',
  notes?: string,
): SabiLessonAlignment => ({
  lessonId,
  title,
  pathway: 'foundational',
  deliveryModes: voiceSuitability === 'voice_only' ? ['voice'] : ['voice', 'app', 'print_bridge'],
  skillIds,
  standardRefs,
  voiceSuitability,
  diagnosticSignals: [`${lessonId}_readiness`, `${skillIds[0]}_gap`],
  masteryEvidence: [`${lessonId}_independent_check`, `${skillIds[0]}_mastery_signal`],
  notes,
});

export const foundationalLiteracyReviewSampleLessonCrosswalk: SabiLessonAlignment[] = [
  lesson('fl-voice-1', 'Environmental Sounds vs. Speech Sounds', ['fl-phonemic-awareness-basic'], [
    cambridge.phonologicalAwareness,
    nerdc.phonicsAndSounds,
    gpf.preReading,
  ]),
  lesson('fl-voice-5', 'What Is Rhyming? Recognizing Rhyming Pairs', ['fl-phonemic-awareness-basic'], [
    cambridge.phonologicalAwareness,
    nerdc.phonicsAndSounds,
    gpf.preReading,
  ]),
  lesson('fl-voice-14', 'Blending 3 Sounds: CVC Words', ['fl-phonemic-awareness-basic'], [
    cambridge.phonologicalAwareness,
    nerdc.phonicsAndSounds,
    gpf.preReading,
  ]),
  lesson('fl-voice-27', 'Market Words: Buying and Selling', ['fl-oral-vocabulary'], [
    cambridge.vocabularyOralLanguage,
    nerdc.oralEnglishVocabulary,
  ]),
  lesson(
    'fl-voice-32b',
    'Listening Comprehension Assessment: The School Garden',
    ['fl-listening-comprehension'],
    [cambridge.listeningComprehension, nerdc.comprehension, gpf.comprehensionOral],
    'voice_supported',
    'Useful external-review sample because it tests oral comprehension and inference.',
  ),
  lesson(
    'fl-voice-45b',
    'First Letter-Sound Pairs',
    ['fl-advanced-phonemic-awareness'],
    [cambridge.phonologicalAwareness, nerdc.phonicsAndSounds, gpf.preReading],
    'voice_supported',
    'Reviewer must check that this is labelled readiness/support, not full print reading.',
  ),
];

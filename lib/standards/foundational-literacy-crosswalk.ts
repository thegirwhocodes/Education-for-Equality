import type { SabiLessonAlignment, SabiModuleAlignment, SabiSkill } from './types';
import {
  cambridgePrimaryEnglishFoundations as cambridge,
  cambridgePrimaryEnglishStage4Objectives as cambridgeStage4,
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
    standardRefs: [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading],
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
    standardRefs: [
      cambridge.vocabularyOralLanguage,
      cambridgeStage4.specialisedVocabulary,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.oralEnglishVocabulary,
      gpf.preReading,
    ],
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
    standardRefs: [cambridge.listeningComprehension, cambridgeStage4.listenAndRespond, nerdc.comprehension, gpf.comprehensionOral],
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
    standardRefs: [
      cambridge.grammarOralComposition,
      cambridgeStage4.speakAccuratelyAtLength,
      cambridgeStage4.sequenceForListener,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.grammar,
      nerdc.oralEnglishVocabulary,
    ],
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
    standardRefs: [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading],
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
    standardRefs: [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading],
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
    standardRefs: [
      cambridge.vocabularyOralLanguage,
      cambridgeStage4.specialisedVocabulary,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.oralEnglishVocabulary,
      gpf.preReading,
    ],
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
    standardRefs: [cambridge.listeningComprehension, cambridgeStage4.listenAndRespond, nerdc.comprehension, gpf.comprehensionOral],
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
    standardRefs: [
      cambridge.grammarOralComposition,
      cambridgeStage4.speakAccuratelyAtLength,
      cambridgeStage4.sequenceForListener,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.grammar,
      nerdc.oralEnglishVocabulary,
    ],
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
    standardRefs: [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading],
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

const literacyStandardRefsForSkill = (skillId: string): SabiLessonAlignment['standardRefs'] => {
  if (skillId === 'fl-phonemic-awareness-basic') {
    return [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading];
  }

  if (skillId === 'fl-oral-vocabulary') {
    return [
      cambridge.vocabularyOralLanguage,
      cambridgeStage4.specialisedVocabulary,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.oralEnglishVocabulary,
      gpf.preReading,
    ];
  }

  if (skillId === 'fl-listening-comprehension') {
    return [cambridge.listeningComprehension, cambridgeStage4.listenAndRespond, nerdc.comprehension, gpf.comprehensionOral];
  }

  if (skillId === 'fl-oral-grammar') {
    return [
      cambridge.grammarOralComposition,
      cambridgeStage4.speakAccuratelyAtLength,
      cambridgeStage4.sequenceForListener,
      cambridgeStage4.preciseVocabularyInSpeech,
      nerdc.grammar,
      nerdc.oralEnglishVocabulary,
    ];
  }

  return [cambridge.phonologicalAwareness, cambridgeStage4.readUnfamiliarWords, nerdc.phonicsAndSounds, gpf.preReading];
};

const literacyLessonSpecs = [
  ['fl-voice-1', 'Environmental Sounds vs. Speech Sounds - Hearing Differences', 'fl-phonemic-awareness-basic'],
  ['fl-voice-2', 'Beginning Sounds - Identifying the First Sound in a Word', 'fl-phonemic-awareness-basic'],
  ['fl-voice-3', 'Beginning Sounds Practice - Sorting Words by First Sound', 'fl-phonemic-awareness-basic'],
  ['fl-voice-4', 'Ending Sounds - Identifying the Last Sound in a Word', 'fl-phonemic-awareness-basic'],
  ['fl-voice-5', 'What Is Rhyming? Recognizing Rhyming Pairs', 'fl-phonemic-awareness-basic'],
  ['fl-voice-6', 'Rhyming Practice - Identifying Which Words Rhyme', 'fl-phonemic-awareness-basic'],
  ['fl-voice-7', 'Producing Rhymes - Making Up Rhyming Words', 'fl-phonemic-awareness-basic'],
  ['fl-voice-8', "Odd One Out - Which Word Doesn't Rhyme?", 'fl-phonemic-awareness-basic'],
  ['fl-voice-9', 'What Are Syllables? Clapping Word Parts', 'fl-phonemic-awareness-basic'],
  ['fl-voice-10', 'Counting Syllables in 1-4 Syllable Words', 'fl-phonemic-awareness-basic'],
  ['fl-voice-11', 'Blending Syllables - Putting Word Parts Together', 'fl-phonemic-awareness-basic'],
  ['fl-voice-12', 'Segmenting Syllables - Breaking Words Into Parts', 'fl-phonemic-awareness-basic'],
  ['fl-voice-13', 'Blending 2 Sounds Into Words', 'fl-phonemic-awareness-basic'],
  ['fl-voice-14', 'Blending 3 Sounds - CVC Words', 'fl-phonemic-awareness-basic'],
  ['fl-voice-15', 'Blending 3-4 Sounds - Harder Words', 'fl-phonemic-awareness-basic'],
  ['fl-voice-16', 'Week 4 Review + Module Assessment', 'fl-phonemic-awareness-basic'],
  ['fl-voice-17', 'Body Parts We Can See - The Touch Your Body Game', 'fl-oral-vocabulary'],
  ['fl-voice-18', 'Body Parts Inside - What They Do', 'fl-oral-vocabulary'],
  ['fl-voice-19', 'Health Words - Visiting the Clinic', 'fl-oral-vocabulary'],
  ['fl-voice-20', 'Action Verbs With the Body - Move and Learn', 'fl-oral-vocabulary'],
  ['fl-voice-21', "Family Roles - Adaeze's Family Tree", 'fl-oral-vocabulary'],
  ['fl-voice-22', 'Household Items - Describing a Nigerian Home', 'fl-oral-vocabulary'],
  ['fl-voice-23', 'Describing Words for Home - Opposites', 'fl-oral-vocabulary'],
  ['fl-voice-24', "Daily Routines - Sequencing Funke's Day", 'fl-oral-vocabulary'],
  ['fl-voice-25', 'Places in the Community - Where Do You Go?', 'fl-oral-vocabulary'],
  ['fl-voice-26', 'People and Jobs - What Do They Do?', 'fl-oral-vocabulary'],
  ['fl-voice-27', 'Market Words - Buying and Selling', 'fl-oral-vocabulary'],
  ['fl-voice-28', 'Transport and Direction Words - Giving Directions', 'fl-oral-vocabulary'],
  ['fl-voice-29', 'Common Animals - Animals Around Us', 'fl-oral-vocabulary'],
  ['fl-voice-30', 'Wild Animals of Africa - Our Amazing Continent', 'fl-oral-vocabulary'],
  ['fl-voice-31', 'Weather and Nature - Sun, Rain, and Harmattan', 'fl-oral-vocabulary'],
  ['fl-voice-32', 'Plants, Food & Module Review - Vocabulary Assessment', 'fl-oral-vocabulary'],
  ['fl-voice-17b', 'Amina Goes to the Market', 'fl-listening-comprehension'],
  ['fl-voice-18b', "Emeka's Morning", 'fl-listening-comprehension'],
  ['fl-voice-19b', 'The Lost Goat', 'fl-listening-comprehension'],
  ['fl-voice-20b', "Kemi's Birthday", 'fl-listening-comprehension'],
  ['fl-voice-21b', 'The Broken Bucket', 'fl-listening-comprehension'],
  ['fl-voice-22b', 'Tunde and the Homework', 'fl-listening-comprehension'],
  ['fl-voice-23b', 'The Market Fire', 'fl-listening-comprehension'],
  ['fl-voice-24b', "Ngozi's Garden", 'fl-listening-comprehension'],
  ['fl-voice-25b', "Bola's Bad Day", 'fl-listening-comprehension'],
  ['fl-voice-26b', 'The New Student', 'fl-listening-comprehension'],
  ['fl-voice-27b', "Adaeze's Secret", 'fl-listening-comprehension'],
  ['fl-voice-28b', 'Two Brothers', 'fl-listening-comprehension'],
  ['fl-voice-29b', 'Lagos: The Big City', 'fl-listening-comprehension'],
  ['fl-voice-30b', 'How Cocoa Becomes Chocolate', 'fl-listening-comprehension'],
  ['fl-voice-31b', 'Nigerian Animals in Danger', 'fl-listening-comprehension'],
  ['fl-voice-32b', 'Module 3 Assessment: The School Garden', 'fl-listening-comprehension'],
  ['fl-voice-33', 'What Is a Sentence?', 'fl-oral-grammar'],
  ['fl-voice-34', 'Expanding Sentences', 'fl-oral-grammar'],
  ['fl-voice-35', 'Statements vs. Questions', 'fl-oral-grammar'],
  ['fl-voice-36', 'Commands and Exclamations', 'fl-oral-grammar'],
  ['fl-voice-37', 'Present Tense', 'fl-oral-grammar'],
  ['fl-voice-38', 'Past Tense (Regular)', 'fl-oral-grammar'],
  ['fl-voice-39', 'Past Tense (Irregular)', 'fl-oral-grammar'],
  ['fl-voice-40', 'Future Tense', 'fl-oral-grammar'],
  ['fl-voice-41', 'Question Words: Who, What, Where', 'fl-oral-grammar'],
  ['fl-voice-42', 'Question Words: When, Why, How', 'fl-oral-grammar'],
  ['fl-voice-43', 'Answering in Full Sentences', 'fl-oral-grammar'],
  ['fl-voice-44', 'Asking Questions About a Story', 'fl-oral-grammar'],
  ['fl-voice-45', 'Adjectives: Words That Describe', 'fl-oral-grammar'],
  ['fl-voice-46', 'Comparatives: Comparing Two Things', 'fl-oral-grammar'],
  ['fl-voice-47', 'Superlatives: The Best of All', 'fl-oral-grammar'],
  ['fl-voice-48', 'Module 4 Review & Assessment', 'fl-oral-grammar'],
  ['fl-voice-33b', 'Segmenting 3-Sound Words', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-34b', 'Segmenting 4-Sound Words', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-35b', 'Segmenting Words with Digraphs', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-36b', 'Segmentation Speed Drill', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-37b', 'Deleting the First Sound', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-38b', 'Deleting the Last Sound', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-39b', 'Deleting Middle Sounds in Blends', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-40b', 'Mixed Deletion Practice', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-41b', 'Changing the First Sound', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-42b', 'Changing the Last Sound', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-43b', 'Changing the Middle Sound', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-44b', 'Mixed Substitution Practice', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-45b', 'First Letter-Sound Pairs (S, A, T, I, P, N)', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-46b', 'More Letter-Sound Pairs (C/K, E, H, R, M, D)', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-47b', 'Building Words from Letter Sounds (Oral)', 'fl-advanced-phonemic-awareness'],
  ['fl-voice-48b', 'Module 5 Assessment & Phase 1 Exit Assessment', 'fl-advanced-phonemic-awareness'],
] as const;

export const foundationalLiteracyLessonCrosswalk: SabiLessonAlignment[] = literacyLessonSpecs.map(
  ([lessonId, title, skillId]) =>
    lesson(
      lessonId,
      title,
      [skillId],
      literacyStandardRefsForSkill(skillId),
      skillId === 'fl-advanced-phonemic-awareness' ? 'voice_supported' : 'voice_only',
      skillId === 'fl-advanced-phonemic-awareness'
        ? 'Supports print-reading readiness. Do not claim full decoding mastery until Phase 2 print/app evidence exists.'
        : undefined,
    ),
);

export const foundationalLiteracyReviewSampleLessonCrosswalk: SabiLessonAlignment[] =
  foundationalLiteracyLessonCrosswalk.filter((lessonAlignment) =>
    ['fl-voice-1', 'fl-voice-5', 'fl-voice-14', 'fl-voice-27', 'fl-voice-32b', 'fl-voice-45b'].includes(
      lessonAlignment.lessonId,
    ),
  );

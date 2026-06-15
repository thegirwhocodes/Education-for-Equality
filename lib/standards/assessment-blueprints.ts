export type DiagnosticSubject = 'foundational-numeracy' | 'foundational-literacy';

export type DiagnosticItemType =
  | 'oral_response'
  | 'counting_sequence'
  | 'comparison'
  | 'operation'
  | 'story_comprehension'
  | 'phonemic_awareness';

export interface DiagnosticItem {
  id: string;
  subject: DiagnosticSubject;
  domain: string;
  itemType: DiagnosticItemType;
  prompt: string;
  skillIds: string[];
  correctSignals: string[];
  commonMisconceptions: string[];
  voiceNotes?: string;
}

export interface PlacementRule {
  id: string;
  subject: DiagnosticSubject;
  when: string;
  placement: string;
  rationale: string;
}

export interface DiagnosticBlueprint {
  id: string;
  subject: DiagnosticSubject;
  title: string;
  purpose: string;
  deliveryMode: 'voice';
  estimatedMinutes: number;
  claimBoundary: string;
  items: DiagnosticItem[];
  placementRules: PlacementRule[];
}

export const numeracyDiagnosticBlueprint: DiagnosticBlueprint = {
  id: 'diagnostic-foundational-numeracy-v1',
  subject: 'foundational-numeracy',
  title: 'Foundational Numeracy Placement Diagnostic',
  purpose:
    'Place the learner into the earliest numeracy module where instruction is needed, using oral TaRL-style checks adapted for Sabi.',
  deliveryMode: 'voice',
  estimatedMinutes: 4,
  claimBoundary:
    'This is an internal placement diagnostic, not an official EGMA, ASER, NERDC, or Cambridge assessment.',
  items: [
    {
      id: 'num-count-as-high-as-you-can',
      subject: 'foundational-numeracy',
      domain: 'counting',
      itemType: 'counting_sequence',
      prompt: 'Can you count for me? Start from 1 and count as high as you can.',
      skillIds: ['fn-count-1-to-20', 'fn-count-to-100'],
      correctSignals: ['counts_to_20', 'counts_to_50', 'counts_to_100', 'stable_sequence'],
      commonMisconceptions: ['skips_numbers', 'restarts_after_10', 'cannot_cross_tens_boundary'],
      voiceNotes: 'Stop gently once the learner has shown the highest useful range; do not make them count forever.',
    },
    {
      id: 'num-after-29-after-99',
      subject: 'foundational-numeracy',
      domain: 'number sequence',
      itemType: 'oral_response',
      prompt: 'What number comes after 29? What number comes after 99?',
      skillIds: ['fn-count-to-100'],
      correctSignals: ['says_30', 'says_100'],
      commonMisconceptions: ['says_21_after_29', 'cannot_transition_to_100'],
    },
    {
      id: 'num-compare-7-3-23-32-156-148',
      subject: 'foundational-numeracy',
      domain: 'comparison',
      itemType: 'comparison',
      prompt: 'Which is bigger: 7 or 3? Which is bigger: 23 or 32? Which is bigger: 156 or 148?',
      skillIds: ['fn-quantity-comparison-ordering'],
      correctSignals: ['compares_single_digit', 'compares_two_digit', 'compares_three_digit'],
      commonMisconceptions: ['chooses_first_number', 'compares_leftmost_digit_only_without_place_value'],
    },
    {
      id: 'num-addition-ladder',
      subject: 'foundational-numeracy',
      domain: 'addition',
      itemType: 'operation',
      prompt: 'What is 3 plus 2? What is 8 plus 7? What is 23 plus 14? What is 47 plus 38?',
      skillIds: ['fn-addition-foundations', 'fn-two-digit-addition'],
      correctSignals: ['adds_within_10', 'adds_within_20', 'adds_two_digit_no_carry', 'adds_two_digit_with_carry'],
      commonMisconceptions: ['counts_all_slowly', 'misses_carrying', 'adds_digits_without_place_value'],
    },
    {
      id: 'num-subtraction-ladder',
      subject: 'foundational-numeracy',
      domain: 'subtraction',
      itemType: 'operation',
      prompt: 'What is 9 minus 4? What is 15 minus 8? What is 42 minus 18?',
      skillIds: ['fn-subtraction-foundations', 'fn-two-digit-subtraction'],
      correctSignals: ['subtracts_within_10', 'subtracts_within_20', 'subtracts_two_digit_with_borrowing'],
      commonMisconceptions: ['counts_forward', 'reverses_smaller_minus_larger_digit', 'misses_borrowing'],
    },
    {
      id: 'num-multiplication-ladder',
      subject: 'foundational-numeracy',
      domain: 'multiplication',
      itemType: 'operation',
      prompt: 'What is 3 times 4? What is 6 times 7? A mango costs 30 naira. You buy 4 mangoes. How much do you pay?',
      skillIds: ['fn-multiplication-equal-groups', 'fn-multiplication-fluency'],
      correctSignals: ['knows_easy_fact', 'knows_harder_fact', 'applies_multiplication_to_price_quantity'],
      commonMisconceptions: ['adds_once', 'confuses_times_with_plus', 'cannot_apply_fact_to_money_context'],
    },
    {
      id: 'num-division-and-word-problem',
      subject: 'foundational-numeracy',
      domain: 'division and mixed word problems',
      itemType: 'operation',
      prompt:
        'Twelve oranges are shared equally among 3 children. How many does each child get? What is 24 divided by 6? You buy 4 mangoes at 30 naira each and pay with 200 naira. How much change do you get?',
      skillIds: ['fn-division-foundations', 'fn-word-problem-reasoning'],
      correctSignals: ['solves_sharing_problem', 'solves_division_fact', 'solves_two_step_change_problem'],
      commonMisconceptions: ['multiplies_when_sharing', 'cannot_choose_operations', 'gets_total_cost_but_not_change'],
    },
  ],
  placementRules: [
    {
      id: 'num-place-module-1',
      subject: 'foundational-numeracy',
      when: 'Learner cannot count reliably past 20 or cannot compare one-digit numbers.',
      placement: 'Module 1: Number Sense',
      rationale: 'Counting and comparison are prerequisites for all later number work.',
    },
    {
      id: 'num-place-module-2',
      subject: 'foundational-numeracy',
      when: 'Learner counts and compares but cannot add single-digit or teen sums reliably.',
      placement: 'Module 2: Addition',
      rationale: 'Addition facts and place-value addition are the next teachable gap.',
    },
    {
      id: 'num-place-module-3',
      subject: 'foundational-numeracy',
      when: 'Learner adds two-digit numbers but cannot subtract within 20 or with borrowing.',
      placement: 'Module 3: Subtraction',
      rationale: 'Subtraction and change-making are not secure.',
    },
    {
      id: 'num-place-module-4',
      subject: 'foundational-numeracy',
      when: 'Learner can subtract but cannot multiply or apply equal groups.',
      placement: 'Module 4: Multiplication',
      rationale: 'Equal groups and times-table fluency are needed before division.',
    },
    {
      id: 'num-place-module-5',
      subject: 'foundational-numeracy',
      when: 'Learner can multiply but cannot solve simple sharing or division facts.',
      placement: 'Module 5: Division',
      rationale: 'Division is the missing bridge before mixed word problems.',
    },
    {
      id: 'num-place-module-6',
      subject: 'foundational-numeracy',
      when: 'Learner can divide but cannot solve mixed or two-step word problems.',
      placement: 'Module 6: Word Problems',
      rationale: 'Operation choice and explanation are the consolidation gap.',
    },
    {
      id: 'num-place-grade-4-bridge',
      subject: 'foundational-numeracy',
      when: 'Learner passes counting, comparison, all four operations, and mixed word problems.',
      placement: 'Grade 4 bridge / Cambridge-aligned app curriculum',
      rationale: 'Foundational numeracy is strong enough for grade-level content with continued monitoring.',
    },
  ],
};

export const literacyDiagnosticBlueprint: DiagnosticBlueprint = {
  id: 'diagnostic-foundational-literacy-v1',
  subject: 'foundational-literacy',
  title: 'Foundational Literacy Placement Diagnostic',
  purpose:
    'Place the learner into oral foundational literacy or print-supported bridge work without claiming that voice alone proves full reading mastery.',
  deliveryMode: 'voice',
  estimatedMinutes: 5,
  claimBoundary:
    'This is an oral placement diagnostic. It can assess listening, oral vocabulary, and phonemic awareness; print reading requires print/app evidence.',
  items: [
    {
      id: 'lit-name-and-oral-comfort',
      subject: 'foundational-literacy',
      domain: 'oral language',
      itemType: 'oral_response',
      prompt: 'Can you tell me your name? Tell me one thing you like to do.',
      skillIds: ['fl-oral-vocabulary'],
      correctSignals: ['responds_with_name', 'answers_simple_personal_question'],
      commonMisconceptions: ['silent_or_shy', 'single_word_only', 'does_not_understand_prompt'],
    },
    {
      id: 'lit-beginning-sound-ball',
      subject: 'foundational-literacy',
      domain: 'phonemic awareness',
      itemType: 'phonemic_awareness',
      prompt: 'What sound do you hear at the very beginning of the word ball?',
      skillIds: ['fl-phonemic-awareness-basic'],
      correctSignals: ['identifies_initial_b_sound'],
      commonMisconceptions: ['says_letter_name_only', 'repeats_whole_word', 'identifies_final_sound'],
    },
    {
      id: 'lit-blend-cat-ship-go',
      subject: 'foundational-literacy',
      domain: 'phonemic blending',
      itemType: 'phonemic_awareness',
      prompt: 'What word do these sounds make: /k/ /a/ /t/? What word do /sh/ /i/ /p/ make? What word do /g/ /o/ make?',
      skillIds: ['fl-phonemic-awareness-basic', 'fl-advanced-phonemic-awareness'],
      correctSignals: ['blends_cvc_word', 'blends_digraph_word', 'blends_two_sound_word'],
      commonMisconceptions: ['cannot_blend_separated_sounds', 'drops_middle_sound', 'confuses_digraph'],
    },
    {
      id: 'lit-listening-story-retell',
      subject: 'foundational-literacy',
      domain: 'listening comprehension',
      itemType: 'story_comprehension',
      prompt: 'Listen to a short story, then tell me what happened first and what happened last.',
      skillIds: ['fl-listening-comprehension'],
      correctSignals: ['recalls_first_event', 'recalls_last_event', 'retells_in_order'],
      commonMisconceptions: ['recalls_detail_without_sequence', 'cannot_retell', 'answers_unrelated_question'],
    },
    {
      id: 'lit-full-sentence-answer',
      subject: 'foundational-literacy',
      domain: 'oral grammar',
      itemType: 'oral_response',
      prompt: 'Answer in a full sentence: Where do you live? What did you eat today?',
      skillIds: ['fl-oral-grammar'],
      correctSignals: ['uses_complete_sentence', 'uses_question_words_correctly', 'uses_basic_tense'],
      commonMisconceptions: ['one_word_answer', 'missing_subject_or_verb', 'tense_confusion'],
    },
  ],
  placementRules: [
    {
      id: 'lit-place-module-1',
      subject: 'foundational-literacy',
      when: 'Learner struggles with beginning sounds, rhyming, syllables, or simple oral blending.',
      placement: 'Module 1: Phonemic Awareness',
      rationale: 'Oral sound awareness is the first prerequisite for later phonics.',
    },
    {
      id: 'lit-place-module-2',
      subject: 'foundational-literacy',
      when: 'Learner can handle basic sounds but has weak oral vocabulary or sentence meaning.',
      placement: 'Module 2: Oral Vocabulary',
      rationale: 'Vocabulary is needed for comprehension and expressive language.',
    },
    {
      id: 'lit-place-module-3',
      subject: 'foundational-literacy',
      when: 'Learner has basic vocabulary but cannot retell, infer, or identify main idea from oral stories.',
      placement: 'Module 3: Listening Comprehension',
      rationale: 'Listening comprehension is a valid oral precursor to reading comprehension.',
    },
    {
      id: 'lit-place-module-4',
      subject: 'foundational-literacy',
      when: 'Learner can understand stories but struggles to answer in complete sentences, use tense, or ask questions.',
      placement: 'Module 4: Oral English and Grammar',
      rationale: 'Oral grammar and expression need strengthening before advanced print bridge.',
    },
    {
      id: 'lit-place-module-5',
      subject: 'foundational-literacy',
      when: 'Learner has basic oral language but needs segmentation, deletion, substitution, and sound-letter readiness.',
      placement: 'Module 5: Advanced Phonemic Awareness',
      rationale: 'This is the bridge into Phase 2 print-supported decoding.',
    },
    {
      id: 'lit-place-phase-2',
      subject: 'foundational-literacy',
      when: 'Learner passes oral phonemic awareness, oral vocabulary, listening comprehension, grammar, and advanced sound manipulation.',
      placement: 'Phase 2 print/app bridge',
      rationale: 'Voice-only evidence is no longer enough; print/app evidence is required for decoding and reading claims.',
    },
  ],
};

export const diagnosticBlueprints = [numeracyDiagnosticBlueprint, literacyDiagnosticBlueprint];

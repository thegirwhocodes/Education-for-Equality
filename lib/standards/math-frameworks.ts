import type { ExternalStandardRef } from './types';

const CAMBRIDGE_MATH_0096 = 'Cambridge Primary Mathematics 0096';
const NERDC_BASIC_MATH = 'NERDC Basic Education Curriculum - Mathematics';
const TARL_ASER_NUMERACY = 'TaRL / ASER Numeracy Levels';

export const cambridgePrimaryMathFoundations = {
  countingSequences: {
    id: 'cambridge-math-number-counting-sequences-foundational',
    framework: CAMBRIDGE_MATH_0096,
    subject: 'Mathematics',
    stageOrBand: 'Primary Stages 1-3 foundation; supports Stage 4 Number',
    strand: 'Number',
    topic: 'Counting, sequences, and number structure',
    description:
      'Learners count forwards and backwards, continue number sequences, skip count, and use counting structure to reason about quantity.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  placeValue: {
    id: 'cambridge-math-number-place-value-foundational',
    framework: CAMBRIDGE_MATH_0096,
    subject: 'Mathematics',
    stageOrBand: 'Primary Stages 1-4',
    strand: 'Number',
    topic: 'Place value and ordering',
    description:
      'Learners understand that digit value depends on position, compose and decompose numbers, and compare/order numbers.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  additionSubtraction: {
    id: 'cambridge-math-number-addition-subtraction-foundational',
    framework: CAMBRIDGE_MATH_0096,
    subject: 'Mathematics',
    stageOrBand: 'Primary Stages 1-3 foundation; supports Stage 4 integer operations',
    strand: 'Number',
    topic: 'Addition and subtraction',
    description:
      'Learners add and subtract whole numbers using mental strategies, place value, inverse operations, and contextual word problems.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  multiplicationDivision: {
    id: 'cambridge-math-number-multiplication-division-foundational',
    framework: CAMBRIDGE_MATH_0096,
    subject: 'Mathematics',
    stageOrBand: 'Primary Stages 2-4',
    strand: 'Number',
    topic: 'Multiplication and division',
    description:
      'Learners understand equal groups, repeated addition, multiplication facts, division as grouping/sharing, and inverse relationships.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  moneyAndWordProblems: {
    id: 'cambridge-math-number-money-reasoning-foundational',
    framework: CAMBRIDGE_MATH_0096,
    subject: 'Mathematics',
    stageOrBand: 'Primary Stages 1-4',
    strand: 'Number',
    topic: 'Money, reasoning, and problem solving',
    description:
      'Learners use number operations to solve real-world money and measure problems, estimate, explain strategies, and check reasonableness.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
} satisfies Record<string, ExternalStandardRef>;

export const nerdcBasicMathFoundations = {
  wholeNumbersCounting: {
    id: 'nerdc-basic-math-numbers-whole-number-counting',
    framework: NERDC_BASIC_MATH,
    subject: 'Mathematics',
    stageOrBand: 'Lower Basic to Middle Basic; supports Primary 4-6',
    theme: 'Number and Numeration',
    topic: 'Whole numbers and counting',
    description:
      'Learners count, group, order, and reason with whole numbers using local materials and everyday contexts.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  quantitativeReasoning: {
    id: 'nerdc-basic-math-quantitative-reasoning',
    framework: NERDC_BASIC_MATH,
    subject: 'Mathematics',
    stageOrBand: 'Primary 4-6 emphasis',
    theme: 'Number and Numeration',
    topic: 'Quantitative reasoning',
    description:
      'Learners identify number patterns, compare quantities, group objects, and reason about numeric relationships.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  basicOperations: {
    id: 'nerdc-basic-math-basic-operations',
    framework: NERDC_BASIC_MATH,
    subject: 'Mathematics',
    stageOrBand: 'Lower Basic to Middle Basic',
    theme: 'Basic operations',
    topic: 'Addition, subtraction, multiplication, and division',
    description:
      'Learners compute and apply the four operations in practical contexts, including money and market transactions.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
  moneyApplications: {
    id: 'nerdc-basic-math-money-applications',
    framework: NERDC_BASIC_MATH,
    subject: 'Mathematics',
    stageOrBand: 'Lower Basic to Middle Basic',
    theme: 'Everyday mathematics',
    topic: 'Money and market applications',
    description:
      'Learners solve everyday problems involving prices, totals, change, grouping of goods, and local economic contexts.',
    relation: 'supports',
    verificationStatus: 'working_crosswalk',
  },
} satisfies Record<string, ExternalStandardRef>;

export const tarlNumeracyLevels = {
  beginner: {
    id: 'tarl-numeracy-beginner',
    framework: TARL_ASER_NUMERACY,
    subject: 'Numeracy',
    stageOrBand: 'Beginner',
    topic: 'Pre-number or early counting',
    description: 'Learner cannot yet reliably count, recognize, or compare basic numbers.',
    relation: 'assesses',
    verificationStatus: 'working_crosswalk',
  },
  oneDigit: {
    id: 'tarl-numeracy-one-digit',
    framework: TARL_ASER_NUMERACY,
    subject: 'Numeracy',
    stageOrBand: 'Number recognition',
    topic: 'Single-digit number sense',
    description: 'Learner recognizes and compares one-digit numbers and begins simple operations.',
    relation: 'assesses',
    verificationStatus: 'working_crosswalk',
  },
  twoDigit: {
    id: 'tarl-numeracy-two-digit',
    framework: TARL_ASER_NUMERACY,
    subject: 'Numeracy',
    stageOrBand: 'Two-digit level',
    topic: 'Two-digit number recognition and operations readiness',
    description: 'Learner recognizes, compares, and works with two-digit numbers.',
    relation: 'assesses',
    verificationStatus: 'working_crosswalk',
  },
  subtraction: {
    id: 'tarl-numeracy-subtraction',
    framework: TARL_ASER_NUMERACY,
    subject: 'Numeracy',
    stageOrBand: 'Subtraction level',
    topic: 'Two-digit subtraction',
    description: 'Learner can solve two-digit subtraction and related everyday problems.',
    relation: 'assesses',
    verificationStatus: 'working_crosswalk',
  },
} satisfies Record<string, ExternalStandardRef>;

export const foundationalMathStandardRefs = {
  cambridge: cambridgePrimaryMathFoundations,
  nerdc: nerdcBasicMathFoundations,
  tarl: tarlNumeracyLevels,
};

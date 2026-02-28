'use client';

import Link from 'next/link';
import ReadingQuiz from '@/components/ReadingQuiz';

const assessments = [
  {
    id: 'reading-1',
    level: 'Grade 4',
    standard: 'Cambridge 4Rn1-4Rn3',
    passageTitle: 'The Baobab Tree',
    passage:
      'The baobab tree is one of the most remarkable trees in Africa. Some baobab trees are over 1,000 years old. Their thick trunks can store up to 120,000 litres of water, which helps them survive long dry seasons. The fruit of the baobab, sometimes called "monkey bread," is rich in vitamin C — it has six times more than an orange! People across Africa use the baobab in many ways. The leaves are eaten as vegetables, the bark is woven into rope and baskets, and the fruit is made into a popular juice drink. Many animals depend on the baobab too. Birds nest in its branches, baboons eat its fruit, and elephants sometimes break open the trunk to reach the water inside. In many communities, the baobab is considered sacred. Village meetings are held under its branches, and elders share stories in its shade. Losing a baobab tree is like losing a piece of the community itself.',
    questions: [
      {
        question: 'What is the main idea of this passage?',
        options: [
          'Baobab trees are very old.',
          'The baobab tree is important to both people and animals in Africa.',
          'Elephants like to drink water from baobab trees.',
          'Village meetings happen under trees.',
        ],
        correctIndex: 1,
        explanation:
          'The passage discusses how the baobab is used by people (food, materials, gathering place) and animals (nesting, food, water). The main idea covers all of these.',
      },
      {
        question: 'Why can baobab trees survive long dry seasons?',
        options: [
          'They have very deep roots.',
          'They lose all their leaves.',
          'Their thick trunks store up to 120,000 litres of water.',
          'They only grow near rivers.',
        ],
        correctIndex: 2,
        explanation:
          'The passage states: "Their thick trunks can store up to 120,000 litres of water, which helps them survive long dry seasons."',
      },
      {
        question: 'What can you infer about why baobab trees are called "sacred" in some communities?',
        options: [
          'Because they are very expensive.',
          'Because they are deeply valued as gathering places and sources of life.',
          'Because only elders are allowed to touch them.',
          'Because they were planted by the government.',
        ],
        correctIndex: 1,
        explanation:
          'The passage says meetings are held under them and stories are shared there. "Losing a baobab is like losing a piece of the community" — this tells us they are deeply valued, which is why they are sacred.',
      },
      {
        question: 'According to the passage, which statement about baobab fruit is TRUE?',
        options: [
          'It is poisonous to animals.',
          'It has six times more vitamin C than an orange.',
          'Only humans eat it.',
          'It tastes like banana.',
        ],
        correctIndex: 1,
        explanation:
          'The passage directly states the fruit "has six times more [vitamin C] than an orange."',
      },
    ],
  },
  {
    id: 'reading-2',
    level: 'Grade 4',
    standard: 'Cambridge 4Rs1-4Rs3',
    passageTitle: 'Amina\'s Market Day',
    passage:
      'Every Saturday morning, Amina helped her grandmother sell vegetables at the Kano central market. She would wake up before the sun rose, help load the cart with tomatoes, peppers, onions, and spinach, and push it through the quiet streets while the city was still sleeping. Amina loved the early morning — the cool air, the sound of birds, the smell of fresh bread from the bakery they passed. But what she loved most was the mathematics. "Grandmother, if we have 48 tomatoes and sell them in groups of 6, how many groups is that?" she would ask. Her grandmother would laugh and say, "You tell me, little professor!" By mid-morning, the market was alive with noise and colour. Customers bargained loudly, children ran between the stalls, and the smell of suya filled the air. Amina handled the money carefully, counting change and keeping track of their sales in a small notebook. By afternoon, when the cart was nearly empty, Amina would count their earnings. "Grandmother, we made 4,200 naira today!" Her grandmother would smile proudly. "And how much is that per hour we worked?" Amina was already doing the calculation in her head.',
    questions: [
      {
        question: 'What does Amina enjoy most about helping at the market?',
        options: [
          'Eating suya.',
          'Playing with other children.',
          'The mathematics of selling.',
          'Pushing the cart through the streets.',
        ],
        correctIndex: 2,
        explanation:
          'The passage says "what she loved most was the mathematics" and shows her asking math questions, counting money, and calculating earnings.',
      },
      {
        question: 'What does the grandmother mean when she calls Amina "little professor"?',
        options: [
          'She wants Amina to become a teacher.',
          'She is impressed that Amina enjoys learning and asking questions.',
          'She thinks Amina talks too much.',
          'She is telling Amina to stop asking questions.',
        ],
        correctIndex: 1,
        explanation:
          'Calling someone "little professor" is an affectionate way of recognising that they are clever and curious. The grandmother laughs, showing she is pleased.',
      },
      {
        question: 'Based on the passage, what time of day do Amina and her grandmother arrive at the market?',
        options: [
          'Late afternoon.',
          'Early morning, before sunrise.',
          'Midday, when it is hottest.',
          'Evening, after dinner.',
        ],
        correctIndex: 1,
        explanation:
          'The passage says "She would wake up before the sun rose" and describes the "cool air" and quiet streets of early morning.',
      },
      {
        question: 'If Amina and her grandmother worked for 7 hours and earned 4,200 naira, how much did they earn per hour?',
        options: [
          '500 naira',
          '600 naira',
          '700 naira',
          '420 naira',
        ],
        correctIndex: 1,
        explanation:
          '4,200 ÷ 7 = 600 naira per hour. This connects reading comprehension with real-world mathematics!',
      },
    ],
  },
];

export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/subjects/english" className="hover:text-[var(--primary-dark)]">
              English
            </Link>
            <span>/</span>
            <span className="text-gray-900">Reading Assessments</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reading Comprehension Practice</h1>
          <p className="text-[var(--text-muted)]">
            Read each passage carefully, then answer the questions to test your understanding.
            Aligned to Cambridge Primary English standards.
          </p>
        </div>
      </div>

      {/* Assessments */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {assessments.map((a) => (
          <ReadingQuiz
            key={a.id}
            passage={a.passage}
            passageTitle={a.passageTitle}
            questions={a.questions}
            standard={a.standard}
          />
        ))}

        {/* Back */}
        <div className="pt-4">
          <Link
            href="/subjects/english"
            className="flex items-center gap-2 text-gray-500 hover:text-[var(--primary-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to English
          </Link>
        </div>
      </div>
    </div>
  );
}

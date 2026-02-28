// Curriculum data structure for K3/3rd Grade pilot
// This can later be moved to Supabase for dynamic content management

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string; // YouTube embed URL
  content: string; // HTML content for the lesson
  duration: number; // in minutes
  order: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  units: Unit[];
}

import { foundationalLiteracy } from './foundational-literacy';
import { foundationalNumeracy } from './foundational-numeracy';

// Sample curriculum data for K3 (3rd Grade)
export const subjects: Subject[] = [
  foundationalLiteracy,
  foundationalNumeracy,
  {
    id: 'math',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Learn numbers, addition, subtraction, multiplication, and basic problem-solving skills.',
    icon: '🔢',
    color: '#4F46E5', // Indigo
    units: [
      {
        id: 'math-unit-1',
        title: 'Numbers and Place Value',
        description: 'Understanding numbers up to 1000',
        order: 1,
        lessons: [
          {
            id: 'math-1-1',
            title: 'Counting to 100',
            description: 'Learn to count from 1 to 100',
            videoUrl: 'https://www.youtube.com/embed/0TgLtF3PMOc',
            content: '<p>In this lesson, we will learn to count from 1 to 100. Counting is one of the most important skills in mathematics!</p><h3>Key Points:</h3><ul><li>Numbers go in order: 1, 2, 3, 4, 5...</li><li>After 9 comes 10</li><li>After 99 comes 100</li></ul>',
            duration: 10,
            order: 1,
          },
          {
            id: 'math-1-2',
            title: 'Place Value: Ones and Tens',
            description: 'Understanding the value of digits',
            videoUrl: 'https://www.youtube.com/embed/UvfYN2gv0Ck',
            content: '<p>Place value tells us what each digit in a number is worth.</p><h3>Example:</h3><p>In the number 34:</p><ul><li>The 3 is in the tens place = 30</li><li>The 4 is in the ones place = 4</li><li>34 = 30 + 4</li></ul>',
            duration: 12,
            order: 2,
          },
          {
            id: 'math-1-3',
            title: 'Counting by 2s, 5s, and 10s',
            description: 'Skip counting patterns',
            content: '<p>Skip counting helps us count faster!</p><h3>Counting by 2s:</h3><p>2, 4, 6, 8, 10, 12, 14, 16, 18, 20</p><h3>Counting by 5s:</h3><p>5, 10, 15, 20, 25, 30, 35, 40, 45, 50</p><h3>Counting by 10s:</h3><p>10, 20, 30, 40, 50, 60, 70, 80, 90, 100</p>',
            duration: 8,
            order: 3,
          },
        ],
      },
      {
        id: 'math-unit-2',
        title: 'Addition and Subtraction',
        description: 'Adding and subtracting numbers up to 100',
        order: 2,
        lessons: [
          {
            id: 'math-2-1',
            title: 'Addition with Single Digits',
            description: 'Adding numbers 1-9',
            videoUrl: 'https://www.youtube.com/embed/AuX7nPBqDts',
            content: '<p>Addition means putting numbers together to find the total.</p><h3>Example:</h3><p>3 + 4 = 7</p><p>We can use our fingers or objects to help us add!</p>',
            duration: 10,
            order: 1,
          },
          {
            id: 'math-2-2',
            title: 'Subtraction Basics',
            description: 'Taking away numbers',
            content: '<p>Subtraction means taking away from a number.</p><h3>Example:</h3><p>8 - 3 = 5</p><p>If you have 8 apples and give away 3, you have 5 left!</p>',
            duration: 10,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    slug: 'english',
    description: 'Reading, writing, grammar, and vocabulary development.',
    icon: '📚',
    color: '#DC2626', // Red
    units: [
      {
        id: 'eng-unit-1',
        title: 'Reading Fundamentals',
        description: 'Building reading skills',
        order: 1,
        lessons: [
          {
            id: 'eng-1-1',
            title: 'The Alphabet',
            description: 'Learning all 26 letters',
            videoUrl: 'https://www.youtube.com/embed/75p-N9YKqNo',
            content: '<p>The English alphabet has 26 letters. Let\'s learn them!</p><h3>Vowels:</h3><p>A, E, I, O, U</p><h3>Consonants:</h3><p>All the other letters: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</p>',
            duration: 15,
            order: 1,
          },
          {
            id: 'eng-1-2',
            title: 'Phonics: Letter Sounds',
            description: 'How letters sound',
            content: '<p>Each letter makes a sound. Learning these sounds helps us read!</p><h3>Examples:</h3><ul><li>A says "ah" like in apple</li><li>B says "buh" like in ball</li><li>C says "kuh" like in cat</li></ul>',
            duration: 12,
            order: 2,
          },
          {
            id: 'eng-1-3',
            title: 'Simple Words',
            description: 'Reading three-letter words',
            content: '<p>Let\'s read simple words by sounding them out:</p><ul><li>C-A-T = Cat</li><li>D-O-G = Dog</li><li>R-U-N = Run</li><li>S-U-N = Sun</li></ul>',
            duration: 10,
            order: 3,
          },
        ],
      },
      {
        id: 'eng-unit-2',
        title: 'Writing Skills',
        description: 'Learning to write',
        order: 2,
        lessons: [
          {
            id: 'eng-2-1',
            title: 'Writing Letters',
            description: 'Forming uppercase and lowercase letters',
            content: '<p>Good handwriting starts with proper letter formation.</p><h3>Tips:</h3><ul><li>Start at the top for most letters</li><li>Hold your pencil correctly</li><li>Practice makes perfect!</li></ul>',
            duration: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    slug: 'science',
    description: 'Discover the world through basic science concepts and experiments.',
    icon: '🔬',
    color: '#059669', // Green
    units: [
      {
        id: 'sci-unit-1',
        title: 'Living Things',
        description: 'Plants, animals, and humans',
        order: 1,
        lessons: [
          {
            id: 'sci-1-1',
            title: 'What is a Living Thing?',
            description: 'Characteristics of living things',
            videoUrl: 'https://www.youtube.com/embed/FMWqJ1MrSx8',
            content: '<p>Living things have special characteristics that make them alive!</p><h3>Living things:</h3><ul><li>Grow and change</li><li>Need food and water</li><li>Breathe</li><li>Can have babies (reproduce)</li><li>Move (even plants move slowly!)</li></ul>',
            duration: 12,
            order: 1,
          },
          {
            id: 'sci-1-2',
            title: 'Parts of a Plant',
            description: 'Roots, stems, leaves, and flowers',
            content: '<p>Plants have different parts that help them survive:</p><ul><li><strong>Roots:</strong> Get water from the soil</li><li><strong>Stem:</strong> Holds the plant up and carries water</li><li><strong>Leaves:</strong> Make food using sunlight</li><li><strong>Flowers:</strong> Help make seeds for new plants</li></ul>',
            duration: 10,
            order: 2,
          },
        ],
      },
      {
        id: 'sci-unit-2',
        title: 'Our Bodies',
        description: 'Understanding the human body',
        order: 2,
        lessons: [
          {
            id: 'sci-2-1',
            title: 'The Five Senses',
            description: 'Seeing, hearing, smelling, tasting, touching',
            content: '<p>We use our five senses to learn about the world:</p><ul><li><strong>Sight:</strong> Eyes help us see</li><li><strong>Hearing:</strong> Ears help us hear sounds</li><li><strong>Smell:</strong> Nose helps us smell</li><li><strong>Taste:</strong> Tongue helps us taste food</li><li><strong>Touch:</strong> Skin helps us feel things</li></ul>',
            duration: 10,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    slug: 'social-studies',
    description: 'Learn about communities, culture, and how people live together.',
    icon: '🌍',
    color: '#D97706', // Amber
    units: [
      {
        id: 'ss-unit-1',
        title: 'My Community',
        description: 'Understanding where we live',
        order: 1,
        lessons: [
          {
            id: 'ss-1-1',
            title: 'What is a Community?',
            description: 'People living and working together',
            content: '<p>A community is a place where people live, work, and help each other.</p><h3>People in our community:</h3><ul><li>Teachers help us learn</li><li>Doctors help us stay healthy</li><li>Farmers grow our food</li><li>Police officers keep us safe</li></ul>',
            duration: 10,
            order: 1,
          },
          {
            id: 'ss-1-2',
            title: 'My Family',
            description: 'Understanding family relationships',
            content: '<p>Families come in all shapes and sizes. A family is a group of people who love and care for each other.</p><h3>Family members might include:</h3><ul><li>Parents (mother, father)</li><li>Brothers and sisters</li><li>Grandparents</li><li>Aunts, uncles, and cousins</li></ul>',
            duration: 8,
            order: 2,
          },
        ],
      },
      {
        id: 'ss-unit-2',
        title: 'Nigeria: Our Country',
        description: 'Learning about Nigeria',
        order: 2,
        lessons: [
          {
            id: 'ss-2-1',
            title: 'About Nigeria',
            description: 'Our beautiful country',
            content: '<p>Nigeria is a country in West Africa. It is home to over 200 million people!</p><h3>Fun facts about Nigeria:</h3><ul><li>The capital city is Abuja</li><li>Lagos is the largest city</li><li>Nigeria has over 250 different ethnic groups</li><li>The official language is English</li><li>The colors of our flag are green and white</li></ul>',
            duration: 12,
            order: 1,
          },
        ],
      },
    ],
  },
];

// Helper functions
export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find(s => s.slug === slug);
}

export function getLessonById(subjectSlug: string, lessonId: string): { subject: Subject; unit: Unit; lesson: Lesson } | undefined {
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return undefined;

  for (const unit of subject.units) {
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return { subject, unit, lesson };
    }
  }
  return undefined;
}

export function getNextLesson(subjectSlug: string, currentLessonId: string): Lesson | undefined {
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return undefined;

  const allLessons = subject.units.flatMap(u => u.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  return undefined;
}

export function getTotalLessons(subject: Subject): number {
  return subject.units.reduce((total, unit) => total + unit.lessons.length, 0);
}

// ============================================
// Cambridge Grade 4 Curriculum Support
// ============================================

import {
  grade4Curriculum,
  type Lesson as CambridgeLesson,
  type Unit as CambridgeUnit,
} from './cambridge-grade4-curriculum';

// Convert Cambridge curriculum to standard format for lesson pages
function cambridgeToStandardLesson(lesson: CambridgeLesson): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl || undefined,
    content: lesson.content,
    duration: lesson.durationMinutes,
    order: lesson.orderIndex,
  };
}

function cambridgeToStandardUnit(unit: CambridgeUnit): Unit {
  return {
    id: unit.id,
    title: unit.title,
    description: unit.description,
    lessons: unit.lessons.map(cambridgeToStandardLesson),
    order: unit.orderIndex,
  };
}

// Subject metadata for Cambridge curriculum
const cambridgeSubjectMeta: Record<string, { color: string; icon: string; slug: string }> = {
  mathematics: { color: '#2563eb', icon: '🔢', slug: 'mathematics' },
  english: { color: '#dc2626', icon: '📚', slug: 'english' },
  science: { color: '#16a34a', icon: '🔬', slug: 'science' },
  socialStudies: { color: '#9333ea', icon: '🌍', slug: 'social-studies' },
};

// Convert Cambridge curriculum to standard Subject format
export function getCambridgeSubjects(): Subject[] {
  return Object.entries(grade4Curriculum).map(([key, curriculum]) => ({
    id: `cambridge-${key}`,
    name: curriculum.subjectName,
    slug: cambridgeSubjectMeta[key].slug,
    description: `Cambridge Primary Stage ${curriculum.gradeNumber} ${curriculum.subjectName}`,
    icon: cambridgeSubjectMeta[key].icon,
    color: cambridgeSubjectMeta[key].color,
    units: curriculum.units.map(cambridgeToStandardUnit),
  }));
}

// Get a Cambridge lesson by ID (lesson IDs from cambridge-grade4-curriculum.ts)
export function getCambridgeLessonById(lessonId: string): { subject: Subject; unit: Unit; lesson: Lesson } | undefined {
  const cambridgeSubjects = getCambridgeSubjects();

  for (const subject of cambridgeSubjects) {
    for (const unit of subject.units) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { subject, unit, lesson };
      }
    }
  }
  return undefined;
}

// Extended getLessonById that checks both original and Cambridge curriculum
export function getLessonByIdExtended(subjectSlug: string, lessonId: string): { subject: Subject; unit: Unit; lesson: Lesson } | undefined {
  // First check original curriculum
  const original = getLessonById(subjectSlug, lessonId);
  if (original) return original;

  // Then check Cambridge curriculum
  return getCambridgeLessonById(lessonId);
}

// Get next lesson (extended to support Cambridge)
export function getNextLessonExtended(subjectSlug: string, currentLessonId: string): Lesson | undefined {
  // First check if it's from original curriculum
  const originalNext = getNextLesson(subjectSlug, currentLessonId);
  if (originalNext) return originalNext;

  // Check Cambridge curriculum
  const cambridgeSubjects = getCambridgeSubjects();
  const subject = cambridgeSubjects.find(s => s.slug === subjectSlug);
  if (!subject) return undefined;

  const allLessons = subject.units.flatMap(u => u.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

  if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  return undefined;
}

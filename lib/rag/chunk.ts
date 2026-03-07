/**
 * Curriculum chunking for RAG system.
 * Splits lessons into semantic chunks for embedding and retrieval.
 */

import { subjects, getCambridgeSubjects, type Subject, type Lesson } from '../curriculum';

export interface CurriculumChunk {
  lessonId: string;
  chunkType: 'concept' | 'example' | 'practice' | 'story' | 'summary';
  chunkText: string;
  module: string;      // e.g. 'numeracy-1', 'literacy-2', 'math-4-1'
  subject: string;     // e.g. 'numeracy', 'literacy', 'mathematics'
  metadata: {
    lessonTitle: string;
    unitTitle: string;
    subjectName: string;
    duration: number;
  };
}

/**
 * Strip HTML tags from content, preserving text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<details>.*?<\/details>/gs, '') // Remove collapsed answers
    .replace(/<[^>]+>/g, ' ')                 // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')                     // Collapse whitespace
    .trim();
}

/**
 * Extract sections from HTML lesson content based on heading patterns.
 */
function extractSections(html: string): Record<string, string> {
  const sections: Record<string, string> = {};

  // Common heading patterns in the curriculum
  const patterns: Array<{ key: string; regex: RegExp }> = [
    { key: 'story', regex: /(?:🏪\s*Market Story|🌟\s*Let'?s Start)(.*?)(?=<h3|$)/gis },
    { key: 'concept', regex: /(?:📝\s*Let'?s Learn|📚\s*New Concept|Key Concepts?|Learning Objective)(.*?)(?=<h3|$)/gis },
    { key: 'practice', regex: /(?:✏️\s*Practice|🎮\s*Let'?s Practice|Practice Questions?)(.*?)(?=<h3|<details|$)/gis },
    { key: 'summary', regex: /(?:💡\s*Remember|Remember)(.*?)(?=<h3|$)/gis },
    { key: 'example', regex: /(?:Example\s*\d*:)(.*?)(?=<\/p>|Example\s*\d|<h3|$)/gis },
  ];

  for (const { key, regex } of patterns) {
    const matches = [...html.matchAll(regex)];
    if (matches.length > 0) {
      sections[key] = stripHtml(matches.map(m => m[1] || '').join(' '));
    }
  }

  return sections;
}

/**
 * Determine the module identifier for a lesson based on its subject and unit.
 */
function getModuleId(subjectId: string, unitId: string, unitOrder: number): string {
  if (subjectId === 'foundational-numeracy') return `numeracy-${unitOrder}`;
  if (subjectId === 'foundational-literacy') return `literacy-${unitOrder}`;
  // Cambridge subjects: math-4-1, english-4-2, etc.
  return `${subjectId}-${unitOrder}`;
}

/**
 * Get simplified subject name for filtering.
 */
function getSubjectKey(subjectId: string): string {
  if (subjectId === 'foundational-numeracy') return 'numeracy';
  if (subjectId === 'foundational-literacy') return 'literacy';
  if (subjectId.startsWith('cambridge-')) return subjectId.replace('cambridge-', '');
  return subjectId;
}

/**
 * Chunk a single lesson into semantic pieces.
 */
function chunkLesson(
  lesson: Lesson,
  subjectId: string,
  subjectName: string,
  unitId: string,
  unitTitle: string,
  unitOrder: number
): CurriculumChunk[] {
  const chunks: CurriculumChunk[] = [];
  const module = getModuleId(subjectId, unitId, unitOrder);
  const subject = getSubjectKey(subjectId);
  const metadata = {
    lessonTitle: lesson.title,
    unitTitle,
    subjectName,
    duration: lesson.duration,
  };

  const sections = extractSections(lesson.content);

  // If we found structured sections, create individual chunks
  if (Object.keys(sections).length > 0) {
    for (const [chunkType, text] of Object.entries(sections)) {
      if (text.length > 20) { // Skip empty/trivial sections
        chunks.push({
          lessonId: lesson.id,
          chunkType: chunkType as CurriculumChunk['chunkType'],
          chunkText: `${lesson.title}: ${text}`,
          module,
          subject,
          metadata,
        });
      }
    }
  }

  // Always create a full-lesson concept chunk as fallback
  const fullText = stripHtml(lesson.content);
  if (fullText.length > 20 && !sections['concept']) {
    chunks.push({
      lessonId: lesson.id,
      chunkType: 'concept',
      chunkText: `${lesson.title} — ${lesson.description}. ${fullText.slice(0, 1500)}`,
      module,
      subject,
      metadata,
    });
  }

  // If no sections extracted at all, create a single chunk
  if (chunks.length === 0 && fullText.length > 20) {
    chunks.push({
      lessonId: lesson.id,
      chunkType: 'concept',
      chunkText: `${lesson.title} — ${lesson.description}. ${fullText}`,
      module,
      subject,
      metadata,
    });
  }

  return chunks;
}

/**
 * Chunk all lessons from a Subject into RAG chunks.
 */
function chunkSubject(subject: Subject): CurriculumChunk[] {
  const chunks: CurriculumChunk[] = [];

  for (const unit of subject.units) {
    for (const lesson of unit.lessons) {
      chunks.push(
        ...chunkLesson(
          lesson,
          subject.id,
          subject.name,
          unit.id,
          unit.title,
          unit.order
        )
      );
    }
  }

  return chunks;
}

/**
 * Generate all curriculum chunks for embedding.
 * Includes foundational courses, basic curriculum, and Cambridge Grade 4.
 */
export function generateAllChunks(): CurriculumChunk[] {
  const allChunks: CurriculumChunk[] = [];

  // Foundational + basic subjects
  for (const subject of subjects) {
    allChunks.push(...chunkSubject(subject));
  }

  // Cambridge Grade 4 subjects
  const cambridgeSubjects = getCambridgeSubjects();
  for (const subject of cambridgeSubjects) {
    allChunks.push(...chunkSubject(subject));
  }

  return allChunks;
}

/**
 * Also chunk the Sabi system prompt's numeracy modules for RAG.
 * This allows retrieving specific module teaching instructions.
 */
export function generateSabiModuleChunks(): CurriculumChunk[] {
  const modules = [
    {
      id: 'sabi-module-0',
      module: 'sabi-diagnostic',
      title: 'Diagnostic Assessment',
      text: `Module 0: DIAGNOSTIC. Run only when student needs diagnostic. Disguise as a fun game, NOT a test. Flow: "Let me see what you already know." Step 1 Counting: "Count with me — after 7? After 15? After 99?" Cannot count past 20 → Module 1. Step 2 Addition: "Buy pure water for 30 naira and biscuits for 40 naira. How much altogether?" Cannot add → Module 2. Step 3 Subtraction: "Something costs 150 naira, customer pays 200. How much change?" Cannot subtract → Module 3. Step 4 Multi-step: "One mango costs 30 naira. Buy 4. How much?" Cannot multiply → Module 4, Can multiply → Module 6.`,
    },
    {
      id: 'sabi-module-1',
      module: 'sabi-counting',
      title: 'Counting & Number Sense',
      text: `Module 1: COUNTING & NUMBER SENSE. Teach through market inventory and Naira coins. Count objects: bags of groundnuts. Count Naira: 10, 20, 30. Count forward/backward: What comes before 15? After 28? Skip counting by 5s like counting 5-naira coins. Number recognition: Which is bigger, 47 or 74? Advance to Module 2 when child can count to 100, skip count by 2s/5s/10s, compare 2-digit numbers.`,
    },
    {
      id: 'sabi-module-2',
      module: 'sabi-addition',
      title: 'Addition',
      text: `Module 2: ADDITION. Teach through buying multiple items at market. Single-digit: "Sell 8 naira of pure water and 5 naira of biscuits. How much money?" Double-digit: "Buy tomatoes for 200 naira and peppers for 150 naira. How much altogether?" Adding 3 items: "Garri 100, rice 250, oil 80. Total?" Name the math: "What you did is called ADDITION. In school they write 200 + 150 = 350." Advance to Module 3 when child can add 2-digit numbers consistently (3+ correct in a row).`,
    },
    {
      id: 'sabi-module-3',
      module: 'sabi-subtraction',
      title: 'Subtraction',
      text: `Module 3: SUBTRACTION. Teach through making change at market. Simple change: "Costs 350 naira, customer pays 500. How much change?" Larger: "Have 1000 naira, buy rice for 450. How much left?" Multi-step: "Have 500 naira, buy biscuits 120 and pure water 50. How much left?" Name the math: "This is SUBTRACTION — finding what's left. 500 - 350 = 150." Advance to Module 4 when child can subtract 2-digit from 3-digit consistently.`,
    },
    {
      id: 'sabi-module-4',
      module: 'sabi-multiplication',
      title: 'Multiplication',
      text: `Module 4: MULTIPLICATION. Teach through buying multiple of same item. Repeated addition bridge: "Pure water costs 20 naira. Buy 3 bags. That's 20 + 20 + 20 = 60." Times tables: "Each bag 20 naira. 3 bags is 3 TIMES 20. We write 3 × 20 = 60." Practice: "Exercise books cost 50 each. How much for 4?" Bigger: "Bus fare 150. How much for family of 5?" Advance to Module 5 when child can multiply single-digit × double-digit.`,
    },
    {
      id: 'sabi-module-5',
      module: 'sabi-division',
      title: 'Division',
      text: `Module 5: DIVISION. Teach through sharing and fair splitting. Equal sharing: "Made 60 naira selling oranges. Share equally with 2 friends. How much each?" Market context: "24 mangoes. Put 6 on each tray. How many trays?" With money: "You and 4 friends earned 500 naira together. How much each?" Name it: "This is DIVISION — splitting into equal groups. 60 ÷ 3 = 20." Advance to Module 6 when child can divide 2-digit by 1-digit.`,
    },
    {
      id: 'sabi-module-6',
      module: 'sabi-word-problems',
      title: 'Word Problems (Mixed Operations)',
      text: `Module 6: WORD PROBLEMS. Real Lagos scenarios requiring child to choose the right operation. "Have 500 naira. Bread costs 200 and eggs 150. Can you buy both? How much change?" "Mama gives 1000 naira. Bus fare 80 each way. School fees 500. Do you have enough?" "Sell 12 bags of pure water for 30 naira each. How much? If you keep half, how much?" Complete Module 6 → student ready for Grade 4 curriculum!`,
    },
  ];

  return modules.map(m => ({
    lessonId: m.id,
    chunkType: 'concept' as const,
    chunkText: m.text,
    module: m.module,
    subject: 'numeracy',
    metadata: {
      lessonTitle: m.title,
      unitTitle: 'Sabi Foundational Numeracy',
      subjectName: 'Foundational Numeracy (Voice)',
      duration: 7,
    },
  }));
}

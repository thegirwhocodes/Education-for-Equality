/**
 * Cambridge Primary Stage 4 (Grade 4) Curriculum
 * Aligned to Cambridge Primary Framework with OER content
 *
 * Sources:
 * - Cambridge Primary Mathematics 0845/0096
 * - Cambridge Primary English 0058
 * - Cambridge Primary Science
 * - Khan Academy (videos)
 * - OpenStax, CK-12 (text content)
 */

export interface CambridgeObjective {
  code: string; // e.g., "4Nn1"
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  videoSource: string | null;
  content: string;
  durationMinutes: number;
  orderIndex: number;
  standards: string[]; // Cambridge objective codes
  externalLink: string | null;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  standardsAlignment: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface SubjectCurriculum {
  subjectId: string;
  subjectName: string;
  gradeNumber: number;
  units: Unit[];
}

// ============================================
// MATHEMATICS - Cambridge Primary Stage 4
// ============================================

export const mathematicsGrade4: SubjectCurriculum = {
  subjectId: 'mathematics',
  subjectName: 'Mathematics',
  gradeNumber: 4,
  units: [
    {
      id: 'math-4-unit-1',
      title: 'Numbers and Place Value',
      description: 'Understanding numbers up to 10,000, place value, and number patterns',
      standardsAlignment: 'Cambridge Primary 4Nn1-4Nn16',
      orderIndex: 1,
      lessons: [
        {
          id: 'math-4-1-1',
          title: 'Place Value: Thousands',
          description: 'Read, write, and understand numbers up to 10,000',
          videoUrl: 'https://www.youtube.com/embed/jnBBaP8oCGg',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn1:</strong> Read and write numbers up to 10,000</p>

            <h3>Key Concepts</h3>
            <ul>
              <li>Place value: ones, tens, hundreds, thousands</li>
              <li>The number 3,456 means: 3 thousands + 4 hundreds + 5 tens + 6 ones</li>
              <li>Each place is worth 10 times the place to its right</li>
            </ul>

            <h3>Examples</h3>
            <p>5,280 = 5,000 + 200 + 80 + 0</p>
            <p>7,039 = 7,000 + 0 + 30 + 9</p>

            <h3>Practice</h3>
            <p>Write these numbers in expanded form:</p>
            <ol>
              <li>2,456</li>
              <li>8,103</li>
              <li>6,790</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn1</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Nn1', '4Nn2'],
          externalLink: 'https://www.khanacademy.org/math/cc-fourth-grade-math/place-value-and-rounding-multi-digit-numbers'
        },
        {
          id: 'math-4-1-2',
          title: 'Comparing Numbers',
          description: 'Compare numbers using > and < symbols',
          videoUrl: 'https://www.youtube.com/embed/H-xhbkj5Kn4',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn12:</strong> Compare pairs of three-digit or four-digit numbers using > and < signs</p>

            <h3>Key Concepts</h3>
            <ul>
              <li>> means "greater than"</li>
              <li>< means "less than"</li>
              <li>Compare digits from left to right</li>
            </ul>

            <h3>Examples</h3>
            <p>5,432 > 5,234 (because 4 hundreds > 2 hundreds)</p>
            <p>3,891 < 3,981 (because 8 tens < 9 tens)</p>

            <h3>Tip</h3>
            <p>The "mouth" of the symbol always opens toward the bigger number!</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn12</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 2,
          standards: ['4Nn12'],
          externalLink: 'https://www.khanacademy.org/math/cc-fourth-grade-math/comparing-whole-numbers'
        },
        {
          id: 'math-4-1-3',
          title: 'Rounding Numbers',
          description: 'Round three and four-digit numbers to nearest 10 or 100',
          videoUrl: 'https://www.youtube.com/embed/UP7YmXJc7Ik',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn9:</strong> Round three- and four-digit numbers to the nearest 10 or 100</p>

            <h3>Rounding Rules</h3>
            <ul>
              <li>Look at the digit to the right of your rounding place</li>
              <li>If it's 5 or more, round up</li>
              <li>If it's 4 or less, round down</li>
            </ul>

            <h3>Examples - Rounding to Nearest 10</h3>
            <p>347 → 350 (7 is 5 or more, so round up)</p>
            <p>342 → 340 (2 is less than 5, so round down)</p>

            <h3>Examples - Rounding to Nearest 100</h3>
            <p>2,567 → 2,600 (6 is 5 or more)</p>
            <p>2,534 → 2,500 (3 is less than 5)</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn9</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 3,
          standards: ['4Nn9'],
          externalLink: 'https://www.khanacademy.org/math/cc-fourth-grade-math/rounding-whole-numbers'
        },
        {
          id: 'math-4-1-4',
          title: 'Negative Numbers',
          description: 'Understanding negative numbers in real-world contexts',
          videoUrl: 'https://www.youtube.com/embed/uD4ttXUV0hw',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn13:</strong> Use negative numbers in context, e.g. temperature</p>

            <h3>What are Negative Numbers?</h3>
            <ul>
              <li>Numbers less than zero</li>
              <li>Written with a minus sign: -1, -2, -3...</li>
              <li>Used for temperatures below zero, depths below sea level, owing money</li>
            </ul>

            <h3>Real World Examples</h3>
            <p><strong>Temperature:</strong> -5°C means 5 degrees below freezing</p>
            <p><strong>Elevation:</strong> -10m means 10 meters below sea level</p>
            <p><strong>Money:</strong> -₦500 means you owe 500 Naira</p>

            <h3>Number Line</h3>
            <p>... -3, -2, -1, 0, 1, 2, 3 ...</p>
            <p>Negative numbers are to the LEFT of zero</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn13</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 4,
          standards: ['4Nn13'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/absolute-value/negative-numbers-intro'
        },
        {
          id: 'math-4-1-5',
          title: 'Odd and Even Numbers',
          description: 'Recognise odd and even numbers and their patterns',
          videoUrl: 'https://www.youtube.com/embed/Umxo8HX7p48',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn15:</strong> Recognise odd and even numbers</p>
            <p><strong>4Nn16:</strong> Make general statements about sums of odd and even numbers</p>

            <h3>Even Numbers</h3>
            <p>Can be divided by 2 with no remainder: 0, 2, 4, 6, 8, 10, 12...</p>
            <p>End in: 0, 2, 4, 6, or 8</p>

            <h3>Odd Numbers</h3>
            <p>Cannot be divided by 2 evenly: 1, 3, 5, 7, 9, 11, 13...</p>
            <p>End in: 1, 3, 5, 7, or 9</p>

            <h3>Patterns</h3>
            <ul>
              <li>Even + Even = Even (4 + 6 = 10)</li>
              <li>Odd + Odd = Even (3 + 5 = 8)</li>
              <li>Even + Odd = Odd (4 + 3 = 7)</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn15, 4Nn16</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 5,
          standards: ['4Nn15', '4Nn16'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/multiplication-division/multi-digit-mult/v/even-and-odd-numbers'
        }
      ]
    },
    {
      id: 'math-4-unit-2',
      title: 'Addition and Subtraction',
      description: 'Mental and written methods for adding and subtracting',
      standardsAlignment: 'Cambridge Primary 4Nc1-4Nc8',
      orderIndex: 2,
      lessons: [
        {
          id: 'math-4-2-1',
          title: 'Mental Addition Strategies',
          description: 'Quick mental methods for adding numbers',
          videoUrl: 'https://www.youtube.com/embed/AuX7nPBqDts',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc1:</strong> Derive quickly pairs of two-digit numbers with a total of 100</p>
            <p><strong>4Nc6:</strong> Add three or four small numbers, finding pairs that equal 10 or 20</p>

            <h3>Number Bonds to 100</h3>
            <p>72 + ? = 100 → Think: 72 + 8 = 80, then 80 + 20 = 100, so 72 + 28 = 100</p>

            <h3>Strategy: Make 10s First</h3>
            <p>When adding 7 + 8 + 3 + 2:</p>
            <ol>
              <li>Find pairs that make 10: 7 + 3 = 10</li>
              <li>Then: 8 + 2 = 10</li>
              <li>Finally: 10 + 10 = 20</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc1, 4Nc6</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Nc1', '4Nc6'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/addition-subtraction'
        },
        {
          id: 'math-4-2-2',
          title: 'Adding Near Multiples of 10 and 100',
          description: 'Add and subtract numbers like 99, 199, 48, 52',
          videoUrl: 'https://www.youtube.com/embed/YWm4LTYrGbY',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc8:</strong> Add and subtract near multiples of 10 or 100 to or from three-digit numbers</p>

            <h3>Strategy: Adjust and Compensate</h3>
            <p>To add 99, add 100 then subtract 1:</p>
            <p>367 + 99 = 367 + 100 - 1 = 467 - 1 = 466</p>

            <p>To subtract 198, subtract 200 then add 2:</p>
            <p>543 - 198 = 543 - 200 + 2 = 343 + 2 = 345</p>

            <h3>More Examples</h3>
            <p>278 + 49 = 278 + 50 - 1 = 328 - 1 = 327</p>
            <p>652 - 97 = 652 - 100 + 3 = 552 + 3 = 555</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc8</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 2,
          standards: ['4Nc8'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/addition-subtraction'
        },
        {
          id: 'math-4-2-3',
          title: 'Written Addition: Column Method',
          description: 'Use column addition for larger numbers',
          videoUrl: 'https://www.youtube.com/embed/mDWJ6YfR3AM',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc18:</strong> Add two three-digit numbers using written column addition</p>

            <h3>Steps for Column Addition</h3>
            <ol>
              <li>Write numbers in columns, lining up place values</li>
              <li>Add from right to left (ones, tens, hundreds)</li>
              <li>Carry when the sum is 10 or more</li>
            </ol>

            <h3>Example: 456 + 378</h3>
            <pre>
              456
            + 378
            -----
              834
            </pre>
            <p>6+8=14 (write 4, carry 1)</p>
            <p>5+7+1=13 (write 3, carry 1)</p>
            <p>4+3+1=8</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc18</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 3,
          standards: ['4Nc18'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/arith-review-add-subtract/multi-digit-add-sub'
        }
      ]
    },
    {
      id: 'math-4-unit-3',
      title: 'Multiplication and Division',
      description: 'Times tables, multiplication strategies, and division',
      standardsAlignment: 'Cambridge Primary 4Nc4-4Nc5, 4Nc20-4Nc24',
      orderIndex: 3,
      lessons: [
        {
          id: 'math-4-3-1',
          title: 'Times Tables: 2, 3, 4, 5, 10',
          description: 'Know multiplication facts for key tables',
          videoUrl: 'https://www.youtube.com/embed/jb3aj3ZGWqM',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc4:</strong> Know multiplication for 2×, 3×, 4×, 5×, 6×, 9× and 10× tables</p>

            <h3>Tips for Learning Tables</h3>
            <ul>
              <li><strong>2× table:</strong> Double the number</li>
              <li><strong>5× table:</strong> Count by 5s (ends in 0 or 5)</li>
              <li><strong>10× table:</strong> Add a 0 to the number</li>
              <li><strong>4× table:</strong> Double, then double again</li>
              <li><strong>9× table:</strong> Multiply by 10, then subtract the number</li>
            </ul>

            <h3>Practice These Facts</h3>
            <p>3 × 4 = 12 | 6 × 5 = 30 | 7 × 2 = 14</p>
            <p>4 × 9 = 36 | 8 × 3 = 24 | 5 × 6 = 30</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc4</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['4Nc4', '4Nc5'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/multiplication-division'
        },
        {
          id: 'math-4-3-2',
          title: 'Times Tables: 6 and 9',
          description: 'Master the 6 and 9 times tables',
          videoUrl: 'https://www.youtube.com/embed/EvxeUWUHUQ0',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc4:</strong> Know multiplication for 6× and 9× tables and derive division facts</p>

            <h3>6× Table Tricks</h3>
            <p>6 × even number: the answer ends in that number!</p>
            <p>6 × 2 = 12 | 6 × 4 = 24 | 6 × 6 = 36 | 6 × 8 = 48</p>

            <h3>9× Table Tricks</h3>
            <p>The digits always add up to 9:</p>
            <p>9 × 2 = 18 (1+8=9) | 9 × 3 = 27 (2+7=9) | 9 × 4 = 36 (3+6=9)</p>

            <h3>Finger Trick for 9×</h3>
            <p>Hold up 10 fingers. To find 9×4, put down finger 4.</p>
            <p>You have 3 fingers on the left, 6 on the right = 36!</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc4</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Nc4'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/multiplication-division'
        },
        {
          id: 'math-4-3-3',
          title: 'Division Facts',
          description: 'Derive division facts from multiplication',
          videoUrl: 'https://www.youtube.com/embed/MVeDXJwHfWU',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc4:</strong> Derive division facts from multiplication tables</p>

            <h3>Multiplication and Division are Related</h3>
            <p>If you know 6 × 4 = 24, then you also know:</p>
            <ul>
              <li>24 ÷ 6 = 4</li>
              <li>24 ÷ 4 = 6</li>
            </ul>

            <h3>Fact Families</h3>
            <p>3 × 7 = 21</p>
            <p>7 × 3 = 21</p>
            <p>21 ÷ 3 = 7</p>
            <p>21 ÷ 7 = 3</p>

            <h3>Think Multiplication for Division</h3>
            <p>45 ÷ 9 = ? → Think: 9 × ? = 45 → Answer: 5</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc4</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 3,
          standards: ['4Nc4'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/multiplication-division'
        },
        {
          id: 'math-4-3-4',
          title: 'Multiplying by 10 and 100',
          description: 'Multiply whole numbers by 10 and 100',
          videoUrl: 'https://www.youtube.com/embed/vFctYRhK2M0',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nc20:</strong> Multiply and divide three-digit numbers by 10 (whole number answers)</p>

            <h3>Multiplying by 10</h3>
            <p>Move all digits one place to the left, add a 0:</p>
            <p>45 × 10 = 450</p>
            <p>123 × 10 = 1,230</p>

            <h3>Multiplying by 100</h3>
            <p>Move all digits two places to the left, add 00:</p>
            <p>45 × 100 = 4,500</p>
            <p>123 × 100 = 12,300</p>

            <h3>Dividing by 10</h3>
            <p>Move all digits one place to the right:</p>
            <p>450 ÷ 10 = 45</p>
            <p>1,230 ÷ 10 = 123</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nc20</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 4,
          standards: ['4Nc20'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/multiplication-division'
        }
      ]
    },
    {
      id: 'math-4-unit-4',
      title: 'Fractions',
      description: 'Understanding, comparing, and calculating with fractions',
      standardsAlignment: 'Cambridge Primary 4Nn17-4Nn25',
      orderIndex: 4,
      lessons: [
        {
          id: 'math-4-4-1',
          title: 'Understanding Fractions',
          description: 'What fractions mean and how to read them',
          videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn17:</strong> Order and compare fractions with the same denominator</p>

            <h3>Parts of a Fraction</h3>
            <ul>
              <li><strong>Numerator (top):</strong> How many parts we have</li>
              <li><strong>Denominator (bottom):</strong> How many equal parts in the whole</li>
            </ul>

            <h3>Reading Fractions</h3>
            <p>3/4 = "three quarters" or "three fourths"</p>
            <p>2/5 = "two fifths"</p>
            <p>7/10 = "seven tenths"</p>

            <h3>Visual Example</h3>
            <p>If a pizza is cut into 8 equal slices and you eat 3:</p>
            <p>You ate 3/8 (three eighths) of the pizza</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn17</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Nn17'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic'
        },
        {
          id: 'math-4-4-2',
          title: 'Comparing Fractions',
          description: 'Compare fractions with the same denominator',
          videoUrl: 'https://www.youtube.com/embed/qb-sF8dTiNs',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn17:</strong> Order and compare two or more fractions with the same denominator</p>

            <h3>Same Denominator = Easy Comparison</h3>
            <p>When denominators are the same, just compare the numerators:</p>
            <p>3/8 < 5/8 (because 3 < 5)</p>
            <p>7/10 > 4/10 (because 7 > 4)</p>

            <h3>Ordering Fractions</h3>
            <p>Put in order from smallest to largest: 2/5, 4/5, 1/5, 3/5</p>
            <p>Answer: 1/5, 2/5, 3/5, 4/5</p>

            <h3>Remember</h3>
            <p>The bigger the numerator, the bigger the fraction (when denominators match)</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn17</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 2,
          standards: ['4Nn17'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic'
        },
        {
          id: 'math-4-4-3',
          title: 'Fractions of Amounts',
          description: 'Find fractions of numbers and quantities',
          videoUrl: 'https://www.youtube.com/embed/7z2BLolSK14',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Nn24:</strong> Relate finding fractions to division</p>
            <p><strong>4Nn25:</strong> Find halves, quarters, thirds, fifths, eighths and tenths of numbers</p>

            <h3>Finding Fractions = Division</h3>
            <p>To find 1/4 of 20: divide 20 by 4 = 5</p>
            <p>To find 1/5 of 30: divide 30 by 5 = 6</p>

            <h3>Finding Non-Unit Fractions</h3>
            <p>To find 3/4 of 20:</p>
            <ol>
              <li>Find 1/4 of 20 = 5</li>
              <li>Multiply by 3: 5 × 3 = 15</li>
            </ol>

            <h3>Examples</h3>
            <p>1/2 of 24 = 12</p>
            <p>1/3 of 15 = 5</p>
            <p>2/5 of 25 = 10</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Nn24, 4Nn25</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 3,
          standards: ['4Nn24', '4Nn25'],
          externalLink: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic'
        }
      ]
    },
    {
      id: 'math-4-unit-5',
      title: 'Geometry',
      description: 'Shapes, angles, and position',
      standardsAlignment: 'Cambridge Primary 4Gs1-4Gp4',
      orderIndex: 5,
      lessons: [
        {
          id: 'math-4-5-1',
          title: '2D Shapes and Properties',
          description: 'Identify and classify 2D shapes',
          videoUrl: 'https://www.youtube.com/embed/WYrNpb8U2ZE',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Gs1:</strong> Identify, describe and draw 2D shapes</p>

            <h3>Common 2D Shapes</h3>
            <ul>
              <li><strong>Triangle:</strong> 3 sides, 3 angles</li>
              <li><strong>Quadrilateral:</strong> 4 sides (squares, rectangles, parallelograms)</li>
              <li><strong>Pentagon:</strong> 5 sides</li>
              <li><strong>Hexagon:</strong> 6 sides</li>
              <li><strong>Octagon:</strong> 8 sides</li>
            </ul>

            <h3>Properties to Describe</h3>
            <p>Number of sides, number of angles, equal sides, parallel sides</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Gs1</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Gs1'],
          externalLink: 'https://www.khanacademy.org/math/basic-geo'
        },
        {
          id: 'math-4-5-2',
          title: 'Lines and Angles',
          description: 'Understand different types of lines and angles',
          videoUrl: 'https://www.youtube.com/embed/wvhNbSVPD7c',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Gs3:</strong> Identify right angles, angles greater than and less than a right angle</p>

            <h3>Types of Lines</h3>
            <ul>
              <li><strong>Horizontal:</strong> Goes left to right (like the horizon)</li>
              <li><strong>Vertical:</strong> Goes up and down</li>
              <li><strong>Parallel:</strong> Lines that never meet</li>
              <li><strong>Perpendicular:</strong> Lines that meet at right angles</li>
            </ul>

            <h3>Types of Angles</h3>
            <ul>
              <li><strong>Right angle:</strong> Exactly 90° (like a corner of a book)</li>
              <li><strong>Acute angle:</strong> Less than 90° (smaller than a right angle)</li>
              <li><strong>Obtuse angle:</strong> More than 90° (bigger than a right angle)</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Gs3</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Gs3'],
          externalLink: 'https://www.khanacademy.org/math/basic-geo/basic-geo-angle'
        }
      ]
    },
    {
      id: 'math-4-unit-6',
      title: 'Measurement',
      description: 'Length, mass, capacity, time, and money',
      standardsAlignment: 'Cambridge Primary 4Ml1-4Mt4',
      orderIndex: 6,
      lessons: [
        {
          id: 'math-4-6-1',
          title: 'Units of Length',
          description: 'Measure and convert units of length',
          videoUrl: 'https://www.youtube.com/embed/a4tQc0wfliY',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Ml1:</strong> Choose and use standard units to measure length</p>

            <h3>Metric Units of Length</h3>
            <ul>
              <li><strong>Millimeter (mm):</strong> Very small, width of a pencil tip</li>
              <li><strong>Centimeter (cm):</strong> Width of your finger</li>
              <li><strong>Meter (m):</strong> About the height of a door handle</li>
              <li><strong>Kilometer (km):</strong> About 10-15 minutes walking</li>
            </ul>

            <h3>Conversions</h3>
            <p>10 mm = 1 cm</p>
            <p>100 cm = 1 m</p>
            <p>1000 m = 1 km</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Ml1</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 1,
          standards: ['4Ml1'],
          externalLink: 'https://www.khanacademy.org/math/cc-fourth-grade-math/measurement'
        },
        {
          id: 'math-4-6-2',
          title: 'Time: Hours and Minutes',
          description: 'Read time and solve time problems',
          videoUrl: 'https://www.youtube.com/embed/fv6wZhJhCjY',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Mt1:</strong> Read and use a calendar</p>
            <p><strong>4Mt2:</strong> Read and tell time to the minute</p>

            <h3>Reading Time</h3>
            <ul>
              <li>Short hand = hours</li>
              <li>Long hand = minutes</li>
              <li>60 minutes = 1 hour</li>
            </ul>

            <h3>Time Calculations</h3>
            <p>What time is 45 minutes after 2:30?</p>
            <p>2:30 + 30 min = 3:00, then + 15 min = 3:15</p>

            <h3>Duration</h3>
            <p>A movie starts at 3:15 and ends at 5:00. How long is it?</p>
            <p>3:15 to 4:15 = 1 hour, 4:15 to 5:00 = 45 minutes</p>
            <p>Total = 1 hour 45 minutes</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Mt1, 4Mt2</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Mt1', '4Mt2'],
          externalLink: 'https://www.khanacademy.org/math/cc-third-grade-math/telling-time'
        }
      ]
    }
  ]
};

// ============================================
// ENGLISH - Cambridge Primary Stage 4
// ============================================

export const englishGrade4: SubjectCurriculum = {
  subjectId: 'english',
  subjectName: 'English',
  gradeNumber: 4,
  units: [
    {
      id: 'eng-4-unit-1',
      title: 'Reading Comprehension',
      description: 'Understanding texts and finding information',
      standardsAlignment: 'Cambridge Primary 4Rf1-4Rn3',
      orderIndex: 1,
      lessons: [
        {
          id: 'eng-4-1-1',
          title: 'Finding Main Ideas',
          description: 'Identify the main idea in a text',
          videoUrl: 'https://www.youtube.com/embed/sYhTCOKD_Pg',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rn1:</strong> Identify main ideas and supporting details</p>

            <h3>What is a Main Idea?</h3>
            <p>The main idea is what the text is mostly about. It's the most important point the author wants you to understand.</p>

            <h3>How to Find It</h3>
            <ol>
              <li>Read the whole text first</li>
              <li>Ask: "What is this mostly about?"</li>
              <li>Look at the title and first/last sentences</li>
              <li>Check that the details support your answer</li>
            </ol>

            <h3>Example</h3>
            <p><em>"Lions are excellent hunters. They have sharp claws and strong legs. Their golden colour helps them hide in the grass. Lions work together to catch prey."</em></p>
            <p><strong>Main idea:</strong> Lions are excellent hunters</p>
            <p><strong>Supporting details:</strong> sharp claws, strong legs, camouflage, teamwork</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Rn1</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['4Rn1'],
          externalLink: 'https://www.khanacademy.org/ela/cc-4th-reading-vocab'
        },
        {
          id: 'eng-4-1-2',
          title: 'Making Inferences',
          description: 'Read between the lines to understand meaning',
          videoUrl: 'https://www.youtube.com/embed/HoZ-eN2ozOg',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rn2:</strong> Make inferences from texts</p>

            <h3>What is an Inference?</h3>
            <p>An inference is a conclusion you make based on clues in the text plus what you already know.</p>

            <h3>Formula</h3>
            <p><strong>Text Clues + What I Know = Inference</strong></p>

            <h3>Example</h3>
            <p><em>"Sarah looked at her watch and started walking faster. She was breathing hard when she finally reached the school gate."</em></p>
            <p><strong>Inference:</strong> Sarah was late for school</p>
            <p><strong>Clues:</strong> looked at watch, walked faster, breathing hard, reached school</p>

            <h3>Practice Questions</h3>
            <ul>
              <li>What does the character feel?</li>
              <li>Why did they do that?</li>
              <li>What might happen next?</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Rn2</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Rn2'],
          externalLink: 'https://www.khanacademy.org/ela/cc-4th-reading-vocab'
        }
      ]
    },
    {
      id: 'eng-4-unit-2',
      title: 'Grammar and Punctuation',
      description: 'Sentences, parts of speech, and punctuation',
      standardsAlignment: 'Cambridge Primary 4Gp1-4Gp6',
      orderIndex: 2,
      lessons: [
        {
          id: 'eng-4-2-1',
          title: 'Types of Sentences',
          description: 'Statements, questions, commands, exclamations',
          videoUrl: 'https://www.youtube.com/embed/HlgRlKwJnKQ',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Gp1:</strong> Identify different sentence types and their punctuation</p>

            <h3>Four Types of Sentences</h3>

            <h4>1. Statement (tells something)</h4>
            <p>"The sun is shining." - ends with a period (.)</p>

            <h4>2. Question (asks something)</h4>
            <p>"Is it going to rain?" - ends with a question mark (?)</p>

            <h4>3. Command (tells someone to do something)</h4>
            <p>"Close the door." - ends with a period (.)</p>

            <h4>4. Exclamation (shows strong feeling)</h4>
            <p>"What a beautiful day!" - ends with an exclamation mark (!)</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Gp1</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 1,
          standards: ['4Gp1'],
          externalLink: 'https://www.khanacademy.org/humanities/grammar'
        },
        {
          id: 'eng-4-2-2',
          title: 'Nouns and Pronouns',
          description: 'Different types of nouns and when to use pronouns',
          videoUrl: 'https://www.youtube.com/embed/NFj0d0n4MDA',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Gp2:</strong> Identify and use nouns, pronouns correctly</p>

            <h3>Types of Nouns</h3>
            <ul>
              <li><strong>Common nouns:</strong> dog, city, book (general)</li>
              <li><strong>Proper nouns:</strong> Lagos, Nigeria, Monday (specific, capitalized)</li>
              <li><strong>Collective nouns:</strong> team, family, herd (groups)</li>
            </ul>

            <h3>Pronouns Replace Nouns</h3>
            <p>"<strong>Amara</strong> went to the market. <strong>She</strong> bought some fruit."</p>

            <h3>Subject Pronouns</h3>
            <p>I, you, he, she, it, we, they</p>

            <h3>Object Pronouns</h3>
            <p>me, you, him, her, it, us, them</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Gp2</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Gp2'],
          externalLink: 'https://www.khanacademy.org/humanities/grammar'
        },
        {
          id: 'eng-4-2-3',
          title: 'Verbs and Tenses',
          description: 'Past, present, and future tense',
          videoUrl: 'https://www.youtube.com/embed/WRvqwjZ6NbA',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Gp3:</strong> Use verb tenses consistently and correctly</p>

            <h3>Present Tense (happening now)</h3>
            <p>"I <strong>walk</strong> to school."</p>
            <p>"She <strong>plays</strong> football."</p>

            <h3>Past Tense (already happened)</h3>
            <p>"I <strong>walked</strong> to school yesterday."</p>
            <p>"She <strong>played</strong> football last week."</p>

            <h3>Future Tense (will happen)</h3>
            <p>"I <strong>will walk</strong> to school tomorrow."</p>
            <p>"She <strong>is going to play</strong> football next week."</p>

            <h3>Irregular Past Tense</h3>
            <p>go → went | eat → ate | see → saw | run → ran</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Gp3</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 3,
          standards: ['4Gp3'],
          externalLink: 'https://www.khanacademy.org/humanities/grammar'
        }
      ]
    },
    {
      id: 'eng-4-unit-3',
      title: 'Writing',
      description: 'Planning and writing different text types',
      standardsAlignment: 'Cambridge Primary 4Wn1-4Wp3',
      orderIndex: 3,
      lessons: [
        {
          id: 'eng-4-3-1',
          title: 'Writing Paragraphs',
          description: 'Structure paragraphs with topic sentences',
          videoUrl: 'https://www.youtube.com/embed/-XSKduNHFJE',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Wp1:</strong> Organize writing into paragraphs with topic sentences</p>

            <h3>Paragraph Structure</h3>
            <ol>
              <li><strong>Topic sentence:</strong> Tells what the paragraph is about</li>
              <li><strong>Supporting sentences:</strong> Give details and examples</li>
              <li><strong>Concluding sentence:</strong> Wraps up the paragraph</li>
            </ol>

            <h3>Example Paragraph</h3>
            <p><em><strong>Dogs make wonderful pets.</strong> They are loyal and loving companions. Dogs can be trained to do tricks and follow commands. They also help keep us active by needing walks every day. <strong>For all these reasons, dogs are a great choice for a family pet.</strong></em></p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Wp1</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['4Wp1'],
          externalLink: 'https://www.khanacademy.org/humanities/grammar'
        },
        {
          id: 'eng-4-3-2',
          title: 'Story Writing',
          description: 'Write stories with beginning, middle, and end',
          videoUrl: 'https://www.youtube.com/embed/hYf59B_6z1Y',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Wn1:</strong> Write stories with a clear structure</p>

            <h3>Story Structure</h3>

            <h4>Beginning (Introduction)</h4>
            <ul>
              <li>Introduce characters</li>
              <li>Set the scene (where and when)</li>
              <li>Hook the reader</li>
            </ul>

            <h4>Middle (Problem/Events)</h4>
            <ul>
              <li>Something happens (the problem)</li>
              <li>Characters try to solve it</li>
              <li>Build excitement</li>
            </ul>

            <h4>End (Resolution)</h4>
            <ul>
              <li>Problem is solved</li>
              <li>Show how characters changed</li>
              <li>Satisfying ending</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Wn1</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 2,
          standards: ['4Wn1'],
          externalLink: 'https://www.khanacademy.org/humanities/grammar'
        }
      ]
    },
    {
      id: 'eng-4-unit-4',
      title: 'Vocabulary',
      description: 'Building word knowledge and using dictionaries',
      standardsAlignment: 'Cambridge Primary 4Rv1-4Rv4',
      orderIndex: 4,
      lessons: [
        {
          id: 'eng-4-4-1',
          title: 'Prefixes and Suffixes',
          description: 'Understand how word parts change meaning',
          videoUrl: 'https://www.youtube.com/embed/JmbRDHYGYWM',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rv1:</strong> Use knowledge of prefixes and suffixes to understand new words</p>

            <h3>Common Prefixes</h3>
            <ul>
              <li><strong>un-</strong> = not (unhappy, unfair, unclear)</li>
              <li><strong>re-</strong> = again (rewrite, redo, replay)</li>
              <li><strong>dis-</strong> = not/opposite (disagree, disappear)</li>
              <li><strong>pre-</strong> = before (preview, preheat)</li>
            </ul>

            <h3>Common Suffixes</h3>
            <ul>
              <li><strong>-ful</strong> = full of (helpful, beautiful, careful)</li>
              <li><strong>-less</strong> = without (helpless, careless)</li>
              <li><strong>-ly</strong> = in a way (quickly, slowly, happily)</li>
              <li><strong>-er/-or</strong> = person who (teacher, actor)</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0) | Aligned to Cambridge Primary 4Rv1</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Rv1'],
          externalLink: 'https://www.khanacademy.org/ela'
        }
      ]
    },
    {
      id: 'eng-4-unit-5',
      title: 'Phonics and Word Reading',
      description: 'Decoding strategies, phonics patterns, and fluent word reading',
      standardsAlignment: 'Cambridge Primary 4Rw1-4Rw4',
      orderIndex: 5,
      lessons: [
        {
          id: 'eng-4-5-1',
          title: 'Long Vowel Sounds',
          description: 'Recognise and read words with long vowel patterns (a-e, i-e, o-e, u-e, ee, ea)',
          videoUrl: 'https://www.youtube.com/embed/3FMmkTayEJo',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rw1:</strong> Read words with common vowel patterns accurately</p>

            <h3>Long Vowel Patterns</h3>
            <p>Long vowels say their name! Here are the patterns:</p>
            <ul>
              <li><strong>a_e</strong> (silent e): c<strong>a</strong>k<strong>e</strong>, m<strong>a</strong>k<strong>e</strong>, l<strong>a</strong>k<strong>e</strong></li>
              <li><strong>i_e</strong> (silent e): b<strong>i</strong>k<strong>e</strong>, t<strong>i</strong>m<strong>e</strong>, l<strong>i</strong>n<strong>e</strong></li>
              <li><strong>o_e</strong> (silent e): h<strong>o</strong>m<strong>e</strong>, b<strong>o</strong>n<strong>e</strong>, r<strong>o</strong>p<strong>e</strong></li>
              <li><strong>ee</strong>: tr<strong>ee</strong>, s<strong>ee</strong>, fr<strong>ee</strong></li>
              <li><strong>ea</strong>: r<strong>ea</strong>d, m<strong>ea</strong>t, cl<strong>ea</strong>n</li>
            </ul>

            <h3>Practice: Read These Words</h3>
            <ol>
              <li>The snake lives near the <strong>lake</strong>.</li>
              <li>I need more <strong>time</strong> to finish.</li>
              <li>The <strong>tree</strong> gives us shade.</li>
              <li>We <strong>eat</strong> rice at <strong>home</strong>.</li>
            </ol>

            <h3>Nigerian Context</h3>
            <p>Many Yoruba, Igbo, and Hausa words have clear vowel sounds too. English vowels can be tricky because the same letter makes different sounds. Practice listening for the long sound!</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rw1</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Rw1'],
          externalLink: null
        },
        {
          id: 'eng-4-5-2',
          title: 'Consonant Blends and Digraphs',
          description: 'Read words with consonant clusters (bl, cr, str) and digraphs (sh, ch, th, wh)',
          videoUrl: 'https://www.youtube.com/embed/UTnZI2IG0bk',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rw2:</strong> Decode words with consonant blends and digraphs</p>

            <h3>Consonant Blends (you hear both sounds)</h3>
            <ul>
              <li><strong>bl</strong>: black, blue, blow</li>
              <li><strong>cr</strong>: cry, cross, crowd</li>
              <li><strong>str</strong>: street, strong, string</li>
              <li><strong>gr</strong>: green, grow, great</li>
              <li><strong>sp</strong>: speak, sport, spend</li>
            </ul>

            <h3>Digraphs (two letters, one sound)</h3>
            <ul>
              <li><strong>sh</strong>: shop, she, fish</li>
              <li><strong>ch</strong>: child, church, teach</li>
              <li><strong>th</strong>: the, think, three</li>
              <li><strong>wh</strong>: what, where, white</li>
            </ul>

            <h3>Practice Sentences</h3>
            <ol>
              <li>The <strong>ch</strong>ildren went to <strong>ch</strong>urch on Sunday.</li>
              <li><strong>Th</strong>e <strong>str</strong>ong man carried <strong>th</strong>ree bags.</li>
              <li><strong>Sh</strong>e bought fi<strong>sh</strong> at the market in Lagos.</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rw2</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Rw2'],
          externalLink: null
        },
        {
          id: 'eng-4-5-3',
          title: 'Syllable Types and Division',
          description: 'Break words into syllables to read longer words',
          videoUrl: 'https://www.youtube.com/embed/TvcgOhfOaOg',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rw3:</strong> Use syllable knowledge to read multi-syllable words</p>

            <h3>What is a Syllable?</h3>
            <p>A syllable is a word part with one vowel sound. Clap each part:</p>
            <ul>
              <li><strong>wa-ter</strong> = 2 syllables (clap, clap)</li>
              <li><strong>beau-ti-ful</strong> = 3 syllables (clap, clap, clap)</li>
              <li><strong>el-e-phant</strong> = 3 syllables</li>
              <li><strong>un-der-stand</strong> = 3 syllables</li>
            </ul>

            <h3>How to Divide Words</h3>
            <ol>
              <li>Find the vowels in the word</li>
              <li>Look at the consonants between vowels</li>
              <li>Split between consonants: <strong>rab-bit</strong>, <strong>hap-py</strong></li>
              <li>If only one consonant, try splitting before it: <strong>o-pen</strong>, <strong>mu-sic</strong></li>
            </ol>

            <h3>Practice: Split and Read</h3>
            <ol>
              <li>important → im-por-tant</li>
              <li>education → ed-u-ca-tion</li>
              <li>Nigeria → Ni-ge-ri-a</li>
              <li>community → com-mu-ni-ty</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rw3</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 3,
          standards: ['4Rw3'],
          externalLink: null
        },
        {
          id: 'eng-4-5-4',
          title: 'Sight Words and High-Frequency Words',
          description: 'Recognise common words that appear often in texts',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rw4:</strong> Read high-frequency words automatically</p>

            <h3>What are Sight Words?</h3>
            <p>Sight words are common words you should recognise instantly without sounding out. Many don't follow phonics rules.</p>

            <h3>Key Sight Words for Grade 4</h3>
            <ul>
              <li><strong>Group 1:</strong> because, through, thought, enough, although</li>
              <li><strong>Group 2:</strong> different, important, together, beginning, another</li>
              <li><strong>Group 3:</strong> between, country, example, question, without</li>
              <li><strong>Group 4:</strong> children, something, government, beautiful, everything</li>
            </ul>

            <h3>Practice: Read the Paragraph</h3>
            <p><em>The <strong>children</strong> walked <strong>together</strong> <strong>through</strong> the market. <strong>Although</strong> it was crowded, they found <strong>everything</strong> they needed. It was a <strong>beautiful</strong> day in our <strong>country</strong>.</em></p>

            <h3>Activity</h3>
            <p>Read the paragraph above three times. Each time, try to read faster and smoother. Can you read it without stopping?</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rw4</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 4,
          standards: ['4Rw4'],
          externalLink: null
        }
      ]
    },
    {
      id: 'eng-4-unit-6',
      title: 'Reading Fluency',
      description: 'Building speed, accuracy, and expression when reading aloud',
      standardsAlignment: 'Cambridge Primary 4Rf1-4Rf3',
      orderIndex: 6,
      lessons: [
        {
          id: 'eng-4-6-1',
          title: 'Reading with Expression',
          description: 'Use punctuation and meaning to read with natural expression',
          videoUrl: 'https://www.youtube.com/embed/S7GGkKpBR-g',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rf1:</strong> Read aloud with fluency, expression, and attention to punctuation</p>

            <h3>What is Fluent Reading?</h3>
            <p>Fluent reading means reading smoothly, at a good speed, with expression — like you are talking to someone.</p>

            <h3>How Punctuation Guides Your Voice</h3>
            <ul>
              <li><strong>Period (.)</strong> — pause and lower your voice</li>
              <li><strong>Comma (,)</strong> — short pause, keep going</li>
              <li><strong>Question mark (?)</strong> — raise your voice at the end</li>
              <li><strong>Exclamation mark (!)</strong> — show excitement or surprise</li>
              <li><strong>Quotation marks (" ")</strong> — change your voice for the character</li>
            </ul>

            <h3>Practice Passage</h3>
            <p>Read this aloud with expression:</p>
            <p><em>"Come quickly!" shouted Amara. "The market is closing soon."<br/>
            Emeka grabbed his bag and ran. "Are we too late?" he asked, breathing hard.<br/>
            "No," she smiled. "We made it just in time."</em></p>

            <h3>Tips</h3>
            <ul>
              <li>Read the passage silently first to understand it</li>
              <li>Then read it aloud, following the punctuation</li>
              <li>Record yourself and listen back — do you sound natural?</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rf1</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['4Rf1'],
          externalLink: null
        },
        {
          id: 'eng-4-6-2',
          title: 'Building Reading Speed',
          description: 'Practice strategies to increase reading speed while maintaining comprehension',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rf2:</strong> Read grade-level text at an appropriate rate</p>

            <h3>Why Speed Matters</h3>
            <p>When you read too slowly, you forget the beginning by the time you reach the end. Reading at a good pace helps you understand the whole text.</p>

            <h3>Grade 4 Target: 100-120 words per minute</h3>

            <h3>Timed Reading Practice</h3>
            <p>Read this passage and time yourself (ask someone to time you, or count to yourself):</p>
            <p><em>Nigeria is the most populated country in Africa. Over 200 million people live there. The country has many different languages, cultures, and traditions. Lagos is the biggest city. It is very busy with markets, schools, and businesses. Children in Nigeria love to play football, tell stories, and help their families. Education is very important because it helps children build a better future for themselves and their communities. Every child deserves the chance to learn and grow.</em></p>
            <p><strong>Word count: 78 words</strong></p>
            <p>If you read this in about 40-50 seconds, you are on track!</p>

            <h3>Tips to Read Faster</h3>
            <ol>
              <li>Don't point at each word — let your eyes move ahead</li>
              <li>Read phrases, not single words: "in the market" not "in... the... market"</li>
              <li>Practice the same passage 3 times — you will get faster each time</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rf2</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Rf2'],
          externalLink: null
        },
        {
          id: 'eng-4-6-3',
          title: 'Self-Monitoring While Reading',
          description: 'Learn to notice and fix mistakes when reading',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rf3:</strong> Self-correct errors during reading using meaning and phonics cues</p>

            <h3>What is Self-Monitoring?</h3>
            <p>Good readers notice when something doesn't make sense and go back to fix it. This is called self-monitoring.</p>

            <h3>Three Questions to Ask Yourself</h3>
            <ol>
              <li><strong>Does it make sense?</strong> (meaning) — If not, re-read the sentence</li>
              <li><strong>Does it sound right?</strong> (grammar) — Would someone say it that way?</li>
              <li><strong>Does it look right?</strong> (visual/phonics) — Do the letters match what I said?</li>
            </ol>

            <h3>Example</h3>
            <p>Text: "The farmer planted corn in the <strong>field</strong>."</p>
            <p>If you read "filed" instead of "field":</p>
            <ul>
              <li>Does "filed" make sense? No — you don't plant corn in a "filed"</li>
              <li>Look again at the word: f-i-e-l-d → field!</li>
              <li>Re-read: "The farmer planted corn in the <strong>field</strong>." &#10003;</li>
            </ul>

            <h3>Practice</h3>
            <p>Read this paragraph. If you get stuck on a word, use the three questions:</p>
            <p><em>The village celebrated the harvest festival with great excitement. Everyone brought different dishes to share. The children performed traditional dances while the elders watched proudly. It was a wonderful evening that brought the whole community together.</em></p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rf3</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 3,
          standards: ['4Rf3'],
          externalLink: null
        }
      ]
    },
    {
      id: 'eng-4-unit-7',
      title: 'Reading Comprehension Strategies',
      description: 'Deep reading strategies: predicting, summarising, questioning, and connecting',
      standardsAlignment: 'Cambridge Primary 4Rs1-4Rs4, 4Rn3-4Rn5',
      orderIndex: 7,
      lessons: [
        {
          id: 'eng-4-7-1',
          title: 'Predicting',
          description: 'Use clues to predict what will happen next in a text',
          videoUrl: 'https://www.youtube.com/embed/2aIJD7GGOjk',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rs1:</strong> Make and confirm predictions about texts</p>

            <h3>What is Predicting?</h3>
            <p>Predicting means guessing what will happen next using clues from the text, the title, and pictures.</p>

            <h3>How to Predict</h3>
            <ol>
              <li>Look at the title and any pictures</li>
              <li>Read the first few sentences</li>
              <li>Think: "What might happen next?"</li>
              <li>Keep reading to check your prediction</li>
            </ol>

            <h3>Practice</h3>
            <p>Read the beginning of this story. What do you think will happen?</p>
            <p><em>Chidi looked at the dark clouds gathering in the sky. The wind began to blow harder. His mother had asked him to bring the clothes from the line before it rained. He looked at his unfinished homework, then back at the window...</em></p>
            <p><strong>My prediction:</strong> (Think about what Chidi will do. Will he go outside? Will the rain come first?)</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rs1</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Rs1'],
          externalLink: null
        },
        {
          id: 'eng-4-7-2',
          title: 'Summarising',
          description: 'Identify the most important ideas and retell them briefly',
          videoUrl: 'https://www.youtube.com/embed/jWFzKy9bJkw',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rs2:</strong> Summarise the main points of a text</p>

            <h3>What is Summarising?</h3>
            <p>Summarising means retelling the most important parts of a text in your own words — shorter than the original.</p>

            <h3>Steps to Summarise</h3>
            <ol>
              <li>Read the whole text</li>
              <li>Ask: "What is the most important thing?"</li>
              <li>Leave out small details</li>
              <li>Retell in 2-3 sentences</li>
            </ol>

            <h3>Practice</h3>
            <p>Read this text and write a summary:</p>
            <p><em>The baobab tree is one of the most important trees in Africa. It can live for thousands of years and grow very thick trunks that store water. People use every part of the tree. The fruit is rich in vitamin C and can be made into juice. The bark is used to make rope and cloth. The leaves are eaten as vegetables and used as medicine. Many animals also depend on the baobab for food and shelter.</em></p>
            <p><strong>Summary:</strong> The baobab tree is an important African tree that lives very long, stores water, and provides food, medicine, and materials for people and animals.</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rs2</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 2,
          standards: ['4Rs2'],
          externalLink: null
        },
        {
          id: 'eng-4-7-3',
          title: 'Asking Questions While Reading',
          description: 'Generate questions before, during, and after reading to deepen understanding',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rs3:</strong> Ask and answer questions to show understanding of a text</p>

            <h3>Three Types of Questions</h3>
            <ul>
              <li><strong>Before reading:</strong> What do I already know? What do I want to learn?</li>
              <li><strong>During reading:</strong> What is happening? Why? What does this word mean?</li>
              <li><strong>After reading:</strong> What was the main message? What did I learn?</li>
            </ul>

            <h3>Question Words</h3>
            <p>Use these to make strong questions:</p>
            <ul>
              <li><strong>Who</strong> — asks about people</li>
              <li><strong>What</strong> — asks about things or events</li>
              <li><strong>Where</strong> — asks about places</li>
              <li><strong>When</strong> — asks about time</li>
              <li><strong>Why</strong> — asks about reasons</li>
              <li><strong>How</strong> — asks about methods or processes</li>
            </ul>

            <h3>Practice</h3>
            <p>Read this passage and write 3 questions about it:</p>
            <p><em>Wangari Maathai was a Kenyan woman who won the Nobel Peace Prize in 2004. She started the Green Belt Movement, which planted over 51 million trees across Africa. She believed that taking care of the environment was connected to peace and women's rights. She inspired millions of people to protect their land.</em></p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rs3</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 3,
          standards: ['4Rs3'],
          externalLink: null
        },
        {
          id: 'eng-4-7-4',
          title: 'Making Connections',
          description: 'Connect what you read to your own life, other texts, and the world',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p><strong>4Rs4:</strong> Make connections between texts and personal experience</p>

            <h3>Three Types of Connections</h3>
            <ul>
              <li><strong>Text to Self:</strong> "This reminds me of when I..."</li>
              <li><strong>Text to Text:</strong> "This is like another story I read..."</li>
              <li><strong>Text to World:</strong> "This connects to what is happening in..."</li>
            </ul>

            <h3>Why Connections Help</h3>
            <p>When you connect what you read to things you already know, you understand and remember it better.</p>

            <h3>Practice</h3>
            <p>Read this and make one of each connection:</p>
            <p><em>Adaeze's family moved to a new city. On her first day at her new school, she didn't know anyone. She sat alone at lunch. Then a girl named Fatima came over and said, "Would you like to sit with us?" Adaeze smiled. Maybe this new school wouldn't be so bad after all.</em></p>
            <ul>
              <li><strong>Text to Self:</strong> Have you ever been new somewhere?</li>
              <li><strong>Text to Text:</strong> Does this remind you of another story?</li>
              <li><strong>Text to World:</strong> Many children in Nigeria move to new cities for school. How does this connect?</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Aligned to Cambridge Primary 4Rs4</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 4,
          standards: ['4Rs4'],
          externalLink: null
        }
      ]
    }
  ]
};

// ============================================
// SCIENCE - Cambridge Primary Stage 4
// ============================================

export const scienceGrade4: SubjectCurriculum = {
  subjectId: 'science',
  subjectName: 'Science',
  gradeNumber: 4,
  units: [
    {
      id: 'sci-4-unit-1',
      title: 'Living Things and Their Habitats',
      description: 'Classification, habitats, and food chains',
      standardsAlignment: 'Cambridge Primary Science 4Bp1-4Bp4',
      orderIndex: 1,
      lessons: [
        {
          id: 'sci-4-1-1',
          title: 'Classifying Living Things',
          description: 'Group animals and plants by their characteristics',
          videoUrl: 'https://www.youtube.com/embed/qXlBLGz5s3o',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Classify living things into groups based on observable features</p>

            <h3>Two Main Groups</h3>
            <ul>
              <li><strong>Plants:</strong> Make their own food, usually have roots, stems, leaves</li>
              <li><strong>Animals:</strong> Cannot make food, must eat other organisms</li>
            </ul>

            <h3>Classifying Animals</h3>
            <ul>
              <li><strong>Vertebrates:</strong> Have a backbone (fish, birds, mammals, reptiles, amphibians)</li>
              <li><strong>Invertebrates:</strong> No backbone (insects, spiders, worms)</li>
            </ul>

            <h3>Examples from Nigeria</h3>
            <p>Mammals: Elephant, Lion | Birds: Crowned Crane | Reptiles: Crocodile</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Bp1'],
          externalLink: 'https://www.khanacademy.org/science/biology'
        },
        {
          id: 'sci-4-1-2',
          title: 'Food Chains',
          description: 'Understand how energy flows through ecosystems',
          videoUrl: 'https://www.youtube.com/embed/MuKs9o1s8h8',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Describe how food chains show the transfer of energy</p>

            <h3>Parts of a Food Chain</h3>
            <ul>
              <li><strong>Producer:</strong> Makes its own food (plants)</li>
              <li><strong>Consumer:</strong> Eats other organisms</li>
              <li><strong>Predator:</strong> Hunts and eats other animals</li>
              <li><strong>Prey:</strong> Animals that get eaten</li>
            </ul>

            <h3>Example Food Chain</h3>
            <p>Grass → Grasshopper → Frog → Snake → Hawk</p>
            <p>The arrow means "is eaten by"</p>

            <h3>Nigerian Savanna Food Chain</h3>
            <p>Grass → Antelope → Lion</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Bp2'],
          externalLink: 'https://www.khanacademy.org/science/biology/ecology'
        }
      ]
    },
    {
      id: 'sci-4-unit-2',
      title: 'Materials and Their Properties',
      description: 'States of matter and changes',
      standardsAlignment: 'Cambridge Primary Science 4Cm1-4Cm4',
      orderIndex: 2,
      lessons: [
        {
          id: 'sci-4-2-1',
          title: 'Solids, Liquids, and Gases',
          description: 'The three states of matter',
          videoUrl: 'https://www.youtube.com/embed/wclY8F-UoTE',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Describe the properties of solids, liquids, and gases</p>

            <h3>Solids</h3>
            <ul>
              <li>Have a fixed shape</li>
              <li>Cannot be compressed (squashed)</li>
              <li>Particles are tightly packed</li>
              <li>Examples: ice, rock, wood</li>
            </ul>

            <h3>Liquids</h3>
            <ul>
              <li>Take the shape of their container</li>
              <li>Cannot be compressed</li>
              <li>Particles can move around</li>
              <li>Examples: water, oil, juice</li>
            </ul>

            <h3>Gases</h3>
            <ul>
              <li>No fixed shape, fill the whole container</li>
              <li>Can be compressed</li>
              <li>Particles move freely</li>
              <li>Examples: air, steam, oxygen</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Cm1'],
          externalLink: 'https://www.khanacademy.org/science/chemistry'
        },
        {
          id: 'sci-4-2-2',
          title: 'Changing States',
          description: 'Melting, freezing, evaporation, and condensation',
          videoUrl: 'https://www.youtube.com/embed/xJe_GSldRho',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Explain how materials change state when heated or cooled</p>

            <h3>Changes of State</h3>
            <ul>
              <li><strong>Melting:</strong> Solid → Liquid (ice → water)</li>
              <li><strong>Freezing:</strong> Liquid → Solid (water → ice)</li>
              <li><strong>Evaporation:</strong> Liquid → Gas (water → steam)</li>
              <li><strong>Condensation:</strong> Gas → Liquid (steam → water droplets)</li>
            </ul>

            <h3>The Water Cycle</h3>
            <p>Water evaporates from oceans → rises and cools → condenses into clouds → falls as rain → flows back to oceans</p>

            <h3>Key Temperatures</h3>
            <p>Water freezes at 0°C | Water boils at 100°C</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['4Cm2'],
          externalLink: 'https://www.khanacademy.org/science/chemistry'
        }
      ]
    },
    {
      id: 'sci-4-unit-3',
      title: 'Forces and Motion',
      description: 'Pushes, pulls, and simple machines',
      standardsAlignment: 'Cambridge Primary Science 4Pf1-4Pf3',
      orderIndex: 3,
      lessons: [
        {
          id: 'sci-4-3-1',
          title: 'Types of Forces',
          description: 'Understand different forces and their effects',
          videoUrl: 'https://www.youtube.com/embed/Ybh3Sb6zxvM',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Identify different types of forces and their effects on objects</p>

            <h3>What is a Force?</h3>
            <p>A force is a push or pull that can make things move, stop, speed up, slow down, or change direction.</p>

            <h3>Types of Forces</h3>
            <ul>
              <li><strong>Gravity:</strong> Pulls things toward Earth</li>
              <li><strong>Friction:</strong> Slows things down when surfaces rub together</li>
              <li><strong>Air resistance:</strong> Slows things moving through air</li>
              <li><strong>Magnetic force:</strong> Attracts or repels magnetic materials</li>
            </ul>

            <h3>Forces are Measured in Newtons (N)</h3>
            <p>We use a spring balance (Newton meter) to measure forces.</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['4Pf1'],
          externalLink: 'https://www.khanacademy.org/science/physics'
        }
      ]
    },
    {
      id: 'sci-4-unit-4',
      title: 'The Human Body',
      description: 'Digestion and nutrition',
      standardsAlignment: 'Cambridge Primary Science 4Bh1-4Bh3',
      orderIndex: 4,
      lessons: [
        {
          id: 'sci-4-4-1',
          title: 'The Digestive System',
          description: 'How our body breaks down and uses food',
          videoUrl: 'https://www.youtube.com/embed/VwdqNqGgJGo',
          videoSource: 'Khan Academy',
          content: `
            <h3>Learning Objective</h3>
            <p>Describe the main parts of the digestive system and their functions</p>

            <h3>The Journey of Food</h3>
            <ol>
              <li><strong>Mouth:</strong> Teeth chew food, saliva starts digestion</li>
              <li><strong>Oesophagus:</strong> Food pipe, pushes food to stomach</li>
              <li><strong>Stomach:</strong> Churns food, acid breaks it down</li>
              <li><strong>Small intestine:</strong> Nutrients absorbed into blood</li>
              <li><strong>Large intestine:</strong> Water absorbed, waste stored</li>
            </ol>

            <h3>Types of Teeth</h3>
            <ul>
              <li><strong>Incisors:</strong> Cut food (front teeth)</li>
              <li><strong>Canines:</strong> Tear food (pointed teeth)</li>
              <li><strong>Molars:</strong> Grind food (back teeth)</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Khan Academy (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['4Bh1', '4Bh2'],
          externalLink: 'https://www.khanacademy.org/science/biology'
        }
      ]
    }
  ]
};

// ============================================
// SOCIAL STUDIES - Cambridge Primary Stage 4
// ============================================

export const socialStudiesGrade4: SubjectCurriculum = {
  subjectId: 'social-studies',
  subjectName: 'Social Studies',
  gradeNumber: 4,
  units: [
    {
      id: 'ss-4-unit-1',
      title: 'Geography: Maps and Nigeria',
      description: 'Understanding maps and Nigeria\'s geography',
      standardsAlignment: 'Geography Skills, Nigeria Studies',
      orderIndex: 1,
      lessons: [
        {
          id: 'ss-4-1-1',
          title: 'Reading Maps',
          description: 'Understand map features and symbols',
          videoUrl: 'https://www.youtube.com/embed/lj4e8F3k0fE',
          videoSource: 'Crash Course Kids',
          content: `
            <h3>Learning Objective</h3>
            <p>Use maps to locate places and understand geographic features</p>

            <h3>Parts of a Map</h3>
            <ul>
              <li><strong>Title:</strong> Tells what the map shows</li>
              <li><strong>Key/Legend:</strong> Explains symbols used</li>
              <li><strong>Compass rose:</strong> Shows directions (N, S, E, W)</li>
              <li><strong>Scale:</strong> Shows how distance on map relates to real distance</li>
            </ul>

            <h3>Types of Maps</h3>
            <ul>
              <li><strong>Political maps:</strong> Show countries, states, cities</li>
              <li><strong>Physical maps:</strong> Show mountains, rivers, land features</li>
              <li><strong>Road maps:</strong> Show roads and highways</li>
            </ul>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Crash Course Kids (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['Geography'],
          externalLink: 'https://www.khanacademy.org/humanities/world-history'
        },
        {
          id: 'ss-4-1-2',
          title: 'Nigeria: Our Country',
          description: 'Geography and regions of Nigeria',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p>Describe Nigeria's location, regions, and geographic features</p>

            <h3>About Nigeria</h3>
            <ul>
              <li><strong>Location:</strong> West Africa, on the Gulf of Guinea</li>
              <li><strong>Capital:</strong> Abuja</li>
              <li><strong>Largest city:</strong> Lagos</li>
              <li><strong>Population:</strong> Over 200 million people</li>
              <li><strong>Languages:</strong> English (official), plus Hausa, Yoruba, Igbo, and many more</li>
            </ul>

            <h3>Geographic Features</h3>
            <ul>
              <li><strong>Niger River:</strong> Third longest river in Africa</li>
              <li><strong>Benue River:</strong> Major tributary of the Niger</li>
              <li><strong>Lake Chad:</strong> In the northeast</li>
              <li><strong>Jos Plateau:</strong> Highland region in the center</li>
            </ul>

            <h3>Regions</h3>
            <ul>
              <li><strong>North:</strong> Savanna, drier climate</li>
              <li><strong>South:</strong> Rainforest, wetter climate</li>
              <li><strong>Niger Delta:</strong> Oil-rich coastal region</li>
            </ul>

            <h3>36 States + FCT</h3>
            <p>Nigeria is divided into 36 states and the Federal Capital Territory (Abuja).</p>
          `,
          durationMinutes: 15,
          orderIndex: 2,
          standards: ['Nigeria Studies'],
          externalLink: null
        }
      ]
    },
    {
      id: 'ss-4-unit-2',
      title: 'Civics: Government and Rights',
      description: 'Understanding government and citizenship',
      standardsAlignment: 'Civics Standards',
      orderIndex: 2,
      lessons: [
        {
          id: 'ss-4-2-1',
          title: 'What is Government?',
          description: 'Understanding why we have government',
          videoUrl: 'https://www.youtube.com/embed/VwiC2bJLfqM',
          videoSource: 'iCivics',
          content: `
            <h3>Learning Objective</h3>
            <p>Explain the purpose of government and its basic functions</p>

            <h3>Why Do We Need Government?</h3>
            <ul>
              <li>To make rules and laws for everyone</li>
              <li>To keep people safe</li>
              <li>To provide services (schools, roads, hospitals)</li>
              <li>To settle disagreements fairly</li>
            </ul>

            <h3>Nigeria's Government</h3>
            <ul>
              <li><strong>President:</strong> Leads the country (executive)</li>
              <li><strong>National Assembly:</strong> Makes laws (legislative)</li>
              <li><strong>Courts:</strong> Apply laws fairly (judicial)</li>
            </ul>

            <h3>Levels of Government</h3>
            <ol>
              <li><strong>Federal:</strong> Governs the whole country</li>
              <li><strong>State:</strong> Governs each of 36 states</li>
              <li><strong>Local:</strong> Governs local areas (LGAs)</li>
            </ol>

            <p class="text-sm text-gray-500 mt-4">
              <em>Content aligned to iCivics standards</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 1,
          standards: ['Civics'],
          externalLink: 'https://www.icivics.org'
        },
        {
          id: 'ss-4-2-2',
          title: 'Rights and Responsibilities',
          description: 'Being a good citizen',
          videoUrl: 'https://www.youtube.com/embed/9YN--ziVsaQ',
          videoSource: 'iCivics',
          content: `
            <h3>Learning Objective</h3>
            <p>Identify the rights and responsibilities of citizens</p>

            <h3>Our Rights</h3>
            <ul>
              <li>Right to education</li>
              <li>Right to express opinions</li>
              <li>Right to practice our religion</li>
              <li>Right to be treated fairly</li>
              <li>Right to safety and protection</li>
            </ul>

            <h3>Our Responsibilities</h3>
            <ul>
              <li>Obey laws and rules</li>
              <li>Respect others</li>
              <li>Help our community</li>
              <li>Take care of the environment</li>
              <li>Be honest and fair</li>
            </ul>

            <h3>Being a Good Citizen</h3>
            <p>A good citizen both enjoys their rights AND fulfills their responsibilities to make our community better for everyone.</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Content aligned to iCivics standards</em>
            </p>
          `,
          durationMinutes: 12,
          orderIndex: 2,
          standards: ['Civics'],
          externalLink: 'https://www.icivics.org'
        }
      ]
    },
    {
      id: 'ss-4-unit-3',
      title: 'History: Nigerian Heritage',
      description: 'Learning about Nigeria\'s rich history',
      standardsAlignment: 'History Standards',
      orderIndex: 3,
      lessons: [
        {
          id: 'ss-4-3-1',
          title: 'Ancient Nigerian Kingdoms',
          description: 'The great empires of Nigeria\'s past',
          videoUrl: null,
          videoSource: null,
          content: `
            <h3>Learning Objective</h3>
            <p>Learn about the major historical kingdoms in Nigerian history</p>

            <h3>The Kingdom of Benin</h3>
            <ul>
              <li>Located in present-day Edo State</li>
              <li>Famous for beautiful bronze sculptures</li>
              <li>Had a powerful Oba (king)</li>
              <li>Skilled in art, trade, and warfare</li>
            </ul>

            <h3>The Hausa City-States</h3>
            <ul>
              <li>In northern Nigeria</li>
              <li>Important trading cities like Kano, Katsina, Zaria</li>
              <li>Traded gold, leather, and cloth across the Sahara</li>
            </ul>

            <h3>The Oyo Empire</h3>
            <ul>
              <li>Yoruba kingdom in southwestern Nigeria</li>
              <li>Strong army with cavalry (horse soldiers)</li>
              <li>Rich culture of art and religion</li>
            </ul>

            <h3>Why This Matters</h3>
            <p>These kingdoms show that Nigeria has a long, proud history of civilization, art, and achievement long before European contact.</p>
          `,
          durationMinutes: 15,
          orderIndex: 1,
          standards: ['History'],
          externalLink: null
        }
      ]
    },
    {
      id: 'ss-4-unit-4',
      title: 'Economics: Needs, Wants, and Resources',
      description: 'Basic economic concepts',
      standardsAlignment: 'Economics Standards',
      orderIndex: 4,
      lessons: [
        {
          id: 'ss-4-4-1',
          title: 'Needs vs Wants',
          description: 'Understanding the difference between needs and wants',
          videoUrl: 'https://www.youtube.com/embed/PNcBsOwb6ek',
          videoSource: 'Crash Course',
          content: `
            <h3>Learning Objective</h3>
            <p>Distinguish between needs and wants; understand scarcity</p>

            <h3>Needs</h3>
            <p>Things we must have to survive:</p>
            <ul>
              <li>Food and water</li>
              <li>Shelter (a place to live)</li>
              <li>Clothing</li>
              <li>Healthcare</li>
            </ul>

            <h3>Wants</h3>
            <p>Things we would like to have but don't need to survive:</p>
            <ul>
              <li>Toys and games</li>
              <li>Fancy clothes</li>
              <li>Sweets and treats</li>
              <li>New phones</li>
            </ul>

            <h3>Scarcity</h3>
            <p>We can't have everything we want because resources are limited. This is called <strong>scarcity</strong>.</p>
            <p>Scarcity means we have to make <strong>choices</strong> about what to spend our money and time on.</p>

            <h3>Making Good Choices</h3>
            <p>Always take care of needs first, then use what's left for wants!</p>

            <p class="text-sm text-gray-500 mt-4">
              <em>Video: Crash Course (CC BY-NC-SA 4.0)</em>
            </p>
          `,
          durationMinutes: 10,
          orderIndex: 1,
          standards: ['Economics'],
          externalLink: 'https://www.khanacademy.org/economics-finance-domain'
        }
      ]
    }
  ]
};

// Export all Grade 4 curriculum
export const grade4Curriculum = {
  mathematics: mathematicsGrade4,
  english: englishGrade4,
  science: scienceGrade4,
  socialStudies: socialStudiesGrade4
};

// Helper to get total lesson count
export function getTotalLessons(curriculum: SubjectCurriculum): number {
  return curriculum.units.reduce((total, unit) => total + unit.lessons.length, 0);
}

// Helper to get total duration
export function getTotalDuration(curriculum: SubjectCurriculum): number {
  return curriculum.units.reduce((total, unit) =>
    total + unit.lessons.reduce((unitTotal, lesson) => unitTotal + lesson.durationMinutes, 0), 0
  );
}

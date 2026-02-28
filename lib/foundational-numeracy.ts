import type { Subject } from './curriculum';

export const foundationalNumeracy: Subject = {
  id: 'foundational-numeracy',
  name: 'Foundational Numeracy',
  slug: 'foundational-numeracy',
  description: 'Master numbers, addition, subtraction, multiplication, and division through real Nigerian market scenarios. For ages 8-14.',
  icon: '🔢',
  color: '#F59E0B',
  units: [
    {
      id: 'fn-unit-1',
      title: 'Counting & Number Sense',
      description: 'Learn to count, compare, and understand numbers up to hundreds using everyday Nigerian market items.',
      order: 1,
      lessons: [
        {
          id: 'fn-1-1',
          title: 'Counting Objects 1-10',
          description: 'Learn to count from 1 to 10 using groundnuts at the market.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count objects from 1 to 10 confidently, using real items you see at the market every day.</p>

<h3>🏪 Market Story</h3>
<p>Amina goes to Balogun Market in Lagos with her mother. A trader is selling groundnuts in small piles. Amina's mother says, "Count how many groundnuts are in that pile before we buy." Amina carefully touches each groundnut and counts: 1, 2, 3, 4, 5, 6, 7. There are 7 groundnuts!</p>

<h3>📝 Let's Learn</h3>
<p>Counting means saying numbers in order while pointing to each object, one at a time. The last number you say tells you how many objects there are. This is called <strong>one-to-one correspondence</strong>.</p>
<p>The numbers from 1 to 10 are: <strong>1, 2, 3, 4, 5, 6, 7, 8, 9, 10</strong></p>
<p><strong>Example 1:</strong> Emeka has some tomatoes. He touches each one and counts: 1, 2, 3, 4, 5. He has <strong>5 tomatoes</strong>.</p>
<p><strong>Example 2:</strong> Bola counts the biscuits in a pack: 1, 2, 3, 4, 5, 6, 7, 8. She has <strong>8 biscuits</strong>.</p>
<p><strong>Example 3:</strong> Chidi counts oranges on the table: 1, 2, 3. He has <strong>3 oranges</strong>.</p>
<p><strong>Tip:</strong> Always touch or point to each object as you count. Don't skip any, and don't count any object twice!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Funke has some plantains. She counts: 1, 2, 3, 4, 5, 6. How many plantains does Funke have?</li>
<li>Tunde sees 4 peppers and then finds 1 more. If he counts all the peppers, what number will he reach?</li>
<li>A trader puts out piles of groundnuts. One pile has 9 groundnuts and another has 10. Which pile has more?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Funke has <strong>6</strong> plantains. The last number she said is the total.</li>
<li>Tunde will count to <strong>5</strong>. He had 4 peppers and found 1 more.</li>
<li>The pile with <strong>10</strong> groundnuts has more, because 10 is bigger than 9.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When you count objects, touch each one and say the next number. The last number you say is the total. Practice counting things around you every day!</p>`,
          duration: 12,
          order: 1,
        },
        {
          id: 'fn-1-2',
          title: 'Counting Objects 11-20',
          description: 'Count bags of pure water and other items from 11 to 20.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count objects from 11 to 20, building on what you know about counting to 10.</p>

<h3>🏪 Market Story</h3>
<p>Emeka helps his uncle sell pure water at Mile 12 Market. A customer wants to buy a bag. Emeka's uncle says, "Count how many sachets are in that bag." Emeka counts carefully: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20. There are 20 sachets of pure water!</p>

<h3>📝 Let's Learn</h3>
<p>After 10, we keep counting: <strong>11, 12, 13, 14, 15, 16, 17, 18, 19, 20</strong>.</p>
<p>Notice that these numbers all start with the sounds of the numbers you already know. Eleven, twelve are special words. Then thir<strong>teen</strong>, four<strong>teen</strong>, fif<strong>teen</strong> — the "teen" part means "plus ten."</p>
<p><strong>Example 1:</strong> Bola counts exercise books for her class: 1, 2, 3... all the way to 14. She has <strong>14 exercise books</strong>.</p>
<p><strong>Example 2:</strong> Chidi counts eggs in a crate row: 1, 2, 3... up to 18. There are <strong>18 eggs</strong> in that row.</p>
<p><strong>Example 3:</strong> Funke counts pure water sachets: She first counts 10, then counts 6 more. She says: "10... 11, 12, 13, 14, 15, 16." She has <strong>16 sachets</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Amina counts 10 groundnuts in one pile and 5 in another. If she counts them all together, what number does she reach?</li>
<li>What number comes right after 13?</li>
<li>Tunde counts plantains and reaches 17. He finds 2 more. If he keeps counting, what numbers does he say?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Amina reaches <strong>15</strong>. 10 plus 5 more makes 15.</li>
<li>The number right after 13 is <strong>14</strong>.</li>
<li>Tunde says <strong>18, 19</strong>. He continues counting from 17.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Numbers from 11 to 20 come right after 10. You can count them by starting at 10 and counting more. Practice counting groups of 11-20 objects around your home!</p>`,
          duration: 12,
          order: 2,
        },
        {
          id: 'fn-1-3',
          title: 'Counting to 50',
          description: 'Count larger collections of market items up to 50.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count all the way from 1 to 50, using market inventory as practice.</p>

<h3>🏪 Market Story</h3>
<p>Bola's mother sells tomatoes at Oyingbo Market. Every morning, she counts her tomatoes to know how many she has. Today, Bola helps her count. They touch each tomato: "1, 2, 3..." all the way to "...48, 49, 50." Bola's mother smiles and says, "We have 50 tomatoes today. That's a good number!"</p>

<h3>📝 Let's Learn</h3>
<p>After 20, counting follows a pattern. Each group of ten has the same ending: twenty-ONE, twenty-TWO, twenty-THREE... just like ONE, TWO, THREE.</p>
<p>The tens are: <strong>10, 20, 30, 40, 50</strong>.</p>
<p>Between each ten, you count: 21, 22, 23, 24, 25, 26, 27, 28, 29, then 30. Then 31, 32, 33... and so on.</p>
<p><strong>Example 1:</strong> Count from 28 to 35: 28, 29, <strong>30</strong>, 31, 32, 33, 34, 35. Notice how 30 is the next "tens" number.</p>
<p><strong>Example 2:</strong> What comes after 39? The answer is <strong>40</strong>. After every 9, the next number is a new ten.</p>
<p><strong>Example 3:</strong> Chidi counts peppers: he reaches 45. He counts 3 more: 46, 47, 48. He has <strong>48 peppers</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What number comes after 29?</li>
<li>Count from 36 to 42. How many numbers did you say?</li>
<li>Funke counted 43 oranges in the morning. She got 5 more in the afternoon. What number does she reach when she keeps counting?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>After 29 comes <strong>30</strong>.</li>
<li>36, 37, 38, 39, 40, 41, 42 — you said <strong>7 numbers</strong>.</li>
<li>Funke reaches <strong>48</strong>. She counts: 44, 45, 46, 47, 48.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting to 50 follows a pattern: after every 9, a new tens number begins (10, 20, 30, 40, 50). Learn the pattern and you can count anything!</p>`,
          duration: 12,
          order: 3,
        },
        {
          id: 'fn-1-4',
          title: 'Counting to 100',
          description: 'Count Naira notes and other items all the way to 100.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count all the way to 100. Once you can count to 100, you can handle money and big numbers with confidence!</p>

<h3>🏪 Market Story</h3>
<p>Tunde's father is a bus conductor on a danfo in Lagos. At the end of the day, he counts his ₦10 notes. "Tunde, help me count," he says. Together they count each note: "1, 2, 3..." all the way to 100. "We collected ₦1,000 today!" his father says happily. (100 notes of ₦10 each = ₦1,000.)</p>

<h3>📝 Let's Learn</h3>
<p>You already know how to count to 50. Counting from 50 to 100 works the same way!</p>
<p>The tens from 50 to 100 are: <strong>50, 60, 70, 80, 90, 100</strong>.</p>
<p>Between each ten: 51, 52, 53, 54, 55, 56, 57, 58, 59, then 60. Then 61, 62, 63... all the way to 100.</p>
<p><strong>Example 1:</strong> What comes after 59? <strong>60</strong>. After 69? <strong>70</strong>. After 99? <strong>100</strong>!</p>
<p><strong>Example 2:</strong> Count from 77 to 83: 77, 78, 79, <strong>80</strong>, 81, 82, 83.</p>
<p><strong>Example 3:</strong> Amina counts ₦5 coins. She reaches 95 and counts 5 more: 96, 97, 98, 99, <strong>100</strong>!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What number comes after 89?</li>
<li>What number comes just before 100?</li>
<li>Emeka counts from 63. He counts 7 more. What number does he stop at?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>After 89 comes <strong>90</strong>.</li>
<li>Just before 100 is <strong>99</strong>.</li>
<li>Emeka stops at <strong>70</strong>. He counts: 64, 65, 66, 67, 68, 69, 70.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting to 100 follows the same pattern as counting to 50. After every 9, the next tens number begins. 100 is a very important number — it is 10 groups of 10!</p>`,
          duration: 12,
          order: 4,
        },
        {
          id: 'fn-1-5',
          title: 'Counting Naira Coins',
          description: 'Identify and count ₦5, ₦10, ₦20, and ₦50 coins.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to recognise different Naira coins and count collections of coins to find the total amount of money.</p>

<h3>🏪 Market Story</h3>
<p>Funke opens her piggy bank. Coins fall out everywhere! She sees some big coins, some small coins. Her older brother Chidi says, "Let me help you sort them. These are ₦5 coins, these are ₦10 coins, these are ₦20 coins, and this big one is ₦50." Funke wants to know: how much money does she have?</p>

<h3>📝 Let's Learn</h3>
<p>Nigeria has different coins worth different amounts:</p>
<ul>
<li><strong>₦5 coin</strong> — the smallest value coin</li>
<li><strong>₦10 coin</strong> — worth two ₦5 coins</li>
<li><strong>₦20 coin</strong> — worth four ₦5 coins</li>
<li><strong>₦50 coin</strong> — worth ten ₦5 coins</li>
</ul>
<p><strong>Example 1:</strong> Funke has 3 coins of ₦10. She counts: ₦10, ₦20, ₦30. She has <strong>₦30</strong>.</p>
<p><strong>Example 2:</strong> Bola has 2 coins of ₦20 and 1 coin of ₦5. She counts the ₦20 coins first: ₦20, ₦40. Then adds the ₦5: ₦45. She has <strong>₦45</strong>.</p>
<p><strong>Example 3:</strong> Tunde has 1 coin of ₦50 and 2 coins of ₦10. He counts: ₦50... then ₦60, ₦70. He has <strong>₦70</strong>.</p>
<p><strong>Tip:</strong> Always count the biggest coins first, then the smaller ones!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Amina has 4 coins of ₦5. How much money does she have?</li>
<li>Emeka has 1 coin of ₦50 and 1 coin of ₦20. How much is that altogether?</li>
<li>Chidi has 2 coins of ₦20 and 3 coins of ₦10. What is his total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Amina has <strong>₦20</strong>. She counts: ₦5, ₦10, ₦15, ₦20.</li>
<li>Emeka has <strong>₦70</strong>. ₦50 + ₦20 = ₦70.</li>
<li>Chidi has <strong>₦70</strong>. ₦20 + ₦20 = ₦40, then ₦10 + ₦10 + ₦10 = ₦30. ₦40 + ₦30 = ₦70.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Sort your coins by value, count the biggest coins first, then add the smaller ones. This is how traders in the market count their money quickly!</p>`,
          duration: 12,
          order: 5,
        },
        {
          id: 'fn-1-6',
          title: 'Counting Forward from Any Number',
          description: 'Practice starting to count from numbers other than 1.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to start counting from any number, not just from 1. This skill is very useful when you are adding more items to a group.</p>

<h3>🏪 Market Story</h3>
<p>Amina is helping her mother count garri in cups. Her mother has already counted 23 cups. A new bag arrives with more garri. Her mother says, "Start counting from 23." Amina continues: "24, 25, 26, 27, 28, 29, 30, 31, 32." Now they have 32 cups of garri!</p>

<h3>📝 Let's Learn</h3>
<p>You don't always have to start counting from 1. If you already know how many you have, just continue from that number. This is called <strong>counting on</strong>.</p>
<p><strong>Example 1:</strong> Start at 15 and count 4 more: 16, 17, 18, <strong>19</strong>.</p>
<p><strong>Example 2:</strong> Start at 47 and count 5 more: 48, 49, <strong>50</strong>, 51, <strong>52</strong>. Notice how we crossed over 50!</p>
<p><strong>Example 3:</strong> Bola has 56 beads. She gets 6 more. She counts on: 57, 58, 59, 60, 61, <strong>62</strong>. She now has 62 beads.</p>
<p><strong>Tip:</strong> When you count on, don't count the starting number. If you start at 15 and count 3 more, say "16, 17, 18" — not "15, 16, 17."</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Start at 28 and count on 4 more. What number do you reach?</li>
<li>Emeka has 35 groundnuts. He gets 7 more. What number does he reach by counting on?</li>
<li>Start at 96 and count on 5 more. What number do you reach?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You reach <strong>32</strong>. Count: 29, 30, 31, 32.</li>
<li>Emeka reaches <strong>42</strong>. Count: 36, 37, 38, 39, 40, 41, 42.</li>
<li>You reach <strong>101</strong>. Count: 97, 98, 99, 100, 101. You went past 100!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting on means starting from a number you already know and continuing forward. It saves time because you don't have to count everything from the beginning!</p>`,
          duration: 10,
          order: 6,
        },
        {
          id: 'fn-1-7',
          title: 'Counting Backward from 20',
          description: 'Learn to count backward from 20 to 0.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count backward from 20. Counting backward is important for subtraction and making change at the market.</p>

<h3>🏪 Market Story</h3>
<p>Chidi is playing a counting game with his friends in the street. They take turns counting backward from 20 before they start their race. "20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, GO!" Whoever finishes counting first without mistakes wins.</p>

<h3>📝 Let's Learn</h3>
<p>Counting backward means saying numbers in reverse order, going from a bigger number to a smaller number. It is like counting forward but in the opposite direction.</p>
<p>From 20: <strong>20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0</strong></p>
<p><strong>Example 1:</strong> Count backward from 10: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.</p>
<p><strong>Example 2:</strong> Funke has 15 sweets. She eats one each day. She counts backward to see how many she has left each day: 15, 14, 13, 12, 11...</p>
<p><strong>Example 3:</strong> Start at 18 and count back 5: 17, 16, 15, 14, <strong>13</strong>. You land on 13.</p>
<p><strong>Why it matters:</strong> When a trader gives you change, they often count backward from the amount you paid!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Count backward from 12 to 7. What numbers do you say?</li>
<li>Start at 20 and count back 6. What number do you land on?</li>
<li>Tunde has 16 biscuits and gives away 4. Count backward to find how many are left.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You say: <strong>12, 11, 10, 9, 8, 7</strong>.</li>
<li>You land on <strong>14</strong>. Count: 19, 18, 17, 16, 15, 14.</li>
<li>Tunde has <strong>12</strong> biscuits left. Count back from 16: 15, 14, 13, 12.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting backward is like counting forward in reverse. Practice every day, and it will help you subtract numbers and make change at the market!</p>`,
          duration: 10,
          order: 7,
        },
        {
          id: 'fn-1-8',
          title: 'Counting Backward from 50',
          description: 'Count backward from 50, crossing tens boundaries.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to count backward from 50, including how to cross over tens boundaries (like going from 40 to 39).</p>

<h3>🏪 Market Story</h3>
<p>Bola is helping her auntie who sells bread. Her auntie baked 50 loaves of agege bread this morning. As customers buy bread throughout the day, Bola counts backward to track how many are left. After the first customer buys 3 loaves, Bola counts back: "50... 49, 48, 47. We have 47 loaves left, Auntie!"</p>

<h3>📝 Let's Learn</h3>
<p>Counting backward from 50 follows the same pattern as counting forward, just reversed.</p>
<p>The tricky parts are crossing tens: ...41, <strong>40</strong>, 39... and ...31, <strong>30</strong>, 29... After a tens number, the next number backward ends in 9.</p>
<p><strong>Example 1:</strong> Count backward from 50 to 44: 50, 49, 48, 47, 46, 45, <strong>44</strong>.</p>
<p><strong>Example 2:</strong> Count backward from 33 to 27: 33, 32, 31, <strong>30</strong>, 29, 28, <strong>27</strong>. Notice how we crossed 30!</p>
<p><strong>Example 3:</strong> Start at 42 and count back 8: 41, 40, 39, 38, 37, 36, 35, <strong>34</strong>. We crossed 40 on the way back.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Count backward from 35 to 29. What numbers do you say?</li>
<li>Start at 50 and count back 12. What number do you land on?</li>
<li>Amina has 45 mangoes. She sells 9. Count backward to find how many remain.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You say: <strong>35, 34, 33, 32, 31, 30, 29</strong>.</li>
<li>You land on <strong>38</strong>. Count back 12 from 50: 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38.</li>
<li>Amina has <strong>36</strong> mangoes. Count back 9 from 45: 44, 43, 42, 41, 40, 39, 38, 37, 36.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When counting backward past a tens number (like 40 or 30), the number just before it always ends in 9 (39, 29). Practice crossing these tens boundaries until it feels easy!</p>`,
          duration: 12,
          order: 8,
        },
        {
          id: 'fn-1-9',
          title: 'Skip Counting by 2s',
          description: 'Count by 2s to count pairs and even numbers quickly.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to skip count by 2s, which means counting every other number. This helps you count pairs of things quickly.</p>

<h3>🏪 Market Story</h3>
<p>Emeka is at the shoe market in Balogun. Shoes come in pairs — that means 2 shoes in each pair. He needs to count how many shoes are on the shelf. Instead of counting one shoe at a time, he counts by 2s: "2, 4, 6, 8, 10, 12." There are 6 pairs, which is 12 shoes!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Skip counting by 2s</strong> means you jump over one number each time: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.</p>
<p>Keep going: 22, 24, 26, 28, 30, 32, 34, 36, 38, 40.</p>
<p>These numbers are called <strong>even numbers</strong>. They all end in 0, 2, 4, 6, or 8.</p>
<p><strong>Example 1:</strong> Count 5 pairs of slippers by 2s: 2, 4, 6, 8, <strong>10</strong>. There are 10 slippers.</p>
<p><strong>Example 2:</strong> Count by 2s from 14: 14, 16, 18, 20, 22, 24.</p>
<p><strong>Example 3:</strong> Funke counts eggs in a crate. They are arranged in rows of 2: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20. She has <strong>20 eggs</strong> in 10 rows of 2.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Skip count by 2s from 2 to 20. Write all the numbers.</li>
<li>Chidi has 7 pairs of socks. Skip count by 2s to find how many individual socks he has.</li>
<li>What is the next number in this pattern: 26, 28, 30, ___?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>2, 4, 6, 8, 10, 12, 14, 16, 18, 20</strong>.</li>
<li>Chidi has <strong>14</strong> socks. Count by 2s: 2, 4, 6, 8, 10, 12, 14.</li>
<li>The next number is <strong>32</strong>. The pattern adds 2 each time.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Skip counting by 2s is a fast way to count pairs. The pattern is: 2, 4, 6, 8, 10... These are even numbers and they always end in 0, 2, 4, 6, or 8.</p>`,
          duration: 10,
          order: 9,
        },
        {
          id: 'fn-1-10',
          title: 'Skip Counting by 5s',
          description: 'Count by 5s like counting ₦5 coins.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to skip count by 5s. This is very useful for counting ₦5 coins and groups of 5.</p>

<h3>🏪 Market Story</h3>
<p>Amina empties her savings jar and finds many ₦5 coins. Instead of adding ₦5 one at a time, her brother Tunde shows her a faster way. "Count by fives!" he says. Amina picks up each coin and counts: "₦5, ₦10, ₦15, ₦20, ₦25, ₦30, ₦35, ₦40." She has 8 coins totalling ₦40!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Skip counting by 5s</strong> means you add 5 each time: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50.</p>
<p>Keep going: 55, 60, 65, 70, 75, 80, 85, 90, 95, 100.</p>
<p>Notice the pattern: the numbers always end in <strong>5 or 0</strong>. This makes them easy to remember!</p>
<p><strong>Example 1:</strong> Count six ₦5 coins: ₦5, ₦10, ₦15, ₦20, ₦25, <strong>₦30</strong>.</p>
<p><strong>Example 2:</strong> Count by 5s from 30 to 60: 30, 35, 40, 45, 50, 55, 60.</p>
<p><strong>Example 3:</strong> Bola counts fingers in her class. Each person has 5 fingers on one hand. She counts students' hands: 5, 10, 15, 20, 25, 30. There are 6 hands up, so 6 students raised their hands.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Skip count by 5s from 5 to 50. Write all the numbers.</li>
<li>Emeka has 9 coins of ₦5. How much money does he have? Count by 5s to find out.</li>
<li>What comes next: 65, 70, 75, ___?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>5, 10, 15, 20, 25, 30, 35, 40, 45, 50</strong>.</li>
<li>Emeka has <strong>₦45</strong>. Count: ₦5, ₦10, ₦15, ₦20, ₦25, ₦30, ₦35, ₦40, ₦45.</li>
<li>The next number is <strong>80</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When you count by 5s, every number ends in 5 or 0. This pattern is perfect for counting coins and telling time on a clock!</p>`,
          duration: 10,
          order: 10,
        },
        {
          id: 'fn-1-11',
          title: 'Skip Counting by 10s',
          description: 'Count by 10s like counting ₦10 notes.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to skip count by 10s. This is one of the most useful skills for handling money in Nigeria!</p>

<h3>🏪 Market Story</h3>
<p>Chidi's father drives a keke (tricycle) in Aba. At the end of the day, he empties his pocket of ₦10 notes and asks Chidi to count them. Chidi lays them out and counts by tens: "₦10, ₦20, ₦30, ₦40, ₦50, ₦60, ₦70, ₦80, ₦90, ₦100." He counted 10 notes. "Papa, you have ₦100!" Chidi says.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Skip counting by 10s</strong> is the easiest skip counting pattern: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.</p>
<p>Every number ends in <strong>0</strong>. You just say the tens: ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred.</p>
<p><strong>Example 1:</strong> Count seven ₦10 notes: ₦10, ₦20, ₦30, ₦40, ₦50, ₦60, <strong>₦70</strong>.</p>
<p><strong>Example 2:</strong> Keep counting from 100: 110, 120, 130, 140, 150... the pattern never stops!</p>
<p><strong>Example 3:</strong> Funke sees 12 piles of 10 oranges. She counts: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, <strong>120</strong>. There are 120 oranges.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Skip count by 10s from 10 to 100.</li>
<li>Bola has 8 notes of ₦10. How much money does she have?</li>
<li>What comes next: 130, 140, 150, ___?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>10, 20, 30, 40, 50, 60, 70, 80, 90, 100</strong>.</li>
<li>Bola has <strong>₦80</strong>. Count: ₦10, ₦20, ₦30, ₦40, ₦50, ₦60, ₦70, ₦80.</li>
<li>The next number is <strong>160</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting by 10s is the fastest way to count money. Every number ends in 0. If you can count by 10s, you are already doing great with numbers!</p>`,
          duration: 10,
          order: 11,
        },
        {
          id: 'fn-1-12',
          title: 'Place Value: Ones and Tens',
          description: 'Understand that digits have different values based on their position.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn that in a two-digit number, each digit has a different value based on its position. This is called <strong>place value</strong>.</p>

<h3>🏪 Market Story</h3>
<p>Tunde has ₦37. His teacher asks, "What does each digit in 37 mean?" Tunde thinks about it. He has 3 notes of ₦10 and 7 coins of ₦1. So the 3 means 30 (three tens) and the 7 means 7 (seven ones). Together: 30 + 7 = 37!</p>

<h3>📝 Let's Learn</h3>
<p>In a two-digit number like <strong>45</strong>:</p>
<ul>
<li>The digit on the <strong>left</strong> is in the <strong>tens place</strong>. The 4 means 4 tens = <strong>40</strong>.</li>
<li>The digit on the <strong>right</strong> is in the <strong>ones place</strong>. The 5 means 5 ones = <strong>5</strong>.</li>
<li>45 = 40 + 5</li>
</ul>
<p><strong>Example 1:</strong> The number 28. The 2 is in the tens place (20), the 8 is in the ones place (8). So 28 = 20 + 8.</p>
<p><strong>Example 2:</strong> The number 73. The 7 means 70 and the 3 means 3. So 73 = 70 + 3.</p>
<p><strong>Example 3:</strong> What number has 5 tens and 6 ones? 5 tens = 50, 6 ones = 6. The number is <strong>56</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>In the number 64, what does the 6 mean? What does the 4 mean?</li>
<li>A number has 9 tens and 2 ones. What is the number?</li>
<li>Amina has ₦85. How many ₦10 notes and how many ₦1 coins could she have?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The 6 means <strong>60</strong> (6 tens). The 4 means <strong>4</strong> (4 ones). 64 = 60 + 4.</li>
<li>The number is <strong>92</strong>. 9 tens = 90, plus 2 ones = 92.</li>
<li>Amina could have <strong>8</strong> notes of ₦10 (= ₦80) and <strong>5</strong> coins of ₦1 (= ₦5). 80 + 5 = 85.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Place value tells you what each digit is worth. The position of a digit matters! A 3 in the tens place is worth 30, but a 3 in the ones place is worth only 3.</p>`,
          duration: 12,
          order: 12,
        },
        {
          id: 'fn-1-13',
          title: 'Place Value: Hundreds',
          description: 'Extend place value to understand three-digit numbers.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn about the hundreds place, so you can understand three-digit numbers like 100, 250, and 500.</p>

<h3>🏪 Market Story</h3>
<p>Bola's mother gives her ₦500 to buy food at the market. The ₦500 note has three digits. Bola thinks: the 5 is in the hundreds place, which means 5 hundreds, or 500. If she had ₦235, that would be 2 hundreds (200) + 3 tens (30) + 5 ones (5) = 235.</p>

<h3>📝 Let's Learn</h3>
<p>In a three-digit number like <strong>347</strong>:</p>
<ul>
<li>The first digit (3) is in the <strong>hundreds place</strong> = <strong>300</strong></li>
<li>The middle digit (4) is in the <strong>tens place</strong> = <strong>40</strong></li>
<li>The last digit (7) is in the <strong>ones place</strong> = <strong>7</strong></li>
<li>347 = 300 + 40 + 7</li>
</ul>
<p><strong>Example 1:</strong> 162 = 100 + 60 + 2. The 1 means one hundred, the 6 means sixty, and the 2 means two.</p>
<p><strong>Example 2:</strong> 500 = 500 + 0 + 0. There are 5 hundreds, 0 tens, and 0 ones.</p>
<p><strong>Example 3:</strong> What number has 4 hundreds, 0 tens, and 8 ones? 400 + 0 + 8 = <strong>408</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>In the number 729, what does the 7 mean? What does the 2 mean? What does the 9 mean?</li>
<li>A number has 3 hundreds, 5 tens, and 1 one. What is the number?</li>
<li>Emeka has a ₦200 note, a ₦50 note, and ₦5 in coins. How much money does he have in total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The 7 means <strong>700</strong> (7 hundreds), the 2 means <strong>20</strong> (2 tens), the 9 means <strong>9</strong> (9 ones).</li>
<li>The number is <strong>351</strong>. 300 + 50 + 1 = 351.</li>
<li>Emeka has <strong>₦255</strong>. ₦200 + ₦50 + ₦5 = ₦255.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Three-digit numbers have hundreds, tens, and ones. The hundreds place is worth the most. Understanding place value helps you read and write bigger numbers, especially when handling Naira!</p>`,
          duration: 12,
          order: 13,
        },
        {
          id: 'fn-1-14',
          title: 'Comparing Numbers',
          description: 'Learn to compare numbers and find which is bigger or smaller.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to compare two numbers and say which one is bigger (greater) and which one is smaller (less).</p>

<h3>🏪 Market Story</h3>
<p>Funke and Chidi are at the market with their mother. Funke finds tomatoes for ₦45 at one stall, and Chidi finds the same tomatoes for ₦38 at another stall. Their mother asks, "Which price is smaller?" Chidi says, "₦38 is smaller than ₦45, so let's buy from my stall!" Their mother smiles — Chidi is right!</p>

<h3>📝 Let's Learn</h3>
<p>To compare numbers, we use these symbols:</p>
<ul>
<li><strong>&gt;</strong> means "is greater than" (bigger). Example: 45 &gt; 38</li>
<li><strong>&lt;</strong> means "is less than" (smaller). Example: 38 &lt; 45</li>
<li><strong>=</strong> means "is equal to" (the same). Example: 50 = 50</li>
</ul>
<p><strong>Tip:</strong> The symbol always "eats" the bigger number. Think of it as a hungry crocodile that always opens its mouth toward the bigger number!</p>
<p><strong>Example 1:</strong> Compare 67 and 52. Look at the tens first: 6 tens &gt; 5 tens. So 67 &gt; 52.</p>
<p><strong>Example 2:</strong> Compare 34 and 37. The tens are the same (both 3). Look at the ones: 4 &lt; 7. So 34 &lt; 37.</p>
<p><strong>Example 3:</strong> Compare 120 and 89. 120 has hundreds, 89 doesn't. More digits = bigger number. So 120 &gt; 89.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Which is bigger: ₦75 or ₦57?</li>
<li>Put the correct symbol (&gt;, &lt;, or =): 43 ___ 43</li>
<li>Amina has ₦200 and Tunde has ₦185. Who has more money?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>₦75</strong> is bigger. 7 tens is more than 5 tens, so 75 &gt; 57.</li>
<li>43 <strong>=</strong> 43. They are the same number.</li>
<li><strong>Amina</strong> has more money. ₦200 &gt; ₦185 because 2 hundreds &gt; 1 hundred.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To compare numbers, start by looking at the biggest place value first (hundreds, then tens, then ones). The number with the bigger digit in the highest place is the greater number.</p>`,
          duration: 12,
          order: 14,
        },
        {
          id: 'fn-1-15',
          title: 'Ordering Numbers',
          description: 'Arrange numbers from smallest to biggest and biggest to smallest.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to put a group of numbers in order — from smallest to biggest, or from biggest to smallest.</p>

<h3>🏪 Market Story</h3>
<p>Emeka visits three stalls at Computer Village Market in Lagos. He sees prices for phone chargers: ₦150, ₦85, ₦200, and ₦120. He wants to find the cheapest one, so he puts the prices in order from smallest to biggest: ₦85, ₦120, ₦150, ₦200. The cheapest charger is ₦85!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Ascending order</strong> means from smallest to biggest: 3, 7, 12, 25, 40.</p>
<p><strong>Descending order</strong> means from biggest to smallest: 40, 25, 12, 7, 3.</p>
<p>To order numbers, compare them using place value, then arrange them step by step.</p>
<p><strong>Example 1:</strong> Put in ascending order: 56, 23, 78, 45. Compare all: 23 is the smallest, then 45, then 56, then 78. Answer: <strong>23, 45, 56, 78</strong>.</p>
<p><strong>Example 2:</strong> Put in descending order: ₦100, ₦250, ₦50, ₦175. Biggest first: <strong>₦250, ₦175, ₦100, ₦50</strong>.</p>
<p><strong>Example 3:</strong> Five children saved money. Their savings are: ₦35, ₦62, ₦18, ₦45, ₦62. In ascending order: <strong>₦18, ₦35, ₦45, ₦62, ₦62</strong>. (Notice two children saved the same amount!)</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Put these in ascending order (smallest to biggest): 47, 12, 83, 29, 65.</li>
<li>Put these in descending order (biggest to smallest): ₦500, ₦200, ₦350, ₦100.</li>
<li>Funke scored 78 in English, 92 in Math, 65 in Science, and 88 in Social Studies. Order her scores from highest to lowest.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Ascending order: <strong>12, 29, 47, 65, 83</strong>.</li>
<li>Descending order: <strong>₦500, ₦350, ₦200, ₦100</strong>.</li>
<li>Highest to lowest: <strong>92, 88, 78, 65</strong> (Math, Social Studies, English, Science).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Ascending means going up (smallest to biggest), descending means going down (biggest to smallest). Ordering numbers helps you compare prices at the market and find the best deal!</p>`,
          duration: 12,
          order: 15,
        },
      ],
    },
    {
      id: 'fn-unit-2',
      title: 'Addition',
      description: 'Learn to add numbers together using market scenarios, from simple sums to adding hundreds.',
      order: 2,
      lessons: [
        {
          id: 'fn-2-1',
          title: 'Adding With Objects',
          description: 'Combine piles of groundnuts and other objects to understand addition.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what addition means by combining groups of real objects together and counting the total.</p>

<h3>🏪 Market Story</h3>
<p>Amina has 3 groundnuts in her left hand and 4 groundnuts in her right hand. She puts them all together on the table. Now she counts all of them: 1, 2, 3, 4, 5, 6, 7. When she combined the two groups, she got 7 groundnuts! This is addition.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Addition</strong> means putting groups together to find the total. We use the <strong>+</strong> sign (called "plus") and the <strong>=</strong> sign (called "equals").</p>
<p>3 + 4 = 7. We say: "Three plus four equals seven."</p>
<p><strong>Example 1:</strong> Emeka has 2 oranges. Bola gives him 3 more. How many does he have now? 2 + 3 = <strong>5 oranges</strong>.</p>
<p><strong>Example 2:</strong> There are 5 children on one bench and 4 on another. How many children altogether? 5 + 4 = <strong>9 children</strong>.</p>
<p><strong>Example 3:</strong> Funke puts 6 tomatoes and 2 peppers in a bowl. How many vegetables in the bowl? 6 + 2 = <strong>8 vegetables</strong>.</p>
<p><strong>Tip:</strong> You can use your fingers, stones, or sticks to help you add. Put out one group, then add the other, and count everything together.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Chidi has 4 pencils. His friend gives him 3 more. How many pencils does he have now?</li>
<li>A basket has 5 mangoes. Tunde puts in 2 more. How many mangoes are in the basket?</li>
<li>There are 6 boys and 4 girls playing football. How many children are playing altogether?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>4 + 3 = <strong>7 pencils</strong>.</li>
<li>5 + 2 = <strong>7 mangoes</strong>.</li>
<li>6 + 4 = <strong>10 children</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Addition means putting groups together. The plus sign (+) tells you to combine, and the answer is the total. You can always use objects to help you count!</p>`,
          duration: 10,
          order: 1,
        },
        {
          id: 'fn-2-2',
          title: 'Adding Numbers to 5',
          description: 'Practice adding small numbers with totals up to 5.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise adding numbers where the answer is 5 or less. These are the first addition facts to memorise.</p>

<h3>🏪 Market Story</h3>
<p>Bola is helping sort fruit at her mother's market stall. She puts 2 bananas next to 1 banana. "That's 3 bananas," she says. Then she puts 2 oranges next to 2 oranges. "That's 4 oranges!" She is getting good at adding small numbers.</p>

<h3>📝 Let's Learn</h3>
<p>Here are all the ways to make numbers up to 5 by adding:</p>
<ul>
<li>1 + 1 = 2</li>
<li>1 + 2 = 3 and 2 + 1 = 3</li>
<li>1 + 3 = 4 and 2 + 2 = 4 and 3 + 1 = 4</li>
<li>1 + 4 = 5 and 2 + 3 = 5 and 3 + 2 = 5 and 4 + 1 = 5</li>
</ul>
<p>Notice: <strong>2 + 3 and 3 + 2 both equal 5</strong>. The order doesn't matter in addition! This is called the <strong>commutative property</strong>.</p>
<p><strong>Example 1:</strong> Tunde has 1 biscuit and gets 2 more: 1 + 2 = <strong>3</strong>.</p>
<p><strong>Example 2:</strong> Amina has 2 sweets and Chidi has 2 sweets. Together: 2 + 2 = <strong>4</strong>.</p>
<p><strong>Example 3:</strong> Emeka scores 3 goals on Monday and 2 on Tuesday: 3 + 2 = <strong>5</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 1 + 4?</li>
<li>What is 2 + 2?</li>
<li>Funke has 3 crayons and finds 1 more on the floor. How many crayons does she have?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>1 + 4 = <strong>5</strong>.</li>
<li>2 + 2 = <strong>4</strong>.</li>
<li>3 + 1 = <strong>4 crayons</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Learning to add up to 5 is your first step. These small sums will become automatic with practice. Use your fingers if you need help!</p>`,
          duration: 10,
          order: 2,
        },
        {
          id: 'fn-2-3',
          title: 'Adding Numbers to 10',
          description: 'Add numbers with totals up to 10.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn addition facts with answers up to 10. These are the building blocks for all bigger addition.</p>

<h3>🏪 Market Story</h3>
<p>Chidi and his sister Funke are helping their father count items at his provision store. Chidi counts 6 tins of milk on one shelf and 4 on another. "6 plus 4 equals 10!" he says. Funke counts 3 packets of biscuits on one shelf and 5 on another. "3 plus 5 equals 8!" she says. Their father is proud of them both.</p>

<h3>📝 Let's Learn</h3>
<p>Important addition facts to 10:</p>
<ul>
<li>5 + 5 = 10 (doubles!)</li>
<li>6 + 4 = 10 and 7 + 3 = 10 and 8 + 2 = 10 and 9 + 1 = 10</li>
<li>4 + 3 = 7 and 5 + 3 = 8 and 6 + 3 = 9</li>
</ul>
<p><strong>Pairs that make 10</strong> are very important: 1+9, 2+8, 3+7, 4+6, 5+5. Memorise these!</p>
<p><strong>Example 1:</strong> 7 + 2 = <strong>9</strong>. Start at 7, count on 2 more: 8, 9.</p>
<p><strong>Example 2:</strong> 4 + 5 = <strong>9</strong>. You can count on from 5 (the bigger number): 6, 7, 8, 9.</p>
<p><strong>Example 3:</strong> 6 + 4 = <strong>10</strong>. These are a pair that makes 10.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 8 + 2?</li>
<li>What is 5 + 4?</li>
<li>Bola has 7 beads and Amina gives her 3 more. How many beads does Bola have now?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>8 + 2 = <strong>10</strong>. This is a pair that makes 10!</li>
<li>5 + 4 = <strong>9</strong>.</li>
<li>7 + 3 = <strong>10 beads</strong>. Another pair that makes 10!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Memorise the pairs that make 10: 1+9, 2+8, 3+7, 4+6, 5+5. These facts will help you with all bigger calculations!</p>`,
          duration: 12,
          order: 3,
        },
        {
          id: 'fn-2-4',
          title: 'Adding Single Digits at the Market',
          description: 'Use addition with single-digit prices at the market.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise adding single-digit numbers in realistic market situations, building speed and confidence.</p>

<h3>🏪 Market Story</h3>
<p>Emeka goes to the small provision kiosk near his school. He buys a sweet for ₦3 and a chewing gum for ₦5. The shopkeeper says, "That's ₦3 plus ₦5." Emeka thinks... 3 + 5 = 8. "₦8, right?" he says. The shopkeeper nods. Emeka hands over the money feeling clever!</p>

<h3>📝 Let's Learn</h3>
<p>When you buy things at the market, you need to add prices together. Let's practise with small amounts.</p>
<p><strong>Tip:</strong> Start with the bigger number and count on. For 3 + 5, start at 5 and count on 3: 6, 7, 8.</p>
<p><strong>Example 1:</strong> A lollipop costs ₦4 and a mint costs ₦6. Total: ₦4 + ₦6 = <strong>₦10</strong>.</p>
<p><strong>Example 2:</strong> Pencil costs ₦7 and eraser costs ₦2. Total: ₦7 + ₦2 = <strong>₦9</strong>.</p>
<p><strong>Example 3:</strong> Funke buys 3 sweets at ₦2 each. Wait — that's ₦2 + ₦2 + ₦2. Let's add step by step: ₦2 + ₦2 = ₦4, then ₦4 + ₦2 = <strong>₦6</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>A pen costs ₦5 and a ruler costs ₦4. How much do they cost together?</li>
<li>Tunde buys biscuits for ₦8 and water for ₦2. What is the total?</li>
<li>Amina buys 3 oranges. Each costs ₦3. How much does she pay? (Add: ₦3 + ₦3 + ₦3)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦5 + ₦4 = <strong>₦9</strong>.</li>
<li>₦8 + ₦2 = <strong>₦10</strong>.</li>
<li>₦3 + ₦3 + ₦3 = <strong>₦9</strong>. (₦3 + ₦3 = ₦6, then ₦6 + ₦3 = ₦9)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>At the market, you add prices to find the total cost. Start from the bigger number and count on — it's faster! Practice makes perfect.</p>`,
          duration: 10,
          order: 4,
        },
        {
          id: 'fn-2-5',
          title: 'Adding with Naira: Small Amounts',
          description: 'Add small Naira amounts up to ₦50.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to add Naira amounts up to ₦50, like the money you might use for small purchases.</p>

<h3>🏪 Market Story</h3>
<p>Bola has ₦20 in her pocket. Her grandmother gives her ₦15 more for being a good girl. "How much do I have now?" Bola wonders. She thinks: ₦20 + ₦15. The tens: 20 + 10 = 30. The ones: 0 + 5 = 5. Total: ₦30 + ₦5 = <strong>₦35</strong>!</p>

<h3>📝 Let's Learn</h3>
<p>To add amounts up to ₦50, you can add the tens first, then add the ones.</p>
<p><strong>Example 1:</strong> ₦12 + ₦15. Tens: 10 + 10 = 20. Ones: 2 + 5 = 7. Total: <strong>₦27</strong>.</p>
<p><strong>Example 2:</strong> ₦30 + ₦20. Tens: 30 + 20 = 50. Ones: 0 + 0 = 0. Total: <strong>₦50</strong>.</p>
<p><strong>Example 3:</strong> ₦24 + ₦13. Tens: 20 + 10 = 30. Ones: 4 + 3 = 7. Total: <strong>₦37</strong>.</p>
<p>This method is called <strong>partitioning</strong> — you split numbers into tens and ones, add each part, then put them back together.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦14 + ₦21 = ?</li>
<li>Chidi has ₦25 and earns ₦20 by helping carry bags. How much does he have?</li>
<li>₦33 + ₦16 = ?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦14 + ₦21 = <strong>₦35</strong>. Tens: 10 + 20 = 30. Ones: 4 + 1 = 5.</li>
<li>₦25 + ₦20 = <strong>₦45</strong>.</li>
<li>₦33 + ₦16 = <strong>₦49</strong>. Tens: 30 + 10 = 40. Ones: 3 + 6 = 9.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To add two-digit numbers, split them into tens and ones, add each part separately, then combine. This makes even big-looking sums easy!</p>`,
          duration: 12,
          order: 5,
        },
        {
          id: 'fn-2-6',
          title: 'Adding Double-Digit Numbers',
          description: 'Add two-digit numbers like ₦20 + ₦30.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to add two-digit numbers confidently, including adding tens to tens.</p>

<h3>🏪 Market Story</h3>
<p>Tunde goes to the market with ₦50. He buys garri for ₦20 and pure water for ₦30. He wonders: "How much did I spend?" He adds: ₦20 + ₦30 = ₦50. "Oh! I spent all my money!" he laughs.</p>

<h3>📝 Let's Learn</h3>
<p>When adding round tens numbers, just add the tens digits and put a zero at the end:</p>
<ul>
<li>₦20 + ₦30: 2 tens + 3 tens = 5 tens = <strong>₦50</strong></li>
<li>₦40 + ₦50: 4 tens + 5 tens = 9 tens = <strong>₦90</strong></li>
</ul>
<p>For non-round numbers, use partitioning:</p>
<p><strong>Example 1:</strong> ₦35 + ₦24. Tens: 30 + 20 = 50. Ones: 5 + 4 = 9. Total: <strong>₦59</strong>.</p>
<p><strong>Example 2:</strong> ₦41 + ₦36. Tens: 40 + 30 = 70. Ones: 1 + 6 = 7. Total: <strong>₦77</strong>.</p>
<p><strong>Example 3:</strong> ₦52 + ₦25. Tens: 50 + 20 = 70. Ones: 2 + 5 = 7. Total: <strong>₦77</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦40 + ₦30 = ?</li>
<li>₦23 + ₦45 = ?</li>
<li>Amina buys an exercise book for ₦32 and a pen for ₦15. How much does she spend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦40 + ₦30 = <strong>₦70</strong>.</li>
<li>₦23 + ₦45 = <strong>₦68</strong>. Tens: 20 + 40 = 60. Ones: 3 + 5 = 8.</li>
<li>₦32 + ₦15 = <strong>₦47</strong>. Tens: 30 + 10 = 40. Ones: 2 + 5 = 7.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When adding double-digit numbers, split into tens and ones, add each part, and combine. For round tens, just add the tens digits — it's fast and easy!</p>`,
          duration: 12,
          order: 6,
        },
        {
          id: 'fn-2-7',
          title: 'Adding with Carrying',
          description: 'Add numbers where the ones add up to more than 9, like ₦45 + ₦27.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what to do when the ones digits add up to more than 9. This is called <strong>carrying</strong> or <strong>regrouping</strong>.</p>

<h3>🏪 Market Story</h3>
<p>Funke buys bread for ₦45 and eggs for ₦27. She adds the ones: 5 + 7 = 12. But 12 is more than 9! She can't put 12 in the ones place. She needs to "carry" the extra ten over to the tens column. Let's see how.</p>

<h3>📝 Let's Learn</h3>
<p>When the ones add up to 10 or more, we <strong>carry</strong> 1 ten to the tens column.</p>
<p><strong>Step-by-step for ₦45 + ₦27:</strong></p>
<ol>
<li>Add the ones: 5 + 7 = 12. Write down 2 in the ones place, carry 1 to the tens.</li>
<li>Add the tens: 4 + 2 = 6, plus the carried 1 = 7. Write 7 in the tens place.</li>
<li>Answer: <strong>₦72</strong>.</li>
</ol>
<p><strong>Example 1:</strong> ₦38 + ₦25. Ones: 8 + 5 = 13, write 3 carry 1. Tens: 3 + 2 + 1 = 6. Answer: <strong>₦63</strong>.</p>
<p><strong>Example 2:</strong> ₦56 + ₦17. Ones: 6 + 7 = 13, write 3 carry 1. Tens: 5 + 1 + 1 = 7. Answer: <strong>₦73</strong>.</p>
<p><strong>Example 3:</strong> ₦49 + ₦34. Ones: 9 + 4 = 13, write 3 carry 1. Tens: 4 + 3 + 1 = 8. Answer: <strong>₦83</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦28 + ₦15 = ?</li>
<li>₦37 + ₦46 = ?</li>
<li>Bola buys a notebook for ₦65 and crayons for ₦28. What is the total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦28 + ₦15 = <strong>₦43</strong>. Ones: 8 + 5 = 13, write 3 carry 1. Tens: 2 + 1 + 1 = 4.</li>
<li>₦37 + ₦46 = <strong>₦83</strong>. Ones: 7 + 6 = 13, write 3 carry 1. Tens: 3 + 4 + 1 = 8.</li>
<li>₦65 + ₦28 = <strong>₦93</strong>. Ones: 5 + 8 = 13, write 3 carry 1. Tens: 6 + 2 + 1 = 9.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When ones add up to 10 or more, write down the ones digit and carry 1 to the tens column. Don't forget to add the carried 1!</p>`,
          duration: 14,
          order: 7,
        },
        {
          id: 'fn-2-8',
          title: 'Adding Three Items Together',
          description: 'Add three numbers in a row.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to add three numbers together, which is what happens when you buy three items at the market.</p>

<h3>🏪 Market Story</h3>
<p>Emeka goes to the shop and buys three things: a pencil for ₦5, an eraser for ₦3, and a sharpener for ₦4. The shopkeeper says, "That will be... let me add it up." ₦5 + ₦3 + ₦4. Emeka works it out: first ₦5 + ₦3 = ₦8, then ₦8 + ₦4 = ₦12. "₦12, oga!" Emeka says.</p>

<h3>📝 Let's Learn</h3>
<p>To add three numbers, add the first two, then add the third to the result. You can also look for pairs that make 10!</p>
<p><strong>Strategy:</strong> Look for pairs that make 10 first. For example, in 6 + 7 + 4, notice that 6 + 4 = 10, then 10 + 7 = 17. Much easier!</p>
<p><strong>Example 1:</strong> 3 + 5 + 7. Add step by step: 3 + 5 = 8, then 8 + 7 = <strong>15</strong>. Or: 3 + 7 = 10, then 10 + 5 = <strong>15</strong>.</p>
<p><strong>Example 2:</strong> 8 + 2 + 6. Notice 8 + 2 = 10! Then 10 + 6 = <strong>16</strong>.</p>
<p><strong>Example 3:</strong> 4 + 9 + 6. Notice 4 + 6 = 10! Then 10 + 9 = <strong>19</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 5 + 3 + 7?</li>
<li>Chidi buys items costing ₦6, ₦4, and ₦8. What is the total?</li>
<li>Add: 9 + 1 + 5. (Hint: look for a pair that makes 10!)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>5 + 3 + 7 = <strong>15</strong>. (5 + 3 = 8, then 8 + 7 = 15. Or: 3 + 7 = 10, then 10 + 5 = 15.)</li>
<li>₦6 + ₦4 + ₦8 = <strong>₦18</strong>. (6 + 4 = 10, then 10 + 8 = 18.)</li>
<li>9 + 1 + 5 = <strong>15</strong>. (9 + 1 = 10, then 10 + 5 = 15.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When adding three numbers, look for pairs that make 10 first. This shortcut makes adding much faster and easier!</p>`,
          duration: 12,
          order: 8,
        },
        {
          id: 'fn-2-9',
          title: 'Adding Three Prices at the Market',
          description: 'Add three market prices together using two-digit numbers.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise adding three two-digit prices together, just like shopping at a real market.</p>

<h3>🏪 Market Story</h3>
<p>Amina is buying ingredients for jollof rice. She needs tomatoes (₦25), rice (₦40), and oil (₦15). She needs to know the total before she pays. She adds step by step: ₦25 + ₦40 = ₦65, then ₦65 + ₦15 = ₦80. She needs ₦80 for all three items.</p>

<h3>📝 Let's Learn</h3>
<p>When adding three bigger numbers, add two of them first, then add the third.</p>
<p><strong>Tip:</strong> Add the easiest pair first. Round numbers (like ₦40) are easiest to add.</p>
<p><strong>Example 1:</strong> ₦20 + ₦35 + ₦10. Start with ₦20 + ₦10 = ₦30 (easy!). Then ₦30 + ₦35 = <strong>₦65</strong>.</p>
<p><strong>Example 2:</strong> ₦15 + ₦22 + ₦13. Add: ₦15 + ₦22 = ₦37. Then ₦37 + ₦13 = <strong>₦50</strong>.</p>
<p><strong>Example 3:</strong> ₦30 + ₦25 + ₦30. Add: ₦30 + ₦30 = ₦60. Then ₦60 + ₦25 = <strong>₦85</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Tunde buys biscuits for ₦15, juice for ₦20, and bread for ₦25. What is the total?</li>
<li>₦30 + ₦18 + ₦12 = ?</li>
<li>Funke buys an exercise book (₦35), a pen (₦20), and a ruler (₦10). How much does she spend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦15 + ₦20 + ₦25 = <strong>₦60</strong>. (₦15 + ₦25 = ₦40, then ₦40 + ₦20 = ₦60.)</li>
<li>₦30 + ₦18 + ₦12 = <strong>₦60</strong>. (₦18 + ₦12 = ₦30, then ₦30 + ₦30 = ₦60.)</li>
<li>₦35 + ₦20 + ₦10 = <strong>₦65</strong>. (₦20 + ₦10 = ₦30, then ₦30 + ₦35 = ₦65.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When adding three prices, find the easiest pair to add first. Look for numbers that make a round ten. Then add the third number to the result.</p>`,
          duration: 12,
          order: 9,
        },
        {
          id: 'fn-2-10',
          title: 'Mental Addition: Making 10 First',
          description: 'Learn the strategy of making 10 to add faster in your head.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn a powerful mental math trick: break a number apart to make 10 first, then add the rest.</p>

<h3>🏪 Market Story</h3>
<p>Bola needs to add ₦8 + ₦5 in her head quickly at the market. She thinks: "I need 2 more to make ₦8 into ₦10. I'll take 2 from the 5, leaving 3. So ₦10 + ₦3 = ₦13!" She did it without counting on her fingers!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>Make 10</strong> strategy works like this:</p>
<ol>
<li>Look at the bigger number. How many more do you need to make 10?</li>
<li>Take that amount from the other number.</li>
<li>Add 10 + whatever is left.</li>
</ol>
<p><strong>Example 1:</strong> 9 + 4. Need 1 to make 10. Take 1 from 4, leaving 3. 10 + 3 = <strong>13</strong>.</p>
<p><strong>Example 2:</strong> 7 + 5. Need 3 to make 10. Take 3 from 5, leaving 2. 10 + 2 = <strong>12</strong>.</p>
<p><strong>Example 3:</strong> 8 + 6. Need 2 to make 10. Take 2 from 6, leaving 4. 10 + 4 = <strong>14</strong>.</p>
<p>This works because adding to 10 is easy — you just put the leftover number after the 1!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Use Make 10 to solve: 9 + 6. How many do you need to make 10? What is left?</li>
<li>Use Make 10 to solve: 7 + 8.</li>
<li>Emeka needs to quickly add ₦8 + ₦7 at the kiosk. Use Make 10 to help him.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>9 + 6: Need 1 to make 10, take 1 from 6, leaving 5. 10 + 5 = <strong>15</strong>.</li>
<li>7 + 8: Need 3 to make 7 into 10? Actually, start with 8 (bigger number). Need 2 to make 10. Take 2 from 7, leaving 5. 10 + 5 = <strong>15</strong>.</li>
<li>8 + 7: Need 2 to make 10. Take 2 from 7, leaving 5. 10 + 5 = <strong>₦15</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The Make 10 strategy is a mental math superpower! Break a number apart so one number becomes 10, then add what's left. Practice until it becomes automatic.</p>`,
          duration: 12,
          order: 10,
        },
        {
          id: 'fn-2-11',
          title: 'Mental Addition: Doubles',
          description: 'Learn to add doubles and near-doubles quickly.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the doubles addition facts and how to use "near doubles" to add quickly in your head.</p>

<h3>🏪 Market Story</h3>
<p>Chidi and his twin brother both get ₦7 as pocket money. Their mother asks, "How much do you two have together?" Chidi says, "That's double 7! 7 + 7 = ₦14." Then Funke gets ₦8. Chidi thinks, "8 is near 7. So 7 + 8 is like 7 + 7 plus 1 more. That's ₦15!"</p>

<h3>📝 Let's Learn</h3>
<p><strong>Doubles</strong> are when you add a number to itself:</p>
<ul>
<li>1 + 1 = 2</li>
<li>2 + 2 = 4</li>
<li>3 + 3 = 6</li>
<li>4 + 4 = 8</li>
<li>5 + 5 = 10</li>
<li>6 + 6 = 12</li>
<li>7 + 7 = 14</li>
<li>8 + 8 = 16</li>
<li>9 + 9 = 18</li>
<li>10 + 10 = 20</li>
</ul>
<p><strong>Near doubles</strong>: If you know 6 + 6 = 12, then 6 + 7 = 12 + 1 = <strong>13</strong>.</p>
<p><strong>Example 1:</strong> 8 + 8 = <strong>16</strong> (double 8).</p>
<p><strong>Example 2:</strong> 8 + 9 = 8 + 8 + 1 = 16 + 1 = <strong>17</strong> (near double).</p>
<p><strong>Example 3:</strong> 15 + 15 = <strong>30</strong> (double 15). So 15 + 16 = 30 + 1 = <strong>31</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 6 + 6?</li>
<li>Using doubles, what is 6 + 7?</li>
<li>What is 20 + 20? Then what is 20 + 21?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 + 6 = <strong>12</strong>.</li>
<li>6 + 7 = 6 + 6 + 1 = 12 + 1 = <strong>13</strong>.</li>
<li>20 + 20 = <strong>40</strong>. And 20 + 21 = 40 + 1 = <strong>41</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Memorise the doubles facts — they are your secret weapon! For near-doubles, just add 1 more to the doubles answer. Fast and simple!</p>`,
          duration: 10,
          order: 11,
        },
        {
          id: 'fn-2-12',
          title: 'Adding Hundreds',
          description: 'Add hundreds like ₦100 + ₦200.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to add hundreds, which is just like adding single digits but with extra zeros!</p>

<h3>🏪 Market Story</h3>
<p>Tunde's mother gives him ₦200 for transport and ₦300 for food. How much does Tunde have altogether? He thinks: "If 2 + 3 = 5, then ₦200 + ₦300 = ₦500!" Adding hundreds is just like adding small numbers.</p>

<h3>📝 Let's Learn</h3>
<p>Adding hundreds works the same way as adding ones, just with two extra zeros:</p>
<ul>
<li>1 + 2 = 3, so ₦100 + ₦200 = <strong>₦300</strong></li>
<li>3 + 4 = 7, so ₦300 + ₦400 = <strong>₦700</strong></li>
<li>5 + 5 = 10, so ₦500 + ₦500 = <strong>₦1,000</strong></li>
</ul>
<p><strong>Example 1:</strong> ₦100 + ₦400 = <strong>₦500</strong>. Think: 1 + 4 = 5, so it's 500.</p>
<p><strong>Example 2:</strong> ₦200 + ₦600 = <strong>₦800</strong>. Think: 2 + 6 = 8, so it's 800.</p>
<p><strong>Example 3:</strong> ₦300 + ₦300 = <strong>₦600</strong>. Think: double 3 = 6, so it's 600.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦400 + ₦200 = ?</li>
<li>₦500 + ₦300 = ?</li>
<li>Amina saves ₦200 in January and ₦300 in February. How much has she saved?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦400 + ₦200 = <strong>₦600</strong>.</li>
<li>₦500 + ₦300 = <strong>₦800</strong>.</li>
<li>₦200 + ₦300 = <strong>₦500</strong>. Amina saved ₦500.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Adding hundreds is just like adding single digits — just add zeros at the end! If you know 3 + 4 = 7, you know ₦300 + ₦400 = ₦700.</p>`,
          duration: 10,
          order: 12,
        },
        {
          id: 'fn-2-13',
          title: 'Adding Hundreds and Tens',
          description: 'Add numbers like ₦150 + ₦230.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to add numbers that have both hundreds and tens, like ₦150 + ₦230.</p>

<h3>🏪 Market Story</h3>
<p>Bola's family is saving for a new cooking pot. Bola's mother has ₦350 and her father adds ₦240. How much do they have together? Bola adds: hundreds first: 300 + 200 = 500. Then tens: 50 + 40 = 90. Total: ₦500 + ₦90 = <strong>₦590</strong>.</p>

<h3>📝 Let's Learn</h3>
<p>Add hundreds first, then tens, then ones. This is partitioning with bigger numbers.</p>
<p><strong>Example 1:</strong> ₦120 + ₦150. Hundreds: 100 + 100 = 200. Tens: 20 + 50 = 70. Total: <strong>₦270</strong>.</p>
<p><strong>Example 2:</strong> ₦230 + ₦340. Hundreds: 200 + 300 = 500. Tens: 30 + 40 = 70. Total: <strong>₦570</strong>.</p>
<p><strong>Example 3:</strong> ₦175 + ₦220. Hundreds: 100 + 200 = 300. Tens: 70 + 20 = 90. Ones: 5 + 0 = 5. Total: <strong>₦395</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦210 + ₦130 = ?</li>
<li>₦450 + ₦320 = ?</li>
<li>Emeka earns ₦250 on Saturday and ₦180 on Sunday. How much did he earn over the weekend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦210 + ₦130 = <strong>₦340</strong>. Hundreds: 200 + 100 = 300. Tens: 10 + 30 = 40.</li>
<li>₦450 + ₦320 = <strong>₦770</strong>. Hundreds: 400 + 300 = 700. Tens: 50 + 20 = 70.</li>
<li>₦250 + ₦180 = <strong>₦430</strong>. Hundreds: 200 + 100 = 300. Tens: 50 + 80 = 130. Total: 300 + 130 = 430.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To add big numbers, partition them into hundreds, tens, and ones. Add each part separately, then combine. You can handle any number this way!</p>`,
          duration: 14,
          order: 13,
        },
        {
          id: 'fn-2-14',
          title: 'Addition Word Problems: Buying Items',
          description: 'Solve addition word problems about buying things at the market.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise solving word problems about buying items, turning real situations into addition sums.</p>

<h3>🏪 Market Story</h3>
<p>Funke goes shopping at Balogun Market. She needs to buy school supplies. She reads the prices: exercise books ₦45 each, pencils ₦15 each, and erasers ₦10 each. She buys one of each. Can she figure out the total?</p>

<h3>📝 Let's Learn</h3>
<p>Word problems tell a story with numbers. To solve them:</p>
<ol>
<li><strong>Read</strong> the problem carefully.</li>
<li><strong>Find</strong> the numbers and what you need to do.</li>
<li><strong>Solve</strong> by adding.</li>
<li><strong>Check</strong> — does the answer make sense?</li>
</ol>
<p><strong>Example 1:</strong> Tunde buys a shirt for ₦85 and trousers for ₦120. How much does he spend?
<br>Numbers: ₦85 and ₦120. Operation: Add. ₦85 + ₦120 = <strong>₦205</strong>.</p>
<p><strong>Example 2:</strong> Amina buys garri for ₦50, fish for ₦75, and peppers for ₦25. What is the total cost?
<br>Add step by step: ₦50 + ₦75 = ₦125. Then ₦125 + ₦25 = <strong>₦150</strong>.</p>
<p><strong>Example 3:</strong> A book costs ₦60 and a bag costs ₦150. Chidi buys both. How much does he pay?
<br>₦60 + ₦150 = <strong>₦210</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola buys a dress for ₦200 and shoes for ₦150. How much does she spend altogether?</li>
<li>Emeka buys rice for ₦90, beans for ₦60, and oil for ₦45. What is the total?</li>
<li>Funke buys 2 exercise books at ₦45 each. How much does she pay? (Hint: ₦45 + ₦45)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦200 + ₦150 = <strong>₦350</strong>.</li>
<li>₦90 + ₦60 + ₦45 = <strong>₦195</strong>. (₦90 + ₦60 = ₦150, then ₦150 + ₦45 = ₦195.)</li>
<li>₦45 + ₦45 = <strong>₦90</strong>. (Double 45 = 90.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Word problems are just addition hidden in a story. Find the numbers, add them up, and check your answer. You use this skill every time you go to the market!</p>`,
          duration: 12,
          order: 14,
        },
        {
          id: 'fn-2-15',
          title: 'Addition Word Problems: Saving Money',
          description: 'Solve word problems about saving and collecting money.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems about saving money over time, adding amounts together to find totals.</p>

<h3>🏪 Market Story</h3>
<p>Chidi wants to buy a football that costs ₦500. He saves money each week from helping at his uncle's shop. Week 1: ₦80. Week 2: ₦120. Week 3: ₦95. Week 4: ₦110. Has he saved enough?</p>

<h3>📝 Let's Learn</h3>
<p>Saving money means adding amounts over time. Let's solve Chidi's problem:</p>
<p>Week 1 + Week 2: ₦80 + ₦120 = ₦200</p>
<p>+ Week 3: ₦200 + ₦95 = ₦295</p>
<p>+ Week 4: ₦295 + ₦110 = ₦405</p>
<p>Chidi has ₦405. The football costs ₦500. He needs ₦95 more. Not yet enough!</p>
<p><strong>Example 1:</strong> Amina saves ₦50 on Monday and ₦50 on Friday. After 2 weeks, how much has she saved?
<br>Each week: ₦50 + ₦50 = ₦100. Two weeks: ₦100 + ₦100 = <strong>₦200</strong>.</p>
<p><strong>Example 2:</strong> Bola collects ₦30 from her mother and ₦20 from her father each day. In 3 days, how much does she collect?
<br>Each day: ₦30 + ₦20 = ₦50. Three days: ₦50 + ₦50 + ₦50 = <strong>₦150</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Tunde saves ₦40 each week. How much does he have after 3 weeks?</li>
<li>Funke saves ₦65 in January, ₦80 in February, and ₦55 in March. What is her total savings?</li>
<li>Emeka collects ₦150 on Saturday and ₦200 on Sunday from washing cars. How much did he earn over the weekend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦40 + ₦40 + ₦40 = <strong>₦120</strong>.</li>
<li>₦65 + ₦80 + ₦55 = <strong>₦200</strong>. (₦65 + ₦55 = ₦120, then ₦120 + ₦80 = ₦200.)</li>
<li>₦150 + ₦200 = <strong>₦350</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Saving money is addition over time. Add each new amount to your running total to see how much you have. This is how real savings grow!</p>`,
          duration: 12,
          order: 15,
        },
        {
          id: 'fn-2-16',
          title: 'Addition Word Problems: Counting Collections',
          description: 'Solve problems about combining collections and groups.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems about combining groups of objects, like counting collections or gathering items.</p>

<h3>🏪 Market Story</h3>
<p>Bola collects colourful bottle caps. She has 37 blue caps, 28 red caps, and 15 green caps. She wants to know how many bottle caps she has in total. Let's help her add them up!</p>

<h3>📝 Let's Learn</h3>
<p>When you combine collections, you add all the groups together.</p>
<p>Bola's bottle caps: 37 + 28 + 15</p>
<p>Step 1: 37 + 28. Ones: 7 + 8 = 15, write 5 carry 1. Tens: 3 + 2 + 1 = 6. Total: 65.</p>
<p>Step 2: 65 + 15. Ones: 5 + 5 = 10, write 0 carry 1. Tens: 6 + 1 + 1 = 8. Total: <strong>80</strong>.</p>
<p>Bola has 80 bottle caps altogether!</p>
<p><strong>Example 1:</strong> A school has 45 boys and 52 girls. How many students in total? 45 + 52 = <strong>97 students</strong>.</p>
<p><strong>Example 2:</strong> Emeka picks 18 mangoes from one tree and 24 from another. Total: 18 + 24 = <strong>42 mangoes</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Chidi has 33 marbles and Tunde has 29 marbles. How many marbles do they have together?</li>
<li>A market has 120 bags of rice from one supplier and 85 from another. How many bags total?</li>
<li>Funke reads 14 pages on Monday, 22 on Tuesday, and 18 on Wednesday. How many pages has she read?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>33 + 29 = <strong>62 marbles</strong>.</li>
<li>120 + 85 = <strong>205 bags</strong>.</li>
<li>14 + 22 + 18 = <strong>54 pages</strong>. (14 + 22 = 36, then 36 + 18 = 54.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Whenever you need to find "how many altogether" or "how many in total," that's a clue to add. Combine all the groups to get your answer!</p>`,
          duration: 12,
          order: 16,
        },
        {
          id: 'fn-2-17',
          title: 'Addition Practice: Market Shopping',
          description: 'Practise addition with a market shopping challenge.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will put all your addition skills together to solve a market shopping challenge with multiple items and prices.</p>

<h3>🏪 Market Story</h3>
<p>Tunde has ₦500 and goes to the market. Here are the prices he sees:</p>
<ul>
<li>Rice (small bag): ₦180</li>
<li>Beans: ₦120</li>
<li>Garri: ₦90</li>
<li>Palm oil: ₦150</li>
<li>Tomatoes: ₦60</li>
</ul>
<p>He needs to buy rice, tomatoes, and palm oil. Can he afford all three?</p>

<h3>📝 Let's Learn</h3>
<p>Let's help Tunde. He needs to add: ₦180 + ₦60 + ₦150.</p>
<p>Step 1: ₦180 + ₦60 = ₦240.</p>
<p>Step 2: ₦240 + ₦150 = ₦390.</p>
<p>Total: <strong>₦390</strong>. Tunde has ₦500, so yes, he can afford it! He will even have ₦110 left over.</p>
<p><strong>Example 1:</strong> Amina buys beans (₦120) and garri (₦90). Total: ₦120 + ₦90 = <strong>₦210</strong>.</p>
<p><strong>Example 2:</strong> What if Tunde buys everything on the list? ₦180 + ₦120 + ₦90 + ₦150 + ₦60. Add step by step: 180 + 120 = 300. 300 + 90 = 390. 390 + 150 = 540. 540 + 60 = <strong>₦600</strong>. He can't afford all 5 items with ₦500!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola has ₦300. She wants to buy garri (₦90) and beans (₦120). How much does she need? Can she afford it?</li>
<li>Chidi buys rice (₦180) and palm oil (₦150). What is his total?</li>
<li>Funke has ₦400. She buys tomatoes (₦60), garri (₦90), and beans (₦120). How much does she spend? How much is left?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦90 + ₦120 = <strong>₦210</strong>. Yes, Bola can afford it because ₦300 > ₦210. She has ₦90 left.</li>
<li>₦180 + ₦150 = <strong>₦330</strong>.</li>
<li>₦60 + ₦90 + ₦120 = <strong>₦270</strong>. She has ₦400 - ₦270 = <strong>₦130 left</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When shopping, add up all the prices before you pay. This way you know if you have enough money and how much change you should get back!</p>`,
          duration: 14,
          order: 17,
        },
        {
          id: 'fn-2-18',
          title: 'Addition Review and Challenge',
          description: 'Review all addition skills and try some challenge problems.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review everything you have learned about addition and test yourself with challenge problems.</p>

<h3>🏪 Market Story</h3>
<p>It's the end of the week, and Emeka's teacher, Mrs. Okafor, gives the class an addition challenge. "Let's see who has been paying attention!" she says. Emeka is ready. He knows how to add small numbers, big numbers, and use strategies like Make 10 and Doubles.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Review of all the strategies you have learned:</strong></p>
<ul>
<li><strong>Counting on:</strong> Start from the bigger number and count up.</li>
<li><strong>Make 10:</strong> Break a number to make 10 first, then add the rest.</li>
<li><strong>Doubles:</strong> If numbers are the same or close, use doubles.</li>
<li><strong>Partitioning:</strong> Split numbers into hundreds, tens, and ones.</li>
<li><strong>Carrying:</strong> When ones add to more than 9, carry to the tens.</li>
</ul>
<p><strong>Challenge 1:</strong> ₦78 + ₦45. Ones: 8 + 5 = 13, write 3 carry 1. Tens: 7 + 4 + 1 = 12, write 2 carry 1. Hundreds: 1. Answer: <strong>₦123</strong>.</p>
<p><strong>Challenge 2:</strong> ₦256 + ₦189. Ones: 6 + 9 = 15, write 5 carry 1. Tens: 5 + 8 + 1 = 14, write 4 carry 1. Hundreds: 2 + 1 + 1 = 4. Answer: <strong>₦445</strong>.</p>
<p><strong>Challenge 3:</strong> ₦99 + ₦99. Think of it as ₦100 + ₦100 - ₦2 = <strong>₦198</strong>. Or use carrying: 9+9=18, write 8 carry 1, 9+9+1=19, write 9 carry 1. Answer: <strong>₦198</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦67 + ₦88 = ?</li>
<li>₦345 + ₦127 = ?</li>
<li>Amina has ₦275. She earns ₦168 more. How much does she have now?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦67 + ₦88 = <strong>₦155</strong>. Ones: 7 + 8 = 15, write 5 carry 1. Tens: 6 + 8 + 1 = 15, write 5 carry 1. Hundreds: 1.</li>
<li>₦345 + ₦127 = <strong>₦472</strong>. Ones: 5 + 7 = 12, write 2 carry 1. Tens: 4 + 2 + 1 = 7. Hundreds: 3 + 1 = 4.</li>
<li>₦275 + ₦168 = <strong>₦443</strong>. Ones: 5 + 8 = 13, write 3 carry 1. Tens: 7 + 6 + 1 = 14, write 4 carry 1. Hundreds: 2 + 1 + 1 = 4.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You have learned many ways to add. Choose the strategy that works best for each problem. With practice, addition will become fast and automatic. Well done!</p>`,
          duration: 14,
          order: 18,
        },
      ],
    },
    {
      id: 'fn-unit-3',
      title: 'Subtraction',
      description: 'Learn to subtract numbers and make change, from simple take-away to subtracting hundreds.',
      order: 3,
      lessons: [
        {
          id: 'fn-3-1',
          title: 'Taking Away Objects',
          description: 'Understand subtraction by taking objects away from a group.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what subtraction means by taking objects away from a group and counting what remains.</p>

<h3>🏪 Market Story</h3>
<p>Amina has 8 groundnuts on her plate. She eats 3 of them. She counts what is left: 1, 2, 3, 4, 5. There are 5 groundnuts remaining. Taking away is called <strong>subtraction</strong>.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Subtraction</strong> means taking away from a group to find how many are left. We use the <strong>−</strong> sign (called "minus").</p>
<p>8 − 3 = 5. We say: "Eight minus three equals five."</p>
<p><strong>Example 1:</strong> Emeka has 7 biscuits. He gives 2 to his sister. 7 − 2 = <strong>5 biscuits left</strong>.</p>
<p><strong>Example 2:</strong> There are 10 birds on a tree. 4 fly away. 10 − 4 = <strong>6 birds left</strong>.</p>
<p><strong>Example 3:</strong> Bola has 9 crayons. She loses 3. 9 − 3 = <strong>6 crayons left</strong>.</p>
<p><strong>Tip:</strong> You can use objects to help. Start with the total, take some away, and count what remains.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Chidi has 6 oranges. He eats 2. How many are left?</li>
<li>There are 10 children playing. 3 go home. How many are still playing?</li>
<li>Funke has 8 pencils. She gives 5 to her friend. How many does she have now?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 − 2 = <strong>4 oranges</strong>.</li>
<li>10 − 3 = <strong>7 children</strong>.</li>
<li>8 − 5 = <strong>3 pencils</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Subtraction means taking away. Start with the total, remove some, and count what's left. The minus sign (−) tells you to subtract.</p>`,
          duration: 10,
          order: 1,
        },
        {
          id: 'fn-3-2',
          title: 'Subtracting Numbers to 5',
          description: 'Practise subtraction with small numbers up to 5.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise subtracting small numbers where you start with 5 or less.</p>

<h3>🏪 Market Story</h3>
<p>Tunde has 5 sweets in his pocket. He gives 2 to his little sister. How many sweets does he have left? 5 − 2 = 3. He has 3 sweets remaining.</p>

<h3>📝 Let's Learn</h3>
<p>Here are the subtraction facts for numbers up to 5:</p>
<ul>
<li>2 − 1 = 1</li>
<li>3 − 1 = 2, 3 − 2 = 1</li>
<li>4 − 1 = 3, 4 − 2 = 2, 4 − 3 = 1</li>
<li>5 − 1 = 4, 5 − 2 = 3, 5 − 3 = 2, 5 − 4 = 1</li>
</ul>
<p>Also remember: any number minus itself equals 0. For example, 5 − 5 = 0.</p>
<p><strong>Example 1:</strong> 4 − 1 = <strong>3</strong>.</p>
<p><strong>Example 2:</strong> 5 − 3 = <strong>2</strong>. Count back from 5: 4, 3, 2. You counted back 3 times.</p>
<p><strong>Example 3:</strong> 3 − 3 = <strong>0</strong>. If you take away everything, nothing is left!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 5 − 4?</li>
<li>Amina has 4 beads and loses 2. How many does she have?</li>
<li>What is 3 − 0? (Hint: taking away nothing means...)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>5 − 4 = <strong>1</strong>.</li>
<li>4 − 2 = <strong>2 beads</strong>.</li>
<li>3 − 0 = <strong>3</strong>. Taking away nothing leaves the number unchanged!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Subtraction with small numbers is the foundation. Any number minus itself is 0, and any number minus 0 is itself. Use your fingers to practise!</p>`,
          duration: 10,
          order: 2,
        },
        {
          id: 'fn-3-3',
          title: 'Subtracting Numbers to 10',
          description: 'Subtract with numbers up to 10.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn subtraction facts for numbers up to 10. These are essential for all bigger subtraction.</p>

<h3>🏪 Market Story</h3>
<p>Bola has 10 mangoes to sell at her mother's stall. By lunchtime, she has sold 6. How many are left? 10 − 6 = 4. She has 4 mangoes left to sell in the afternoon.</p>

<h3>📝 Let's Learn</h3>
<p>Key subtraction facts from 10:</p>
<ul>
<li>10 − 1 = 9, 10 − 2 = 8, 10 − 3 = 7, 10 − 4 = 6, 10 − 5 = 5</li>
<li>10 − 6 = 4, 10 − 7 = 3, 10 − 8 = 2, 10 − 9 = 1, 10 − 10 = 0</li>
</ul>
<p>Notice: subtraction and addition are related! If 6 + 4 = 10, then 10 − 6 = 4 and 10 − 4 = 6.</p>
<p><strong>Example 1:</strong> 9 − 4 = <strong>5</strong>. Count back from 9: 8, 7, 6, 5.</p>
<p><strong>Example 2:</strong> 8 − 3 = <strong>5</strong>. Think: 3 + ? = 8. Answer: 5.</p>
<p><strong>Example 3:</strong> 7 − 7 = <strong>0</strong>. Take away everything and nothing remains.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 10 − 7?</li>
<li>Chidi has 8 stickers and gives 5 to his friend. How many does he keep?</li>
<li>What is 9 − 6?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>10 − 7 = <strong>3</strong>.</li>
<li>8 − 5 = <strong>3 stickers</strong>.</li>
<li>9 − 6 = <strong>3</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Subtraction and addition are partners. If you know that 7 + 3 = 10, you also know that 10 − 7 = 3. Use addition facts to help with subtraction!</p>`,
          duration: 12,
          order: 3,
        },
        {
          id: 'fn-3-4',
          title: 'Making Change: Simple',
          description: 'Learn to make change with simple Naira amounts like ₦50 − ₦20.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to calculate change when buying things with round Naira amounts.</p>

<h3>🏪 Market Story</h3>
<p>Funke buys a sachet of pure water for ₦20. She pays with a ₦50 note. The trader needs to give her change. How much change? ₦50 − ₦20 = ₦30. The trader gives Funke ₦30 back.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Making change</strong> means finding how much money you get back. You subtract the price from what you paid.</p>
<p>Change = Amount paid − Price</p>
<p><strong>Example 1:</strong> You pay ₦50 for a ₦30 item. Change: ₦50 − ₦30 = <strong>₦20</strong>.</p>
<p><strong>Example 2:</strong> You pay ₦100 for a ₦40 item. Change: ₦100 − ₦40 = <strong>₦60</strong>.</p>
<p><strong>Example 3:</strong> You pay ₦50 for a ₦50 item. Change: ₦50 − ₦50 = <strong>₦0</strong>. Exact change — no money back!</p>
<p><strong>Tip for round numbers:</strong> Subtracting tens is easy — just subtract the tens digits. ₦80 − ₦30: 8 tens − 3 tens = 5 tens = <strong>₦50</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Emeka pays ₦50 for a snack that costs ₦10. How much change does he get?</li>
<li>Amina pays ₦100 for shoes that cost ₦70. How much change?</li>
<li>Tunde pays ₦200 for a book that costs ₦200. How much change does he get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦50 − ₦10 = <strong>₦40</strong> change.</li>
<li>₦100 − ₦70 = <strong>₦30</strong> change.</li>
<li>₦200 − ₦200 = <strong>₦0</strong>. No change — he paid the exact amount.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Change = What you paid − Price. Always check your change at the market! If the price is ₦30 and you pay ₦50, you should get ₦20 back.</p>`,
          duration: 10,
          order: 4,
        },
        {
          id: 'fn-3-5',
          title: 'Making Change: With Naira Notes',
          description: 'Calculate change when paying with common Naira notes.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to calculate change from common Naira notes like ₦100, ₦200, and ₦500.</p>

<h3>🏪 Market Story</h3>
<p>Chidi goes to buy garri. It costs ₦85. He has a ₦100 note. How much change should the trader give him? ₦100 − ₦85 = ₦15. The trader should give Chidi ₦15.</p>

<h3>📝 Let's Learn</h3>
<p>A useful trick: to subtract from 100, think "how much more do I need to reach 100?"</p>
<p>₦100 − ₦85: Start at 85, count up to 100. 85 + 5 = 90, 90 + 10 = 100. So 5 + 10 = <strong>₦15</strong> change.</p>
<p>This method is called <strong>counting up</strong> or <strong>shopkeeper's method</strong>. It's how many market traders calculate change!</p>
<p><strong>Example 1:</strong> Pay ₦100 for a ₦65 item. Count up from 65: 65 + 5 = 70, 70 + 30 = 100. Change: 5 + 30 = <strong>₦35</strong>.</p>
<p><strong>Example 2:</strong> Pay ₦200 for a ₦130 item. Count up from 130: 130 + 70 = 200. Change: <strong>₦70</strong>.</p>
<p><strong>Example 3:</strong> Pay ₦500 for a ₦320 item. Count up from 320: 320 + 80 = 400, 400 + 100 = 500. Change: 80 + 100 = <strong>₦180</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola pays ₦100 for an item costing ₦72. How much change?</li>
<li>Tunde pays ₦200 for an item costing ₦155. How much change?</li>
<li>Funke pays ₦500 for an item costing ₦275. How much change? (Use counting up!)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦100 − ₦72 = <strong>₦28</strong>. Count up: 72 + 8 = 80, 80 + 20 = 100. Change: 8 + 20 = 28.</li>
<li>₦200 − ₦155 = <strong>₦45</strong>. Count up: 155 + 5 = 160, 160 + 40 = 200. Change: 5 + 40 = 45.</li>
<li>₦500 − ₦275 = <strong>₦225</strong>. Count up: 275 + 25 = 300, 300 + 200 = 500. Change: 25 + 200 = 225.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting up from the price to the amount you paid is the easiest way to calculate change. Nigerian market traders use this method every day!</p>`,
          duration: 12,
          order: 5,
        },
        {
          id: 'fn-3-6',
          title: 'Subtracting Double-Digit Numbers',
          description: 'Subtract two-digit numbers without borrowing.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to subtract two-digit numbers when no borrowing is needed.</p>

<h3>🏪 Market Story</h3>
<p>Amina has ₦86 and spends ₦43 on tomatoes. How much does she have left? She subtracts the ones: 6 − 3 = 3. Then the tens: 8 − 4 = 4. She has ₦43 left.</p>

<h3>📝 Let's Learn</h3>
<p>To subtract two-digit numbers, subtract the ones first, then subtract the tens.</p>
<p><strong>Example 1:</strong> ₦75 − ₦32. Ones: 5 − 2 = 3. Tens: 7 − 3 = 4. Answer: <strong>₦43</strong>.</p>
<p><strong>Example 2:</strong> ₦98 − ₦51. Ones: 8 − 1 = 7. Tens: 9 − 5 = 4. Answer: <strong>₦47</strong>.</p>
<p><strong>Example 3:</strong> ₦67 − ₦24. Ones: 7 − 4 = 3. Tens: 6 − 2 = 4. Answer: <strong>₦43</strong>.</p>
<p>This is easy when the top digit is bigger than the bottom digit in each column. We'll learn what to do when it isn't in the next lesson!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦89 − ₦35 = ?</li>
<li>₦56 − ₦24 = ?</li>
<li>Emeka has ₦79 and spends ₦46 on a book. How much is left?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦89 − ₦35 = <strong>₦54</strong>. Ones: 9 − 5 = 4. Tens: 8 − 3 = 5.</li>
<li>₦56 − ₦24 = <strong>₦32</strong>. Ones: 6 − 4 = 2. Tens: 5 − 2 = 3.</li>
<li>₦79 − ₦46 = <strong>₦33</strong>. Ones: 9 − 6 = 3. Tens: 7 − 4 = 3.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To subtract two-digit numbers, work column by column: ones first, then tens. Make sure the top number is bigger than the bottom in each column!</p>`,
          duration: 12,
          order: 6,
        },
        {
          id: 'fn-3-7',
          title: 'Subtracting with Borrowing',
          description: 'Subtract when the ones digit on top is smaller, requiring borrowing.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to subtract when the ones digit on top is smaller than the ones digit on the bottom. This requires <strong>borrowing</strong> (also called regrouping).</p>

<h3>🏪 Market Story</h3>
<p>Bola has ₦52 and wants to buy plantain for ₦28. She tries to subtract: 2 − 8... but you can't take 8 from 2! She needs to borrow from the tens. Let's learn how.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Borrowing</strong> means taking 1 ten and turning it into 10 ones.</p>
<p><strong>Step-by-step for ₦52 − ₦28:</strong></p>
<ol>
<li>Ones: 2 − 8. Can't do it! Borrow 1 ten from the 5, making it 4. The 2 becomes 12.</li>
<li>Ones: 12 − 8 = 4.</li>
<li>Tens: 4 − 2 = 2.</li>
<li>Answer: <strong>₦24</strong>.</li>
</ol>
<p><strong>Example 1:</strong> ₦73 − ₦47. Ones: 3 − 7, borrow! 13 − 7 = 6. Tens: 6 − 4 = 2. Answer: <strong>₦26</strong>.</p>
<p><strong>Example 2:</strong> ₦81 − ₦35. Ones: 1 − 5, borrow! 11 − 5 = 6. Tens: 7 − 3 = 4. Answer: <strong>₦46</strong>.</p>
<p><strong>Example 3:</strong> ₦60 − ₦24. Ones: 0 − 4, borrow! 10 − 4 = 6. Tens: 5 − 2 = 3. Answer: <strong>₦36</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦64 − ₦29 = ?</li>
<li>₦83 − ₦57 = ?</li>
<li>Chidi has ₦71 and buys a cap for ₦38. How much change does he get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦64 − ₦29 = <strong>₦35</strong>. Ones: 4 − 9, borrow! 14 − 9 = 5. Tens: 5 − 2 = 3.</li>
<li>₦83 − ₦57 = <strong>₦26</strong>. Ones: 3 − 7, borrow! 13 − 7 = 6. Tens: 7 − 5 = 2.</li>
<li>₦71 − ₦38 = <strong>₦33</strong>. Ones: 1 − 8, borrow! 11 − 8 = 3. Tens: 6 − 3 = 3.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When you can't subtract the ones, borrow 1 ten (making the tens digit 1 less) and add 10 to the ones. Then subtract normally. Practice this — it's one of the most important math skills!</p>`,
          duration: 14,
          order: 7,
        },
        {
          id: 'fn-3-8',
          title: 'Subtracting from 100',
          description: 'Learn strategies for subtracting any number from 100.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn quick strategies for subtracting from 100, which is essential for making change from a ₦100 note.</p>

<h3>🏪 Market Story</h3>
<p>Funke pays ₦100 for items costing ₦37. She needs to quickly work out her change. Here's a trick: the ones digit and its partner add to 10, the tens digit and its partner add to 9. So for ₦37: ones: 10 − 7 = 3, tens: 9 − 3 = 6. Change: <strong>₦63</strong>!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Quick trick for 100 − any two-digit number:</strong></p>
<ol>
<li>Subtract the ones digit from 10.</li>
<li>Subtract the tens digit from 9.</li>
<li>Put them together.</li>
</ol>
<p><strong>Example 1:</strong> 100 − 45. Ones: 10 − 5 = 5. Tens: 9 − 4 = 5. Answer: <strong>55</strong>.</p>
<p><strong>Example 2:</strong> 100 − 82. Ones: 10 − 2 = 8. Tens: 9 − 8 = 1. Answer: <strong>18</strong>.</p>
<p><strong>Example 3:</strong> 100 − 19. Ones: 10 − 9 = 1. Tens: 9 − 1 = 8. Answer: <strong>81</strong>.</p>
<p><strong>Special case:</strong> If the ones digit is 0 (like 100 − 30), just think: 10 − 3 = 7, so the answer is <strong>70</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦100 − ₦56 = ?</li>
<li>₦100 − ₦73 = ?</li>
<li>Tunde pays ₦100 for food costing ₦68. How much change should he receive?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦100 − ₦56 = <strong>₦44</strong>. Ones: 10 − 6 = 4. Tens: 9 − 5 = 4.</li>
<li>₦100 − ₦73 = <strong>₦27</strong>. Ones: 10 − 3 = 7. Tens: 9 − 7 = 2.</li>
<li>₦100 − ₦68 = <strong>₦32</strong>. Ones: 10 − 8 = 2. Tens: 9 − 6 = 3.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To subtract from 100: ones from 10, tens from 9. This trick lets you calculate change from ₦100 instantly in your head!</p>`,
          duration: 12,
          order: 8,
        },
        {
          id: 'fn-3-9',
          title: 'Subtracting from Larger Numbers',
          description: 'Subtract from ₦500 and ₦1,000.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to subtract from ₦500 and ₦1,000 — amounts you encounter with larger Naira notes.</p>

<h3>🏪 Market Story</h3>
<p>Emeka's mother gives him a ₦500 note to buy provisions. He spends ₦320. How much should he bring back? ₦500 − ₦320 = ₦180. Let's learn how to do this.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Subtracting from 500:</strong> Think of it as 500 = 400 + 100. Or use counting up from the price to 500.</p>
<p><strong>Subtracting from 1,000:</strong> Subtract from each place: ones from 10, tens from 9, hundreds from 9.</p>
<p><strong>Example 1:</strong> ₦500 − ₦320. Count up from 320: 320 + 80 = 400, 400 + 100 = 500. Change: 80 + 100 = <strong>₦180</strong>.</p>
<p><strong>Example 2:</strong> ₦1,000 − ₦650. Ones: 10 − 0 = 0. Tens: 9 − 5 = 4. Hundreds: 9 − 6 = 3. Answer: <strong>₦350</strong>.</p>
<p><strong>Example 3:</strong> ₦1,000 − ₦475. Ones: 10 − 5 = 5. Tens: 9 − 7 = 2. Hundreds: 9 − 4 = 5. Answer: <strong>₦525</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦500 − ₦250 = ?</li>
<li>₦1,000 − ₦380 = ?</li>
<li>Amina pays ₦1,000 for a dress costing ₦735. How much change?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦500 − ₦250 = <strong>₦250</strong>. Exactly half!</li>
<li>₦1,000 − ₦380 = <strong>₦620</strong>. Ones: 10 − 0 = 0. Tens: 9 − 8 = 1... wait, let's use counting up: 380 + 20 = 400, 400 + 600 = 1000. Change: 20 + 600 = 620.</li>
<li>₦1,000 − ₦735 = <strong>₦265</strong>. Ones: 10 − 5 = 5. Tens: 9 − 3 = 6. Hundreds: 9 − 7 = 2.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>For ₦1,000, use the same trick as ₦100 but with three digits: ones from 10, tens from 9, hundreds from 9. Counting up also works well for any amount!</p>`,
          duration: 14,
          order: 9,
        },
        {
          id: 'fn-3-10',
          title: 'Connection: Addition and Subtraction are Related',
          description: 'Understand how addition and subtraction are inverse operations.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will discover that addition and subtraction are opposite operations — knowing one helps you solve the other!</p>

<h3>🏪 Market Story</h3>
<p>Bola buys 3 oranges and then buys 5 more. She has 8 oranges (3 + 5 = 8). Later, she gives 5 oranges away. She's back to 3 (8 − 5 = 3). Addition and subtraction undo each other!</p>

<h3>📝 Let's Learn</h3>
<p>Addition and subtraction are <strong>inverse operations</strong> — they are opposites that undo each other.</p>
<p>If you know: <strong>7 + 5 = 12</strong>, then you also know:</p>
<ul>
<li>12 − 5 = 7</li>
<li>12 − 7 = 5</li>
</ul>
<p>These three facts are called a <strong>fact family</strong>. Here's another: 8 + 4 = 12, so 12 − 4 = 8 and 12 − 8 = 4.</p>
<p><strong>Example 1:</strong> 6 + 9 = 15, so 15 − 9 = <strong>6</strong> and 15 − 6 = <strong>9</strong>.</p>
<p><strong>Example 2:</strong> If ₦50 + ₦30 = ₦80, then ₦80 − ₦30 = <strong>₦50</strong>.</p>
<p><strong>Example 3:</strong> You know 25 + 75 = 100. So 100 − 75 = <strong>25</strong> and 100 − 25 = <strong>75</strong>.</p>
<p><strong>How to use this:</strong> If you need to solve 13 − 8 = ?, think: 8 + ? = 13. The answer is 5, because 8 + 5 = 13.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>If 9 + 7 = 16, what is 16 − 7?</li>
<li>If ₦120 + ₦80 = ₦200, what is ₦200 − ₦120?</li>
<li>Solve 15 − 9 by thinking: 9 + ? = 15.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>16 − 7 = <strong>9</strong>.</li>
<li>₦200 − ₦120 = <strong>₦80</strong>.</li>
<li>9 + <strong>6</strong> = 15, so 15 − 9 = <strong>6</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Addition and subtraction are a team! If you know one fact, you know three. Use addition to check your subtraction and subtraction to check your addition.</p>`,
          duration: 12,
          order: 10,
        },
        {
          id: 'fn-3-11',
          title: 'Finding the Difference',
          description: 'Use subtraction to find the difference between two amounts.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to find the difference between two numbers — how much more one number is than another.</p>

<h3>🏪 Market Story</h3>
<p>Chidi has ₦85 and his friend Tunde has ₦60. Chidi asks, "How much more money do I have than Tunde?" The difference is ₦85 − ₦60 = ₦25. Chidi has ₦25 more than Tunde.</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>difference</strong> between two numbers tells you how far apart they are. You find it by subtracting the smaller number from the bigger number.</p>
<p>Key words that mean "find the difference": "how much more," "how much less," "how many more," "what is the difference."</p>
<p><strong>Example 1:</strong> Amina scored 78 and Bola scored 65 on a test. Difference: 78 − 65 = <strong>13 marks</strong>.</p>
<p><strong>Example 2:</strong> A shirt costs ₦150 and a cap costs ₦80. The shirt costs ₦150 − ₦80 = <strong>₦70 more</strong>.</p>
<p><strong>Example 3:</strong> Emeka is 12 years old and his sister is 8. The age difference is 12 − 8 = <strong>4 years</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Funke has ₦90 and Chidi has ₦55. How much more does Funke have?</li>
<li>One stall sells garri for ₦120 and another sells it for ₦95. What is the price difference?</li>
<li>Tunde scored 42 goals this year. Last year he scored 28. How many more goals did he score this year?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦90 − ₦55 = <strong>₦35 more</strong>.</li>
<li>₦120 − ₦95 = <strong>₦25</strong>.</li>
<li>42 − 28 = <strong>14 more goals</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>"How much more" and "what is the difference" both mean subtract the smaller from the bigger. This helps you compare prices, scores, ages, and amounts!</p>`,
          duration: 12,
          order: 11,
        },
        {
          id: 'fn-3-12',
          title: 'Multi-Step: Buy Two Things, Find Change',
          description: 'Solve problems that need both addition and subtraction.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to solve problems with two steps: first add up what you buy, then subtract from what you paid to find the change.</p>

<h3>🏪 Market Story</h3>
<p>Tunde has ₦100. He buys a meat pie for ₦35 and a drink for ₦40. How much change does he get?</p>
<p>Step 1: Add the prices: ₦35 + ₦40 = ₦75.</p>
<p>Step 2: Subtract from ₦100: ₦100 − ₦75 = ₦25.</p>
<p>Tunde gets <strong>₦25</strong> change!</p>

<h3>📝 Let's Learn</h3>
<p>Many real problems need more than one step. The key is: figure out what to do first, then what to do next.</p>
<p><strong>Example 1:</strong> Funke buys a pen (₦15) and a notebook (₦45) and pays ₦100. Change? First: ₦15 + ₦45 = ₦60. Then: ₦100 − ₦60 = <strong>₦40 change</strong>.</p>
<p><strong>Example 2:</strong> Amina buys bread (₦50) and butter (₦80) and pays ₦200. Change? First: ₦50 + ₦80 = ₦130. Then: ₦200 − ₦130 = <strong>₦70 change</strong>.</p>
<p><strong>Example 3:</strong> Emeka buys rice (₦180) and beans (₦120) and pays ₦500. Change? First: ₦180 + ₦120 = ₦300. Then: ₦500 − ₦300 = <strong>₦200 change</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola buys an exercise book (₦40) and crayons (₦35). She pays ₦100. How much change?</li>
<li>Chidi buys shoes (₦250) and socks (₦50). He pays ₦500. How much change?</li>
<li>Tunde buys garri (₦90), fish (₦75), and peppers (₦35). He pays ₦300. How much change?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦40 + ₦35 = ₦75. ₦100 − ₦75 = <strong>₦25 change</strong>.</li>
<li>₦250 + ₦50 = ₦300. ₦500 − ₦300 = <strong>₦200 change</strong>.</li>
<li>₦90 + ₦75 + ₦35 = ₦200. ₦300 − ₦200 = <strong>₦100 change</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>For shopping problems: Step 1 — add all the prices. Step 2 — subtract the total from what you paid. This gives you the change!</p>`,
          duration: 14,
          order: 12,
        },
        {
          id: 'fn-3-13',
          title: 'Mental Subtraction: Counting Back',
          description: 'Subtract quickly by counting backward in your head.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to subtract small numbers by counting backward from the starting number.</p>

<h3>🏪 Market Story</h3>
<p>Bola needs to quickly work out ₦43 − ₦5 in her head. She starts at 43 and counts back 5: 42, 41, 40, 39, 38. The answer is ₦38! Fast and easy.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Counting back</strong> means starting at the bigger number and counting backward by the smaller number.</p>
<p>This strategy works best when you are subtracting a small number (1 to 9).</p>
<p><strong>Example 1:</strong> 56 − 3. Count back from 56: 55, 54, <strong>53</strong>.</p>
<p><strong>Example 2:</strong> 72 − 4. Count back from 72: 71, 70, 69, <strong>68</strong>.</p>
<p><strong>Example 3:</strong> 80 − 6. Count back from 80: 79, 78, 77, 76, 75, <strong>74</strong>.</p>
<p><strong>Tip:</strong> Be careful when crossing a tens boundary! For example, counting back from 31: 30, 29, 28...</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>64 − 3 = ? (Count back from 64.)</li>
<li>51 − 4 = ? (You'll cross over 50!)</li>
<li>Amina has ₦85 and spends ₦7. Count back to find how much she has left.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>64, 63, 62, <strong>61</strong>.</li>
<li>51, 50, 49, 48, <strong>47</strong>.</li>
<li>85, 84, 83, 82, 81, 80, 79, <strong>₦78</strong>. Wait — let's recount: 85 − 7. Count back 7: 84, 83, 82, 81, 80, 79, 78. Answer: <strong>₦78</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Counting back is a fast mental subtraction strategy. Start at the bigger number and count backward by the smaller number. Be careful crossing tens boundaries!</p>`,
          duration: 10,
          order: 13,
        },
        {
          id: 'fn-3-14',
          title: 'Mental Subtraction: Using Doubles',
          description: 'Use doubles facts to subtract quickly.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use your knowledge of doubles to subtract quickly in your head.</p>

<h3>🏪 Market Story</h3>
<p>Emeka needs to solve 16 − 8 quickly. He thinks: "I know 8 + 8 = 16. So 16 − 8 must be 8!" Using doubles makes subtraction fast.</p>

<h3>📝 Let's Learn</h3>
<p>If you know your doubles for addition, you can use them for subtraction:</p>
<ul>
<li>6 + 6 = 12, so 12 − 6 = <strong>6</strong></li>
<li>7 + 7 = 14, so 14 − 7 = <strong>7</strong></li>
<li>8 + 8 = 16, so 16 − 8 = <strong>8</strong></li>
<li>9 + 9 = 18, so 18 − 9 = <strong>9</strong></li>
<li>15 + 15 = 30, so 30 − 15 = <strong>15</strong></li>
</ul>
<p>When a number is double something, subtracting half gives you back the other half!</p>
<p><strong>Example 1:</strong> 14 − 7 = <strong>7</strong>. (Because 7 + 7 = 14.)</p>
<p><strong>Example 2:</strong> 20 − 10 = <strong>10</strong>. (Because 10 + 10 = 20.)</p>
<p><strong>Example 3:</strong> 13 − 7 = ? Think: 14 − 7 = 7, so 13 − 7 = <strong>6</strong> (one less).</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 16 − 8?</li>
<li>What is 18 − 9?</li>
<li>₦50 − ₦25 = ? (Hint: 25 is half of 50!)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>16 − 8 = <strong>8</strong>. (Double 8 is 16.)</li>
<li>18 − 9 = <strong>9</strong>. (Double 9 is 18.)</li>
<li>₦50 − ₦25 = <strong>₦25</strong>. (25 + 25 = 50.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>If a number is a double, subtracting half gives you the other half. Doubles are powerful for both addition and subtraction!</p>`,
          duration: 10,
          order: 14,
        },
        {
          id: 'fn-3-15',
          title: 'Subtraction Word Problems: Making Change',
          description: 'Solve real-world word problems about making change.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise solving word problems about buying things and receiving change at the market.</p>

<h3>🏪 Market Story</h3>
<p>Funke goes to Tejuosho Market with her mother. They buy fabric for ₦350 and pay with a ₦500 note. The fabric seller counts out the change: "₦350 plus ₦50 is ₦400, plus ₦100 is ₦500. Your change is ₦150." Funke checks: ₦500 − ₦350 = ₦150. Correct!</p>

<h3>📝 Let's Learn</h3>
<p>Change problems always follow the same pattern: <strong>Change = Money given − Total cost</strong>.</p>
<p><strong>Example 1:</strong> Chidi buys a shirt for ₦280 and pays ₦300. Change: ₦300 − ₦280 = <strong>₦20</strong>.</p>
<p><strong>Example 2:</strong> Tunde buys food for ₦175 and pays ₦200. Change: ₦200 − ₦175 = <strong>₦25</strong>. Count up: 175 + 25 = 200. Correct!</p>
<p><strong>Example 3:</strong> Amina buys school supplies for ₦425 and pays ₦500. Change: ₦500 − ₦425 = <strong>₦75</strong>. Count up: 425 + 75 = 500. Correct!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola buys sandals for ₦180 and pays with ₦200. How much change does she receive?</li>
<li>Emeka buys a football for ₦350 and pays with ₦500. What is his change?</li>
<li>Funke buys groceries for ₦680 and pays with ₦1,000. How much change should she get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦200 − ₦180 = <strong>₦20</strong>.</li>
<li>₦500 − ₦350 = <strong>₦150</strong>.</li>
<li>₦1,000 − ₦680 = <strong>₦320</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Always check your change at the market! Subtract the price from what you paid, or count up from the price to what you paid. Both methods should give the same answer.</p>`,
          duration: 12,
          order: 15,
        },
        {
          id: 'fn-3-16',
          title: 'Subtraction Word Problems: How Much Left?',
          description: 'Solve word problems about what remains after spending or using.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems about finding how much is left after something is used, eaten, spent, or given away.</p>

<h3>🏪 Market Story</h3>
<p>Amina starts the week with ₦500. She spends ₦120 on Monday and ₦85 on Wednesday. How much does she have left? First, find total spent: ₦120 + ₦85 = ₦205. Then subtract: ₦500 − ₦205 = ₦295. Amina has <strong>₦295</strong> left.</p>

<h3>📝 Let's Learn</h3>
<p>Key words that tell you to subtract: "how much is left," "how many remain," "what's left over," "how much less."</p>
<p><strong>Example 1:</strong> A baker makes 80 loaves of bread. He sells 53. How many are left? 80 − 53 = <strong>27 loaves</strong>.</p>
<p><strong>Example 2:</strong> Emeka has 45 marbles. He gives 18 to Chidi and 12 to Tunde. How many are left? Total given: 18 + 12 = 30. Left: 45 − 30 = <strong>15 marbles</strong>.</p>
<p><strong>Example 3:</strong> A water tank holds 200 litres. A family uses 75 litres. How much water is left? 200 − 75 = <strong>125 litres</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola has 36 sweets. She gives 14 to her friends. How many does she have left?</li>
<li>A market trader has 150 bags of garri. She sells 87. How many bags remain?</li>
<li>Tunde starts with ₦400. He spends ₦95 on transport and ₦160 on food. How much is left?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>36 − 14 = <strong>22 sweets</strong>.</li>
<li>150 − 87 = <strong>63 bags</strong>.</li>
<li>Total spent: ₦95 + ₦160 = ₦255. Left: ₦400 − ₦255 = <strong>₦145</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When the question asks "how much is left" or "how many remain," that's subtraction. Start with the total and subtract what was used or taken away.</p>`,
          duration: 12,
          order: 16,
        },
        {
          id: 'fn-3-17',
          title: 'Subtraction Practice: Market Trader',
          description: 'Practise subtraction as a market trader making change.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will pretend to be a market trader and practise making change for customers. This is real-world subtraction!</p>

<h3>🏪 Market Story</h3>
<p>Today you are the trader! You sell food at Mushin Market. Here are your prices:</p>
<ul>
<li>Rice (small bag): ₦200</li>
<li>Beans: ₦150</li>
<li>Garri: ₦100</li>
<li>Tomatoes: ₦80</li>
<li>Palm oil: ₦120</li>
</ul>
<p>Customers are coming. Can you give the right change?</p>

<h3>📝 Let's Learn</h3>
<p><strong>Customer 1:</strong> Buys garri (₦100) and pays with ₦200. Change: ₦200 − ₦100 = <strong>₦100</strong>.</p>
<p><strong>Customer 2:</strong> Buys tomatoes (₦80) and palm oil (₦120), pays ₦500. Total: ₦80 + ₦120 = ₦200. Change: ₦500 − ₦200 = <strong>₦300</strong>.</p>
<p><strong>Customer 3:</strong> Buys rice (₦200) and beans (₦150), pays ₦500. Total: ₦200 + ₦150 = ₦350. Change: ₦500 − ₦350 = <strong>₦150</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>A customer buys beans (₦150) and pays with ₦200. What change do you give?</li>
<li>A customer buys rice (₦200) and tomatoes (₦80) and pays ₦500. What is their change?</li>
<li>A customer buys garri (₦100), beans (₦150), and palm oil (₦120) and pays ₦500. What change do they get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦200 − ₦150 = <strong>₦50 change</strong>.</li>
<li>₦200 + ₦80 = ₦280. ₦500 − ₦280 = <strong>₦220 change</strong>.</li>
<li>₦100 + ₦150 + ₦120 = ₦370. ₦500 − ₦370 = <strong>₦130 change</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Market traders use addition and subtraction all day long. First add up the total cost, then subtract from what the customer pays. Check your work by adding the change back to the total — it should equal what the customer paid!</p>`,
          duration: 14,
          order: 17,
        },
        {
          id: 'fn-3-18',
          title: 'Subtraction Review and Challenge',
          description: 'Review all subtraction skills and tackle challenge problems.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review all your subtraction skills and challenge yourself with harder problems.</p>

<h3>🏪 Market Story</h3>
<p>It's test day! Mrs. Okafor says, "Let's see if you can handle any subtraction problem I throw at you." Chidi, Amina, Bola, and the whole class are ready. Are you?</p>

<h3>📝 Let's Learn</h3>
<p><strong>Review of subtraction strategies:</strong></p>
<ul>
<li><strong>Counting back:</strong> Great for subtracting small numbers.</li>
<li><strong>Counting up:</strong> Great for making change (start at the price, count up to what you paid).</li>
<li><strong>Borrowing:</strong> When the top digit is smaller than the bottom digit.</li>
<li><strong>Using doubles:</strong> If the number is a double, halving is easy.</li>
<li><strong>Subtracting from 100/1000:</strong> Ones from 10, tens from 9.</li>
</ul>
<p><strong>Challenge 1:</strong> ₦503 − ₦278. Ones: 3 − 8, borrow! 13 − 8 = 5. Tens: 9 − 7 = 2 (we had 10, borrowed 1, left 9... wait, 0 − 7, borrow from hundreds! 10 − 7 − 1 = 2). Hundreds: 4 − 2 = 2. Answer: <strong>₦225</strong>.</p>
<p><strong>Challenge 2:</strong> ₦1,000 − ₦463. Ones: 10 − 3 = 7. Tens: 9 − 6 = 3. Hundreds: 9 − 4 = 5. Answer: <strong>₦537</strong>.</p>
<p><strong>Challenge 3:</strong> Tunde has ₦750. He buys food for ₦285 and transport for ₦165. How much is left? Total spent: ₦285 + ₦165 = ₦450. Left: ₦750 − ₦450 = <strong>₦300</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦92 − ₦48 = ?</li>
<li>₦500 − ₦237 = ?</li>
<li>Amina has ₦1,000. She buys a dress for ₦350 and shoes for ₦275. How much is left?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦92 − ₦48 = <strong>₦44</strong>. Ones: 2 − 8, borrow! 12 − 8 = 4. Tens: 8 − 4 = 4.</li>
<li>₦500 − ₦237 = <strong>₦263</strong>. Ones: 10 − 7 = 3. Tens: 9 − 3 = 6. Hundreds: 4 − 2 = 2.</li>
<li>Total: ₦350 + ₦275 = ₦625. Left: ₦1,000 − ₦625 = <strong>₦375</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You now have many subtraction strategies. Choose the best one for each problem. Always check your answer using addition — if the answer + what you subtracted = the original number, you got it right!</p>`,
          duration: 14,
          order: 18,
        },
      ],
    },
    {
      id: 'fn-unit-4',
      title: 'Multiplication',
      description: 'Learn to multiply numbers using groups, repeated addition, and times tables with real market scenarios.',
      order: 4,
      lessons: [
        {
          id: 'fn-4-1',
          title: 'Groups of Objects',
          description: 'Understand multiplication as counting equal groups.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn that multiplication means having equal groups and finding the total in all groups combined.</p>

<h3>🏪 Market Story</h3>
<p>Amina sees a groundnut seller at the market. The groundnuts are arranged in small bags. Each bag has exactly 5 groundnuts. Amina counts 3 bags. How many groundnuts are there in total? She could count one by one, but there's a faster way — multiplication!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Multiplication</strong> is a quick way to add equal groups. Instead of 5 + 5 + 5, we say "3 groups of 5" or "3 times 5."</p>
<p>3 bags × 5 groundnuts in each = 15 groundnuts total.</p>
<p><strong>Example 1:</strong> 4 plates with 2 oranges on each plate. 4 groups of 2 = 4 × 2 = <strong>8 oranges</strong>.</p>
<p><strong>Example 2:</strong> 2 rows of chairs with 6 chairs in each row. 2 groups of 6 = 2 × 6 = <strong>12 chairs</strong>.</p>
<p><strong>Example 3:</strong> 5 children each have 3 pencils. 5 groups of 3 = 5 × 3 = <strong>15 pencils</strong>.</p>
<p><strong>Tip:</strong> When you see equal groups, think multiplication!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola sees 3 baskets with 4 mangoes each. How many mangoes are there in total?</li>
<li>There are 5 tables with 2 books on each. How many books altogether?</li>
<li>Emeka has 4 pockets, and each pocket has 3 sweets. How many sweets in total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>3 × 4 = <strong>12 mangoes</strong>.</li>
<li>5 × 2 = <strong>10 books</strong>.</li>
<li>4 × 3 = <strong>12 sweets</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Multiplication counts equal groups. "Groups of" means multiply. If you have 4 bags with 5 items each, that's 4 × 5 = 20 items total!</p>`,
          duration: 12,
          order: 1,
        },
        {
          id: 'fn-4-2',
          title: 'Repeated Addition',
          description: 'See multiplication as adding the same number over and over.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will see that multiplication is the same as <strong>repeated addition</strong> — adding the same number again and again.</p>

<h3>🏪 Market Story</h3>
<p>Chidi buys 4 sachets of pure water. Each sachet costs ₦20. He could add: ₦20 + ₦20 + ₦20 + ₦20 = ₦80. Or he could multiply: 4 × ₦20 = ₦80. Both give the same answer, but multiplication is faster!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Repeated addition</strong> means adding the same number multiple times. Multiplication is a shortcut for this.</p>
<ul>
<li>₦20 + ₦20 + ₦20 = 3 × ₦20 = <strong>₦60</strong></li>
<li>₦10 + ₦10 + ₦10 + ₦10 + ₦10 = 5 × ₦10 = <strong>₦50</strong></li>
<li>₦5 + ₦5 + ₦5 + ₦5 = 4 × ₦5 = <strong>₦20</strong></li>
</ul>
<p><strong>Example 1:</strong> 3 + 3 + 3 + 3 + 3 = 5 × 3 = <strong>15</strong>.</p>
<p><strong>Example 2:</strong> ₦50 + ₦50 + ₦50 = 3 × ₦50 = <strong>₦150</strong>.</p>
<p><strong>Example 3:</strong> 7 + 7 = 2 × 7 = <strong>14</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Write as multiplication: ₦10 + ₦10 + ₦10 + ₦10 + ₦10 + ₦10 = ?</li>
<li>Write as repeated addition: 4 × 8 = ?</li>
<li>Tunde buys 5 meat pies at ₦30 each. Write this as repeated addition AND as multiplication. What is the total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 × ₦10 = <strong>₦60</strong>.</li>
<li>8 + 8 + 8 + 8 = <strong>32</strong>.</li>
<li>₦30 + ₦30 + ₦30 + ₦30 + ₦30 = 5 × ₦30 = <strong>₦150</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Multiplication is a shortcut for repeated addition. Instead of adding ₦20 four times, just say 4 × ₦20 = ₦80. It saves time!</p>`,
          duration: 10,
          order: 2,
        },
        {
          id: 'fn-4-3',
          title: 'The Times Sign: What Multiplication Means',
          description: 'Learn the × symbol and the language of multiplication.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to read and use the multiplication sign (×) and understand multiplication vocabulary.</p>

<h3>🏪 Market Story</h3>
<p>Funke's teacher writes on the board: 3 × 4 = 12. She explains: "The × sign means 'times' or 'multiplied by.' So 3 × 4 means 3 times 4, which is 12." Funke now knows that when she sees ×, she needs to multiply!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>×</strong> sign is called the <strong>multiplication sign</strong> or <strong>times sign</strong>.</p>
<p>Ways to read 3 × 4 = 12:</p>
<ul>
<li>"3 times 4 equals 12"</li>
<li>"3 multiplied by 4 equals 12"</li>
<li>"3 groups of 4 equals 12"</li>
</ul>
<p>The numbers we multiply are called <strong>factors</strong>. The answer is called the <strong>product</strong>.</p>
<p>In 3 × 4 = 12: 3 and 4 are factors, 12 is the product.</p>
<p><strong>Example 1:</strong> 5 × 2 = <strong>10</strong>. Read: "5 times 2 equals 10." Factors: 5 and 2. Product: 10.</p>
<p><strong>Example 2:</strong> 6 × 3 = <strong>18</strong>. Read: "6 multiplied by 3 equals 18."</p>
<p><strong>Example 3:</strong> 2 × 9 = <strong>18</strong>. Notice that 6 × 3 and 2 × 9 have the same product! Different factors can give the same product.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Read this aloud: 7 × 3 = 21. What are the factors? What is the product?</li>
<li>What is 4 × 5? Name the factors and the product.</li>
<li>True or false: 3 × 4 gives the same answer as 4 × 3?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"7 times 3 equals 21." Factors: <strong>7 and 3</strong>. Product: <strong>21</strong>.</li>
<li>4 × 5 = <strong>20</strong>. Factors: 4 and 5. Product: 20.</li>
<li><strong>True!</strong> 3 × 4 = 12 and 4 × 3 = 12. Order doesn't matter in multiplication (this is called the commutative property).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The × sign means multiply. The numbers you multiply are factors, and the answer is the product. Just like with addition, the order doesn't matter: 3 × 4 = 4 × 3!</p>`,
          duration: 10,
          order: 3,
        },
        {
          id: 'fn-4-4',
          title: 'Times Table: 2s',
          description: 'Learn the 2 times table.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will memorise the 2 times table. Multiplying by 2 is the same as doubling a number!</p>

<h3>🏪 Market Story</h3>
<p>Emeka and his twin brother each get the same pocket money. Whatever one gets, the total is always double. If each gets ₦5, the total is ₦10. If each gets ₦8, the total is ₦16. That's the 2 times table!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>2 times table</strong>:</p>
<ul>
<li>1 × 2 = 2</li>
<li>2 × 2 = 4</li>
<li>3 × 2 = 6</li>
<li>4 × 2 = 8</li>
<li>5 × 2 = 10</li>
<li>6 × 2 = 12</li>
<li>7 × 2 = 14</li>
<li>8 × 2 = 16</li>
<li>9 × 2 = 18</li>
<li>10 × 2 = 20</li>
</ul>
<p>Notice: all the answers are <strong>even numbers</strong> — they end in 0, 2, 4, 6, or 8. Multiplying by 2 is the same as skip counting by 2s!</p>
<p><strong>Example 1:</strong> 7 × 2 = 7 + 7 = <strong>14</strong>.</p>
<p><strong>Example 2:</strong> 2 pairs of shoes means 2 × 2 = <strong>4 shoes</strong>.</p>
<p><strong>Example 3:</strong> Amina buys 8 oranges at ₦2 each: 8 × 2 = <strong>₦16</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 6 × 2?</li>
<li>What is 9 × 2?</li>
<li>Bola buys 5 exercise books at ₦2 each. How much does she pay?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 × 2 = <strong>12</strong>.</li>
<li>9 × 2 = <strong>18</strong>.</li>
<li>5 × ₦2 = <strong>₦10</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The 2 times table gives even numbers. Multiplying by 2 means doubling. If you can double, you know your 2 times table!</p>`,
          duration: 10,
          order: 4,
        },
        {
          id: 'fn-4-5',
          title: 'Times Table: 5s',
          description: 'Learn the 5 times table.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will memorise the 5 times table. The answers always end in 0 or 5!</p>

<h3>🏪 Market Story</h3>
<p>Tunde counts ₦5 coins at his father's keke stand. Each coin is worth ₦5. With 1 coin: ₦5. With 2 coins: ₦10. With 3 coins: ₦15. He's counting by 5s — that's the 5 times table!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>5 times table</strong>:</p>
<ul>
<li>1 × 5 = 5</li>
<li>2 × 5 = 10</li>
<li>3 × 5 = 15</li>
<li>4 × 5 = 20</li>
<li>5 × 5 = 25</li>
<li>6 × 5 = 30</li>
<li>7 × 5 = 35</li>
<li>8 × 5 = 40</li>
<li>9 × 5 = 45</li>
<li>10 × 5 = 50</li>
</ul>
<p>Notice: every answer ends in <strong>5 or 0</strong>. Odd numbers × 5 end in 5. Even numbers × 5 end in 0.</p>
<p><strong>Example 1:</strong> 7 × 5 = <strong>35</strong>. (7 is odd, so it ends in 5.)</p>
<p><strong>Example 2:</strong> 8 × 5 = <strong>40</strong>. (8 is even, so it ends in 0.)</p>
<p><strong>Example 3:</strong> Funke has 6 coins of ₦5. Total: 6 × ₦5 = <strong>₦30</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 4 × 5?</li>
<li>What is 9 × 5?</li>
<li>Chidi buys 7 sweets at ₦5 each. How much does he spend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>4 × 5 = <strong>20</strong>.</li>
<li>9 × 5 = <strong>45</strong>.</li>
<li>7 × ₦5 = <strong>₦35</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The 5 times table always ends in 0 or 5. You already know it from skip counting by 5s and counting ₦5 coins!</p>`,
          duration: 10,
          order: 5,
        },
        {
          id: 'fn-4-6',
          title: 'Times Table: 10s',
          description: 'Learn the 10 times table.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will memorise the 10 times table — the easiest times table of all!</p>

<h3>🏪 Market Story</h3>
<p>Bola counts ₦10 notes at her mother's shop. 1 note = ₦10. 2 notes = ₦20. 3 notes = ₦30. She notices: just add a zero! 7 notes of ₦10 = ₦70. That's the 10 times table.</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>10 times table</strong>:</p>
<ul>
<li>1 × 10 = 10</li>
<li>2 × 10 = 20</li>
<li>3 × 10 = 30</li>
<li>4 × 10 = 40</li>
<li>5 × 10 = 50</li>
<li>6 × 10 = 60</li>
<li>7 × 10 = 70</li>
<li>8 × 10 = 80</li>
<li>9 × 10 = 90</li>
<li>10 × 10 = 100</li>
</ul>
<p>The rule: <strong>just add a 0</strong> to the number! 7 × 10 = 70 (just add 0 to 7).</p>
<p><strong>Example 1:</strong> 4 × 10 = <strong>40</strong>.</p>
<p><strong>Example 2:</strong> 12 × 10 = <strong>120</strong> (works for bigger numbers too!).</p>
<p><strong>Example 3:</strong> Emeka has 8 notes of ₦10: 8 × ₦10 = <strong>₦80</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 6 × 10?</li>
<li>What is 15 × 10?</li>
<li>Amina has 9 ₦10 coins. How much money does she have?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 × 10 = <strong>60</strong>.</li>
<li>15 × 10 = <strong>150</strong>.</li>
<li>9 × ₦10 = <strong>₦90</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The 10 times table is the easiest: just add a zero! 3 × 10 = 30, 25 × 10 = 250. This is very useful for counting ₦10 notes.</p>`,
          duration: 10,
          order: 6,
        },
        {
          id: 'fn-4-7',
          title: 'Times Table: 3s',
          description: 'Learn the 3 times table.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will memorise the 3 times table, which is useful for many everyday counting situations.</p>

<h3>🏪 Market Story</h3>
<p>Chidi helps arrange eggs at the market. Each row in the egg crate holds 3 eggs. He counts the rows: with 4 rows he has 12 eggs, with 5 rows he has 15 eggs. He is learning the 3 times table!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>3 times table</strong>:</p>
<ul>
<li>1 × 3 = 3</li>
<li>2 × 3 = 6</li>
<li>3 × 3 = 9</li>
<li>4 × 3 = 12</li>
<li>5 × 3 = 15</li>
<li>6 × 3 = 18</li>
<li>7 × 3 = 21</li>
<li>8 × 3 = 24</li>
<li>9 × 3 = 27</li>
<li>10 × 3 = 30</li>
</ul>
<p><strong>Trick:</strong> Add the digits of any answer in the 3 times table. The sum is always 3, 6, or 9! Example: 24 → 2 + 4 = 6. 27 → 2 + 7 = 9.</p>
<p><strong>Example 1:</strong> 6 × 3 = <strong>18</strong>. Check: 1 + 8 = 9. ✓</p>
<p><strong>Example 2:</strong> 8 × 3 = <strong>24</strong>. Check: 2 + 4 = 6. ✓</p>
<p><strong>Example 3:</strong> Funke buys 7 bananas at ₦3 each: 7 × ₦3 = <strong>₦21</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 5 × 3?</li>
<li>What is 9 × 3?</li>
<li>Tunde buys 4 packets of biscuits at ₦3 each. How much does he pay?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>5 × 3 = <strong>15</strong>.</li>
<li>9 × 3 = <strong>27</strong>.</li>
<li>4 × ₦3 = <strong>₦12</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The 3 times table goes up by 3 each time. A fun check: the digits of the answer always add up to 3, 6, or 9!</p>`,
          duration: 12,
          order: 7,
        },
        {
          id: 'fn-4-8',
          title: 'Times Table: 4s',
          description: 'Learn the 4 times table.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will memorise the 4 times table. Here's a secret: 4 times a number is just double-double!</p>

<h3>🏪 Market Story</h3>
<p>Amina notices that her mother's car has 4 tyres. She counts how many tyres for multiple cars: 1 car = 4 tyres, 2 cars = 8 tyres, 3 cars = 12 tyres. She's discovering the 4 times table just by counting tyres!</p>

<h3>📝 Let's Learn</h3>
<p>The <strong>4 times table</strong>:</p>
<ul>
<li>1 × 4 = 4</li>
<li>2 × 4 = 8</li>
<li>3 × 4 = 12</li>
<li>4 × 4 = 16</li>
<li>5 × 4 = 20</li>
<li>6 × 4 = 24</li>
<li>7 × 4 = 28</li>
<li>8 × 4 = 32</li>
<li>9 × 4 = 36</li>
<li>10 × 4 = 40</li>
</ul>
<p><strong>Double-double trick:</strong> 4 × a number = double it, then double again.</p>
<p>Example: 4 × 7. Double 7 = 14. Double 14 = <strong>28</strong>. ✓</p>
<p><strong>Example 1:</strong> 4 × 6. Double 6 = 12. Double 12 = <strong>24</strong>.</p>
<p><strong>Example 2:</strong> 4 × 8. Double 8 = 16. Double 16 = <strong>32</strong>.</p>
<p><strong>Example 3:</strong> Bola buys 4 pens at ₦5 each: 4 × ₦5 = <strong>₦20</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 4 × 9? (Use the double-double trick!)</li>
<li>What is 4 × 3?</li>
<li>Emeka sees 6 cars. Each car has 4 tyres. How many tyres in total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>4 × 9: Double 9 = 18, double 18 = <strong>36</strong>.</li>
<li>4 × 3 = <strong>12</strong>.</li>
<li>6 × 4 = <strong>24 tyres</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The 4 times table = double-double! To find 4 × any number, double it twice. This trick makes the 4s easy to remember.</p>`,
          duration: 12,
          order: 8,
        },
        {
          id: 'fn-4-9',
          title: 'Multiplying by 1 and 0',
          description: 'Understand the special rules for multiplying by 1 and by 0.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn two special multiplication rules: any number times 1 stays the same, and any number times 0 equals 0.</p>

<h3>🏪 Market Story</h3>
<p>Funke asks her teacher: "What is 5 × 0?" Her teacher says, "If you have 0 bags of groundnuts, how many groundnuts do you have?" Funke thinks... "Zero! No bags means no groundnuts!" Then the teacher asks, "What about 5 × 1?" Funke says, "That's 1 bag of 5. That's just 5!"</p>

<h3>📝 Let's Learn</h3>
<p><strong>Identity property (× 1):</strong> Any number times 1 equals itself.</p>
<ul>
<li>7 × 1 = 7</li>
<li>100 × 1 = 100</li>
<li>1 × 53 = 53</li>
</ul>
<p><strong>Zero property (× 0):</strong> Any number times 0 equals 0.</p>
<ul>
<li>7 × 0 = 0</li>
<li>100 × 0 = 0</li>
<li>0 × 53 = 0</li>
</ul>
<p><strong>Example 1:</strong> 8 × 1 = <strong>8</strong>. One group of 8 is just 8.</p>
<p><strong>Example 2:</strong> 8 × 0 = <strong>0</strong>. Zero groups of 8 is nothing at all.</p>
<p><strong>Example 3:</strong> Tunde buys 1 bag of rice at ₦200. Total: 1 × ₦200 = <strong>₦200</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 25 × 1?</li>
<li>What is 50 × 0?</li>
<li>Chidi has 0 bags. Each bag has 10 oranges. How many oranges does he have?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>25 × 1 = <strong>25</strong>.</li>
<li>50 × 0 = <strong>0</strong>.</li>
<li>0 × 10 = <strong>0 oranges</strong>. No bags means no oranges!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Times 1 = the same number. Times 0 = zero. These two rules work for every number, no matter how big!</p>`,
          duration: 10,
          order: 9,
        },
        {
          id: 'fn-4-10',
          title: 'Buying Multiple Items',
          description: 'Use multiplication to calculate the cost of buying several items.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will use multiplication to quickly calculate the cost of buying several of the same item at the market.</p>

<h3>🏪 Market Story</h3>
<p>Bola's mother needs to buy 4 exercise books for her children. Each exercise book costs ₦50. Instead of adding ₦50 + ₦50 + ₦50 + ₦50, she multiplies: 4 × ₦50 = ₦200. Quick and easy!</p>

<h3>📝 Let's Learn</h3>
<p>When you buy multiple items at the same price: <strong>Total cost = Number of items × Price per item</strong></p>
<p><strong>Example 1:</strong> 3 bags of pure water at ₦20 each. Total: 3 × ₦20 = <strong>₦60</strong>.</p>
<p><strong>Example 2:</strong> 5 pencils at ₦10 each. Total: 5 × ₦10 = <strong>₦50</strong>.</p>
<p><strong>Example 3:</strong> 4 bottles of drink at ₦50 each. Total: 4 × ₦50 = <strong>₦200</strong>. (Think: 4 × 5 = 20, then add the zero: 200.)</p>
<p><strong>Tip for multiplying by tens:</strong> Multiply the non-zero digits first, then add the zero back. 4 × ₦50: 4 × 5 = 20, add the zero = ₦200.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Emeka buys 6 bananas at ₦10 each. What is the total cost?</li>
<li>Amina buys 3 notebooks at ₦40 each. How much does she spend?</li>
<li>Tunde buys 8 sweets at ₦5 each. What is the total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 × ₦10 = <strong>₦60</strong>.</li>
<li>3 × ₦40 = <strong>₦120</strong>. (3 × 4 = 12, add zero = 120.)</li>
<li>8 × ₦5 = <strong>₦40</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Total cost = quantity × price. This is the most common use of multiplication in everyday life. Market traders use this formula hundreds of times a day!</p>`,
          duration: 12,
          order: 10,
        },
        {
          id: 'fn-4-11',
          title: 'Single Digit × Double Digit',
          description: 'Multiply a single-digit number by a double-digit number.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to multiply a single-digit number by a two-digit number using partitioning.</p>

<h3>🏪 Market Story</h3>
<p>Chidi needs to buy 3 shirts at ₦25 each. He thinks: 3 × ₦25. He splits 25 into 20 + 5. Then: 3 × 20 = 60 and 3 × 5 = 15. Add them: 60 + 15 = ₦75. The 3 shirts cost <strong>₦75</strong>!</p>

<h3>📝 Let's Learn</h3>
<p>To multiply a single digit by a two-digit number, <strong>partition</strong> the two-digit number:</p>
<ol>
<li>Split the two-digit number into tens and ones.</li>
<li>Multiply each part separately.</li>
<li>Add the results.</li>
</ol>
<p><strong>Example 1:</strong> 4 × 13. Split 13 = 10 + 3. 4 × 10 = 40. 4 × 3 = 12. Total: 40 + 12 = <strong>52</strong>.</p>
<p><strong>Example 2:</strong> 5 × 24. Split 24 = 20 + 4. 5 × 20 = 100. 5 × 4 = 20. Total: 100 + 20 = <strong>120</strong>.</p>
<p><strong>Example 3:</strong> 3 × 32. Split 32 = 30 + 2. 3 × 30 = 90. 3 × 2 = 6. Total: 90 + 6 = <strong>96</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 2 × 34?</li>
<li>What is 4 × 15?</li>
<li>Funke buys 3 bags of rice at ₦45 each. What is the total? (Partition 45 into 40 + 5.)</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>2 × 34 = 2 × 30 + 2 × 4 = 60 + 8 = <strong>68</strong>.</li>
<li>4 × 15 = 4 × 10 + 4 × 5 = 40 + 20 = <strong>60</strong>.</li>
<li>3 × 45 = 3 × 40 + 3 × 5 = 120 + 15 = <strong>₦135</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To multiply by a two-digit number, split it into tens and ones, multiply each part, then add. This works every time!</p>`,
          duration: 14,
          order: 11,
        },
        {
          id: 'fn-4-12',
          title: 'Multiplying with Naira: Bus Fare for a Family',
          description: 'Use multiplication with real transport and family scenarios.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will use multiplication to calculate costs for families and groups, like bus fares and meal costs.</p>

<h3>🏪 Market Story</h3>
<p>Tunde's family of 5 is taking a bus from Ikeja to Lekki. The bus fare is ₦150 per person. How much will the family pay altogether? 5 × ₦150. Let's work it out: 5 × 100 = 500, 5 × 50 = 250. Total: 500 + 250 = <strong>₦750</strong>.</p>

<h3>📝 Let's Learn</h3>
<p>Multiplication helps you calculate costs for groups of people. The formula is: <strong>Total cost = Number of people × Cost per person</strong>.</p>
<p><strong>Example 1:</strong> Bus fare is ₦100 per person. A family of 4: 4 × ₦100 = <strong>₦400</strong>.</p>
<p><strong>Example 2:</strong> Lunch costs ₦200 per person. For 3 friends: 3 × ₦200 = <strong>₦600</strong>.</p>
<p><strong>Example 3:</strong> A keke ride costs ₦50 per person. 3 passengers: 3 × ₦50 = <strong>₦150</strong>.</p>
<p><strong>Tip:</strong> For big numbers, partition! 3 × ₦250 = 3 × 200 + 3 × 50 = 600 + 150 = ₦750.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>A danfo ride costs ₦80 per person. How much does it cost for 4 people?</li>
<li>Amina buys lunch for 6 friends. Each lunch is ₦150. What is the total?</li>
<li>A school trip costs ₦120 per student. There are 5 students going. What is the total cost?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>4 × ₦80 = <strong>₦320</strong>. (4 × 8 = 32, add zero = 320.)</li>
<li>6 × ₦150 = 6 × 100 + 6 × 50 = 600 + 300 = <strong>₦900</strong>.</li>
<li>5 × ₦120 = 5 × 100 + 5 × 20 = 500 + 100 = <strong>₦600</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Whenever everyone pays the same amount, multiply to find the total. Number of people × cost per person = total cost. This works for bus fares, meals, tickets, and more!</p>`,
          duration: 12,
          order: 12,
        },
        {
          id: 'fn-4-13',
          title: 'Multiplication and Addition Together',
          description: 'Solve problems that combine multiplication with addition.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve problems that need both multiplication and addition, just like real shopping situations.</p>

<h3>🏪 Market Story</h3>
<p>Bola buys 3 exercise books at ₦40 each and 2 pens at ₦25 each. What is the total cost? She needs multiplication AND addition: Books: 3 × ₦40 = ₦120. Pens: 2 × ₦25 = ₦50. Total: ₦120 + ₦50 = <strong>₦170</strong>.</p>

<h3>📝 Let's Learn</h3>
<p>Many real problems combine operations. The key: do multiplication first, then add the results.</p>
<p><strong>Example 1:</strong> 4 oranges at ₦5 each and 3 bananas at ₦10 each. Oranges: 4 × ₦5 = ₦20. Bananas: 3 × ₦10 = ₦30. Total: ₦20 + ₦30 = <strong>₦50</strong>.</p>
<p><strong>Example 2:</strong> 2 shirts at ₦80 each and 1 pair of trousers at ₦120. Shirts: 2 × ₦80 = ₦160. Trousers: ₦120 (just 1, no multiplication needed). Total: ₦160 + ₦120 = <strong>₦280</strong>.</p>
<p><strong>Example 3:</strong> 5 meat pies at ₦30 each, plus 2 drinks at ₦50 each. Pies: 5 × ₦30 = ₦150. Drinks: 2 × ₦50 = ₦100. Total: ₦150 + ₦100 = <strong>₦250</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Emeka buys 4 pencils at ₦10 each and 2 erasers at ₦5 each. What is the total?</li>
<li>Funke buys 3 bottles of water at ₦20 each and 1 biscuit for ₦30. What does she spend?</li>
<li>Chidi buys 5 bananas at ₦15 each and 3 oranges at ₦20 each. How much altogether?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Pencils: 4 × ₦10 = ₦40. Erasers: 2 × ₦5 = ₦10. Total: ₦40 + ₦10 = <strong>₦50</strong>.</li>
<li>Water: 3 × ₦20 = ₦60. Biscuit: ₦30. Total: ₦60 + ₦30 = <strong>₦90</strong>.</li>
<li>Bananas: 5 × ₦15 = ₦75. Oranges: 3 × ₦20 = ₦60. Total: ₦75 + ₦60 = <strong>₦135</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When buying different items in different quantities, multiply each group separately, then add all the results together for the total cost.</p>`,
          duration: 14,
          order: 13,
        },
        {
          id: 'fn-4-14',
          title: 'Arrays: Rows and Columns',
          description: 'Understand multiplication using arrays — objects arranged in rows and columns.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use arrays — objects arranged in rows and columns — to understand and visualise multiplication.</p>

<h3>🏪 Market Story</h3>
<p>Amina looks at an egg crate at the market. The eggs are neatly arranged: 5 rows with 6 eggs in each row. She can count them by multiplying: 5 × 6 = 30 eggs. The egg crate is an <strong>array</strong>!</p>

<h3>📝 Let's Learn</h3>
<p>An <strong>array</strong> is when objects are arranged in equal rows and equal columns, like a grid.</p>
<p>To find the total: <strong>Number of rows × Number in each row = Total</strong></p>
<p>A 3 × 4 array looks like this:</p>
<p>● ● ● ●<br>● ● ● ●<br>● ● ● ●</p>
<p>3 rows of 4 = 12. You can also see it as 4 columns of 3 = 12. Same answer!</p>
<p><strong>Example 1:</strong> Chairs arranged in 4 rows of 5: 4 × 5 = <strong>20 chairs</strong>.</p>
<p><strong>Example 2:</strong> A mango crate with 3 rows and 8 in each row: 3 × 8 = <strong>24 mangoes</strong>.</p>
<p><strong>Example 3:</strong> Windows on a building: 6 rows with 4 windows each: 6 × 4 = <strong>24 windows</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>A classroom has desks in 5 rows with 6 desks in each row. How many desks?</li>
<li>A biscuit packet shows biscuits in 4 rows of 3. How many biscuits?</li>
<li>Tunde arranges his marbles in 7 rows with 4 marbles in each row. How many marbles?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>5 × 6 = <strong>30 desks</strong>.</li>
<li>4 × 3 = <strong>12 biscuits</strong>.</li>
<li>7 × 4 = <strong>28 marbles</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Arrays show multiplication as rows and columns. Rows × objects per row = total. Arrays are everywhere: egg crates, classroom desks, buildings, and tiles on a floor!</p>`,
          duration: 12,
          order: 14,
        },
        {
          id: 'fn-4-15',
          title: 'Multiplication Word Problems: Shopping',
          description: 'Solve multiplication word problems about shopping.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise solving word problems that require multiplication, all set in shopping scenarios.</p>

<h3>🏪 Market Story</h3>
<p>It's back-to-school time and parents are buying supplies at Idumota Market. Prices are displayed and everyone is multiplying to figure out their totals. Let's help some families!</p>

<h3>📝 Let's Learn</h3>
<p>Look for clues in word problems that tell you to multiply: "each costs," "per item," "every one costs," "times as many."</p>
<p><strong>Example 1:</strong> Funke needs 6 exercise books. Each costs ₦35. How much for all of them?
<br>6 × ₦35 = 6 × 30 + 6 × 5 = 180 + 30 = <strong>₦210</strong>.</p>
<p><strong>Example 2:</strong> Emeka buys 4 packs of crayons at ₦50 per pack. Total: 4 × ₦50 = <strong>₦200</strong>.</p>
<p><strong>Example 3:</strong> A school buys 10 footballs at ₦300 each. Total: 10 × ₦300 = <strong>₦3,000</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Bola buys 5 packets of biscuits. Each packet costs ₦25. What is the total cost?</li>
<li>A shop sells water bottles for ₦15 each. Chidi buys 8. How much does he pay?</li>
<li>Amina's mother buys 3 bags of rice at ₦450 each. What is the total?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>5 × ₦25 = <strong>₦125</strong>. (5 × 20 + 5 × 5 = 100 + 25 = 125.)</li>
<li>8 × ₦15 = <strong>₦120</strong>. (8 × 10 + 8 × 5 = 80 + 40 = 120.)</li>
<li>3 × ₦450 = <strong>₦1,350</strong>. (3 × 400 + 3 × 50 = 1,200 + 150 = 1,350.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When a word problem says "each costs" or "per item," that's your clue to multiply. Number of items × price per item = total cost.</p>`,
          duration: 12,
          order: 15,
        },
        {
          id: 'fn-4-16',
          title: 'Multiplication Word Problems: Groups',
          description: 'Solve word problems about equal groups of people and objects.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems about equal groups of people, animals, and objects.</p>

<h3>🏪 Market Story</h3>
<p>Tunde's school is going on a field trip. The headteacher organises 5 buses. Each bus can carry 30 students. How many students can go on the trip? 5 × 30 = 150 students!</p>

<h3>📝 Let's Learn</h3>
<p>When objects or people are divided into equal groups, use multiplication to find the total.</p>
<p><strong>Example 1:</strong> There are 8 families in a compound. Each family has 4 children. Total children: 8 × 4 = <strong>32 children</strong>.</p>
<p><strong>Example 2:</strong> A teacher gives 6 sweets to each of her 9 students. Total sweets: 9 × 6 = <strong>54 sweets</strong>.</p>
<p><strong>Example 3:</strong> Bola plants 7 rows of corn. Each row has 10 stalks. Total stalks: 7 × 10 = <strong>70 stalks</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>There are 6 tables in a restaurant. Each table seats 4 people. How many people can sit down?</li>
<li>Amina packs 8 bags. She puts 5 oranges in each bag. How many oranges in total?</li>
<li>A school has 9 classrooms. Each classroom has 25 students. How many students in the school?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>6 × 4 = <strong>24 people</strong>.</li>
<li>8 × 5 = <strong>40 oranges</strong>.</li>
<li>9 × 25 = 9 × 20 + 9 × 5 = 180 + 45 = <strong>225 students</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Equal groups = multiplication. If every group has the same number, multiply the number of groups by the number in each group to find the total.</p>`,
          duration: 12,
          order: 16,
        },
        {
          id: 'fn-4-17',
          title: 'Multiplication Practice: Market Buying',
          description: 'Practise multiplication with a comprehensive market buying challenge.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will put all your multiplication skills together in a market buying challenge.</p>

<h3>🏪 Market Story</h3>
<p>It's Saturday and Emeka's mother gives him a shopping list and ₦500. Can he buy everything? Here are the market prices:</p>
<ul>
<li>Tomatoes: ₦15 each</li>
<li>Peppers: ₦10 each</li>
<li>Plantain: ₦40 each</li>
<li>Eggs: ₦25 each</li>
<li>Pure water sachet: ₦20 each</li>
</ul>
<p>The shopping list says: 6 tomatoes, 4 peppers, 3 plantains, 4 eggs, 5 pure water.</p>

<h3>📝 Let's Learn</h3>
<p>Let's calculate each item:</p>
<ul>
<li>Tomatoes: 6 × ₦15 = ₦90</li>
<li>Peppers: 4 × ₦10 = ₦40</li>
<li>Plantains: 3 × ₦40 = ₦120</li>
<li>Eggs: 4 × ₦25 = ₦100</li>
<li>Pure water: 5 × ₦20 = ₦100</li>
</ul>
<p>Total: ₦90 + ₦40 + ₦120 + ₦100 + ₦100 = <strong>₦450</strong>.</p>
<p>Emeka has ₦500, so he can buy everything and have ₦50 left!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Funke buys 8 tomatoes at ₦15 each and 3 peppers at ₦10 each. What is her total?</li>
<li>Chidi buys 5 plantains at ₦40 each. He pays with ₦500. What change does he get?</li>
<li>Bola buys 6 eggs at ₦25 each and 4 sachets of pure water at ₦20 each. How much does she spend?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Tomatoes: 8 × ₦15 = ₦120. Peppers: 3 × ₦10 = ₦30. Total: ₦120 + ₦30 = <strong>₦150</strong>.</li>
<li>5 × ₦40 = ₦200. Change: ₦500 − ₦200 = <strong>₦300</strong>.</li>
<li>Eggs: 6 × ₦25 = ₦150. Water: 4 × ₦20 = ₦80. Total: ₦150 + ₦80 = <strong>₦230</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>At the market, multiply to find item totals, then add them all up. Check against your budget before you buy! This is real-world maths at its best.</p>`,
          duration: 14,
          order: 17,
        },
        {
          id: 'fn-4-18',
          title: 'Multiplication Review and Challenge',
          description: 'Review all multiplication concepts and tackle challenge problems.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review all multiplication skills and challenge yourself with harder problems.</p>

<h3>🏪 Market Story</h3>
<p>Mrs. Okafor announces a multiplication challenge. "Whoever solves the most problems wins a prize!" The class is excited. Amina, Chidi, Bola, Emeka, Tunde, and Funke are all ready. Are you?</p>

<h3>📝 Let's Learn</h3>
<p><strong>Review of multiplication strategies:</strong></p>
<ul>
<li><strong>Times 2:</strong> Double the number.</li>
<li><strong>Times 5:</strong> Answers end in 0 or 5.</li>
<li><strong>Times 10:</strong> Add a zero.</li>
<li><strong>Times 4:</strong> Double-double.</li>
<li><strong>Times 3:</strong> Digits add to 3, 6, or 9.</li>
<li><strong>Times 1:</strong> Same number. <strong>Times 0:</strong> Always 0.</li>
<li><strong>Partitioning:</strong> Split the bigger number and multiply each part.</li>
</ul>
<p><strong>Challenge 1:</strong> 7 × 8 = ? Think: 7 × 8 = 7 × (4 + 4) = 28 + 28 = <strong>56</strong>. Or just remember: 5, 6, 7, 8 → 56 = 7 × 8!</p>
<p><strong>Challenge 2:</strong> 6 × 15. Partition: 6 × 10 + 6 × 5 = 60 + 30 = <strong>90</strong>.</p>
<p><strong>Challenge 3:</strong> A school orders 8 boxes of chalk. Each box has 24 pieces. How many pieces? 8 × 24 = 8 × 20 + 8 × 4 = 160 + 32 = <strong>192 pieces</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 9 × 7?</li>
<li>What is 5 × 36?</li>
<li>Tunde buys 7 items at ₦45 each. What is the total cost?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>9 × 7 = <strong>63</strong>.</li>
<li>5 × 36 = 5 × 30 + 5 × 6 = 150 + 30 = <strong>180</strong>.</li>
<li>7 × ₦45 = 7 × 40 + 7 × 5 = 280 + 35 = <strong>₦315</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Multiplication is one of the most useful skills in maths. You use it every day at the market, in school, and in life. Keep practising your times tables until they become automatic!</p>`,
          duration: 14,
          order: 18,
        },
      ],
    },
    {
      id: 'fn-unit-5',
      title: 'Division',
      description: 'Learn to divide numbers by sharing equally and grouping, using real Nigerian scenarios.',
      order: 5,
      lessons: [
        {
          id: 'fn-5-1',
          title: 'Sharing Equally',
          description: 'Split 12 oranges among 3 friends and other sharing scenarios.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what division means by sharing objects equally among people.</p>

<h3>🏪 Market Story</h3>
<p>Amina has 12 oranges and wants to share them equally among her 3 friends. She gives one orange to each friend, going round and round: "One for you, one for you, one for you..." until all the oranges are gone. Each friend gets 4 oranges. This is <strong>division</strong>!</p>

<h3>📝 Let's Learn</h3>
<p><strong>Division</strong> means sharing things equally into groups. When we divide, we find out how many each person gets.</p>
<p>12 oranges ÷ 3 friends = 4 oranges each. We write: 12 ÷ 3 = 4.</p>
<p>The ÷ sign means "divided by." We say: "twelve divided by three equals four."</p>
<p><strong>Example 1:</strong> 10 sweets shared among 2 children. 10 ÷ 2 = <strong>5 sweets each</strong>.</p>
<p><strong>Example 2:</strong> 15 pencils shared among 5 students. 15 ÷ 5 = <strong>3 pencils each</strong>.</p>
<p><strong>Example 3:</strong> ₦20 shared equally between 4 friends. ₦20 ÷ 4 = <strong>₦5 each</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Share 8 mangoes equally among 4 children. How many does each child get?</li>
<li>Emeka has 18 biscuits. He shares them equally among 3 friends. How many does each friend get?</li>
<li>₦30 is shared equally among 6 people. How much does each person get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>8 ÷ 4 = <strong>2 mangoes each</strong>.</li>
<li>18 ÷ 3 = <strong>6 biscuits each</strong>.</li>
<li>₦30 ÷ 6 = <strong>₦5 each</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Division is fair sharing. When you share equally, everyone gets the same amount. The ÷ sign tells you to divide.</p>`,
          duration: 12,
          order: 1,
        },
        {
          id: 'fn-5-2',
          title: 'What Division Means',
          description: 'Understand division as both sharing and grouping.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn that division can mean sharing (splitting into equal parts) or grouping (making groups of a certain size).</p>

<h3>🏪 Market Story</h3>
<p>Bola has 20 groundnuts. She can think about division in two ways:</p>
<p><strong>Sharing:</strong> "I want to share with 4 friends. How many does each person get?" 20 ÷ 4 = 5 each.</p>
<p><strong>Grouping:</strong> "I want to put 5 groundnuts in each bag. How many bags can I fill?" 20 ÷ 5 = 4 bags.</p>
<p>Both use division, but they ask different questions!</p>

<h3>📝 Let's Learn</h3>
<p>Division has two meanings:</p>
<ul>
<li><strong>Sharing:</strong> "I have 12 items for 3 people. How many does each get?" 12 ÷ 3 = 4.</li>
<li><strong>Grouping:</strong> "I have 12 items. I put 3 in each group. How many groups?" 12 ÷ 3 = 4.</li>
</ul>
<p>Both give the same answer! 12 ÷ 3 = 4 either way.</p>
<p><strong>Example 1 (Sharing):</strong> ₦24 shared among 6 children. ₦24 ÷ 6 = <strong>₦4 each</strong>.</p>
<p><strong>Example 2 (Grouping):</strong> 24 eggs, 6 in each carton. 24 ÷ 6 = <strong>4 cartons</strong>.</p>
<p><strong>Example 3:</strong> Tunde has 30 marbles. He puts 5 in each bag. 30 ÷ 5 = <strong>6 bags</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Chidi has 16 stickers to share among 4 friends. How many does each friend get? (Sharing)</li>
<li>Funke has 16 beads. She puts 4 in each necklace. How many necklaces can she make? (Grouping)</li>
<li>₦40 is shared among 8 people. How much does each person receive?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>16 ÷ 4 = <strong>4 stickers each</strong>.</li>
<li>16 ÷ 4 = <strong>4 necklaces</strong>. Same calculation, different meaning!</li>
<li>₦40 ÷ 8 = <strong>₦5 each</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Division can mean "share equally" or "make equal groups." Both use the ÷ sign and both give the same answer. Think about which meaning fits the situation!</p>`,
          duration: 12,
          order: 2,
        },
        {
          id: 'fn-5-3',
          title: 'Dividing by 2: Halving',
          description: 'Learn to divide by 2, which is the same as finding half.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to divide any number by 2, which means finding <strong>half</strong>.</p>

<h3>🏪 Market Story</h3>
<p>Emeka and his brother share everything equally. If they get 14 groundnuts, each gets half: 14 ÷ 2 = 7. If they get ₦50, each gets: ₦50 ÷ 2 = ₦25. Dividing by 2 is halving!</p>

<h3>📝 Let's Learn</h3>
<p>Dividing by 2 is the <strong>opposite of doubling</strong>. If you know your 2 times table, you know how to halve!</p>
<ul>
<li>2 ÷ 2 = 1 (half of 2)</li>
<li>4 ÷ 2 = 2 (half of 4)</li>
<li>6 ÷ 2 = 3 (half of 6)</li>
<li>8 ÷ 2 = 4 (half of 8)</li>
<li>10 ÷ 2 = 5 (half of 10)</li>
<li>12 ÷ 2 = 6, 14 ÷ 2 = 7, 16 ÷ 2 = 8, 18 ÷ 2 = 9, 20 ÷ 2 = 10</li>
</ul>
<p><strong>Example 1:</strong> Half of 16 = 16 ÷ 2 = <strong>8</strong>.</p>
<p><strong>Example 2:</strong> Half of ₦100 = ₦100 ÷ 2 = <strong>₦50</strong>.</p>
<p><strong>Example 3:</strong> Half of 24 = 24 ÷ 2 = <strong>12</strong>. (Think: 12 + 12 = 24.)</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is half of 18?</li>
<li>Two sisters share ₦60 equally. How much does each get?</li>
<li>A rope is 30 metres long. You cut it in half. How long is each piece?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>18 ÷ 2 = <strong>9</strong>.</li>
<li>₦60 ÷ 2 = <strong>₦30 each</strong>.</li>
<li>30 ÷ 2 = <strong>15 metres</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Dividing by 2 is the same as finding half. It's the opposite of doubling. If you know that double 8 = 16, then half of 16 = 8!</p>`,
          duration: 10,
          order: 3,
        },
        {
          id: 'fn-5-4',
          title: 'Dividing by 3',
          description: 'Learn to divide numbers by 3.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to divide numbers by 3, splitting things into three equal parts.</p>

<h3>🏪 Market Story</h3>
<p>Funke, Bola, and Amina are best friends. They always share treats three ways. Today they have 21 chin-chin pieces. How many does each girl get? 21 ÷ 3 = 7 pieces each. Fair sharing among three!</p>

<h3>📝 Let's Learn</h3>
<p>Dividing by 3 uses the 3 times table in reverse:</p>
<ul>
<li>3 ÷ 3 = 1</li>
<li>6 ÷ 3 = 2</li>
<li>9 ÷ 3 = 3</li>
<li>12 ÷ 3 = 4</li>
<li>15 ÷ 3 = 5</li>
<li>18 ÷ 3 = 6</li>
<li>21 ÷ 3 = 7</li>
<li>24 ÷ 3 = 8</li>
<li>27 ÷ 3 = 9</li>
<li>30 ÷ 3 = 10</li>
</ul>
<p>Think: "3 times WHAT equals this number?"</p>
<p><strong>Example 1:</strong> 18 ÷ 3. Think: 3 × ? = 18. Answer: 3 × 6 = 18, so 18 ÷ 3 = <strong>6</strong>.</p>
<p><strong>Example 2:</strong> ₦24 ÷ 3 = <strong>₦8</strong>. (3 × 8 = 24.)</p>
<p><strong>Example 3:</strong> 27 ÷ 3 = <strong>9</strong>. (3 × 9 = 27.)</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 15 ÷ 3?</li>
<li>Three brothers share ₦30 equally. How much does each get?</li>
<li>Chidi has 24 stickers to share among 3 friends. How many does each friend get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>15 ÷ 3 = <strong>5</strong>.</li>
<li>₦30 ÷ 3 = <strong>₦10 each</strong>.</li>
<li>24 ÷ 3 = <strong>8 stickers each</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Dividing by 3 is the reverse of the 3 times table. Ask yourself: "3 times what gives me this number?" The answer is your division result!</p>`,
          duration: 12,
          order: 4,
        },
        {
          id: 'fn-5-5',
          title: 'Dividing by 5',
          description: 'Learn to divide numbers by 5.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to divide numbers by 5, which is useful for splitting things into five equal parts.</p>

<h3>🏪 Market Story</h3>
<p>Tunde earns ₦45 over 5 days helping at his uncle's shop. He earns the same amount each day. How much per day? ₦45 ÷ 5 = ₦9 per day. He can check: 5 × ₦9 = ₦45. Correct!</p>

<h3>📝 Let's Learn</h3>
<p>Dividing by 5 uses the 5 times table in reverse:</p>
<ul>
<li>5 ÷ 5 = 1</li>
<li>10 ÷ 5 = 2</li>
<li>15 ÷ 5 = 3</li>
<li>20 ÷ 5 = 4</li>
<li>25 ÷ 5 = 5</li>
<li>30 ÷ 5 = 6</li>
<li>35 ÷ 5 = 7</li>
<li>40 ÷ 5 = 8</li>
<li>45 ÷ 5 = 9</li>
<li>50 ÷ 5 = 10</li>
</ul>
<p>Think: "5 times WHAT equals this number?"</p>
<p><strong>Example 1:</strong> 35 ÷ 5. Think: 5 × ? = 35. Answer: 5 × 7 = 35, so 35 ÷ 5 = <strong>7</strong>.</p>
<p><strong>Example 2:</strong> ₦50 shared among 5 children: ₦50 ÷ 5 = <strong>₦10 each</strong>.</p>
<p><strong>Example 3:</strong> 40 ÷ 5 = <strong>8</strong>. (5 × 8 = 40.)</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 25 ÷ 5?</li>
<li>₦45 is shared equally among 5 friends. How much does each get?</li>
<li>Amina has 30 beads to put into bags of 5. How many bags does she fill?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>25 ÷ 5 = <strong>5</strong>.</li>
<li>₦45 ÷ 5 = <strong>₦9 each</strong>.</li>
<li>30 ÷ 5 = <strong>6 bags</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Dividing by 5 is the reverse of the 5 times table. Since 5 times table answers end in 0 or 5, numbers that end in 0 or 5 divide evenly by 5!</p>`,
          duration: 10,
          order: 5,
        },
        {
          id: 'fn-5-6',
          title: 'Dividing by 10',
          description: 'Learn to divide by 10 — just remove the zero!',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to divide by 10, which is the easiest division — just remove the zero!</p>

<h3>🏪 Market Story</h3>
<p>Bola has ₦80 in ₦10 notes. How many notes does she have? ₦80 ÷ ₦10 = 8 notes. She just removes the zero from 80 to get 8!</p>

<h3>📝 Let's Learn</h3>
<p>Dividing by 10 is the opposite of multiplying by 10. To multiply by 10, you add a zero. To divide by 10, you <strong>remove a zero</strong>.</p>
<ul>
<li>10 ÷ 10 = 1</li>
<li>20 ÷ 10 = 2</li>
<li>30 ÷ 10 = 3</li>
<li>50 ÷ 10 = 5</li>
<li>100 ÷ 10 = 10</li>
<li>200 ÷ 10 = 20</li>
<li>500 ÷ 10 = 50</li>
</ul>
<p><strong>Example 1:</strong> 70 ÷ 10 = <strong>7</strong>. Just remove the zero.</p>
<p><strong>Example 2:</strong> ₦150 ÷ 10 = <strong>₦15</strong>. Remove one zero.</p>
<p><strong>Example 3:</strong> ₦1,000 ÷ 10 = <strong>₦100</strong>. Remove one zero.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 90 ÷ 10?</li>
<li>Emeka has ₦60 in ₦10 notes. How many notes does he have?</li>
<li>A shopkeeper has ₦400. She divides it into groups of ₦10. How many groups?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>90 ÷ 10 = <strong>9</strong>.</li>
<li>₦60 ÷ 10 = <strong>6 notes</strong>.</li>
<li>₦400 ÷ 10 = <strong>40 groups</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Dividing by 10 is super easy: just remove one zero! If the number ends in zero, division by 10 always works cleanly.</p>`,
          duration: 10,
          order: 6,
        },
        {
          id: 'fn-5-7',
          title: 'Division and Multiplication are Related',
          description: 'Understand that division and multiplication are inverse operations.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will discover that division and multiplication are opposite operations — knowing one helps you solve the other!</p>

<h3>🏪 Market Story</h3>
<p>Chidi knows that 4 × 5 = 20. His teacher asks him: "What is 20 ÷ 5?" Chidi thinks: "If 4 groups of 5 makes 20, then 20 divided into groups of 5 gives 4 groups." So 20 ÷ 5 = 4. His multiplication knowledge helped him divide!</p>

<h3>📝 Let's Learn</h3>
<p>Division and multiplication are <strong>inverse operations</strong> — they undo each other.</p>
<p>If you know: <strong>6 × 3 = 18</strong>, then you also know:</p>
<ul>
<li>18 ÷ 3 = 6</li>
<li>18 ÷ 6 = 3</li>
</ul>
<p>These facts form a <strong>fact family</strong>: 6 × 3 = 18, 3 × 6 = 18, 18 ÷ 3 = 6, 18 ÷ 6 = 3.</p>
<p><strong>Example 1:</strong> 7 × 4 = 28, so 28 ÷ 4 = <strong>7</strong> and 28 ÷ 7 = <strong>4</strong>.</p>
<p><strong>Example 2:</strong> 5 × 8 = 40, so 40 ÷ 8 = <strong>5</strong> and 40 ÷ 5 = <strong>8</strong>.</p>
<p><strong>Example 3:</strong> To check if 36 ÷ 4 = 9 is correct, multiply: 9 × 4 = 36. ✓ Correct!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>If 8 × 3 = 24, what is 24 ÷ 3?</li>
<li>If 9 × 5 = 45, what is 45 ÷ 9?</li>
<li>Funke calculates 42 ÷ 6 = 7. How can she check her answer using multiplication?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>24 ÷ 3 = <strong>8</strong>.</li>
<li>45 ÷ 9 = <strong>5</strong>.</li>
<li>She checks: 7 × 6 = 42. ✓ Since this equals the original number, her answer is correct!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Division and multiplication are a team. Use times tables to divide: "? × 3 = 18" means 18 ÷ 3 = 6. Always check division with multiplication!</p>`,
          duration: 12,
          order: 7,
        },
        {
          id: 'fn-5-8',
          title: 'Dividing Naira Among Friends',
          description: 'Practise dividing money equally among friends.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise dividing Naira amounts equally among friends, a very common real-life situation.</p>

<h3>🏪 Market Story</h3>
<p>Amina, Bola, and Funke buy a big bag of chin-chin together for ₦90. They want to split the cost equally. ₦90 ÷ 3 = ₦30 each. Fair and square!</p>

<h3>📝 Let's Learn</h3>
<p>Dividing money equally is something you'll do your whole life — splitting bills, sharing gifts, or dividing earnings.</p>
<p><strong>Example 1:</strong> 4 friends share ₦100 equally. ₦100 ÷ 4 = <strong>₦25 each</strong>. Check: 4 × ₦25 = ₦100. ✓</p>
<p><strong>Example 2:</strong> 5 siblings share ₦200 from their grandmother. ₦200 ÷ 5 = <strong>₦40 each</strong>. Check: 5 × ₦40 = ₦200. ✓</p>
<p><strong>Example 3:</strong> 2 friends earn ₦150 together washing a car. ₦150 ÷ 2 = <strong>₦75 each</strong>. Check: 2 × ₦75 = ₦150. ✓</p>
<p><strong>Tip:</strong> For bigger amounts, partition! ₦150 ÷ 2: Half of 100 = 50, half of 50 = 25. Total: 50 + 25 = ₦75.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>3 friends share ₦60 equally. How much does each get?</li>
<li>₦200 is divided among 4 workers. How much does each receive?</li>
<li>Tunde and Emeka earn ₦180 together. They split it equally. How much does each get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦60 ÷ 3 = <strong>₦20 each</strong>.</li>
<li>₦200 ÷ 4 = <strong>₦50 each</strong>.</li>
<li>₦180 ÷ 2 = <strong>₦90 each</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Dividing money equally means everyone pays or receives the same amount. Always check by multiplying the share by the number of people — it should equal the total!</p>`,
          duration: 12,
          order: 8,
        },
        {
          id: 'fn-5-9',
          title: 'Division with Remainders',
          description: 'Learn what happens when things don\'t divide evenly.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what happens when a number doesn't divide evenly — there's something left over called a <strong>remainder</strong>.</p>

<h3>🏪 Market Story</h3>
<p>Chidi has 13 sweets to share among 4 friends. He gives 3 to each friend: 4 × 3 = 12. But he started with 13. There's 1 sweet left over! That leftover is called a remainder. 13 ÷ 4 = 3 remainder 1.</p>

<h3>📝 Let's Learn</h3>
<p>Sometimes numbers don't divide evenly. The leftover amount is called the <strong>remainder</strong>.</p>
<p>We write it as: 13 ÷ 4 = 3 r 1 (or "3 remainder 1").</p>
<p><strong>How to find remainders:</strong></p>
<ol>
<li>Find the biggest number in the times table that fits. 4 × 3 = 12 fits into 13.</li>
<li>Subtract: 13 − 12 = 1. The remainder is 1.</li>
</ol>
<p><strong>Example 1:</strong> 14 ÷ 3. 3 × 4 = 12 (fits). 14 − 12 = 2. Answer: <strong>4 r 2</strong>.</p>
<p><strong>Example 2:</strong> 17 ÷ 5. 5 × 3 = 15 (fits). 17 − 15 = 2. Answer: <strong>3 r 2</strong>.</p>
<p><strong>Example 3:</strong> 25 ÷ 4. 4 × 6 = 24 (fits). 25 − 24 = 1. Answer: <strong>6 r 1</strong>.</p>
<p><strong>Important:</strong> The remainder must always be smaller than the number you divide by!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 11 ÷ 2?</li>
<li>What is 20 ÷ 3?</li>
<li>Bola has 23 groundnuts to share among 5 friends. How many does each friend get, and how many are left over?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>11 ÷ 2 = <strong>5 r 1</strong>. (2 × 5 = 10, 11 − 10 = 1.)</li>
<li>20 ÷ 3 = <strong>6 r 2</strong>. (3 × 6 = 18, 20 − 18 = 2.)</li>
<li>23 ÷ 5 = <strong>4 r 3</strong>. Each friend gets 4, and 3 are left over. (5 × 4 = 20, 23 − 20 = 3.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When things don't share evenly, there's a remainder — the leftover amount. The remainder is always less than the number you divide by. In real life, Chidi might eat that leftover sweet himself!</p>`,
          duration: 14,
          order: 9,
        },
        {
          id: 'fn-5-10',
          title: 'Dividing Larger Numbers',
          description: 'Divide larger numbers like ₦60 ÷ 4.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn strategies for dividing larger numbers, like amounts over ₦50.</p>

<h3>🏪 Market Story</h3>
<p>Emeka has ₦60 to share among 4 friends. How much does each get? He thinks: "I know 4 × 15 = 60, so ₦60 ÷ 4 = ₦15." But how did he figure out 4 × 15 = 60? Let's learn a method.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Strategy: Partition and divide each part.</strong></p>
<p>₦60 ÷ 4: Split 60 into 40 + 20. Then: 40 ÷ 4 = 10 and 20 ÷ 4 = 5. Total: 10 + 5 = <strong>₦15</strong>.</p>
<p><strong>Example 1:</strong> 72 ÷ 3. Split 72 = 60 + 12. 60 ÷ 3 = 20. 12 ÷ 3 = 4. Total: <strong>24</strong>.</p>
<p><strong>Example 2:</strong> 85 ÷ 5. Split 85 = 50 + 35. 50 ÷ 5 = 10. 35 ÷ 5 = 7. Total: <strong>17</strong>.</p>
<p><strong>Example 3:</strong> ₦96 ÷ 4. Split 96 = 80 + 16. 80 ÷ 4 = 20. 16 ÷ 4 = 4. Total: <strong>₦24</strong>.</p>
<p><strong>Tip:</strong> Choose parts that are easy to divide. Pick multiples of the divisor!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>What is 84 ÷ 4? (Split into 80 + 4.)</li>
<li>What is ₦75 ÷ 3? (Split into 60 + 15.)</li>
<li>Funke earns ₦90 over 5 days. How much does she earn per day?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>84 ÷ 4: 80 ÷ 4 = 20, 4 ÷ 4 = 1. Total: <strong>21</strong>.</li>
<li>₦75 ÷ 3: 60 ÷ 3 = 20, 15 ÷ 3 = 5. Total: <strong>₦25</strong>.</li>
<li>₦90 ÷ 5: 50 ÷ 5 = 10, 40 ÷ 5 = 8. Total: <strong>₦18 per day</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To divide bigger numbers, split them into parts that are easy to divide. Divide each part separately, then add the results. This makes hard division manageable!</p>`,
          duration: 14,
          order: 10,
        },
        {
          id: 'fn-5-11',
          title: 'Fair Sharing Word Problems',
          description: 'Solve word problems about sharing things equally.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems that involve sharing things equally among people.</p>

<h3>🏪 Market Story</h3>
<p>Tunde's grandmother gives ₦150 to be shared equally among her 5 grandchildren. Each grandchild gets ₦150 ÷ 5 = ₦30. But Funke asks, "What if there are only 3 grandchildren visiting?" Then each would get ₦150 ÷ 3 = ₦50. Fewer people sharing means more for each!</p>

<h3>📝 Let's Learn</h3>
<p>Fair sharing word problems always ask: "How much does each person get?" You divide the total by the number of people.</p>
<p><strong>Example 1:</strong> A class of 8 students collects ₦40 for a teacher's gift. If each student pays equally, how much does each pay? ₦40 ÷ 8 = <strong>₦5 each</strong>.</p>
<p><strong>Example 2:</strong> Amina picks 36 flowers and divides them equally into 4 vases. 36 ÷ 4 = <strong>9 flowers per vase</strong>.</p>
<p><strong>Example 3:</strong> 3 children share 21 crayons equally. 21 ÷ 3 = <strong>7 crayons each</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>5 friends share 35 sweets equally. How many does each friend get?</li>
<li>₦120 is divided equally among 4 siblings. How much does each sibling receive?</li>
<li>A teacher has 42 exercise books to give to 6 students. How many does each student get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>35 ÷ 5 = <strong>7 sweets each</strong>.</li>
<li>₦120 ÷ 4 = <strong>₦30 each</strong>.</li>
<li>42 ÷ 6 = <strong>7 exercise books each</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When a problem says "share equally" or "divide fairly," use division. Total amount ÷ number of people = each person's share.</p>`,
          duration: 12,
          order: 11,
        },
        {
          id: 'fn-5-12',
          title: 'Market Division: Price Per Item',
          description: 'Find the price of one item when you know the price for several.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to find the price of one item when the price is given for a group of items.</p>

<h3>🏪 Market Story</h3>
<p>Bola sees a sign at the market: "5 oranges for ₦50." She wants to know: how much is one orange? ₦50 ÷ 5 = ₦10. One orange costs ₦10. Now she can compare prices at different stalls!</p>

<h3>📝 Let's Learn</h3>
<p>To find the <strong>price per item</strong> (unit price): <strong>Total price ÷ Number of items = Price per item</strong>.</p>
<p>This helps you compare deals and find the best price!</p>
<p><strong>Example 1:</strong> 3 pens for ₦30. Price per pen: ₦30 ÷ 3 = <strong>₦10</strong>.</p>
<p><strong>Example 2:</strong> 4 exercise books for ₦80. Price per book: ₦80 ÷ 4 = <strong>₦20</strong>.</p>
<p><strong>Example 3:</strong> Chidi finds two deals on groundnuts. Deal A: 6 bags for ₦90 (₦90 ÷ 6 = ₦15 each). Deal B: 5 bags for ₦80 (₦80 ÷ 5 = ₦16 each). Deal A is cheaper per bag!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>8 bananas cost ₦40. What is the price of one banana?</li>
<li>A pack of 6 biscuits costs ₦48. How much is one biscuit?</li>
<li>Stall A sells 4 tomatoes for ₦60. Stall B sells 5 tomatoes for ₦70. Which stall has a better price per tomato?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦40 ÷ 8 = <strong>₦5 per banana</strong>.</li>
<li>₦48 ÷ 6 = <strong>₦8 per biscuit</strong>.</li>
<li>Stall A: ₦60 ÷ 4 = ₦15 per tomato. Stall B: ₦70 ÷ 5 = ₦14 per tomato. <strong>Stall B is cheaper</strong> (₦14 vs ₦15).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Finding the price per item helps you be a smart shopper. Divide the total price by the number of items. The lower the price per item, the better the deal!</p>`,
          duration: 12,
          order: 12,
        },
        {
          id: 'fn-5-13',
          title: 'Division Word Problems: Grouping',
          description: 'Solve word problems about putting items into equal groups.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will solve word problems where you need to make groups of a certain size.</p>

<h3>🏪 Market Story</h3>
<p>Emeka has 24 eggs. He needs to put them into cartons that hold 6 eggs each. How many cartons does he need? 24 ÷ 6 = 4 cartons. This is grouping — dividing a total into groups of a specific size.</p>

<h3>📝 Let's Learn</h3>
<p>Grouping problems ask: "How many groups can you make?" You divide the total by the group size.</p>
<p><strong>Example 1:</strong> 30 students need to sit in rows of 5. How many rows? 30 ÷ 5 = <strong>6 rows</strong>.</p>
<p><strong>Example 2:</strong> Funke has 28 stickers to put 4 on each page. How many pages does she need? 28 ÷ 4 = <strong>7 pages</strong>.</p>
<p><strong>Example 3:</strong> A bus holds 10 passengers. 45 people need to travel. How many buses? 45 ÷ 10 = 4 r 5. She needs <strong>5 buses</strong> (4 full buses plus 1 more for the remaining 5 people).</p>
<p><strong>Important:</strong> When grouping people or things that can't be split, if there's a remainder, you need one extra group!</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>Amina has 32 flowers. She puts 8 in each vase. How many vases does she fill?</li>
<li>Tunde has 50 sweets to put into bags of 10. How many bags does he need?</li>
<li>A school has 35 students. Each row in the assembly hall fits 6 students. How many rows are needed?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>32 ÷ 8 = <strong>4 vases</strong>.</li>
<li>50 ÷ 10 = <strong>5 bags</strong>.</li>
<li>35 ÷ 6 = 5 r 5. They need <strong>6 rows</strong> (5 full rows of 6 plus 1 extra row for the remaining 5 students).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Grouping means making equal groups from a total. If there are leftovers and nothing can be left out, you need one extra group! This is important in real life.</p>`,
          duration: 12,
          order: 13,
        },
        {
          id: 'fn-5-14',
          title: 'Division Practice: Sharing Money',
          description: 'Practise division with various money-sharing scenarios.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will practise all your division skills with realistic money-sharing problems.</p>

<h3>🏪 Market Story</h3>
<p>It's the end of the market day. Several traders and friends need to settle up and share money. Can you help them all?</p>

<h3>📝 Let's Learn</h3>
<p><strong>Problem 1:</strong> Chidi, Tunde, and Emeka earn ₦180 washing cars. They split it equally. ₦180 ÷ 3 = <strong>₦60 each</strong>.</p>
<p><strong>Problem 2:</strong> A family of 4 goes to a restaurant. The bill is ₦200. If they split it: ₦200 ÷ 4 = <strong>₦50 each</strong>.</p>
<p><strong>Problem 3:</strong> Bola buys 5 identical pens for ₦75. Each pen costs: ₦75 ÷ 5 = <strong>₦15</strong>.</p>
<p><strong>Problem 4:</strong> Amina saves ₦84 over 4 weeks. She saves the same amount each week: ₦84 ÷ 4 = <strong>₦21 per week</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>6 friends share ₦72 equally. How much does each friend get?</li>
<li>Funke earns ₦150 in 5 days. How much does she earn per day?</li>
<li>Tunde buys 3 identical shirts for ₦135. How much does each shirt cost?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦72 ÷ 6 = <strong>₦12 each</strong>.</li>
<li>₦150 ÷ 5 = <strong>₦30 per day</strong>.</li>
<li>₦135 ÷ 3 = <strong>₦45 per shirt</strong>. (Split 135: 120 ÷ 3 = 40, 15 ÷ 3 = 5. Total: 45.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Division helps you share money fairly, find prices per item, and calculate daily or weekly earnings. Always check your division by multiplying the answer by the divisor!</p>`,
          duration: 12,
          order: 14,
        },
        {
          id: 'fn-5-15',
          title: 'Division Review and Challenge',
          description: 'Review all division skills and tackle challenge problems.',
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review all division concepts and challenge yourself with harder problems.</p>

<h3>🏪 Market Story</h3>
<p>Mrs. Okafor prepares the toughest division challenge yet. "You have learned sharing, grouping, remainders, and dividing bigger numbers. Now show me what you know!" The whole class is ready.</p>

<h3>📝 Let's Learn</h3>
<p><strong>Review of division concepts:</strong></p>
<ul>
<li><strong>Sharing:</strong> Splitting a total equally among people.</li>
<li><strong>Grouping:</strong> Making groups of a certain size.</li>
<li><strong>Remainders:</strong> Leftovers when division isn't exact.</li>
<li><strong>Inverse of multiplication:</strong> Use times tables to divide.</li>
<li><strong>Partitioning:</strong> Split big numbers to make division easier.</li>
</ul>
<p><strong>Challenge 1:</strong> ₦252 ÷ 4. Split: 240 ÷ 4 = 60, 12 ÷ 4 = 3. Answer: <strong>₦63</strong>. Check: 4 × 63 = 252. ✓</p>
<p><strong>Challenge 2:</strong> 100 ÷ 8 = ? 8 × 12 = 96. 100 − 96 = 4. Answer: <strong>12 r 4</strong>.</p>
<p><strong>Challenge 3:</strong> A farmer has 156 oranges to pack into bags of 6. 156 ÷ 6: Split: 120 ÷ 6 = 20, 36 ÷ 6 = 6. Total: <strong>26 bags</strong>.</p>

<h3>✏️ Practice Questions</h3>
<ol>
<li>₦96 ÷ 8 = ?</li>
<li>57 ÷ 5 = ? (There will be a remainder!)</li>
<li>A school has ₦480 to divide equally among 6 classes. How much does each class get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>₦96 ÷ 8 = <strong>₦12</strong>. (8 × 12 = 96.)</li>
<li>57 ÷ 5 = <strong>11 r 2</strong>. (5 × 11 = 55, 57 − 55 = 2.)</li>
<li>₦480 ÷ 6 = <strong>₦80</strong>. (Split: 480 = 420 + 60. 420 ÷ 6 = 70, 60 ÷ 6 = 10. Total: 80.)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Division is about sharing and grouping. Use your times tables, partition big numbers, and always check with multiplication. You have mastered division!</p>`,
          duration: 14,
          order: 15,
        },
      ],
    },
  ],
};

import type { Subject } from './curriculum';

export const foundationalLiteracy: Subject = {
  id: 'foundational-literacy',
  name: 'Foundational Literacy',
  slug: 'foundational-literacy',
  description: 'Build reading skills from scratch — sounds, vocabulary, comprehension, phonics, and reading. For ages 8-14.',
  icon: '📖',
  color: '#EC4899',
  units: [
    {
      id: 'fl-unit-1',
      title: 'Sound Awareness',
      description: 'Train your ears to hear and play with the sounds in words — the first step to reading.',
      order: 1,
      lessons: [
        {
          id: 'fl-1-1',
          title: 'Listening to Sounds Around Us',
          description: 'Learn to listen carefully to the sounds in your environment.',
          duration: 10,
          order: 1,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to listen carefully to the different sounds around you. Good listeners become great readers!</p>

<h3>🌟 Let's Start</h3>
<p>Close your eyes for a moment. What can you hear? Maybe you hear birds singing, a car honking, or people talking. Amina lives in Lagos and every morning she hears the sound of okadas on the road, her mother cooking in the kitchen, and the call to prayer from the mosque. Every sound is different, and your ears can tell them apart!</p>

<h3>📚 New Concept</h3>
<p>Sounds are all around us. Some sounds are <strong>loud</strong> like a truck horn — BEEP BEEP! Some sounds are <strong>soft</strong> like a cat purring. Some sounds are <strong>high</strong> like a whistle, and some sounds are <strong>low</strong> like a drum.</p>
<p>When we read, we need to hear the small sounds inside words. But first, let us practice listening to big sounds around us.</p>
<p><strong>Types of sounds:</strong></p>
<ul>
<li><strong>Nature sounds:</strong> rain falling, wind blowing, a rooster crowing</li>
<li><strong>People sounds:</strong> talking, laughing, clapping, singing</li>
<li><strong>Object sounds:</strong> a door closing, a bell ringing, water pouring</li>
</ul>
<p>Good listening means paying attention with your ears. When your teacher speaks, you listen. When a story is told, you listen. Listening is the first step to learning to read!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Name three sounds you might hear at a Nigerian market.</li>
<li>Is the sound of thunder LOUD or SOFT?</li>
<li>Name one sound you hear every morning when you wake up.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You might hear people calling out prices, car horns honking, and music playing from a radio.</li>
<li>The sound of thunder is LOUD.</li>
<li>Answers will vary — you might hear a rooster crowing, your family talking, or an alarm ringing.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Good listeners hear many different sounds. Your ears are powerful tools that will help you learn to read!</p>`,
        },
        {
          id: 'fl-1-2',
          title: 'Beginning Sounds: What Sound Does It Start With?',
          description: 'Learn to identify the first sound in a word.',
          duration: 10,
          order: 2,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to hear the very first sound in a word. This is called the <strong>beginning sound</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Emeka loves to eat mangoes. Listen to the word <strong>mango</strong>. What is the very first sound you hear? It is <strong>/m/</strong>! The sound /m/ is the beginning sound of mango. Every word starts with a sound, and today we will learn to hear that first sound.</p>

<h3>📚 New Concept</h3>
<p>The <strong>beginning sound</strong> is the very first sound you hear when you say a word. Let us practice:</p>
<ul>
<li><strong>ball</strong> — the beginning sound is /b/</li>
<li><strong>sun</strong> — the beginning sound is /s/</li>
<li><strong>fish</strong> — the beginning sound is /f/</li>
<li><strong>dog</strong> — the beginning sound is /d/</li>
<li><strong>rice</strong> — the beginning sound is /r/</li>
</ul>
<p>Say each word slowly. Stretch out the first sound: <strong>mmmmango</strong>, <strong>sssssun</strong>, <strong>fffffish</strong>. Can you hear it? That stretched-out part is the beginning sound!</p>
<p>Think about the foods you eat at home. <strong>Garri</strong> starts with /g/. <strong>Plantain</strong> starts with /p/. <strong>Yam</strong> starts with /y/.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is the beginning sound of the word <strong>table</strong>?</li>
<li>What is the beginning sound of the word <strong>goat</strong>?</li>
<li>What is the beginning sound of the word <strong>water</strong>?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The beginning sound of <strong>table</strong> is /t/.</li>
<li>The beginning sound of <strong>goat</strong> is /g/.</li>
<li>The beginning sound of <strong>water</strong> is /w/.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every word starts with a beginning sound. Say the word slowly and listen for the very first sound you hear.</p>`,
        },
        {
          id: 'fl-1-3',
          title: 'Beginning Sounds: Matching Words That Start the Same',
          description: 'Find words that share the same beginning sound.',
          duration: 10,
          order: 3,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to match words that start with the same sound.</p>

<h3>🌟 Let's Start</h3>
<p>Bola and her brother Bayo are playing a game. Bola says "ball" and Bayo says "book." Both words start with the same sound — /b/! Their names start with /b/ too. Can you think of another word that starts with /b/?</p>

<h3>📚 New Concept</h3>
<p>Words that start with the <strong>same beginning sound</strong> are like a family. Let us find some sound families:</p>
<ul>
<li><strong>/m/ family:</strong> mango, market, mother, money, mat</li>
<li><strong>/s/ family:</strong> school, sun, sister, sand, soap</li>
<li><strong>/k/ family:</strong> car, cup, corn, cassava, cook</li>
<li><strong>/t/ family:</strong> table, teacher, tree, ten, talk</li>
</ul>
<p>To check if two words start the same, say them both slowly. Listen to the first sound of each word. If the first sounds match, they belong to the same sound family!</p>
<p><strong>Do these start the same?</strong></p>
<ul>
<li><strong>fish</strong> and <strong>fan</strong> — YES! Both start with /f/.</li>
<li><strong>hat</strong> and <strong>pen</strong> — NO! Hat starts with /h/ and pen starts with /p/.</li>
<li><strong>dog</strong> and <strong>door</strong> — YES! Both start with /d/.</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Do <strong>cat</strong> and <strong>cup</strong> start with the same sound?</li>
<li>Which word starts with the same sound as <strong>rain</strong>: <strong>red</strong> or <strong>ball</strong>?</li>
<li>Name a word that starts with the same sound as <strong>house</strong>.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>YES — both <strong>cat</strong> and <strong>cup</strong> start with the /k/ sound.</li>
<li><strong>Red</strong> starts with the same sound as <strong>rain</strong>. Both start with /r/.</li>
<li>Any word starting with /h/ is correct, such as: hand, happy, hen, hill, hot.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Words that start with the same sound belong to the same sound family. Say two words slowly and compare their first sounds.</p>`,
        },
        {
          id: 'fl-1-4',
          title: 'Ending Sounds: What Sound Does It End With?',
          description: 'Learn to identify the last sound in a word.',
          duration: 10,
          order: 4,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to hear the very last sound in a word. This is called the <strong>ending sound</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Chidi is learning a new game. He says the word <strong>cat</strong> very slowly: c-a-t. The last sound he hears is /t/! Now he tries <strong>drum</strong>: d-r-u-m. The last sound is /m/! Let us play this game too.</p>

<h3>📚 New Concept</h3>
<p>The <strong>ending sound</strong> is the very last sound you hear when you say a word. Let us practice:</p>
<ul>
<li><strong>bus</strong> — the ending sound is /s/</li>
<li><strong>red</strong> — the ending sound is /d/</li>
<li><strong>book</strong> — the ending sound is /k/</li>
<li><strong>rain</strong> — the ending sound is /n/</li>
<li><strong>leaf</strong> — the ending sound is /f/</li>
</ul>
<p>To hear the ending sound, say the word slowly and hold on to the very last sound: bu-sssss, re-ddddd, boo-kkkk.</p>
<p>Think about things at your school. <strong>Pen</strong> ends with /n/. <strong>Desk</strong> ends with /k/. <strong>Bag</strong> ends with /g/.</p>
<p>The ending sound is just as important as the beginning sound. Great readers pay attention to every part of a word!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is the ending sound of the word <strong>cup</strong>?</li>
<li>What is the ending sound of the word <strong>mat</strong>?</li>
<li>Do <strong>fan</strong> and <strong>run</strong> end with the same sound?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The ending sound of <strong>cup</strong> is /p/.</li>
<li>The ending sound of <strong>mat</strong> is /t/.</li>
<li>YES — both <strong>fan</strong> and <strong>run</strong> end with the /n/ sound.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The ending sound is the last sound you hear in a word. Say the word slowly and listen carefully at the end.</p>`,
        },
        {
          id: 'fl-1-5',
          title: 'Rhyming Words: Do These Sound the Same?',
          description: 'Learn what rhyming words are and how to hear them.',
          duration: 10,
          order: 5,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn what <strong>rhyming words</strong> are — words that have the same ending sound pattern.</p>

<h3>🌟 Let's Start</h3>
<p>Funke loves to sing songs. One of her favourite songs goes: "Rain, rain, go away, come again another <strong>day</strong>." Do you hear how <strong>away</strong> and <strong>day</strong> sound alike at the end? Those are rhyming words! Rhyming words are fun — they make songs and poems sound beautiful.</p>

<h3>📚 New Concept</h3>
<p><strong>Rhyming words</strong> are words that sound the same at the end.</p>
<ul>
<li><strong>cat — hat — bat — mat</strong> all rhyme! They all end with the -at sound.</li>
<li><strong>sun — fun — run — bun</strong> all rhyme! They all end with the -un sound.</li>
<li><strong>ball — tall — wall — fall</strong> all rhyme! They all end with the -all sound.</li>
</ul>
<p><strong>How to check if words rhyme:</strong> Say the two words. Do they sound the same at the end? If YES, they rhyme!</p>
<ul>
<li>Do <strong>dog</strong> and <strong>log</strong> rhyme? Say them: dog... log... YES! They both end with -og.</li>
<li>Do <strong>fish</strong> and <strong>tree</strong> rhyme? Say them: fish... tree... NO! They sound different at the end.</li>
<li>Do <strong>man</strong> and <strong>pan</strong> rhyme? Say them: man... pan... YES! They both end with -an.</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Do <strong>bed</strong> and <strong>red</strong> rhyme?</li>
<li>Do <strong>cup</strong> and <strong>dog</strong> rhyme?</li>
<li>Which word rhymes with <strong>cake</strong>: <strong>lake</strong> or <strong>tree</strong>?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>YES — <strong>bed</strong> and <strong>red</strong> both end with the -ed sound. They rhyme!</li>
<li>NO — <strong>cup</strong> ends with -up and <strong>dog</strong> ends with -og. They do not rhyme.</li>
<li><strong>Lake</strong> rhymes with <strong>cake</strong>. They both end with the -ake sound.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Rhyming words sound the same at the end. Cat and hat rhyme. Sun and fun rhyme. Listen for the ending sounds!</p>`,
        },
        {
          id: 'fl-1-6',
          title: 'Rhyming Words: Find the Rhyme',
          description: 'Practice finding rhyming words in groups.',
          duration: 10,
          order: 6,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will get better at finding rhyming words by picking the rhyme from a group of words.</p>

<h3>🌟 Let's Start</h3>
<p>Tunde is playing a game with his friends at school. He says a word, and his friends must find the word that rhymes. Tunde says "ring" — and his friend Kemi shouts "sing!" because ring and sing sound the same at the end. Let us play this game too!</p>

<h3>📚 New Concept</h3>
<p>To find a rhyme, listen to the ending sound of the first word. Then check which other word has the same ending sound.</p>
<p><strong>Example:</strong> Which word rhymes with <strong>hop</strong>: <em>cat</em> or <em>mop</em>?</p>
<ul>
<li>Hop ends with -op.</li>
<li>Cat ends with -at. That is different.</li>
<li>Mop ends with -op. That is the same!</li>
<li>So <strong>mop</strong> rhymes with <strong>hop</strong>.</li>
</ul>
<p><strong>Let us try more:</strong></p>
<ul>
<li>Which rhymes with <strong>box</strong>: <em>pen</em> or <em>fox</em>? Answer: <strong>fox</strong> (-ox)</li>
<li>Which rhymes with <strong>rice</strong>: <em>nice</em> or <em>bag</em>? Answer: <strong>nice</strong> (-ice)</li>
<li>Which rhymes with <strong>king</strong>: <em>ring</em> or <em>cup</em>? Answer: <strong>ring</strong> (-ing)</li>
</ul>
<p>Sometimes three words are given and only two of them rhyme. The one that does not rhyme is the <strong>odd one out</strong>.</p>
<p><strong>Example:</strong> car, star, pen — <strong>car</strong> and <strong>star</strong> rhyme. <strong>Pen</strong> is the odd one out.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Which word rhymes with <strong>tail</strong>: <em>pail</em> or <em>dog</em>?</li>
<li>Which word rhymes with <strong>night</strong>: <em>tree</em> or <em>light</em>?</li>
<li>Find the odd one out: <strong>hen, pen, car</strong>. Which word does NOT rhyme?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>Pail</strong> rhymes with <strong>tail</strong>. They both end with -ail.</li>
<li><strong>Light</strong> rhymes with <strong>night</strong>. They both end with -ight.</li>
<li><strong>Car</strong> does NOT rhyme. Hen and pen both end with -en, but car ends with -ar.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To find a rhyme, listen to how the word ends. The rhyming word will have the same ending sound pattern.</p>`,
        },
        {
          id: 'fl-1-7',
          title: 'Making Rhymes: Can You Think of a Rhyme?',
          description: 'Practice creating your own rhyming words.',
          duration: 10,
          order: 7,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to make up your own rhyming words — this is a superpower for reading!</p>

<h3>🌟 Let's Start</h3>
<p>Adaeze loves making up silly rhymes. She says: "I have a cat, it sat on a mat, wearing a hat!" Cat, mat, hat — they all rhyme with -at. Now Adaeze wants you to try making your own rhymes. It is easier than you think!</p>

<h3>📚 New Concept</h3>
<p>To make a rhyme, keep the ending sound and change the beginning sound. Watch:</p>
<p><strong>Start with -at:</strong></p>
<ul>
<li>Put /b/ in front: <strong>bat</strong></li>
<li>Put /k/ in front: <strong>cat</strong></li>
<li>Put /f/ in front: <strong>fat</strong></li>
<li>Put /h/ in front: <strong>hat</strong></li>
<li>Put /m/ in front: <strong>mat</strong></li>
<li>Put /r/ in front: <strong>rat</strong></li>
<li>Put /s/ in front: <strong>sat</strong></li>
</ul>
<p>You just made SEVEN rhyming words!</p>
<p><strong>Start with -an:</strong> man, pan, ran, fan, van — five more rhyming words!</p>
<p><strong>More rhyme families:</strong> -ig (big, dig, fig, pig, wig), -op (hop, mop, pop, top), -ug (bug, hug, mug, rug, tug).</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Make two words that rhyme with <strong>hot</strong> (hint: change the beginning sound, keep -ot).</li>
<li>Make two words that rhyme with <strong>ring</strong> (hint: keep -ing).</li>
<li>Make two words that rhyme with <strong>bed</strong> (hint: keep -ed).</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Words that rhyme with <strong>hot</strong>: pot, dot, got, not, lot (any two are correct).</li>
<li>Words that rhyme with <strong>ring</strong>: sing, king, wing, thing, bring (any two are correct).</li>
<li>Words that rhyme with <strong>bed</strong>: red, fed, led, said, wed (any two are correct).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>To make a rhyme, keep the ending sound the same and change the beginning sound. You can make many words this way!</p>`,
        },
        {
          id: 'fl-1-8',
          title: 'Syllable Clapping: Breaking Words into Parts',
          description: 'Learn to break words into syllables by clapping.',
          duration: 10,
          order: 8,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to break words into smaller parts called <strong>syllables</strong> by clapping along.</p>

<h3>🌟 Let's Start</h3>
<p>When Amina sings her name, she notices it has three parts: A-mi-na. She claps three times — one for each part! Her brother Ade has two parts: A-de — two claps. These word parts are called <strong>syllables</strong>.</p>

<h3>📚 New Concept</h3>
<p>A <strong>syllable</strong> is a beat in a word. You can clap or tap the table for each syllable.</p>
<p><strong>One-syllable words (1 clap):</strong> cat, ball, fish, hand</p>
<p><strong>Two-syllable words (2 claps):</strong> wa-ter, man-go, gar-ri, La-gos</p>
<p><strong>Three-syllable words (3 claps):</strong> ba-na-na, um-brel-la, to-ma-to, com-pu-ter</p>
<p><strong>How to clap syllables:</strong> Say the word slowly. Every time your mouth opens wide to make a new sound burst, that is a new syllable. Clap for each one!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Clap the word <strong>table</strong>. How many claps?</li>
<li>Clap the word <strong>pencil</strong>. How many claps?</li>
<li>Clap the word <strong>elephant</strong>. How many claps?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>ta-ble</strong> = 2 claps (2 syllables).</li>
<li><strong>pen-cil</strong> = 2 claps (2 syllables).</li>
<li><strong>el-e-phant</strong> = 3 claps (3 syllables).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every word is made of parts called syllables. Clap once for each part. This helps you say and read long words!</p>`,
        },
        {
          id: 'fl-1-9',
          title: 'Syllable Counting: How Many Parts?',
          description: 'Practice counting syllables in longer words.',
          duration: 10,
          order: 9,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will get better at counting syllables, even in longer words.</p>

<h3>🌟 Let's Start</h3>
<p>Emeka's teacher asks the class to count the syllables in their names. Emeka counts: E-me-ka — three syllables! His friend Chukwuemeka counts five syllables! Longer names have more syllables. Let us count syllables in all kinds of words.</p>

<h3>📚 New Concept</h3>
<p>Here is a trick: <strong>put your hand under your chin</strong>. Say the word. Every time your chin drops down, that is one syllable!</p>
<ul>
<li><strong>dog</strong> — chin drops 1 time = 1 syllable</li>
<li><strong>teacher</strong> — teach-er = 2 syllables</li>
<li><strong>beautiful</strong> — beau-ti-ful = 3 syllables</li>
<li><strong>caterpillar</strong> — cat-er-pil-lar = 4 syllables</li>
</ul>
<p><strong>Nigerian words:</strong></p>
<ul>
<li><strong>yam</strong> = 1 syllable</li>
<li><strong>suya</strong> = su-ya = 2 syllables</li>
<li><strong>Nigeria</strong> = Ni-ge-ri-a = 4 syllables</li>
<li><strong>Abuja</strong> = A-bu-ja = 3 syllables</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>How many syllables in the word <strong>market</strong>?</li>
<li>How many syllables in the word <strong>pineapple</strong>?</li>
<li>Which word has more syllables: <strong>bus</strong> or <strong>bicycle</strong>?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>mar-ket</strong> = 2 syllables.</li>
<li><strong>pine-ap-ple</strong> = 3 syllables.</li>
<li><strong>Bicycle</strong> (bi-cy-cle = 3) has more than <strong>bus</strong> (1).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Put your hand under your chin and say the word. Count how many times your chin drops — that is the number of syllables!</p>`,
        },
        {
          id: 'fl-1-10',
          title: 'Blending Syllables: Put the Parts Together',
          description: 'Learn to blend syllables back into whole words.',
          duration: 10,
          order: 10,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to put syllables together to make whole words. This is called <strong>blending</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Funke's teacher says word parts slowly: "wa... ter." Funke puts them together and shouts "water!" The teacher says "um... brel... la" and Funke says "umbrella!" Putting word parts together is like solving a puzzle.</p>

<h3>📚 New Concept</h3>
<p><strong>Blending</strong> means putting syllables together to make a word.</p>
<p><strong>Two-part words:</strong></p>
<ul>
<li>sis... ter = <strong>sister</strong></li>
<li>pen... cil = <strong>pencil</strong></li>
<li>riv... er = <strong>river</strong></li>
<li>mon... key = <strong>monkey</strong></li>
</ul>
<p><strong>Three-part words:</strong></p>
<ul>
<li>to... ma... to = <strong>tomato</strong></li>
<li>hos... pi... tal = <strong>hospital</strong></li>
<li>beau... ti... ful = <strong>beautiful</strong></li>
</ul>
<p><strong>How to blend:</strong> Say the parts slowly, then faster, then quickly as one word. Slow: um... brel... la. Medium: um-brel-la. Fast: umbrella!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Blend these parts: <strong>rab... bit</strong>. What word is it?</li>
<li>Blend these parts: <strong>choc... o... late</strong>. What word is it?</li>
<li>Blend these parts: <strong>el... e... phant</strong>. What word is it?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>rabbit</strong></li>
<li><strong>chocolate</strong></li>
<li><strong>elephant</strong></li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Blending means putting syllables together to make a word. Say the parts slowly, then faster, until you hear the whole word!</p>`,
        },
        {
          id: 'fl-1-11',
          title: 'Sound Games: Odd One Out',
          description: 'Find the word that does not match the sound pattern.',
          duration: 10,
          order: 11,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will play sound games to find the word that does not belong — the <strong>odd one out</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Tunde, Bola, and Chidi are playing a game at break time. Tunde says three words: "cat, car, dog." Two start with the same sound, and one is different. "Dog" is the odd one out because cat and car both start with /k/, but dog starts with /d/.</p>

<h3>📚 New Concept</h3>
<p>In the <strong>Odd One Out</strong> game, you hear three words. Two words match and one is different.</p>
<p><strong>Beginning Sounds:</strong></p>
<ul>
<li><strong>ball, bat, sun</strong> — Odd one out: <strong>sun</strong> (ball and bat start with /b/)</li>
<li><strong>fish, fan, gate</strong> — Odd one out: <strong>gate</strong> (fish and fan start with /f/)</li>
<li><strong>red, map, moon</strong> — Odd one out: <strong>red</strong> (map and moon start with /m/)</li>
</ul>
<p><strong>Rhyming:</strong></p>
<ul>
<li><strong>cake, lake, tree</strong> — Odd one out: <strong>tree</strong> (cake and lake rhyme)</li>
<li><strong>king, ring, dog</strong> — Odd one out: <strong>dog</strong> (king and ring rhyme)</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Find the odd one out (beginning sound): <strong>mango, milk, pen</strong>.</li>
<li>Find the odd one out (rhyming): <strong>fun, sun, bat</strong>.</li>
<li>Find the odd one out (beginning sound): <strong>door, dish, ring</strong>.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>Pen</strong> is the odd one out. Mango and milk both start with /m/.</li>
<li><strong>Bat</strong> is the odd one out. Fun and sun rhyme (-un).</li>
<li><strong>Ring</strong> is the odd one out. Door and dish both start with /d/.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>In Odd One Out, listen carefully to find which word sounds different from the other two!</p>`,
        },
        {
          id: 'fl-1-12',
          title: 'Sound Review: Listening Champion',
          description: 'Review everything you have learned about sounds.',
          duration: 12,
          order: 12,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review all the sound skills you have learned and show you are a <strong>Listening Champion</strong>!</p>

<h3>🌟 Let's Start</h3>
<p>Congratulations! You have learned so many sound skills. Amina, Emeka, Bola, Chidi, Funke, and Tunde are all proud of you. Let us review everything!</p>

<h3>📚 New Concept</h3>
<p><strong>Your sound skills:</strong></p>
<p><strong>1. Beginning sounds:</strong> You can hear the first sound in any word. The beginning sound of <em>school</em> is /s/.</p>
<p><strong>2. Ending sounds:</strong> You can hear the last sound in any word. The ending sound of <em>drum</em> is /m/.</p>
<p><strong>3. Rhyming:</strong> You know words that sound the same at the end. <em>Cat</em> and <em>hat</em> rhyme.</p>
<p><strong>4. Making rhymes:</strong> You can create new rhyming words. From -op: hop, mop, top, pop.</p>
<p><strong>5. Syllables:</strong> You can break words into parts and count them. <em>Banana</em> = ba-na-na = 3 syllables.</p>
<p><strong>6. Blending:</strong> You can put syllables together. Hos-pi-tal = hospital.</p>
<p><strong>7. Odd One Out:</strong> You can find which word does not match.</p>
<p>These skills are the <strong>foundation of reading</strong>. You are getting ready to become a reader!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is the beginning sound of <strong>plantain</strong> and the ending sound of <strong>yam</strong>?</li>
<li>How many syllables are in the word <strong>watermelon</strong>?</li>
<li>Name two words that rhyme with <strong>night</strong>.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The beginning sound of <strong>plantain</strong> is /p/. The ending sound of <strong>yam</strong> is /m/.</li>
<li><strong>wa-ter-mel-on</strong> = 4 syllables.</li>
<li>Words that rhyme with <strong>night</strong>: light, right, fight, sight, might (any two are correct).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You are a Listening Champion! You can hear beginning sounds, ending sounds, rhymes, and syllables. These are the building blocks of reading!</p>`,
        },
      ],
    },
    {
      id: 'fl-unit-2',
      title: 'Vocabulary Building',
      description: 'Learn new words about your body, family, home, market, school, and the world around you.',
      order: 2,
      lessons: [
        {
          id: 'fl-2-1',
          title: 'My Body: Head to Toe',
          description: 'Learn the English words for parts of your body.',
          duration: 10,
          order: 1,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for the parts of your body, from your head down to your toes.</p>

<h3>🌟 Let's Start</h3>
<p>Amina is standing in front of the mirror. She points to the top of herself and says "head!" Then she touches her nose and says "nose!" Knowing the names of body parts in English is very useful — at the doctor, at school, and every day. Let us learn them together.</p>

<h3>📚 New Concept</h3>
<p><strong>Body part words:</strong></p>
<ul>
<li><strong>Head</strong> — the top part of your body, where your brain is</li>
<li><strong>Hair</strong> — it grows on top of your head</li>
<li><strong>Eyes</strong> — you use them to see</li>
<li><strong>Ears</strong> — you use them to hear</li>
<li><strong>Nose</strong> — you use it to smell</li>
<li><strong>Mouth</strong> — you use it to eat and talk</li>
<li><strong>Hands</strong> — at the end of your arms, you use them to hold things</li>
<li><strong>Legs</strong> — you use them to walk and run</li>
</ul>
<p><strong>Using body words in sentences:</strong></p>
<ul>
<li>"I wash my <strong>hands</strong> before I eat."</li>
<li>"Emeka has brown <strong>eyes</strong>."</li>
<li>"I use my <strong>ears</strong> to listen to my teacher."</li>
<li>"Bola combs her <strong>hair</strong> every morning."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What body part do you use to see?</li>
<li>Fill in the blank: "I kick the ball with my ___."</li>
<li>Touch your nose. Now touch your ears. What are two differences between them?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You use your <strong>eyes</strong> to see.</li>
<li>"I kick the ball with my <strong>legs</strong> (or feet)."</li>
<li>Your nose is in the middle of your face and you have one nose. Your ears are on the sides of your head and you have two ears. Your nose is for smelling and your ears are for hearing.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Your body has many parts and each one has a name. Head, eyes, ears, nose, mouth, hands, legs — now you know them all in English!</p>`,
        },
        {
          id: 'fl-2-2',
          title: 'Staying Healthy: Health Words',
          description: 'Learn words about health, hygiene, and staying well.',
          duration: 10,
          order: 2,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn English words about health and staying clean and strong.</p>

<h3>🌟 Let's Start</h3>
<p>Chidi's mother always says, "Wash your hands with soap and water!" She knows that staying clean keeps Chidi healthy. At school, the nurse checks the children to make sure they are well. Let us learn the words for staying healthy.</p>

<h3>📚 New Concept</h3>
<p><strong>Health words:</strong></p>
<ul>
<li><strong>Healthy</strong> — when your body feels good and strong</li>
<li><strong>Sick</strong> — when your body does not feel well</li>
<li><strong>Medicine</strong> — what the doctor gives you when you are sick</li>
<li><strong>Doctor</strong> — a person who helps sick people get better</li>
<li><strong>Soap</strong> — you use it to wash and kill germs</li>
<li><strong>Water</strong> — you drink it and use it to wash</li>
<li><strong>Clean</strong> — free from dirt and germs</li>
<li><strong>Exercise</strong> — moving your body to stay strong</li>
</ul>
<p><strong>Using health words in sentences:</strong></p>
<ul>
<li>"I drink <strong>water</strong> every day to stay <strong>healthy</strong>."</li>
<li>"When Funke was <strong>sick</strong>, her mother took her to the <strong>doctor</strong>."</li>
<li>"Wash your hands with <strong>soap</strong> to keep them <strong>clean</strong>."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What do you use to wash your hands and kill germs?</li>
<li>Who do you visit when you are sick?</li>
<li>Fill in the blank: "Running and jumping are types of ___."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You use <strong>soap</strong> (and water) to wash your hands and kill germs.</li>
<li>You visit a <strong>doctor</strong> when you are sick.</li>
<li>"Running and jumping are types of <strong>exercise</strong>."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Staying healthy means keeping clean, drinking water, eating good food, and exercising. If you are sick, a doctor can help with medicine.</p>`,
        },
        {
          id: 'fl-2-3',
          title: 'My Family: Who Lives With Me?',
          description: 'Learn the English words for family members.',
          duration: 10,
          order: 3,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for the people in your family.</p>

<h3>🌟 Let's Start</h3>
<p>Bola loves her family! She lives with her mother, her father, her grandmother, and her two brothers. Every family is different — some are big and some are small. But every family is special. Let us learn the English words for family members.</p>

<h3>📚 New Concept</h3>
<p><strong>Family words:</strong></p>
<ul>
<li><strong>Mother (Mama)</strong> — the woman who gave birth to you or takes care of you</li>
<li><strong>Father (Papa)</strong> — the man who is your parent</li>
<li><strong>Brother</strong> — a boy who has the same parents as you</li>
<li><strong>Sister</strong> — a girl who has the same parents as you</li>
<li><strong>Grandmother (Grandma)</strong> — your mother's or father's mother</li>
<li><strong>Grandfather (Grandpa)</strong> — your mother's or father's father</li>
<li><strong>Uncle</strong> — your mother's or father's brother</li>
<li><strong>Aunt</strong> — your mother's or father's sister</li>
</ul>
<p><strong>Using family words in sentences:</strong></p>
<ul>
<li>"My <strong>mother</strong> cooks delicious jollof rice."</li>
<li>"I have two <strong>brothers</strong> and one <strong>sister</strong>."</li>
<li>"My <strong>grandmother</strong> tells us stories at night."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What do you call your mother's mother?</li>
<li>What do you call your father's brother?</li>
<li>Fill in the blank: "My ___ is a girl with the same parents as me."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Your mother's mother is your <strong>grandmother</strong>.</li>
<li>Your father's brother is your <strong>uncle</strong>.</li>
<li>"My <strong>sister</strong> is a girl with the same parents as me."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Your family includes your mother, father, brothers, sisters, grandparents, uncles, and aunts. Every family is special and important!</p>`,
        },
        {
          id: 'fl-2-4',
          title: 'My Home: Things in the House',
          description: 'Learn the English words for things you find at home.',
          duration: 10,
          order: 4,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for things you see and use at home every day.</p>

<h3>🌟 Let's Start</h3>
<p>Tunde walks around his house and looks at everything. There is a table where the family eats, a chair where his father sits, and a bed where Tunde sleeps. Every item in the house has a name. Let us learn these names in English!</p>

<h3>📚 New Concept</h3>
<p><strong>Home words:</strong></p>
<ul>
<li><strong>Door</strong> — you open it to go in or out of a room</li>
<li><strong>Window</strong> — you look through it to see outside</li>
<li><strong>Table</strong> — you put things on it and eat at it</li>
<li><strong>Chair</strong> — you sit on it</li>
<li><strong>Bed</strong> — you sleep on it</li>
<li><strong>Cup</strong> — you drink from it</li>
<li><strong>Plate</strong> — you put food on it</li>
<li><strong>Pot</strong> — you cook food in it</li>
</ul>
<p><strong>Using home words in sentences:</strong></p>
<ul>
<li>"Please close the <strong>door</strong>."</li>
<li>"The food is on the <strong>table</strong>."</li>
<li>"Emeka sits on a <strong>chair</strong> to do his homework."</li>
<li>"Mother cooks soup in a big <strong>pot</strong>."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What do you sleep on at night?</li>
<li>What do you look through to see outside?</li>
<li>Fill in the blank: "I drink water from a ___."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You sleep on a <strong>bed</strong>.</li>
<li>You look through a <strong>window</strong> to see outside.</li>
<li>"I drink water from a <strong>cup</strong>."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Your home is full of things with English names — door, window, table, chair, bed, cup, plate, and pot. Try to use these words every day!</p>`,
        },
        {
          id: 'fl-2-5',
          title: 'At the Market: Trading Words',
          description: 'Learn words used when buying and selling at the market.',
          duration: 10,
          order: 5,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn English words used at the market when people buy and sell things.</p>

<h3>🌟 Let's Start</h3>
<p>Amina goes to Balogun Market in Lagos with her mother every Saturday. The market is busy and colourful! People are buying tomatoes, selling clothes, and counting money. The market is a great place to learn new words.</p>

<h3>📚 New Concept</h3>
<p><strong>Market words:</strong></p>
<ul>
<li><strong>Buy</strong> — to give money and get something</li>
<li><strong>Sell</strong> — to give something and receive money</li>
<li><strong>Money</strong> — Naira and kobo, what you use to pay</li>
<li><strong>Price</strong> — how much something costs</li>
<li><strong>Cheap</strong> — when the price is low</li>
<li><strong>Expensive</strong> — when the price is high</li>
<li><strong>Customer</strong> — a person who buys things</li>
<li><strong>Trader</strong> — a person who sells things</li>
</ul>
<p><strong>Using market words in sentences:</strong></p>
<ul>
<li>"Mama wants to <strong>buy</strong> tomatoes at the market."</li>
<li>"The <strong>trader</strong> said the <strong>price</strong> is 500 Naira."</li>
<li>"That bag is too <strong>expensive</strong>, let us find a <strong>cheap</strong> one."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>If you give money and get rice, are you buying or selling?</li>
<li>What is the word for the person who sells things at the market?</li>
<li>Fill in the blank: "The ___ of the mango is 100 Naira."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You are <strong>buying</strong> — you give money and get something.</li>
<li>The person who sells things is called a <strong>trader</strong>.</li>
<li>"The <strong>price</strong> of the mango is 100 Naira."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>At the market, traders sell and customers buy. Everything has a price. Some things are cheap and some are expensive!</p>`,
        },
        {
          id: 'fl-2-6',
          title: 'Market Items: Food Words',
          description: 'Learn the English words for common foods in Nigeria.',
          duration: 10,
          order: 6,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for foods you see and eat every day in Nigeria.</p>

<h3>🌟 Let's Start</h3>
<p>Chidi's favourite food is jollof rice with fried plantain! His sister Ngozi loves pounded yam with egusi soup. Nigeria has so many delicious foods. Let us learn their names in English.</p>

<h3>📚 New Concept</h3>
<p><strong>Food words:</strong></p>
<ul>
<li><strong>Rice</strong> — small white grains, used in jollof rice and fried rice</li>
<li><strong>Yam</strong> — a large root vegetable, you can boil, fry, or pound it</li>
<li><strong>Plantain</strong> — looks like a big banana, you fry or boil it</li>
<li><strong>Beans</strong> — small seeds you cook and eat, very healthy</li>
<li><strong>Fish</strong> — comes from rivers and the sea</li>
<li><strong>Chicken</strong> — a bird you can cook and eat</li>
<li><strong>Tomato</strong> — a red fruit used to make stew</li>
<li><strong>Pepper</strong> — makes food spicy and hot</li>
</ul>
<p><strong>Using food words in sentences:</strong></p>
<ul>
<li>"We eat <strong>rice</strong> and <strong>beans</strong> for lunch."</li>
<li>"Mother fried the <strong>plantain</strong> until it was golden."</li>
<li>"The stew has <strong>tomato</strong>, <strong>pepper</strong>, and <strong>fish</strong> in it."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Name two foods you eat that come from plants.</li>
<li>What food makes stew spicy?</li>
<li>Fill in the blank: "Bola eats ___ rice with fried ___."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Foods from plants include: <strong>rice, yam, plantain, beans, tomato, pepper</strong> (any two are correct).</li>
<li><strong>Pepper</strong> makes stew spicy.</li>
<li>"Bola eats <strong>jollof</strong> rice with fried <strong>plantain</strong>." (or other correct food words)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Nigeria has many wonderful foods — rice, yam, plantain, beans, fish, chicken, tomato, and pepper. Knowing food words in English helps you everywhere!</p>`,
        },
        {
          id: 'fl-2-7',
          title: 'Getting Around: Transport Words',
          description: 'Learn the English words for ways people travel.',
          duration: 10,
          order: 7,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for the different ways people get from one place to another.</p>

<h3>🌟 Let's Start</h3>
<p>Funke takes a yellow bus called a danfo to school every morning. Her neighbour Tunde rides on the back of an okada. On the highway, big trucks carry goods to the market. People travel in many different ways!</p>

<h3>📚 New Concept</h3>
<p><strong>Transport words:</strong></p>
<ul>
<li><strong>Car</strong> — a vehicle with four wheels for carrying people</li>
<li><strong>Bus</strong> — a large vehicle that carries many people (like a danfo)</li>
<li><strong>Bicycle</strong> — you pedal it with your feet, it has two wheels</li>
<li><strong>Motorcycle</strong> — a fast two-wheeled vehicle (okada)</li>
<li><strong>Truck</strong> — a big vehicle that carries heavy things</li>
<li><strong>Boat</strong> — travels on water</li>
<li><strong>Walk</strong> — to travel using your legs and feet</li>
<li><strong>Road</strong> — the path that cars and buses drive on</li>
</ul>
<p><strong>Using transport words in sentences:</strong></p>
<ul>
<li>"Emeka rides his <strong>bicycle</strong> to school."</li>
<li>"The <strong>bus</strong> is full of passengers."</li>
<li>"We <strong>walk</strong> to the market because it is not far."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What do you call a vehicle that travels on water?</li>
<li>How many wheels does a bicycle have?</li>
<li>Fill in the blank: "The big ___ carries bags of rice to the market."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>A vehicle that travels on water is a <strong>boat</strong>.</li>
<li>A bicycle has <strong>two</strong> wheels.</li>
<li>"The big <strong>truck</strong> carries bags of rice to the market."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>People travel by car, bus, bicycle, motorcycle, truck, boat, or on foot. These are all types of transport!</p>`,
        },
        {
          id: 'fl-2-8',
          title: 'My School: Classroom Words',
          description: 'Learn the English words for things at school.',
          duration: 10,
          order: 8,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for things you see and use at school every day.</p>

<h3>🌟 Let's Start</h3>
<p>Tunde loves going to school! He carries his bag with his books and pencils inside. At school, he sits at a desk and the teacher writes on the board. School is where you learn new things, and knowing school words in English will help you.</p>

<h3>📚 New Concept</h3>
<p><strong>School words:</strong></p>
<ul>
<li><strong>Teacher</strong> — the person who teaches you at school</li>
<li><strong>Student</strong> — a child who goes to school to learn (that is you!)</li>
<li><strong>Book</strong> — you read it to learn new things</li>
<li><strong>Pencil</strong> — you write with it</li>
<li><strong>Desk</strong> — a table where you sit and work</li>
<li><strong>Board</strong> — the teacher writes on it at the front of the class</li>
<li><strong>Bag</strong> — you carry your books and pencils in it</li>
<li><strong>Classroom</strong> — the room where you learn</li>
</ul>
<p><strong>Using school words in sentences:</strong></p>
<ul>
<li>"The <strong>teacher</strong> wrote the lesson on the <strong>board</strong>."</li>
<li>"I put my <strong>book</strong> and <strong>pencil</strong> in my <strong>bag</strong>."</li>
<li>"Every <strong>student</strong> has a <strong>desk</strong> in the <strong>classroom</strong>."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What do you write with?</li>
<li>What do you call the room where you learn?</li>
<li>Fill in the blank: "The ___ teaches the students in the classroom."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>You write with a <strong>pencil</strong>.</li>
<li>The room where you learn is called a <strong>classroom</strong>.</li>
<li>"The <strong>teacher</strong> teaches the students in the classroom."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>At school you are a student. You use books, pencils, desks, and boards. Your teacher helps you learn in the classroom!</p>`,
        },
        {
          id: 'fl-2-9',
          title: 'Nature: Animals Around Us',
          description: 'Learn the English words for common animals.',
          duration: 10,
          order: 9,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the English words for animals you might see in Nigeria.</p>

<h3>🌟 Let's Start</h3>
<p>Amina has a pet goat at home. Her neighbour has chickens that lay eggs every morning. At the river, she sometimes sees big lizards! Animals are all around us. Let us learn their names in English.</p>

<h3>📚 New Concept</h3>
<p><strong>Animal words:</strong></p>
<ul>
<li><strong>Goat</strong> — it gives milk and says "maa maa"</li>
<li><strong>Chicken</strong> — a bird that lays eggs</li>
<li><strong>Dog</strong> — a pet that barks and guards the house</li>
<li><strong>Cat</strong> — a pet that catches mice</li>
<li><strong>Cow</strong> — a large animal that gives milk</li>
<li><strong>Fish</strong> — it lives in water and swims</li>
<li><strong>Bird</strong> — it has wings and can fly</li>
<li><strong>Lizard</strong> — a small animal with four legs and a long tail</li>
</ul>
<p><strong>Using animal words in sentences:</strong></p>
<ul>
<li>"The <strong>goat</strong> eats grass in the yard."</li>
<li>"I saw a <strong>bird</strong> flying over the tree."</li>
<li>"The <strong>dog</strong> barks when a stranger comes."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Which animal lives in water?</li>
<li>Which animal lays eggs?</li>
<li>Fill in the blank: "The ___ catches mice in our house."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>A <strong>fish</strong> lives in water.</li>
<li>A <strong>chicken</strong> lays eggs.</li>
<li>"The <strong>cat</strong> catches mice in our house."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Animals are living things around us — goats, chickens, dogs, cats, cows, fish, birds, and lizards. Each one has a name in English!</p>`,
        },
        {
          id: 'fl-2-10',
          title: 'Nature: Plants and Weather',
          description: 'Learn the English words for plants, trees, and weather.',
          duration: 10,
          order: 10,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn English words about plants, trees, and the weather.</p>

<h3>🌟 Let's Start</h3>
<p>Emeka looks outside. The sun is shining brightly. There are tall trees near the school, and flowers are growing in the garden. In Nigeria, we have a rainy season and a dry season. Let us learn the words for nature and weather!</p>

<h3>📚 New Concept</h3>
<p><strong>Plant words:</strong></p>
<ul>
<li><strong>Tree</strong> — a tall plant with a trunk, branches, and leaves</li>
<li><strong>Flower</strong> — the colourful part of a plant</li>
<li><strong>Leaf</strong> — the green flat part of a plant (many leaves = leaves)</li>
<li><strong>Grass</strong> — short green plants that cover the ground</li>
</ul>
<p><strong>Weather words:</strong></p>
<ul>
<li><strong>Sun</strong> — the bright ball in the sky that gives light and heat</li>
<li><strong>Rain</strong> — water that falls from the clouds</li>
<li><strong>Cloud</strong> — the white or grey shapes in the sky</li>
<li><strong>Wind</strong> — moving air that you can feel</li>
</ul>
<p><strong>Using nature words in sentences:</strong></p>
<ul>
<li>"The <strong>tree</strong> has many green <strong>leaves</strong>."</li>
<li>"The <strong>rain</strong> is falling from the <strong>clouds</strong>."</li>
<li>"The <strong>sun</strong> is hot today!"</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What falls from the clouds during the rainy season?</li>
<li>What is the colourful part of a plant called?</li>
<li>Fill in the blank: "The ___ is blowing the leaves off the tree."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>Rain</strong> falls from the clouds.</li>
<li>The colourful part of a plant is called a <strong>flower</strong>.</li>
<li>"The <strong>wind</strong> is blowing the leaves off the tree."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Nature includes trees, flowers, leaves, and grass. The weather can be sunny, rainy, cloudy, or windy. These are important English words to know!</p>`,
        },
        {
          id: 'fl-2-11',
          title: 'Describing Words: Big, Small, Fast, Slow',
          description: 'Learn adjectives — words that describe things.',
          duration: 10,
          order: 11,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn <strong>describing words</strong> (adjectives) that tell us more about things — their size, speed, colour, and shape.</p>

<h3>🌟 Let's Start</h3>
<p>Bola sees a <em>big</em> truck and a <em>small</em> car. She sees a <em>fast</em> okada and a <em>slow</em> bicycle. These words — big, small, fast, slow — are <strong>describing words</strong>. They tell us more about something.</p>

<h3>📚 New Concept</h3>
<p><strong>Describing words (adjectives):</strong></p>
<ul>
<li><strong>Big</strong> — large in size. "The elephant is <strong>big</strong>."</li>
<li><strong>Small</strong> — little in size. "The ant is <strong>small</strong>."</li>
<li><strong>Fast</strong> — moves quickly. "The car is <strong>fast</strong>."</li>
<li><strong>Slow</strong> — moves not quickly. "The tortoise is <strong>slow</strong>."</li>
<li><strong>Hot</strong> — very warm. "The sun is <strong>hot</strong>."</li>
<li><strong>Cold</strong> — not warm. "The water is <strong>cold</strong>."</li>
<li><strong>Happy</strong> — feeling good. "Amina is <strong>happy</strong>."</li>
<li><strong>Sad</strong> — feeling not good. "Chidi is <strong>sad</strong>."</li>
</ul>
<p>Describing words make our sentences more interesting. Compare:</p>
<ul>
<li>"I see a dog." vs. "I see a <strong>big, brown</strong> dog."</li>
<li>"The food is ready." vs. "The <strong>hot, delicious</strong> food is ready."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Is an elephant big or small?</li>
<li>Fill in the blank with a describing word: "The ___ tortoise walked across the road."</li>
<li>Use a describing word in this sentence: "Today the weather is very ___."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>An elephant is <strong>big</strong>.</li>
<li>"The <strong>slow</strong> tortoise walked across the road."</li>
<li>Answers may vary: "Today the weather is very <strong>hot</strong>," or "Today the weather is very <strong>cold</strong>."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Describing words tell us more about things. Big, small, fast, slow, hot, cold, happy, sad — they make your English more colourful!</p>`,
        },
        {
          id: 'fl-2-12',
          title: 'Action Words: Run, Jump, Eat, Sleep',
          description: 'Learn verbs — words that describe what people do.',
          duration: 10,
          order: 12,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn <strong>action words</strong> (verbs) — words that tell us what someone is doing.</p>

<h3>🌟 Let's Start</h3>
<p>Look at the children in the school compound. Tunde is <em>running</em>. Funke is <em>jumping</em>. Emeka is <em>eating</em> his lunch. Bola is <em>reading</em> a book. All these words — running, jumping, eating, reading — are <strong>action words</strong>. They tell us what people are doing.</p>

<h3>📚 New Concept</h3>
<p><strong>Action words (verbs):</strong></p>
<ul>
<li><strong>Run</strong> — to move your legs fast. "The children <strong>run</strong> on the field."</li>
<li><strong>Jump</strong> — to push your body up into the air. "The frog can <strong>jump</strong> very high."</li>
<li><strong>Eat</strong> — to put food in your mouth and swallow it. "We <strong>eat</strong> lunch at noon."</li>
<li><strong>Sleep</strong> — to close your eyes and rest. "I <strong>sleep</strong> at night."</li>
<li><strong>Read</strong> — to look at words and understand them. "Amina likes to <strong>read</strong> books."</li>
<li><strong>Write</strong> — to make words with a pencil. "Please <strong>write</strong> your name."</li>
<li><strong>Walk</strong> — to move on your feet, not fast. "I <strong>walk</strong> to school."</li>
<li><strong>Play</strong> — to have fun with games or toys. "The children <strong>play</strong> football."</li>
</ul>
<p>Every sentence needs an action word! The action word tells us what is happening.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What action word means "to move your legs fast"?</li>
<li>Fill in the blank: "At night, I ___ in my bed."</li>
<li>Name two things you do at school (use action words).</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The action word is <strong>run</strong>.</li>
<li>"At night, I <strong>sleep</strong> in my bed."</li>
<li>At school you might: <strong>read</strong> books, <strong>write</strong> in your exercise book, <strong>play</strong> with friends, <strong>eat</strong> lunch (any two are correct).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Action words tell us what people do — run, jump, eat, sleep, read, write, walk, play. Every sentence needs an action word!</p>`,
        },
      ],
    },
    {
      id: 'fl-unit-3',
      title: 'Listening Comprehension',
      description: 'Listen to stories set in Nigeria and answer questions to build understanding skills.',
      order: 3,
      lessons: [
        {
          id: 'fl-3-1',
          title: 'Amina Goes to the Market',
          description: 'Listen to a story and retell events in order.',
          duration: 12,
          order: 1,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a story and practise telling what happened <strong>first, next, and last</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Have you ever gone to the market with someone in your family? Markets are exciting places with lots of sounds, colours, and people. Today we will hear a story about Amina and her trip to the market.</p>

<h3>📚 The Story</h3>
<p>One Saturday morning, <strong>Amina</strong> woke up early. Her mother said, "Today we are going to Oyingbo Market to buy food for the week." Amina was excited!</p>
<p><strong>First</strong>, Amina and her mother took a yellow danfo bus to the market. The bus was crowded, but they found a seat near the window.</p>
<p><strong>Next</strong>, they arrived at the market. It was very busy! They walked to the vegetable section. Amina's mother bought tomatoes, peppers, and onions from a friendly trader. The trader gave Amina a small tomato as a gift.</p>
<p><strong>Then</strong>, they went to buy rice and beans. Amina helped carry the bag of beans. She felt proud and strong.</p>
<p><strong>Finally</strong>, they took another danfo bus home. Amina helped her mother put all the food in the kitchen. "Thank you for helping me," her mother said with a big smile.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What did Amina and her mother do <strong>first</strong>?</li>
<li>What did the trader give Amina as a gift?</li>
<li>What did Amina do at the end of the story?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>First</strong>, Amina and her mother took a danfo bus to the market.</li>
<li>The trader gave Amina a small <strong>tomato</strong> as a gift.</li>
<li>At the end, Amina helped her mother put all the food in the kitchen.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When you listen to a story, think about what happened first, next, then, and finally. This helps you understand and retell the story!</p>`,
        },
        {
          id: 'fl-3-2',
          title: 'Emeka and the Lost Goat',
          description: 'Listen to a story about solving a problem.',
          duration: 12,
          order: 2,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a story and identify the <strong>problem</strong> and the <strong>solution</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>In stories, characters often have a problem they need to solve. Today we will hear about Emeka and a big problem he had with his family's goat. Listen carefully for what went wrong and how Emeka fixed it.</p>

<h3>📚 The Story</h3>
<p><strong>Emeka</strong> lived in a small village outside Enugu. His family had a white goat named Nkem. Every day, Emeka tied Nkem to a tree so she could eat grass.</p>
<p>One afternoon, Emeka came home from school and looked for Nkem. But Nkem was gone! The rope was broken, and the goat had run away. <strong>This was the problem.</strong></p>
<p>Emeka was very worried. His father would be upset if Nkem was lost. Emeka ran to his neighbour, Mama Eze, and asked, "Have you seen a white goat?" Mama Eze said, "Yes! A white goat went towards the stream."</p>
<p>Emeka ran to the stream. There was Nkem, drinking water happily! Emeka gently took Nkem and led her home. He tied her with a stronger rope this time. <strong>This was the solution.</strong></p>
<p>When his father came home, Emeka told him what happened. His father smiled and said, "You were brave and smart to find Nkem. Well done!"</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What was the <strong>problem</strong> in the story?</li>
<li>How did Emeka <strong>solve</strong> the problem?</li>
<li>How do you think Emeka felt when he found Nkem?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The problem was that Nkem the goat broke her rope and ran away.</li>
<li>Emeka asked his neighbour where the goat went, then found Nkem at the stream and brought her home with a stronger rope.</li>
<li>Emeka probably felt <strong>happy</strong> and <strong>relieved</strong> when he found Nkem.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every story has a problem and a solution. The problem is what goes wrong. The solution is how it gets fixed. Listen for both!</p>`,
        },
        {
          id: 'fl-3-3',
          title: 'The Kindest Girl in Lagos',
          description: 'Listen to a story and think about how characters feel.',
          duration: 12,
          order: 3,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a story and identify how the <strong>characters feel</strong> and why.</p>

<h3>🌟 Let's Start</h3>
<p>People in stories have feelings, just like you. They can be happy, sad, angry, scared, or proud. Today, listen to the story and think about how each character feels.</p>

<h3>📚 The Story</h3>
<p><strong>Adaeze</strong> was a girl who lived on a busy street in Lagos. Everyone in the neighbourhood called her "the kindest girl on the street."</p>
<p>One morning, a new girl named <strong>Kemi</strong> moved into the house next door. Kemi looked <strong>sad</strong> and <strong>scared</strong>. She did not know anyone. She sat alone on the step outside her door.</p>
<p>Adaeze saw Kemi and walked over to her. "Hello! My name is Adaeze. Would you like to play with me?" Kemi's face brightened. She felt <strong>surprised</strong> and <strong>happy</strong> that someone was being kind to her.</p>
<p>"Yes, please!" said Kemi. They played together all morning. Adaeze showed Kemi around the street and introduced her to the other children.</p>
<p>That evening, Kemi told her mother, "I love our new home! I have a friend named Adaeze." Kemi's mother felt <strong>relieved</strong> and <strong>grateful</strong>. Adaeze's mother felt <strong>proud</strong> when she heard what Adaeze had done.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>How did Kemi feel at the <strong>beginning</strong> of the story? Why?</li>
<li>How did Kemi feel at the <strong>end</strong> of the story? What changed?</li>
<li>Why was Adaeze called "the kindest girl on the street"?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Kemi felt <strong>sad and scared</strong> because she was new and did not know anyone.</li>
<li>Kemi felt <strong>happy</strong> because Adaeze became her friend and showed her around.</li>
<li>Adaeze was called the kindest girl because she was friendly to everyone, especially to Kemi who was new and alone.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Characters in stories have feelings. Pay attention to how they feel and why. A kind action can change someone's feelings from sad to happy!</p>`,
        },
        {
          id: 'fl-3-4',
          title: "Bola's First Day at School",
          description: 'Listen to a story and practise predicting what happens next.',
          duration: 12,
          order: 4,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a story and practise <strong>predicting</strong> — guessing what might happen next.</p>

<h3>🌟 Let's Start</h3>
<p>Have you ever guessed what would happen in a story before it happened? That is called <strong>predicting</strong>. Good readers and listeners think ahead. Let us try it with Bola's story.</p>

<h3>📚 The Story</h3>
<p>Today was <strong>Bola's</strong> first day at a new school. She felt nervous. What if the other children did not like her? What if the teacher was strict?</p>
<p>Bola's mother held her hand and walked her to the school gate. "You will be fine," Mama said. "Be brave and smile."</p>
<p>Bola walked into the classroom. All the other children were already sitting down. The teacher, Mrs. Okafor, looked up and smiled. "Welcome! You must be Bola. Class, please welcome your new friend."</p>
<p>The children clapped. A girl in the front row waved and pointed to an empty seat next to her. "Sit here!" the girl whispered. Her name was Chioma.</p>
<p>At break time, Chioma said, "Come, I will show you the playground." Bola smiled. Maybe this new school would not be so bad after all.</p>
<p>By the end of the day, Bola had made three new friends. When her mother picked her up, Bola said, "Mama, I love my new school!"</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>At the beginning, how did Bola feel? What did you <strong>predict</strong> would happen?</li>
<li>Was the teacher strict or kind? How do you know?</li>
<li>If the story continued to the next day, what do you <strong>predict</strong> Bola would do?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Bola felt <strong>nervous</strong>. You might have predicted she would make friends because the title is about her first day (not her worst day!).</li>
<li>The teacher was <strong>kind</strong>. She smiled and welcomed Bola to the class.</li>
<li>Bola would probably go to school <strong>happily</strong> and play with her new friends, especially Chioma.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Predicting means thinking about what might happen next. Use clues from the story to make smart guesses!</p>`,
        },
        {
          id: 'fl-3-5',
          title: 'The Clever Tortoise',
          description: 'Listen to a Nigerian folktale and find the main idea.',
          duration: 12,
          order: 5,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a Nigerian folktale and find the <strong>main idea</strong> — what the story is mostly about.</p>

<h3>🌟 Let's Start</h3>
<p>In Nigeria, our grandparents and elders tell wonderful stories called folktales. One of the most famous characters is the <strong>Tortoise</strong>, who is very clever. Let us hear a folktale about him!</p>

<h3>📚 The Story</h3>
<p>Long ago, the animals had a contest. <strong>Elephant</strong> said, "I am the strongest! I should be the king." <strong>Lion</strong> roared, "No, I am the bravest! I should be king." <strong>Eagle</strong> said, "I can fly the highest! I should be king."</p>
<p>Little <strong>Tortoise</strong> said quietly, "I would like to try too." All the animals laughed. "You? You are small and slow!"</p>
<p>The wise old Owl set a challenge: "The one who can bring water from the river in a basket shall be king."</p>
<p>Elephant tried. The water poured through the holes. Lion tried. The water leaked out. Eagle tried. The water dripped away. They all failed.</p>
<p>Tortoise smiled. He went to the river, lined the basket with large banana leaves, and then filled it with water. The leaves stopped the water from leaking! He carried the basket back without spilling a single drop.</p>
<p>All the animals cheered. Tortoise became the king. He was not the biggest, fastest, or strongest — but he was the <strong>cleverest</strong>.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is the <strong>main idea</strong> of this story?</li>
<li>How did Tortoise solve the problem?</li>
<li>What lesson does this story teach?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The main idea is that being <strong>clever</strong> is more important than being the biggest or strongest.</li>
<li>Tortoise lined the basket with banana leaves to stop the water from leaking.</li>
<li>The lesson is: use your <strong>brain</strong> to solve problems. You do not have to be big or strong to succeed.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The main idea is what a story is mostly about. This folktale is about cleverness being more valuable than size or strength.</p>`,
        },
        {
          id: 'fl-3-6',
          title: 'Sharing at the Market',
          description: 'Listen to a story and understand cause and effect.',
          duration: 12,
          order: 6,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn about <strong>cause and effect</strong> — understanding why things happen in a story.</p>

<h3>🌟 Let's Start</h3>
<p>Sometimes one thing makes another thing happen. If you drop a glass, it breaks. Dropping the glass is the <strong>cause</strong>. The glass breaking is the <strong>effect</strong>. Let us find causes and effects in a story.</p>

<h3>📚 The Story</h3>
<p><strong>Tunde</strong> and his big sister <strong>Yemi</strong> were selling oranges at the market for their mother. They had a big basket with fifty oranges.</p>
<p>An old woman came by. She looked tired and hungry. "Please, I have no money, but I am very thirsty," she said. Yemi felt sorry for her and gave her two oranges for free. <strong>Because</strong> Yemi was kind, the old woman smiled and thanked her many times.</p>
<p>Later, a young boy tripped and knocked over their basket. Many oranges rolled onto the ground. <strong>Because</strong> the oranges fell, some of them got bruised and dirty. Tunde was upset.</p>
<p>But then, other traders nearby came to help. They picked up the oranges and cleaned them. One trader even gave Tunde five extra oranges from her own basket. <strong>Because</strong> Yemi had been kind earlier, the traders wanted to be kind too.</p>
<p>At the end of the day, Tunde and Yemi had sold all their oranges. They went home happy.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li><strong>Cause:</strong> Yemi gave the old woman oranges. <strong>Effect:</strong> What happened?</li>
<li><strong>Cause:</strong> The boy tripped and knocked the basket. <strong>Effect:</strong> What happened?</li>
<li>Why did the other traders help Tunde and Yemi?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The old woman felt happy and thanked Yemi.</li>
<li>The oranges rolled onto the ground and some got bruised.</li>
<li>The traders helped because they saw that Yemi was kind, and they wanted to be kind too.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Cause is WHY something happens. Effect is WHAT happens. Ask yourself: "Why did this happen?" to find the cause, and "What happened next?" to find the effect.</p>`,
        },
        {
          id: 'fl-3-7',
          title: "Chidi's Big Dream",
          description: 'Listen to a story and practise making inferences.',
          duration: 12,
          order: 7,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to make <strong>inferences</strong> — figuring out things the story does not say directly by using clues.</p>

<h3>🌟 Let's Start</h3>
<p>Sometimes a story does not tell you everything. You have to be a detective and figure some things out yourself! This is called making an <strong>inference</strong>. Let us practise with Chidi's story.</p>

<h3>📚 The Story</h3>
<p><strong>Chidi</strong> sat in the classroom looking out the window. His eyes were wide and shining. On his desk, he had drawn pictures of buildings — tall ones, short ones, bridges, and even a stadium.</p>
<p>When the teacher asked, "What do you want to be when you grow up?" every child answered. Some said doctor, some said teacher, some said pilot.</p>
<p>When it was Chidi's turn, he stood up and said proudly, "I want to design buildings that will make Nigeria proud. Like the ones I see in Lagos, but even bigger and more beautiful!"</p>
<p>His classmates clapped. The teacher smiled and said, "You should study hard in mathematics and science, Chidi. Those subjects will help you reach your dream."</p>
<p>That evening, Chidi asked his father for a ruler and pencil. He spent hours drawing a house with perfect straight lines. His little sister watched in amazement.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What does Chidi want to be when he grows up? (The story does not say the exact job title — you need to <strong>infer</strong> it.)</li>
<li>How do you know Chidi is serious about his dream? What clues does the story give?</li>
<li>Why did the teacher say Chidi should study mathematics and science?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Chidi wants to be an <strong>architect</strong> (someone who designs buildings). The story does not say "architect" but you can infer it from his love of drawing buildings.</li>
<li>Clues: He draws buildings in class, he asked for a ruler and pencil at home, and he spent hours practising. This shows he is serious and hardworking.</li>
<li>Because designing buildings requires knowledge of maths (for measurements) and science (for how buildings stay strong).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>An inference is figuring out something the story does not say directly. Use clues from the story and what you already know to make smart guesses!</p>`,
        },
        {
          id: 'fl-3-8',
          title: 'The Rainy Season',
          description: 'Listen to an informational text and learn facts.',
          duration: 12,
          order: 8,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to an <strong>informational text</strong> — a text that teaches you facts, not a made-up story.</p>

<h3>🌟 Let's Start</h3>
<p>Not all texts are stories. Some texts teach you real facts about the world. These are called <strong>informational texts</strong>. Today you will learn real facts about the rainy season in Nigeria.</p>

<h3>📚 Informational Text: The Rainy Season</h3>
<p>Nigeria has two main seasons: the <strong>rainy season</strong> and the <strong>dry season</strong>.</p>
<p>The rainy season in southern Nigeria usually lasts from <strong>April to October</strong>. In northern Nigeria, it is shorter — from about <strong>June to September</strong>. During this time, rain falls heavily, sometimes every day.</p>
<p>Rain is very important. It fills the rivers and streams with water. Farmers need rain to grow crops like yam, corn, and cassava. Without rain, the crops would die and there would not be enough food.</p>
<p>But too much rain can cause problems. Heavy rain can cause <strong>flooding</strong>, where water covers the roads and even enters houses. When it floods, it is hard to go to school or the market.</p>
<p>During the rainy season, many children carry <strong>umbrellas</strong> to school. Some wear rubber boots to keep their feet dry. The air feels cool and fresh after it rains.</p>
<p>The rainy season is also when mosquitoes come out. Mosquitoes breed in standing water. That is why it is important to cover water containers and sleep under a mosquito net.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Name the two main seasons in Nigeria.</li>
<li>Why is rain important for farmers?</li>
<li>What problem can too much rain cause?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The two main seasons are the <strong>rainy season</strong> and the <strong>dry season</strong>.</li>
<li>Rain is important because farmers need it to <strong>grow crops</strong> like yam, corn, and cassava.</li>
<li>Too much rain can cause <strong>flooding</strong>, where water covers roads and enters houses.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Informational texts teach you real facts. When you listen, look for the most important facts and remember them!</p>`,
        },
        {
          id: 'fl-3-9',
          title: "Grandma's Jollof Rice Recipe",
          description: 'Listen to a recipe and practise sequencing steps.',
          duration: 12,
          order: 9,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will listen to a set of steps and put them in the correct <strong>sequence</strong> (order).</p>

<h3>🌟 Let's Start</h3>
<p>When you follow a recipe, you must do things in the right order. You cannot eat the food before you cook it! Today, Grandma is teaching us to make jollof rice. Listen carefully to the steps.</p>

<h3>📚 Grandma's Recipe</h3>
<p><strong>Grandma Nneka</strong> is the best cook in the family. Everyone loves her jollof rice. Here is how she makes it:</p>
<p><strong>Step 1:</strong> First, Grandma washes the rice in clean water. She washes it three times until the water is clear.</p>
<p><strong>Step 2:</strong> Next, she blends the tomatoes, peppers, and onions together to make a smooth paste.</p>
<p><strong>Step 3:</strong> Then, she puts oil in a big pot and heats it on the fire. She fries the onions until they are golden.</p>
<p><strong>Step 4:</strong> After that, she adds the tomato paste to the pot and cooks it until the oil floats on top. This is called "frying the tomato."</p>
<p><strong>Step 5:</strong> Then, she adds water, salt, and seasoning cubes to the pot.</p>
<p><strong>Step 6:</strong> When the water boils, she pours in the washed rice, covers the pot tightly, and turns the fire down low.</p>
<p><strong>Step 7:</strong> Finally, after about 30 minutes, the rice is done! Grandma opens the pot and the delicious smell fills the whole house.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What does Grandma do <strong>first</strong>?</li>
<li>What does she do <strong>after</strong> she fries the onions?</li>
<li>What is the <strong>last</strong> step?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>First, Grandma <strong>washes the rice</strong> in clean water.</li>
<li>After frying the onions, she <strong>adds the tomato paste</strong> and cooks it.</li>
<li>The last step is waiting 30 minutes, then opening the pot — the <strong>rice is done</strong>!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Sequencing means putting steps in the right order. Words like first, next, then, after that, and finally help you follow the sequence!</p>`,
        },
        {
          id: 'fl-3-10',
          title: 'Story Review: Listening Detective',
          description: 'Review all listening comprehension skills with a final story.',
          duration: 12,
          order: 10,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will use ALL your listening skills — sequence, problem/solution, feelings, predicting, main idea, cause/effect, inference, and facts — to understand one final story.</p>

<h3>🌟 Let's Start</h3>
<p>You are now a <strong>Listening Detective</strong>! A detective finds clues and solves mysteries. Today you will use all your skills to understand a story completely.</p>

<h3>📚 The Story: The School Garden</h3>
<p>The students at Bright Future Primary School in Ibadan wanted to grow a garden, but there was no money to buy seeds. <strong>This was the problem.</strong></p>
<p><strong>First</strong>, Funke had an idea. "Let us ask our families for seeds from their kitchens!" The children collected tomato seeds, pepper seeds, and watermelon seeds from home.</p>
<p><strong>Next</strong>, Mr. Abiola, the science teacher, showed them how to prepare the soil. They dug, raked, and planted the seeds in neat rows. <strong>Because</strong> they watered the seeds every day, small green shoots appeared after two weeks.</p>
<p><strong>Then</strong>, a big rainstorm came and washed away some of the plants. The children felt <strong>sad</strong> and <strong>disappointed</strong>. But Funke said, "Let us not give up. We can plant again!"</p>
<p>They replanted and built a small fence to protect the garden. <strong>Finally</strong>, after two months, the garden was full of tomatoes, peppers, and even a watermelon! The children felt <strong>proud</strong> and <strong>happy</strong>.</p>
<p>The <strong>main idea</strong> of this story is that hard work and not giving up can help you achieve great things.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What was the <strong>problem</strong> and the <strong>solution</strong>?</li>
<li><strong>Cause and effect:</strong> Why did the plants grow?</li>
<li>What can you <strong>infer</strong> about Funke's personality?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>Problem:</strong> No money for seeds. <strong>Solution:</strong> They collected seeds from home.</li>
<li>The plants grew <strong>because</strong> the children watered them every day.</li>
<li>You can infer that Funke is a <strong>leader</strong> — she comes up with ideas and encourages others not to give up.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You are a Listening Detective! You can find the sequence, problem, solution, feelings, causes, effects, main idea, and inferences in any story. Amazing work!</p>`,
        },
      ],
    },
    {
      id: 'fl-unit-4',
      title: 'Oral English & Grammar',
      description: 'Learn to speak in full sentences using correct English grammar.',
      order: 4,
      lessons: [
        {
          id: 'fl-4-1',
          title: 'Speaking in Full Sentences',
          description: 'Learn to express ideas using complete sentences.',
          duration: 10,
          order: 1,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to speak in <strong>full sentences</strong> instead of single words or short phrases.</p>

<h3>🌟 Let's Start</h3>
<p>When the teacher asks Amina, "Where do you live?" Amina could say just "Lagos." But a full sentence sounds much better: "I live in Lagos." A full sentence tells a complete idea. Let us practise speaking in full sentences!</p>

<h3>📚 New Concept</h3>
<p>A <strong>full sentence</strong> has two important parts:</p>
<ul>
<li><strong>Who or what</strong> (the subject) — the person or thing you are talking about</li>
<li><strong>What they do</strong> (the verb) — the action or state</li>
</ul>
<p><strong>Not a sentence:</strong> "The market." (Who does what? We do not know.)</p>
<p><strong>Full sentence:</strong> "I go to the market." (Who? I. What do I do? Go to the market.)</p>
<p><strong>More examples:</strong></p>
<ul>
<li>Not full: "Rice." Full: "<strong>I eat rice for lunch.</strong>"</li>
<li>Not full: "School." Full: "<strong>Emeka walks to school every day.</strong>"</li>
<li>Not full: "Happy." Full: "<strong>Bola is happy today.</strong>"</li>
<li>Not full: "Two brothers." Full: "<strong>I have two brothers.</strong>"</li>
</ul>
<p>A full sentence starts with a <strong>capital letter</strong> and ends with a <strong>full stop</strong> (period).</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Change this to a full sentence: "Mango."</li>
<li>Change this to a full sentence: "Football."</li>
<li>Is this a full sentence? "She reads a book."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"<strong>I like to eat mango.</strong>" (or any full sentence about mango)</li>
<li>"<strong>The boys play football after school.</strong>" (or any full sentence about football)</li>
<li>YES — "She reads a book" is a full sentence. It has a subject (she) and a verb (reads).</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>A full sentence tells a complete idea. It has a subject (who) and a verb (what they do). Always try to speak in full sentences!</p>`,
        },
        {
          id: 'fl-4-2',
          title: 'Subject and Verb: Who Does What?',
          description: 'Learn to identify the subject and verb in a sentence.',
          duration: 10,
          order: 2,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to find the <strong>subject</strong> (who) and the <strong>verb</strong> (what they do) in a sentence.</p>

<h3>🌟 Let's Start</h3>
<p>Every sentence is like a tiny story. It tells you WHO does WHAT. "Funke sings." Who? Funke. What does she do? She sings. That is the subject and the verb!</p>

<h3>📚 New Concept</h3>
<p>The <strong>subject</strong> is the person or thing doing the action. The <strong>verb</strong> is the action word.</p>
<ul>
<li>"<strong>Tunde</strong> <em>runs</em> fast." Subject: Tunde. Verb: runs.</li>
<li>"<strong>The dog</strong> <em>barks</em> loudly." Subject: The dog. Verb: barks.</li>
<li>"<strong>My mother</strong> <em>cooks</em> dinner." Subject: My mother. Verb: cooks.</li>
<li>"<strong>The children</strong> <em>play</em> football." Subject: The children. Verb: play.</li>
<li>"<strong>Rain</strong> <em>falls</em> from the sky." Subject: Rain. Verb: falls.</li>
</ul>
<p><strong>To find the subject:</strong> Ask "Who or what is doing something?"</p>
<p><strong>To find the verb:</strong> Ask "What are they doing?"</p>
<p>The subject usually comes first, and the verb comes after it.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>"Amina eats breakfast." What is the subject? What is the verb?</li>
<li>"The bird flies high." What is the subject? What is the verb?</li>
<li>Make a sentence with the subject "Chidi" and the verb "reads."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Subject: <strong>Amina</strong>. Verb: <strong>eats</strong>.</li>
<li>Subject: <strong>The bird</strong>. Verb: <strong>flies</strong>.</li>
<li>"<strong>Chidi reads a book every evening.</strong>" (or any sentence with Chidi as subject and reads as verb)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every sentence needs a subject (who) and a verb (what they do). Find them by asking: "Who is doing something?" and "What are they doing?"</p>`,
        },
        {
          id: 'fl-4-3',
          title: 'Past Tense: What Happened Yesterday?',
          description: 'Learn to talk about things that already happened.',
          duration: 10,
          order: 3,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use the <strong>past tense</strong> — talking about things that already happened.</p>

<h3>🌟 Let's Start</h3>
<p>What did you do yesterday? Maybe you ate food, walked to school, or played with friends. When we talk about things that already happened, we use the <strong>past tense</strong>. The past tense often adds <strong>-ed</strong> to the end of a verb.</p>

<h3>📚 New Concept</h3>
<p>The <strong>past tense</strong> tells us that something already happened — yesterday, last week, or a long time ago.</p>
<p><strong>Adding -ed:</strong></p>
<ul>
<li>walk → <strong>walked</strong> ("I <strong>walked</strong> to school yesterday.")</li>
<li>play → <strong>played</strong> ("We <strong>played</strong> football last Saturday.")</li>
<li>cook → <strong>cooked</strong> ("Mother <strong>cooked</strong> rice.")</li>
<li>wash → <strong>washed</strong> ("Bola <strong>washed</strong> her clothes.")</li>
</ul>
<p><strong>Some verbs are tricky!</strong> They do not just add -ed. They change completely:</p>
<ul>
<li>eat → <strong>ate</strong> ("I <strong>ate</strong> plantain.")</li>
<li>go → <strong>went</strong> ("We <strong>went</strong> to the market.")</li>
<li>run → <strong>ran</strong> ("Emeka <strong>ran</strong> home.")</li>
<li>see → <strong>saw</strong> ("I <strong>saw</strong> a bird.")</li>
<li>come → <strong>came</strong> ("My uncle <strong>came</strong> to visit.")</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Change to past tense: "I walk to school." (yesterday)</li>
<li>Change to past tense: "She eats rice." (yesterday)</li>
<li>Fill in the blank: "Last week, Tunde ___ (go) to Lagos."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"I <strong>walked</strong> to school yesterday."</li>
<li>"She <strong>ate</strong> rice yesterday."</li>
<li>"Last week, Tunde <strong>went</strong> to Lagos."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The past tense tells us something already happened. Many verbs add -ed (walked, played), but some change completely (ate, went, ran).</p>`,
        },
        {
          id: 'fl-4-4',
          title: 'Present Tense: What is Happening Now?',
          description: 'Learn to talk about things happening right now.',
          duration: 10,
          order: 4,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use the <strong>present tense</strong> — talking about things happening right now or that happen regularly.</p>

<h3>🌟 Let's Start</h3>
<p>Look around you. What is happening right now? Maybe you are sitting. Maybe the fan is spinning. When we talk about what is happening NOW, we use the <strong>present tense</strong>.</p>

<h3>📚 New Concept</h3>
<p>The <strong>present tense</strong> tells us what is happening now or what happens regularly.</p>
<p><strong>Right now (present continuous — using "is/are + -ing"):</strong></p>
<ul>
<li>"Amina <strong>is reading</strong> a book right now."</li>
<li>"The children <strong>are playing</strong> outside."</li>
<li>"I <strong>am eating</strong> my lunch."</li>
<li>"It <strong>is raining</strong> right now."</li>
</ul>
<p><strong>Things that happen regularly (simple present):</strong></p>
<ul>
<li>"I <strong>go</strong> to school every day."</li>
<li>"She <strong>eats</strong> breakfast every morning."</li>
<li>"We <strong>play</strong> football on Saturdays."</li>
<li>"The sun <strong>rises</strong> in the east."</li>
</ul>
<p><strong>Notice:</strong> When talking about he, she, or it, we often add <strong>-s</strong> to the verb: he run<strong>s</strong>, she eat<strong>s</strong>, it rain<strong>s</strong>.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is happening right now? Use "is" or "are" + -ing: "The teacher ___ (write) on the board."</li>
<li>What happens every day? "Chidi ___ (walk) to school."</li>
<li>Make a sentence about something you do every morning.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"The teacher <strong>is writing</strong> on the board."</li>
<li>"Chidi <strong>walks</strong> to school." (every day = simple present, add -s)</li>
<li>Example: "<strong>I brush my teeth every morning.</strong>" (any present tense sentence is correct)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The present tense is for now and for things that happen regularly. Use "is/are + -ing" for right now, and add -s for he/she/it with regular actions.</p>`,
        },
        {
          id: 'fl-4-5',
          title: 'Future Tense: What Will Happen Tomorrow?',
          description: 'Learn to talk about things that will happen later.',
          duration: 10,
          order: 5,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use the <strong>future tense</strong> — talking about things that have not happened yet but will happen later.</p>

<h3>🌟 Let's Start</h3>
<p>What will you do tomorrow? Maybe you will go to school. Maybe you will eat lunch with your family. When we talk about things that have not happened yet, we use the word <strong>will</strong>.</p>

<h3>📚 New Concept</h3>
<p>The <strong>future tense</strong> uses the word <strong>will</strong> before the verb to talk about things that will happen later — tomorrow, next week, or in the future.</p>
<ul>
<li>"I <strong>will go</strong> to school tomorrow."</li>
<li>"We <strong>will eat</strong> dinner at 7 o'clock."</li>
<li>"Funke <strong>will visit</strong> her grandmother next week."</li>
<li>"It <strong>will rain</strong> this afternoon."</li>
<li>"The teacher <strong>will give</strong> us a test on Friday."</li>
</ul>
<p>You can also use <strong>"going to"</strong> for the future:</p>
<ul>
<li>"I <strong>am going to</strong> read a book tonight."</li>
<li>"They <strong>are going to</strong> play football after school."</li>
</ul>
<p><strong>Past, Present, Future — all together:</strong></p>
<ul>
<li>Past: "Yesterday, I <strong>ate</strong> rice."</li>
<li>Present: "Right now, I <strong>am eating</strong> rice."</li>
<li>Future: "Tomorrow, I <strong>will eat</strong> rice."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Change to future tense: "I go to the market." (tomorrow)</li>
<li>Change to future tense: "She cooks dinner." (tonight)</li>
<li>Tell me something you <strong>will do</strong> next Saturday.</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"I <strong>will go</strong> to the market tomorrow."</li>
<li>"She <strong>will cook</strong> dinner tonight."</li>
<li>Example: "Next Saturday, I <strong>will play</strong> with my friends." (any future tense sentence is correct)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Use "will" to talk about the future. Yesterday I walked (past). Today I walk (present). Tomorrow I will walk (future).</p>`,
        },
        {
          id: 'fl-4-6',
          title: 'Asking Questions: Who, What, Where?',
          description: 'Learn to ask questions using who, what, and where.',
          duration: 10,
          order: 6,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to ask questions using the words <strong>who</strong>, <strong>what</strong>, and <strong>where</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Questions help us learn new things. When Emeka wants to know something, he asks a question. "Who is that man?" "What is for dinner?" "Where is my bag?" These question words are very powerful!</p>

<h3>📚 New Concept</h3>
<p><strong>Question words:</strong></p>
<ul>
<li><strong>Who</strong> — asks about a person. "Who is your teacher?" "Who cooked the food?"</li>
<li><strong>What</strong> — asks about a thing or an action. "What is your name?" "What are you doing?"</li>
<li><strong>Where</strong> — asks about a place. "Where do you live?" "Where is the market?"</li>
</ul>
<p><strong>Examples of questions and answers:</strong></p>
<ul>
<li>"<strong>Who</strong> is your best friend?" — "My best friend is Bola."</li>
<li>"<strong>What</strong> is your favourite food?" — "My favourite food is jollof rice."</li>
<li>"<strong>Where</strong> is your school?" — "My school is on Broad Street."</li>
</ul>
<p>Questions end with a <strong>question mark (?)</strong> instead of a full stop.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Which question word would you use to ask about a person? Make a question about your mother.</li>
<li>Which question word would you use to ask about a place? Make a question about Lagos.</li>
<li>Answer this question: "What is your favourite colour?"</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>Who</strong>. Example: "<strong>Who</strong> is my mother's best friend?"</li>
<li><strong>Where</strong>. Example: "<strong>Where</strong> is Lagos?"</li>
<li>Answer in a full sentence: "My favourite colour is ___." (any colour is correct)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Who asks about people. What asks about things. Where asks about places. Questions end with a question mark (?). Keep asking questions — that is how you learn!</p>`,
        },
        {
          id: 'fl-4-7',
          title: 'Asking Questions: When, Why, How?',
          description: 'Learn to ask questions using when, why, and how.',
          duration: 10,
          order: 7,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to ask questions using <strong>when</strong>, <strong>why</strong>, and <strong>how</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>Last lesson, we learned who, what, and where. Today we learn three more question words. Bola asks her teacher: "When is the test?" "Why do birds fly?" "How do you make garri?" These are great questions!</p>

<h3>📚 New Concept</h3>
<p><strong>More question words:</strong></p>
<ul>
<li><strong>When</strong> — asks about time. "When does school start?" "When is your birthday?"</li>
<li><strong>Why</strong> — asks for a reason. "Why is the sky blue?" "Why are you late?"</li>
<li><strong>How</strong> — asks about the way something is done. "How do you cook beans?" "How are you today?"</li>
</ul>
<p><strong>Examples:</strong></p>
<ul>
<li>"<strong>When</strong> do you wake up?" — "I wake up at 6 o'clock."</li>
<li>"<strong>Why</strong> do we wash our hands?" — "We wash our hands to remove germs."</li>
<li>"<strong>How</strong> do you get to school?" — "I walk to school."</li>
</ul>
<p><strong>All six question words together:</strong> Who, What, Where, When, Why, How.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Which question word asks about time? Make a question using it.</li>
<li>Which question word asks for a reason? Make a question using it.</li>
<li>Answer this question: "How do you get to school?"</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>When</strong>. Example: "<strong>When</strong> does the market open?"</li>
<li><strong>Why</strong>. Example: "<strong>Why</strong> do we need to drink water?"</li>
<li>Example: "I <strong>walk</strong> to school." or "I take a <strong>bus</strong> to school."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When asks about time. Why asks for reasons. How asks about the way things are done. Now you know all six question words: Who, What, Where, When, Why, How!</p>`,
        },
        {
          id: 'fl-4-8',
          title: 'Describing Things: Using Adjectives',
          description: 'Learn to use adjectives to describe nouns in sentences.',
          duration: 10,
          order: 8,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to use <strong>adjectives</strong> (describing words) properly in sentences to make your English more colourful.</p>

<h3>🌟 Let's Start</h3>
<p>Compare these two sentences: "I see a dog." and "I see a big, brown, friendly dog." The second sentence paints a picture in your mind! The words big, brown, and friendly are <strong>adjectives</strong> — they describe the dog.</p>

<h3>📚 New Concept</h3>
<p>An <strong>adjective</strong> describes a noun (a person, place, or thing). It tells us more about size, colour, shape, or feeling.</p>
<p><strong>Colour adjectives:</strong> red, blue, green, yellow, white, black, brown</p>
<p><strong>Size adjectives:</strong> big, small, tall, short, long, tiny, huge</p>
<p><strong>Feeling adjectives:</strong> happy, sad, angry, scared, tired, excited</p>
<p><strong>Other adjectives:</strong> old, new, clean, dirty, soft, hard, beautiful, ugly</p>
<p><strong>Where to put adjectives:</strong> Adjectives go <strong>before</strong> the noun:</p>
<ul>
<li>"A <strong>red</strong> car." (not "A car red")</li>
<li>"A <strong>tall</strong> tree." (not "A tree tall")</li>
<li>"The <strong>happy</strong> children." (not "The children happy")</li>
</ul>
<p>You can use more than one adjective: "A <strong>small, white</strong> cat." "The <strong>old, brown</strong> bag."</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Add an adjective: "Amina has a ___ dress."</li>
<li>Add two adjectives: "I see a ___, ___ house."</li>
<li>Find the adjective: "The tired boy sat under the tree."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Example: "Amina has a <strong>beautiful</strong> dress." (any adjective works)</li>
<li>Example: "I see a <strong>big, white</strong> house." (any two adjectives work)</li>
<li>The adjective is <strong>tired</strong> — it describes the boy.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Adjectives describe nouns and go before them. They make your sentences more interesting and help others picture what you are talking about!</p>`,
        },
        {
          id: 'fl-4-9',
          title: 'Comparing: Bigger, Biggest',
          description: 'Learn to compare things using -er and -est.',
          duration: 10,
          order: 9,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to <strong>compare</strong> things using words like bigger, biggest, taller, tallest.</p>

<h3>🌟 Let's Start</h3>
<p>Tunde is tall. Emeka is taller than Tunde. But Chidi is the tallest of all! When we compare things, we change the adjective. Let us learn how.</p>

<h3>📚 New Concept</h3>
<p><strong>Comparing two things — add -er:</strong></p>
<ul>
<li>tall → tall<strong>er</strong> ("Emeka is <strong>taller</strong> than Tunde.")</li>
<li>fast → fast<strong>er</strong> ("A car is <strong>faster</strong> than a bicycle.")</li>
<li>old → old<strong>er</strong> ("My sister is <strong>older</strong> than me.")</li>
<li>small → small<strong>er</strong> ("An ant is <strong>smaller</strong> than a dog.")</li>
</ul>
<p><strong>Comparing three or more — add -est:</strong></p>
<ul>
<li>tall → tall<strong>est</strong> ("Chidi is the <strong>tallest</strong> boy in the class.")</li>
<li>fast → fast<strong>est</strong> ("The cheetah is the <strong>fastest</strong> animal.")</li>
<li>old → old<strong>est</strong> ("Grandpa is the <strong>oldest</strong> in the family.")</li>
</ul>
<p><strong>Some special words:</strong></p>
<ul>
<li>good → <strong>better</strong> → <strong>best</strong></li>
<li>bad → <strong>worse</strong> → <strong>worst</strong></li>
<li>big → <strong>bigger</strong> → <strong>biggest</strong> (double the g)</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Compare: "A goat is big. A cow is ___."</li>
<li>Which is correct: "She is the taller girl in the school" or "She is the tallest girl in the school"?</li>
<li>Fill in: "Jollof rice is good. Grandma's jollof rice is the ___!"</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>"A cow is <strong>bigger</strong>." (comparing two things, use -er)</li>
<li>"She is the <strong>tallest</strong> girl in the school." (comparing many girls, use -est)</li>
<li>"Grandma's jollof rice is the <strong>best</strong>!" (good → better → best)</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Use -er to compare two things (bigger, faster). Use -est to compare three or more (biggest, fastest). Some words are special: good/better/best!</p>`,
        },
        {
          id: 'fl-4-10',
          title: 'Grammar Review: Sentence Builder',
          description: 'Review all grammar skills and build great sentences.',
          duration: 12,
          order: 10,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review everything you have learned about sentences, tenses, questions, adjectives, and comparisons.</p>

<h3>🌟 Let's Start</h3>
<p>You are becoming a <strong>Sentence Builder</strong>! You can speak in full sentences, use past, present, and future tense, ask questions, and describe things. Let us put it all together!</p>

<h3>📚 New Concept</h3>
<p><strong>Review of your grammar skills:</strong></p>
<p><strong>1. Full sentences</strong> have a subject and a verb: "Amina reads a book."</p>
<p><strong>2. Past tense</strong> (already happened): "She <strong>read</strong> a book yesterday."</p>
<p><strong>3. Present tense</strong> (happening now): "She <strong>is reading</strong> a book now."</p>
<p><strong>4. Future tense</strong> (will happen): "She <strong>will read</strong> a book tomorrow."</p>
<p><strong>5. Questions</strong> use who, what, where, when, why, how: "<strong>What</strong> is she reading?"</p>
<p><strong>6. Adjectives</strong> describe nouns: "She is reading an <strong>interesting</strong> book."</p>
<p><strong>7. Comparisons</strong> use -er and -est: "This book is <strong>longer</strong> than that one."</p>
<p><strong>Building a great sentence step by step:</strong></p>
<ul>
<li>Basic: "The boy runs."</li>
<li>Add adjective: "The <strong>fast</strong> boy runs."</li>
<li>Add detail: "The fast boy runs <strong>to school every morning</strong>."</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Write a sentence about Bola in the <strong>past tense</strong> with an <strong>adjective</strong>.</li>
<li>Write a <strong>question</strong> using "when."</li>
<li>Compare: "A bicycle is slow. A car is ___. An airplane is the ___."</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>Example: "Bola wore a <strong>beautiful</strong> dress yesterday." (past tense + adjective)</li>
<li>Example: "<strong>When</strong> does the rainy season start?"</li>
<li>"A car is <strong>faster</strong>. An airplane is the <strong>fastest</strong>."</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You are a Sentence Builder! You can make full sentences, use tenses, ask questions, and describe things. Keep practising and your English will keep growing!</p>`,
        },
      ],
    },
    {
      id: 'fl-unit-5',
      title: 'Advanced Sounds',
      description: 'Work with individual sounds in words and learn the alphabet — your bridge to reading.',
      order: 5,
      lessons: [
        {
          id: 'fl-5-1',
          title: 'Breaking Words into Sounds',
          description: 'Learn to segment words into their individual sounds (phonemes).',
          duration: 10,
          order: 1,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to break a word into its <strong>individual sounds</strong>. Each small sound in a word is called a <strong>phoneme</strong>.</p>

<h3>🌟 Let's Start</h3>
<p>In Unit 1, you learned to break words into syllables (big parts). Now we will break words into even smaller parts — individual sounds! The word <strong>cat</strong> has three sounds: /k/ - /a/ - /t/. This skill is very important for learning to read.</p>

<h3>📚 New Concept</h3>
<p><strong>Segmenting</strong> means breaking a word into its separate sounds.</p>
<p>Say the word slowly and stretch each sound:</p>
<ul>
<li><strong>sun</strong> → /s/ - /u/ - /n/ (3 sounds)</li>
<li><strong>dog</strong> → /d/ - /o/ - /g/ (3 sounds)</li>
<li><strong>map</strong> → /m/ - /a/ - /p/ (3 sounds)</li>
<li><strong>fish</strong> → /f/ - /i/ - /sh/ (3 sounds — sh is one sound!)</li>
<li><strong>hand</strong> → /h/ - /a/ - /n/ - /d/ (4 sounds)</li>
</ul>
<p><strong>How to segment:</strong></p>
<ol>
<li>Say the word slowly.</li>
<li>Stretch out each sound.</li>
<li>Hold up one finger for each sound you hear.</li>
</ol>
<p>Try it with <strong>red</strong>: rrr - eee - ddd. Three fingers up. Three sounds!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Break <strong>pen</strong> into its sounds. How many sounds?</li>
<li>Break <strong>sit</strong> into its sounds. How many sounds?</li>
<li>Break <strong>lamp</strong> into its sounds. How many sounds?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>pen</strong> → /p/ - /e/ - /n/ = 3 sounds.</li>
<li><strong>sit</strong> → /s/ - /i/ - /t/ = 3 sounds.</li>
<li><strong>lamp</strong> → /l/ - /a/ - /m/ - /p/ = 4 sounds.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every word is made of small sounds called phonemes. Breaking words into sounds is called segmenting. This is a superpower for reading!</p>`,
        },
        {
          id: 'fl-5-2',
          title: 'Counting Sounds in Words',
          description: 'Practise counting the number of sounds in words.',
          duration: 10,
          order: 2,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will get better at counting the number of <strong>individual sounds</strong> in words.</p>

<h3>🌟 Let's Start</h3>
<p>Amina and Emeka are playing the sound-counting game. Amina says "go" and holds up two fingers — /g/ - /o/. Emeka says "stop" and holds up four fingers — /s/ - /t/ - /o/ - /p/. Who has more sounds? Emeka! Let us play this game.</p>

<h3>📚 New Concept</h3>
<p>Remember: sounds are different from letters! Some words have more letters than sounds.</p>
<p><strong>Two-sound words:</strong></p>
<ul>
<li><strong>go</strong> → /g/ - /o/ = 2 sounds</li>
<li><strong>me</strong> → /m/ - /ee/ = 2 sounds</li>
<li><strong>up</strong> → /u/ - /p/ = 2 sounds</li>
</ul>
<p><strong>Three-sound words:</strong></p>
<ul>
<li><strong>cat</strong> → /k/ - /a/ - /t/ = 3 sounds</li>
<li><strong>big</strong> → /b/ - /i/ - /g/ = 3 sounds</li>
<li><strong>shop</strong> → /sh/ - /o/ - /p/ = 3 sounds (sh is one sound)</li>
</ul>
<p><strong>Four-sound words:</strong></p>
<ul>
<li><strong>frog</strong> → /f/ - /r/ - /o/ - /g/ = 4 sounds</li>
<li><strong>clap</strong> → /k/ - /l/ - /a/ - /p/ = 4 sounds</li>
<li><strong>desk</strong> → /d/ - /e/ - /s/ - /k/ = 4 sounds</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>How many sounds in <strong>hat</strong>?</li>
<li>How many sounds in <strong>drum</strong>?</li>
<li>Which word has more sounds: <strong>at</strong> or <strong>flat</strong>?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>hat</strong> = /h/ - /a/ - /t/ = <strong>3</strong> sounds.</li>
<li><strong>drum</strong> = /d/ - /r/ - /u/ - /m/ = <strong>4</strong> sounds.</li>
<li><strong>flat</strong> has more sounds! <strong>at</strong> = 2 sounds. <strong>flat</strong> = /f/ - /l/ - /a/ - /t/ = 4 sounds.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Count sounds, not letters! Say the word slowly, stretch each sound, and count. This skill will help you spell and read words.</p>`,
        },
        {
          id: 'fl-5-3',
          title: "Removing Sounds: What's Left?",
          description: 'Learn what happens when you take a sound away from a word.',
          duration: 10,
          order: 3,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to <strong>remove a sound</strong> from a word and hear what new word is left.</p>

<h3>🌟 Let's Start</h3>
<p>Here is a word magic trick! Say <strong>sand</strong>. Now take away the /s/ sound. What is left? <strong>and</strong>! You just made a new word by removing a sound. This is called <strong>sound deletion</strong>.</p>

<h3>📚 New Concept</h3>
<p><strong>Sound deletion</strong> means taking away one sound from a word to make a new word.</p>
<p><strong>Remove the first sound:</strong></p>
<ul>
<li><strong>bus</strong> without /b/ = <strong>us</strong></li>
<li><strong>meat</strong> without /m/ = <strong>eat</strong></li>
<li><strong>sit</strong> without /s/ = <strong>it</strong></li>
<li><strong>hat</strong> without /h/ = <strong>at</strong></li>
<li><strong>farm</strong> without /f/ = <strong>arm</strong></li>
</ul>
<p><strong>Remove the last sound:</strong></p>
<ul>
<li><strong>cart</strong> without /t/ = <strong>car</strong></li>
<li><strong>seat</strong> without /t/ = <strong>sea</strong></li>
<li><strong>hand</strong> without /d/ = <strong>han</strong></li>
</ul>
<p>This is like a word puzzle. You are training your brain to hear every sound in a word!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Say <strong>cat</strong>. Remove the /k/ sound. What is left?</li>
<li>Say <strong>man</strong>. Remove the /m/ sound. What is left?</li>
<li>Say <strong>ball</strong>. Remove the /b/ sound. What is left?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>cat</strong> without /k/ = <strong>at</strong>.</li>
<li><strong>man</strong> without /m/ = <strong>an</strong>.</li>
<li><strong>ball</strong> without /b/ = <strong>all</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>When you remove a sound from a word, you often get a new word! This shows you that words are made of separate sounds that can be moved around.</p>`,
        },
        {
          id: 'fl-5-4',
          title: 'Changing Sounds: Make a New Word',
          description: 'Learn to change one sound in a word to create a new word.',
          duration: 10,
          order: 4,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to <strong>change one sound</strong> in a word to make a completely new word.</p>

<h3>🌟 Let's Start</h3>
<p>Watch this trick: <strong>cat</strong>. Change the /k/ to /b/. Now you have <strong>bat</strong>! Change the /b/ to /h/. Now you have <strong>hat</strong>! By changing just one sound, you make a whole new word.</p>

<h3>📚 New Concept</h3>
<p><strong>Sound substitution</strong> means swapping one sound for another to make a new word.</p>
<p><strong>Change the first sound:</strong></p>
<ul>
<li><strong>map</strong> — change /m/ to /t/ = <strong>tap</strong></li>
<li><strong>bin</strong> — change /b/ to /p/ = <strong>pin</strong></li>
<li><strong>run</strong> — change /r/ to /s/ = <strong>sun</strong></li>
<li><strong>hot</strong> — change /h/ to /d/ = <strong>dot</strong></li>
</ul>
<p><strong>Change the last sound:</strong></p>
<ul>
<li><strong>cap</strong> — change /p/ to /t/ = <strong>cat</strong></li>
<li><strong>man</strong> — change /n/ to /d/ = <strong>mad</strong></li>
<li><strong>pig</strong> — change /g/ to /n/ = <strong>pin</strong></li>
</ul>
<p><strong>Change the middle sound:</strong></p>
<ul>
<li><strong>cat</strong> — change /a/ to /u/ = <strong>cut</strong></li>
<li><strong>big</strong> — change /i/ to /a/ = <strong>bag</strong></li>
<li><strong>hot</strong> — change /o/ to /i/ = <strong>hit</strong></li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Start with <strong>dog</strong>. Change the /d/ to /l/. What new word do you get?</li>
<li>Start with <strong>bed</strong>. Change the /b/ to /r/. What new word do you get?</li>
<li>Start with <strong>pan</strong>. Change the /a/ to /i/. What new word do you get?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>dog</strong> → change /d/ to /l/ = <strong>log</strong>.</li>
<li><strong>bed</strong> → change /b/ to /r/ = <strong>red</strong>.</li>
<li><strong>pan</strong> → change /a/ to /i/ = <strong>pin</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Changing just one sound in a word creates a brand new word. This shows how important each sound is!</p>`,
        },
        {
          id: 'fl-5-5',
          title: 'First Sound, Last Sound, Middle Sound',
          description: 'Identify sounds at different positions in a word.',
          duration: 10,
          order: 5,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to identify the <strong>first sound</strong>, <strong>last sound</strong>, and <strong>middle sound</strong> in short words.</p>

<h3>🌟 Let's Start</h3>
<p>You already know how to hear the beginning and ending sounds. Now let us also listen for the <strong>middle sound</strong> — the sound hiding in the middle of a word. In the word <strong>cat</strong>, the middle sound is /a/!</p>

<h3>📚 New Concept</h3>
<p>In a three-sound word, there is a first sound, a middle sound, and a last sound:</p>
<ul>
<li><strong>mat</strong>: first = /m/, middle = /a/, last = /t/</li>
<li><strong>pig</strong>: first = /p/, middle = /i/, last = /g/</li>
<li><strong>cup</strong>: first = /k/, middle = /u/, last = /p/</li>
<li><strong>hen</strong>: first = /h/, middle = /e/, last = /n/</li>
<li><strong>dog</strong>: first = /d/, middle = /o/, last = /g/</li>
</ul>
<p>The <strong>middle sound</strong> is usually a vowel sound: /a/, /e/, /i/, /o/, or /u/.</p>
<p><strong>Listen carefully to middle sounds:</strong></p>
<ul>
<li>Do <strong>cat</strong> and <strong>bat</strong> have the same middle sound? YES — both have /a/ in the middle.</li>
<li>Do <strong>pin</strong> and <strong>pen</strong> have the same middle sound? NO — pin has /i/ and pen has /e/.</li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What is the middle sound in <strong>bus</strong>?</li>
<li>What is the first, middle, and last sound in <strong>top</strong>?</li>
<li>Do <strong>run</strong> and <strong>fun</strong> have the same middle sound?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The middle sound in <strong>bus</strong> is /u/.</li>
<li><strong>top</strong>: first = /t/, middle = /o/, last = /p/.</li>
<li>YES — both <strong>run</strong> and <strong>fun</strong> have /u/ in the middle.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Every short word has a first, middle, and last sound. The middle sound is usually a vowel — a, e, i, o, or u. Listen carefully to hear all three positions!</p>`,
        },
        {
          id: 'fl-5-6',
          title: 'Blending Sounds into Words',
          description: 'Practise blending individual sounds to make words.',
          duration: 10,
          order: 6,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn to <strong>blend individual sounds</strong> together to make a word — the most important skill for reading!</p>

<h3>🌟 Let's Start</h3>
<p>In Unit 1, you blended syllables. Now you will blend individual sounds! Listen: /d/ - /o/ - /g/. Say them faster: d-o-g. Faster: dog! You just read a word by blending sounds! This is exactly what readers do.</p>

<h3>📚 New Concept</h3>
<p><strong>Sound blending</strong> means pushing separate sounds together to make a word.</p>
<p><strong>Steps to blend:</strong></p>
<ol>
<li>Say each sound slowly: /s/ ... /i/ ... /t/</li>
<li>Say them a bit faster: s-i-t</li>
<li>Say them as one word: <strong>sit</strong>!</li>
</ol>
<p><strong>Practice blending:</strong></p>
<ul>
<li>/r/ - /u/ - /n/ = <strong>run</strong></li>
<li>/b/ - /e/ - /d/ = <strong>bed</strong></li>
<li>/m/ - /a/ - /p/ = <strong>map</strong></li>
<li>/f/ - /i/ - /sh/ = <strong>fish</strong></li>
<li>/h/ - /a/ - /n/ - /d/ = <strong>hand</strong></li>
</ul>
<p><strong>Try these longer ones:</strong></p>
<ul>
<li>/s/ - /t/ - /o/ - /p/ = <strong>stop</strong></li>
<li>/d/ - /r/ - /i/ - /n/ - /k/ = <strong>drink</strong></li>
</ul>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Blend: /p/ - /e/ - /n/. What word is it?</li>
<li>Blend: /g/ - /o/ - /t/. What word is it?</li>
<li>Blend: /s/ - /t/ - /a/ - /r/. What word is it?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>/p/ - /e/ - /n/ = <strong>pen</strong></li>
<li>/g/ - /o/ - /t/ = <strong>got</strong></li>
<li>/s/ - /t/ - /a/ - /r/ = <strong>star</strong></li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Blending sounds is the key to reading. Say each sound, then push them together faster and faster until you hear the word. You are learning to read!</p>`,
        },
        {
          id: 'fl-5-7',
          title: 'The Alphabet: Letter Names',
          description: 'Learn the 26 letters of the English alphabet and their names.',
          duration: 12,
          order: 7,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the names of all <strong>26 letters</strong> of the English alphabet.</p>

<h3>🌟 Let's Start</h3>
<p>Everything you read is made of letters. There are 26 letters in the English alphabet. You may already know some of them! Let us learn all their names.</p>

<h3>📚 New Concept</h3>
<p>The <strong>English alphabet</strong> has 26 letters. Here they are in order:</p>
<p><strong>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</strong></p>
<p>The small (lowercase) letters look like this:</p>
<p><strong>a b c d e f g h i j k l m n o p q r s t u v w x y z</strong></p>
<p><strong>Five of these letters are special — they are called vowels:</strong></p>
<p><strong>A, E, I, O, U</strong></p>
<p>The other 21 letters are called <strong>consonants</strong>.</p>
<p>Every word in English is made from these 26 letters. Your name is made of letters too!</p>
<ul>
<li><strong>A-M-I-N-A</strong> spells Amina</li>
<li><strong>E-M-E-K-A</strong> spells Emeka</li>
<li><strong>B-O-L-A</strong> spells Bola</li>
</ul>
<p>Sing the alphabet song to help you remember: A-B-C-D-E-F-G, H-I-J-K-L-M-N-O-P, Q-R-S-T-U-V, W-X-Y and Z!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>How many letters are in the English alphabet?</li>
<li>Name the five vowels.</li>
<li>What letters spell your first name?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>There are <strong>26</strong> letters in the English alphabet.</li>
<li>The five vowels are <strong>A, E, I, O, U</strong>.</li>
<li>Your answer will be the letters in your own name!</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>The English alphabet has 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants. These letters make up every word you will ever read!</p>`,
        },
        {
          id: 'fl-5-8',
          title: 'Letters and Their Sounds: a-m',
          description: 'Learn the sounds that the letters a through m make.',
          duration: 12,
          order: 8,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the <strong>sounds</strong> that the first 13 letters of the alphabet make (a through m).</p>

<h3>🌟 Let's Start</h3>
<p>Letters have names AND sounds. The letter B is named "bee" but its SOUND is /b/ as in "ball." When we read, we use the sounds, not the names. Let us learn the sounds for letters a to m.</p>

<h3>📚 New Concept</h3>
<p>Each letter makes a sound. Here are the sounds for a to m:</p>
<ul>
<li><strong>a</strong> — /a/ as in <strong>a</strong>nt, <strong>a</strong>pple</li>
<li><strong>b</strong> — /b/ as in <strong>b</strong>all, <strong>b</strong>oy</li>
<li><strong>c</strong> — /k/ as in <strong>c</strong>at, <strong>c</strong>up</li>
<li><strong>d</strong> — /d/ as in <strong>d</strong>og, <strong>d</strong>oor</li>
<li><strong>e</strong> — /e/ as in <strong>e</strong>gg, <strong>e</strong>lbow</li>
<li><strong>f</strong> — /f/ as in <strong>f</strong>an, <strong>f</strong>ish</li>
<li><strong>g</strong> — /g/ as in <strong>g</strong>oat, <strong>g</strong>irl</li>
<li><strong>h</strong> — /h/ as in <strong>h</strong>at, <strong>h</strong>en</li>
<li><strong>i</strong> — /i/ as in <strong>i</strong>gloo, <strong>i</strong>nk</li>
<li><strong>j</strong> — /j/ as in <strong>j</strong>ar, <strong>j</strong>ump</li>
<li><strong>k</strong> — /k/ as in <strong>k</strong>ite, <strong>k</strong>ing</li>
<li><strong>l</strong> — /l/ as in <strong>l</strong>eg, <strong>l</strong>amp</li>
<li><strong>m</strong> — /m/ as in <strong>m</strong>an, <strong>m</strong>ango</li>
</ul>
<p>Say each sound out loud. Feel how your mouth moves differently for each one!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What sound does the letter <strong>d</strong> make? Name a word that starts with that sound.</li>
<li>What sound does the letter <strong>g</strong> make? Name a word that starts with that sound.</li>
<li>The word <strong>jam</strong> starts with which letter?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The letter <strong>d</strong> makes the /d/ sound. Example word: <strong>dog</strong>, <strong>desk</strong>, or <strong>drum</strong>.</li>
<li>The letter <strong>g</strong> makes the /g/ sound. Example word: <strong>goat</strong>, <strong>girl</strong>, or <strong>garri</strong>.</li>
<li>The word <strong>jam</strong> starts with the letter <strong>j</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Letters have names and sounds. For reading, we use the sounds. Learn the sound each letter makes — this is the key to reading words!</p>`,
        },
        {
          id: 'fl-5-9',
          title: 'Letters and Their Sounds: n-z',
          description: 'Learn the sounds that the letters n through z make.',
          duration: 12,
          order: 9,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will learn the <strong>sounds</strong> that the last 13 letters of the alphabet make (n through z).</p>

<h3>🌟 Let's Start</h3>
<p>Great work learning the sounds for a through m! Now let us complete the alphabet and learn the sounds for n through z. After this, you will know the sound for every letter!</p>

<h3>📚 New Concept</h3>
<p>Here are the sounds for n to z:</p>
<ul>
<li><strong>n</strong> — /n/ as in <strong>n</strong>ose, <strong>n</strong>et</li>
<li><strong>o</strong> — /o/ as in <strong>o</strong>range, <strong>o</strong>x</li>
<li><strong>p</strong> — /p/ as in <strong>p</strong>en, <strong>p</strong>ot</li>
<li><strong>q</strong> — /kw/ as in <strong>q</strong>ueen (q almost always comes with u)</li>
<li><strong>r</strong> — /r/ as in <strong>r</strong>ain, <strong>r</strong>ed</li>
<li><strong>s</strong> — /s/ as in <strong>s</strong>un, <strong>s</strong>at</li>
<li><strong>t</strong> — /t/ as in <strong>t</strong>op, <strong>t</strong>en</li>
<li><strong>u</strong> — /u/ as in <strong>u</strong>p, <strong>u</strong>mbrella</li>
<li><strong>v</strong> — /v/ as in <strong>v</strong>an, <strong>v</strong>est</li>
<li><strong>w</strong> — /w/ as in <strong>w</strong>et, <strong>w</strong>ater</li>
<li><strong>x</strong> — /ks/ as in bo<strong>x</strong>, fo<strong>x</strong> (usually at the end of words)</li>
<li><strong>y</strong> — /y/ as in <strong>y</strong>am, <strong>y</strong>es</li>
<li><strong>z</strong> — /z/ as in <strong>z</strong>oo, <strong>z</strong>ip</li>
</ul>
<p>Now you know all 26 letter sounds! You can start to read words by sounding out each letter.</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>What sound does the letter <strong>r</strong> make? Name a word that starts with that sound.</li>
<li>What sound does the letter <strong>w</strong> make? Name a word that starts with that sound.</li>
<li>The word <strong>van</strong> starts with which letter?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li>The letter <strong>r</strong> makes the /r/ sound. Example word: <strong>rain</strong>, <strong>red</strong>, or <strong>rice</strong>.</li>
<li>The letter <strong>w</strong> makes the /w/ sound. Example word: <strong>water</strong>, <strong>walk</strong>, or <strong>window</strong>.</li>
<li>The word <strong>van</strong> starts with the letter <strong>v</strong>.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>Now you know the sound for every letter from a to z! This is the foundation for reading. Each letter is a code for a sound, and words are built from these codes.</p>`,
        },
        {
          id: 'fl-5-10',
          title: 'Sound-Letter Review: Ready for Reading',
          description: 'Review all sound and letter skills to prepare for phonics.',
          duration: 12,
          order: 10,
          content: `<h3>🎯 What You'll Learn</h3>
<p>You will review all your sound and letter skills. After this, you are <strong>ready for reading</strong>!</p>

<h3>🌟 Let's Start</h3>
<p>Look how far you have come! You started by listening to sounds around you. Now you can break words into sounds, count sounds, blend sounds, and match sounds to letters. You are ready to start reading! Let us review everything.</p>

<h3>📚 New Concept</h3>
<p><strong>Your sound and letter skills:</strong></p>
<p><strong>1. Segmenting:</strong> Breaking words into sounds. <em>dog</em> → /d/ - /o/ - /g/</p>
<p><strong>2. Counting:</strong> <em>stop</em> has 4 sounds.</p>
<p><strong>3. Deleting:</strong> <em>sand</em> without /s/ = <em>and</em></p>
<p><strong>4. Substituting:</strong> <em>cat</em> → change /k/ to /b/ = <em>bat</em></p>
<p><strong>5. Sound positions:</strong> In <em>pin</em>: first = /p/, middle = /i/, last = /n/</p>
<p><strong>6. Blending:</strong> /r/ - /e/ - /d/ = <em>red</em></p>
<p><strong>7. Alphabet:</strong> 26 letters, 5 vowels (a, e, i, o, u), 21 consonants</p>
<p><strong>8. Letter sounds:</strong> Each letter makes a sound. b = /b/, s = /s/, etc.</p>
<p><strong>How reading works:</strong> When you see a word like <strong>cat</strong>, you:</p>
<ol>
<li>See the letters: c - a - t</li>
<li>Say the sounds: /k/ - /a/ - /t/</li>
<li>Blend the sounds: cat!</li>
</ol>
<p>That is reading! And you are ready to do it!</p>

<h3>🎮 Let's Practice</h3>
<ol>
<li>Break the word <strong>fun</strong> into its three sounds.</li>
<li>Blend these sounds: /b/ - /i/ - /g/. What word?</li>
<li>What letter makes the /s/ sound? What letter makes the /m/ sound?</li>
</ol>

<details><summary>Click to see answers</summary>
<ol>
<li><strong>fun</strong> = /f/ - /u/ - /n/</li>
<li>/b/ - /i/ - /g/ = <strong>big</strong></li>
<li>The letter <strong>s</strong> makes the /s/ sound. The letter <strong>m</strong> makes the /m/ sound.</li>
</ol>
</details>

<h3>💡 Remember</h3>
<p>You are ready for reading! You know how to hear sounds in words and you know what sounds the letters make. Next, you will start reading real words. Congratulations!</p>`,
        },
      ],
    },
    // PLACEHOLDER_UNITS_6_TO_8
  ],
};

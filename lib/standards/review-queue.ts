export type ReviewQueueCategory =
  | 'standards-verification'
  | 'grade-4-audit'
  | 'source-of-truth'
  | 'assessment'
  | 'voice-performance';

export type ReviewQueuePriority = 'p0' | 'p1' | 'p2';

export type ReviewQueueStatus = 'not_started' | 'in_progress' | 'blocked' | 'done';

export interface StandardsReviewQueueItem {
  id: string;
  title: string;
  category: ReviewQueueCategory;
  priority: ReviewQueuePriority;
  status: ReviewQueueStatus;
  ownerRole: string;
  whyItMatters: string;
  currentState: string;
  evidenceNeeded: string[];
  outputArtifacts: string[];
  claimBoundary: string;
  doneCriteria: string[];
}

export const standardsReviewQueue: StandardsReviewQueueItem[] = [
  {
    id: 'verify-nerdc-math-exact-rows',
    title: 'Verify exact NERDC mathematics rows',
    category: 'standards-verification',
    priority: 'p0',
    status: 'not_started',
    ownerRole: 'Nigerian primary mathematics curriculum reviewer',
    whyItMatters:
      'The numeracy crosswalk is currently directionally aligned to NERDC themes, but an external reviewer needs exact rows before any Nigerian standards claim is defensible.',
    currentState:
      'Code and docs use broad NERDC working references for foundational numeracy skills and modules.',
    evidenceNeeded: [
      'Official NERDC Basic Education Mathematics curriculum rows for the relevant primary bands.',
      'Topic, performance objective, content, teacher activity, pupil activity, resources, and evaluation wording where available.',
      'Reviewer notes on which Sabi voice lessons teach, support, extend, or assess each row.',
    ],
    outputArtifacts: [
      'Exact NERDC math refs in the standards registry.',
      'Reviewer memo explaining any gaps between Sabi lessons and NERDC expectations.',
    ],
    claimBoundary:
      'Until NERDC reviews directly, the claim remains "mapped to NERDC expectations for review", not "NERDC approved".',
    doneCriteria: [
      'Every NERDC math ref used in code has exact source text or a documented reason for remaining broad.',
      'At least one Nigerian math reviewer has checked the mappings.',
      'Any unteachable-by-voice rows are marked app or print supported.',
    ],
  },
  {
    id: 'verify-nerdc-english-exact-rows',
    title: 'Verify exact NERDC English Studies rows',
    category: 'standards-verification',
    priority: 'p0',
    status: 'not_started',
    ownerRole: 'Nigerian English Studies or early-grade literacy reviewer',
    whyItMatters:
      'Sabi literacy must be precise about oral language and reading-readiness, especially because voice alone cannot prove print reading mastery.',
    currentState:
      'Literacy refs are working crosswalks at skill and module level, with exact Cambridge refs added where verified.',
    evidenceNeeded: [
      'Official NERDC English Studies rows for oral language, phonics, vocabulary, listening comprehension, grammar, reading, and writing.',
      'Reviewer judgment on which outcomes are voice-only, voice-supported, or print/app dependent.',
      'Notes on Nigerian English, home-language variation, and age appropriateness for 8-14-year-old learners.',
    ],
    outputArtifacts: [
      'Exact NERDC English refs in the standards registry.',
      'Voice-only versus print-required literacy claim memo.',
    ],
    claimBoundary:
      'Use "mapped to Nigerian English Studies expectations" only. Do not claim full reading mastery without print/app evidence.',
    doneCriteria: [
      'Each literacy skill has exact NERDC rows or an explicit no-match note.',
      'Print reading and writing rows are marked print_bridge or app where needed.',
      'A Nigerian literacy reviewer signs off on the claim wording.',
    ],
  },
  {
    id: 'audit-grade-4-cambridge-codes',
    title: 'Audit Grade 4 app lessons against current Cambridge codes',
    category: 'grade-4-audit',
    priority: 'p0',
    status: 'not_started',
    ownerRole: 'Cambridge Primary math and English consultant',
    whyItMatters:
      'The restored app has older or looser Cambridge-style codes in Grade 4 content. The new registry should not leave two competing code systems.',
    currentState:
      'Exact Cambridge Stage 4 refs exist for selected foundational crosswalk entries, but the full Grade 4 app curriculum still needs audit.',
    evidenceNeeded: [
      'Current Cambridge Primary Mathematics 0096 Stage 4 framework.',
      'Current Cambridge Primary English 0058 Stage 4 framework.',
      'All Grade 4 app lesson IDs, titles, standards arrays, objectives, and content.',
    ],
    outputArtifacts: [
      'Grade 4 Cambridge code audit table.',
      'Replacement patch for older or loose codes.',
      'List of app lessons that support rather than teach a Cambridge objective.',
    ],
    claimBoundary:
      'A consultant audit supports "Cambridge-aligned". It is not Cambridge International endorsement.',
    doneCriteria: [
      'Every Grade 4 app lesson has verified current codes or a documented no-code rationale.',
      'Old code styles are either replaced or explicitly mapped.',
      'Consultant-facing audit file is reviewable without reading the whole app.',
    ],
  },
  {
    id: 'select-gpf-reading-descriptors',
    title: 'Select exact GPF reading descriptors',
    category: 'standards-verification',
    priority: 'p1',
    status: 'not_started',
    ownerRole: 'Foundational literacy assessment reviewer',
    whyItMatters:
      'GPF can strengthen measurement language, but only if Sabi chooses exact descriptors instead of citing the framework broadly.',
    currentState:
      'GPF reading is referenced as a measurement anchor, with source notes, but exact descriptor selection is incomplete.',
    evidenceNeeded: [
      'Official Global Proficiency Framework reading descriptors for early grades or relevant proficiency bands.',
      'Decision record for which descriptors Sabi can assess orally and which require print.',
    ],
    outputArtifacts: [
      'Exact GPF reading refs in literacy-frameworks.ts.',
      'Oral-only limitation note for each print-dependent descriptor.',
    ],
    claimBoundary:
      'GPF is a reference framework, not a certification or endorsement.',
    doneCriteria: [
      'Every GPF reading ref has exact descriptor text, band, and source URL.',
      'Print-dependent descriptors are not used as evidence from voice-only diagnostics.',
    ],
  },
  {
    id: 'select-gpf-math-descriptors',
    title: 'Select exact GPF math descriptors',
    category: 'standards-verification',
    priority: 'p1',
    status: 'not_started',
    ownerRole: 'Foundational numeracy assessment reviewer',
    whyItMatters:
      'The numeracy diagnostic and monthly probes need measurable proficiency language that can survive funder and evaluator review.',
    currentState:
      'GPF math is named in docs as a measurement reference, but exact descriptor mapping is incomplete.',
    evidenceNeeded: [
      'Official Global Proficiency Framework mathematics descriptors for number, operations, and problem solving.',
      'Mapping from Sabi skills and diagnostic items to exact descriptors.',
    ],
    outputArtifacts: [
      'Exact GPF math refs in math-frameworks.ts.',
      'Diagnostic blueprint notes linking items to descriptors.',
    ],
    claimBoundary:
      'Use as measurement alignment only. Do not imply UNESCO/UIS reviewed Sabi.',
    doneCriteria: [
      'Each selected descriptor is traceable to a diagnostic item or mastery probe.',
      'Descriptors outside Sabi scope are excluded or marked future.',
    ],
  },
  {
    id: 'decide-module-5-6-source-of-truth',
    title: 'Decide Module 5/6 markdown mirror versus app source of truth',
    category: 'source-of-truth',
    priority: 'p0',
    status: 'not_started',
    ownerRole: 'Sabi curriculum maintainer',
    whyItMatters:
      'Diagnostics now route into Division and Word Problems. If the phone path cannot find canonical voice scripts, placement will outrun production content.',
    currentState:
      'Module 5 and 6 lessons exist in curriculum-app/lib/foundational-numeracy.ts, while standalone markdown voice scripts currently cover Modules 1-4.',
    evidenceNeeded: [
      'List of all app Module 5 and 6 lesson objects.',
      'Decision on whether markdown or TypeScript app data is canonical for phone delivery.',
      'RAG and voice runtime requirements for consuming the chosen source.',
    ],
    outputArtifacts: [
      'Source-of-truth decision note.',
      'Either mirrored markdown scripts for fn-5-1 to fn-6-16 or runtime support for app-source voice lessons.',
    ],
    claimBoundary:
      'Until resolved, say Module 5/6 exist in the app and need phone-path source-of-truth finalization.',
    doneCriteria: [
      'Phone diagnostic placements can resolve every Module 5 and 6 lesson ID.',
      'Docs and code agree on the canonical content source.',
      'No invented lesson ranges remain in validation artifacts.',
    ],
  },
  {
    id: 'define-phase-2-print-bridge',
    title: 'Define Phase 2 print bridge scope and source of truth',
    category: 'source-of-truth',
    priority: 'p1',
    status: 'not_started',
    ownerRole: 'Literacy curriculum designer',
    whyItMatters:
      'Phase 1 literacy is oral. Phase 2 is where Sabi can begin making real print reading claims, so the artifact boundary must be explicit.',
    currentState:
      'Phase 1 has all 80 lesson entries. Phase 2 is described in plans but not yet formalized as a reviewed print/app curriculum package.',
    evidenceNeeded: [
      'Chosen systematic phonics sequence and licensing decision.',
      'Print/app materials required for letter-sound, blending, decodable word, sentence, fluency, and spelling evidence.',
      'Decision on whether Phase 2 lives in markdown, app data, printable PDFs, or a mixed package.',
    ],
    outputArtifacts: [
      'Phase 2 scope and sequence.',
      'Print bridge artifact inventory.',
      'Reading-claim boundary memo.',
    ],
    claimBoundary:
      'Do not claim voice-only reading mastery. Reading and writing claims require print/app evidence.',
    doneCriteria: [
      'Every Phase 2 objective has a source artifact and mastery check.',
      'Licensing for any phonics sequence or materials is documented.',
      'Phase 1 exit and Phase 2 entry criteria are machine-readable.',
    ],
  },
  {
    id: 'migrate-performance-tags',
    title: 'Migrate bracketed performance tags to voice metadata',
    category: 'voice-performance',
    priority: 'p1',
    status: 'not_started',
    ownerRole: 'Voice curriculum engineer',
    whyItMatters:
      'Bracketed affect tags can be read aloud by TTS or confuse reviewers, but they also encode useful pacing and warmth that should not be lost.',
    currentState:
      'Diagnostics are cleaned. Longer lesson scripts still contain bracketed affect tags for laughter, chuckles, sighs, and similar delivery cues.',
    evidenceNeeded: [
      'Full count and inventory of bracketed performance tags across lesson scripts and app voice data.',
      'Decision on the metadata schema for affect, pacing, pause, and delivery style.',
      'Runtime behavior for stripping learner-visible text while preserving delivery metadata.',
    ],
    outputArtifacts: [
      'Voice performance metadata schema.',
      'Migration patch for assessment lessons first, then production phone-path scripts.',
      'Regression check proving no bracketed affect tags reach spoken learner text.',
    ],
    claimBoundary:
      'Removing tags is a voice-product cleanup, not an accreditation or standards milestone by itself.',
    doneCriteria: [
      'No bracketed affect tags remain in learner-visible or LLM-spoken script text.',
      'Useful delivery cues are preserved as metadata where needed.',
      'TTS path has a safety stripper for any missed tags.',
    ],
  },
];

export const priorityStandardsReviewQueue = standardsReviewQueue.filter((item) => item.priority === 'p0');

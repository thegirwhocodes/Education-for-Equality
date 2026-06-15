# Sabi Standards Registry

This folder is the machine-readable backbone for Sabi curriculum alignment.

It separates three things:

1. External standards references: NERDC, Cambridge, TaRL/ASER.
2. Sabi internal skill IDs: stable skills the product can track.
3. Lesson/module crosswalks: which Sabi lesson teaches, supports, extends, or assesses which standards.

## Important Claim Boundary

Entries marked `working_crosswalk` are curriculum-team mappings, not official certification. They are suitable for product design and educator review, but should not be marketed as "approved" by NERDC or Cambridge.

Use `verified_official` only after we have checked the exact wording/code against an official framework document.

## Current Coverage

- `math-frameworks.ts`: NERDC/Cambridge/TaRL math references for foundational numeracy, including exact verified Cambridge Primary Mathematics 0096 Stage 4 objective refs where source text has been checked.
- `foundational-numeracy-crosswalk.ts`: Sabi foundational numeracy skill map, module crosswalk, all 64 existing markdown voice lessons, and the restored app Module 5/6 lessons for Division and Word Problems.
- `literacy-frameworks.ts`: NERDC/Cambridge/GPF literacy references for voice-first foundational literacy, including exact verified Cambridge Primary English 0058 Stage 4 objective refs where source text has been checked.
- `foundational-literacy-crosswalk.ts`: Phase 1 foundational literacy skill map, module crosswalk, all 80 Phase 1 lesson entries, and a filtered external-review sample.

## Next Work

1. Replace broad NERDC working refs with exact NERDC curriculum rows after official-document review.
2. Mirror app Module 5 Division and Module 6 Word Problems into standalone markdown voice scripts, or formally choose app-only/app-first as the source of truth.
3. Add Grade 4 Cambridge app lesson code audit, replacing older/looser codes with verified framework references.
4. Add assessment item banks as structured data, not prose inside lesson scripts.
5. Move performance direction such as laughs/sighs out of curriculum scripts and into the voice-performance layer.

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

- `math-frameworks.ts`: first NERDC/Cambridge/TaRL math references for foundational numeracy.
- `foundational-numeracy-crosswalk.ts`: Sabi foundational numeracy skill map, module crosswalk, all 64 existing lesson crosswalk entries, plus planned Module 5/6 skill/module placeholders.
- `literacy-frameworks.ts`: first NERDC/Cambridge/GPF literacy references for voice-first foundational literacy.
- `foundational-literacy-crosswalk.ts`: Phase 1 foundational literacy skill map, module crosswalk, and external-review sample lessons.

## Next Work

1. Replace working-crosswalk references with verified exact NERDC/Cambridge codes after official-document review.
2. Write full Module 5 Division and Module 6 Word Problems voice scripts from the structured plans.
3. Expand literacy lesson-level crosswalk beyond review samples if Phase 1 becomes part of the first external review packet.
4. Add Grade 4 Cambridge app lesson code audit, replacing older/looser codes with verified framework references.
5. Add assessment item banks as structured data, not prose inside lesson scripts.

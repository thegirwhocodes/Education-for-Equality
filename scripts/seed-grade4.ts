/**
 * Seed Script: Grade 4 Cambridge Curriculum
 *
 * This script populates Supabase with the Grade 4 Cambridge-aligned curriculum.
 *
 * Usage:
 * 1. Make sure .env.local has your Supabase credentials
 * 2. Run: npx tsx scripts/seed-grade4.ts
 */

import { createClient } from '@supabase/supabase-js';
import { grade4Curriculum } from '../lib/cambridge-grade4-curriculum';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!');
  console.error('Make sure .env.local has:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Subject key to slug mapping
const subjectSlugMap: Record<string, string> = {
  mathematics: 'mathematics',
  english: 'english',
  science: 'science',
  socialStudies: 'social-studies',
};

async function seedGrade4Curriculum() {
  console.log('🌱 Starting Grade 4 curriculum seed...\n');

  try {
    // 1. Get Grade 4 ID
    console.log('📚 Finding Grade 4...');
    const { data: grade, error: gradeError } = await supabase
      .from('grades')
      .select('id')
      .eq('number', 4)
      .single();

    if (gradeError || !grade) {
      throw new Error(`Grade 4 not found. Run the schema SQL first! Error: ${gradeError?.message}`);
    }
    console.log(`   ✓ Grade 4 ID: ${grade.id}`);

    // 2. Get Subject IDs
    console.log('\n📖 Finding subjects...');
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, slug');

    if (subjectsError || !subjects) {
      throw new Error(`Subjects not found. Run the schema SQL first! Error: ${subjectsError?.message}`);
    }

    const subjectIdMap = new Map(subjects.map(s => [s.slug, s.id]));
    console.log(`   ✓ Found ${subjects.length} subjects`);

    // 3. Seed each subject's curriculum
    let totalUnits = 0;
    let totalLessons = 0;

    for (const [subjectKey, curriculum] of Object.entries(grade4Curriculum)) {
      const subjectSlug = subjectSlugMap[subjectKey];
      const subjectId = subjectIdMap.get(subjectSlug);

      if (!subjectId) {
        console.warn(`   ⚠️ Subject not found: ${subjectSlug}`);
        continue;
      }

      console.log(`\n📘 Seeding ${curriculum.subjectName}...`);

      for (const unit of curriculum.units) {
        // Insert unit
        const { data: insertedUnit, error: unitError } = await supabase
          .from('units')
          .upsert({
            grade_id: grade.id,
            subject_id: subjectId,
            title: unit.title,
            description: unit.description,
            order_index: unit.orderIndex,
            standards_alignment: unit.standardsAlignment,
          }, {
            onConflict: 'grade_id,subject_id,title',
            ignoreDuplicates: false,
          })
          .select('id')
          .single();

        if (unitError) {
          // Try to find existing unit
          const { data: existingUnit } = await supabase
            .from('units')
            .select('id')
            .eq('grade_id', grade.id)
            .eq('subject_id', subjectId)
            .eq('title', unit.title)
            .single();

          if (!existingUnit) {
            console.error(`   ❌ Failed to insert unit: ${unit.title}`);
            console.error(`      Error: ${unitError.message}`);
            continue;
          }

          // Use existing unit
          const unitId = existingUnit.id;

          // Insert lessons
          for (const lesson of unit.lessons) {
            const { error: lessonError } = await supabase
              .from('lessons')
              .upsert({
                unit_id: unitId,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                video_url: lesson.videoUrl,
                video_source: lesson.videoSource,
                external_link: lesson.externalLink,
                duration_minutes: lesson.durationMinutes,
                order_index: lesson.orderIndex,
                standards: lesson.standards,
              }, {
                onConflict: 'unit_id,title',
                ignoreDuplicates: false,
              });

            if (lessonError) {
              console.error(`   ❌ Failed to insert lesson: ${lesson.title}`);
              console.error(`      Error: ${lessonError.message}`);
            } else {
              totalLessons++;
            }
          }
          totalUnits++;
          continue;
        }

        const unitId = insertedUnit.id;
        totalUnits++;

        // Insert lessons
        for (const lesson of unit.lessons) {
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              unit_id: unitId,
              title: lesson.title,
              description: lesson.description,
              content: lesson.content,
              video_url: lesson.videoUrl,
              video_source: lesson.videoSource,
              external_link: lesson.externalLink,
              duration_minutes: lesson.durationMinutes,
              order_index: lesson.orderIndex,
              standards: lesson.standards,
            });

          if (lessonError) {
            console.error(`   ❌ Failed to insert lesson: ${lesson.title}`);
            console.error(`      Error: ${lessonError.message}`);
          } else {
            totalLessons++;
          }
        }

        console.log(`   ✓ Unit: ${unit.title} (${unit.lessons.length} lessons)`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Seed completed!');
    console.log(`   📚 Units created: ${totalUnits}`);
    console.log(`   📝 Lessons created: ${totalLessons}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed
seedGrade4Curriculum();
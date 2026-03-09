/**
 * Seed curriculum embeddings into Supabase pgvector.
 *
 * Usage:
 *   npx tsx scripts/seed-embeddings.ts
 *
 * Prerequisites:
 *   1. Run supabase-rag-schema.sql on your Supabase instance
 *   2. Install: npm install @xenova/transformers
 *   3. Set env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { generateAllChunks, generateSabiModuleChunks } from '../lib/rag/chunk';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Batch size for embedding generation (avoid OOM)
const BATCH_SIZE = 10;

async function loadEmbeddingModel() {
  console.log('Loading embedding model (all-MiniLM-L6-v2)...');
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('Model loaded.');
  return embedder;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function embed(embedder: any, text: string): Promise<number[]> {
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data as Float32Array).slice(0, 384);
}

async function main() {
  const embedder = await loadEmbeddingModel();

  // Generate all chunks
  console.log('\nChunking curriculum...');
  const lessonChunks = generateAllChunks();
  const moduleChunks = generateSabiModuleChunks();
  const allChunks = [...lessonChunks, ...moduleChunks];

  console.log(`Total chunks: ${allChunks.length}`);
  console.log(`  Lesson chunks: ${lessonChunks.length}`);
  console.log(`  Sabi module chunks: ${moduleChunks.length}`);

  // Clear existing embeddings
  console.log('\nClearing existing embeddings...');
  const { error: deleteError } = await supabase
    .from('curriculum_embeddings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  if (deleteError) {
    console.error('Delete error:', deleteError.message);
  }

  // Process in batches
  let inserted = 0;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);

    // Generate embeddings for batch
    const rows = [];
    for (const chunk of batch) {
      const embedding = await embed(embedder, chunk.chunkText);
      rows.push({
        lesson_id: chunk.lessonId,
        chunk_text: chunk.chunkText,
        chunk_type: chunk.chunkType,
        module: chunk.module,
        subject: chunk.subject,
        embedding,
        metadata: chunk.metadata,
      });
    }

    // Insert batch
    const { error } = await supabase
      .from('curriculum_embeddings')
      .insert(rows);

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} insert error:`, error.message);
    } else {
      inserted += rows.length;
      console.log(`  Inserted ${inserted}/${allChunks.length} chunks`);
    }
  }

  console.log(`\nDone! Inserted ${inserted} embeddings.`);

  // Print stats
  const subjects = new Set(allChunks.map(c => c.subject));
  const modules = new Set(allChunks.map(c => c.module));
  console.log(`\nSubjects: ${[...subjects].join(', ')}`);
  console.log(`Modules: ${[...modules].join(', ')}`);
}

main().catch(console.error);

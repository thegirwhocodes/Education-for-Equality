/**
 * RAG retrieval for Sabi voice tutor.
 * Queries Supabase pgvector for relevant curriculum chunks.
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface RetrievedChunk {
  lessonId: string;
  chunkText: string;
  chunkType: string;
  module: string;
  subject: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

/**
 * Generate embedding for a query using the Supabase edge function
 * or a local model. For now, uses a simple API endpoint.
 *
 * In production on the self-hosted server, this calls the local
 * sentence-transformers model directly.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Option 1: Call our own embedding API endpoint
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/rag/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Embedding API failed: ${res.status}`);
  }

  const { embedding } = await res.json();
  return embedding;
}

/**
 * Search curriculum by student's current module.
 * Returns the most relevant chunks for the student's learning context.
 */
export async function searchCurriculum(
  query: string,
  options: {
    module?: string;        // e.g. 'sabi-addition', 'numeracy-2'
    subject?: string;       // e.g. 'numeracy', 'literacy'
    matchCount?: number;    // default 3
  } = {}
): Promise<RetrievedChunk[]> {
  const { module, subject, matchCount = 3 } = options;

  try {
    const embedding = await generateEmbedding(query);
    const supabase = getSupabase();

    const { data, error } = await supabase.rpc('search_curriculum', {
      query_embedding: embedding,
      match_count: matchCount,
      filter_module: module || null,
      filter_subject: subject || null,
    });

    if (error) {
      console.error('RAG search error:', error.message);
      return [];
    }

    return (data || []).map((row: Record<string, unknown>) => ({
      lessonId: row.lesson_id as string,
      chunkText: row.chunk_text as string,
      chunkType: row.chunk_type as string,
      module: row.module as string,
      subject: row.subject as string,
      similarity: row.similarity as number,
      metadata: (row.metadata || {}) as Record<string, unknown>,
    }));
  } catch (err) {
    console.error('RAG search failed:', err);
    return [];
  }
}

/**
 * Get curriculum context for a Sabi voice call.
 * Given the student's current module, retrieves the most relevant
 * teaching content to inject into the system prompt.
 *
 * This replaces the full 6-module curriculum in the system prompt
 * with just the relevant content (~1,500-2,000 tokens instead of ~9,000).
 */
export async function getSabiCurriculumContext(
  currentModule: number,
  lastSessionSummary?: string
): Promise<string> {
  const moduleNames: Record<number, string> = {
    0: 'sabi-diagnostic',
    1: 'sabi-counting',
    2: 'sabi-addition',
    3: 'sabi-subtraction',
    4: 'sabi-multiplication',
    5: 'sabi-division',
    6: 'sabi-word-problems',
  };

  const moduleName = moduleNames[currentModule] || 'sabi-diagnostic';

  // Build query from module context + last session
  const query = lastSessionSummary
    ? `${moduleName} teaching ${lastSessionSummary}`
    : `${moduleName} teaching foundational numeracy`;

  // Get the current module's teaching instructions
  const moduleChunks = await searchCurriculum(query, {
    module: moduleName,
    subject: 'numeracy',
    matchCount: 2,
  });

  // Also get related lesson content from the foundational numeracy curriculum
  const lessonChunks = await searchCurriculum(query, {
    subject: 'numeracy',
    matchCount: 2,
  });

  // Deduplicate and combine
  const seen = new Set<string>();
  const allChunks = [...moduleChunks, ...lessonChunks].filter(c => {
    if (seen.has(c.lessonId + c.chunkType)) return false;
    seen.add(c.lessonId + c.chunkType);
    return true;
  });

  if (allChunks.length === 0) {
    return ''; // Fallback: no RAG context, full prompt will be used
  }

  // Format as context for the system prompt
  const contextParts = allChunks.map(c =>
    `[${c.chunkType.toUpperCase()}] ${c.chunkText}`
  );

  return `\n\n## CURRICULUM CONTEXT (Retrieved for this session)\n${contextParts.join('\n\n')}`;
}

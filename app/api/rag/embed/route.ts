/**
 * Embedding API endpoint.
 * Generates vector embeddings for text using a lightweight model.
 *
 * For the Next.js app (Vercel), we use the Xenova/transformers.js library
 * which runs all-MiniLM-L6-v2 in the Node.js runtime (no GPU needed).
 *
 * On the self-hosted Python server, this is replaced by sentence-transformers.
 */

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to avoid loading the model at startup
let pipeline: unknown = null;

async function getEmbeddingPipeline() {
  if (!pipeline) {
    const { pipeline: createPipeline } = await import('@xenova/transformers');
    pipeline = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipeline;
}

export async function POST(req: NextRequest) {
  try {
    const { text, texts } = await req.json();

    if (!text && !texts) {
      return NextResponse.json(
        { error: 'Provide "text" (string) or "texts" (string[])' },
        { status: 400 }
      );
    }

    const embeddingPipeline = await getEmbeddingPipeline();

    if (text) {
      // Single text embedding
      // @ts-expect-error - transformers.js types
      const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data as Float32Array).slice(0, 384);
      return NextResponse.json({ embedding });
    }

    // Batch embedding
    const embeddings: number[][] = [];
    for (const t of texts as string[]) {
      // @ts-expect-error - transformers.js types
      const output = await embeddingPipeline(t, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data as Float32Array).slice(0, 384));
    }
    return NextResponse.json({ embeddings });
  } catch (error) {
    console.error('Embedding error:', error);
    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}

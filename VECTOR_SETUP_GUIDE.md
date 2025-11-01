# Vector Support Setup Guide

This guide walks you through setting up vector support for semantic search in the Fusioned EdTech platform.

## Overview

The vector support system enables:
- Semantic search over lesson content
- AI-powered content recommendations
- Intelligent content discovery
- Retrieval-Augmented Generation (RAG) capabilities

## Prerequisites

1. **Supabase Project**: With pgvector extension support
2. **Node.js 18+**: For local development
3. **Supabase CLI**: For database management
4. **Embedding Provider API Keys**: OpenAI or Cohere

## Step 1: Database Setup

### 1.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 1.2 Link to Your Project

```bash
# Navigate to project directory
cd /path/to/fusioned-edtech

# Link to your Supabase project
supabase link --project-ref your-project-ref
```

### 1.3 Run Vector Support Migrations

```bash
# Apply vector support migration
supabase db push --file supabase/migrations/20250101000000_vector_support.sql

# Run test migration to verify setup
supabase db push --file supabase/migrations/20250101000001_test_vector_support.sql
```

### 1.4 Verify pgvector Extension

Connect to your Supabase SQL Editor and run:

```sql
-- Check if pgvector is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Should return one row with extname = 'vector'
```

## Step 2: Environment Configuration

### 2.1 Update Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
nano .env.local
```

Required variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Vector Embedding Configuration
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_COHERE_API_KEY=your-cohere-key

# Default embedding settings
VITE_EMBEDDING_PROVIDER=openai
VITE_EMBEDDING_MODEL=text-embedding-ada-002

# Supabase Edge Functions (for local development)
SUPABASE_FUNCTIONS_URL=http://localhost:54321/functions/v1
```

### 2.2 Store API Keys in Supabase

For production, store API keys securely in Supabase:

```sql
-- Insert OpenAI API key (encrypted)
INSERT INTO user_api_keys (user_id, provider, key_name, encrypted_key)
VALUES (
  'your-user-id',
  'openai',
  'embeddings',
  crypt('sk-your-actual-key', gen_salt('bf'))
);

-- Insert Cohere API key (encrypted)
INSERT INTO user_api_keys (user_id, provider, key_name, encrypted_key)
VALUES (
  'your-user-id',
  'cohere',
  'embeddings',
  crypt('your-cohere-key', gen_salt('bf'))
);
```

## Step 3: Edge Functions Setup

### 3.1 Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy ingestLesson
```

### 3.2 Test Edge Functions Locally

```bash
# Start local Supabase
supabase start

# Test the ingestLesson function
curl -X POST "http://localhost:54321/functions/v1/ingestLesson" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{
    "lesson_chunk_id": "test-uuid",
    "provider": "openai",
    "model": "text-embedding-ada-002"
  }'
```

Expected response (501 - scaffold):
```json
{
  "success": false,
  "error": "Embedding generation not yet implemented - scaffold function",
  "status": "queued",
  "message": "This is a placeholder function...",
  "expected_payload": {...}
}
```

### 3.3 Test Queue Processing Function

```bash
# Test the processEmbeddingQueue function
curl -X POST "http://localhost:54321/functions/v1/processEmbeddingQueue" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-service-role-key"
```

Expected response (200):
```json
{
  "success": true,
  "processed": 0,
  "errors": 0,
  "message": "No items in embedding queue"
}
```

## Step 4: Verify Setup

### 4.1 Check Database Schema

```sql
-- Verify lesson_embeddings table exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lesson_embeddings'
ORDER BY ordinal_position;

-- Should show: id, lesson_chunk_id, embedding, provider, model, metadata, created_at, updated_at
```

### 4.2 Test Sample Data

```sql
-- The test migration should have created sample data
SELECT COUNT(*) as embedding_count
FROM lesson_embeddings
WHERE metadata->>'test' = 'true';

-- Should return 1 (sample embedding)
```

### 4.3 Test Similarity Search

```sql
-- Test the similarity search function
SELECT * FROM find_similar_lesson_chunks(
  query_embedding => (SELECT embedding FROM lesson_embeddings LIMIT 1),
  match_threshold => 0.5,
  match_count => 5
);

-- Should return the sample embedding with high similarity
```

## Step 5: Integration Examples

### 5.1 Generate Embeddings

```typescript
// client/src/lib/embeddings.ts
import { supabase } from './supabase';

export async function generateEmbedding(
  lessonChunkId: string,
  options: {
    provider?: string;
    model?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  const { data, error } = await supabase.functions.invoke('ingestLesson', {
    body: {
      lesson_chunk_id: lessonChunkId,
      provider: options.provider || 'openai',
      model: options.model || 'text-embedding-ada-002',
      metadata: options.metadata
    }
  });

  if (error) throw error;
  return data;
}
```

### 5.2 Semantic Search

```typescript
// client/src/lib/semantic-search.ts
import { supabase } from './supabase';

export async function findSimilarContent(
  queryEmbedding: number[],
  options: {
    threshold?: number;
    limit?: number;
    courseId?: string;
    difficultyRange?: [number, number];
  } = {}
) {
  const { data, error } = await supabase.rpc('find_similar_lesson_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: options.threshold || 0.8,
    match_count: options.limit || 10,
    course_id_filter: options.courseId,
    difficulty_min: options.difficultyRange?.[0],
    difficulty_max: options.difficultyRange?.[1]
  });

  if (error) throw error;
  return data;
}
```

## Step 6: Performance Optimization

### 6.1 Index Tuning

After you have real data, optimize the vector index:

```sql
-- Check current row count
SELECT COUNT(*) FROM lesson_embeddings;

-- Recreate index with optimal parameters
DROP INDEX IF EXISTS idx_lesson_embeddings_embedding;
CREATE INDEX idx_lesson_embeddings_embedding 
ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100); -- Adjust based on your data size
```

### 6.2 Batch Processing

Generate embeddings for existing content:

```sql
-- Find chunks without embeddings
SELECT 
  lc.id,
  lc.chunk_text,
  l.title as lesson_title,
  c.title as course_title
FROM lesson_chunks lc
JOIN lessons l ON l.id = lc.lesson_id
JOIN courses c ON c.id = l.course_id
WHERE NOT EXISTS (
  SELECT 1 FROM lesson_embeddings le 
  WHERE le.lesson_chunk_id = lc.id
)
AND l.is_published = true
ORDER BY c.title, l.title, lc.chunk_index;
```

## Troubleshooting

### Common Issues

1. **pgvector Extension Not Found**
   ```sql
   -- Enable manually if migration failed
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Edge Function Returns 500**
   - Check environment variables are set
   - Verify Supabase project is linked
   - Check function logs: `supabase functions logs`

3. **Vector Index Not Created**
   - Insert some sample data first
   - Index needs data to be created
   - Run the test migration

4. **Slow Search Performance**
   - Check if vector index exists
   - Optimize index parameters
   - Consider materialized views

### Debug Queries

```sql
-- Check extension status
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Verify table structure
\d lesson_embeddings;

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE tablename = 'lesson_embeddings';

-- Test vector operations
SELECT '[1,2,3]'::vector <=> '[1,2,3]'::vector;
```

## Next Steps

1. **Complete Edge Function**: Implement actual embedding generation
2. **Add Triggers**: Auto-generate embeddings when lesson chunks change
3. **UI Integration**: Add semantic search to the frontend
4. **Monitoring**: Track embedding generation and search performance
5. **Optimization**: Fine-tune based on actual usage patterns

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **pgvector Documentation**: https://github.com/pgvector/pgvector
- **OpenAI Embeddings**: https://platform.openai.com/docs/guides/embeddings
- **Cohere Embeddings**: https://docs.cohere.com/docs/embeddings

For issues specific to this implementation:
1. Check the migration logs: `supabase db logs`
2. Review edge function logs: `supabase functions logs`
3. Test queries in Supabase SQL Editor
4. Verify environment variables are correctly set
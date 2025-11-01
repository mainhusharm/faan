/*
  Vector Support Migration
  
  This migration enables pgvector extension and creates the lesson_embeddings table
  for storing and searching lesson content embeddings using ANN (Approximate Nearest Neighbor)
  
  Features:
  - pgvector extension installation
  - lesson_embeddings table with vector storage
  - ivfflat index for efficient similarity search
  - Trigger to automatically generate embeddings when lesson chunks change
  - RLS policies for secure access
*/

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Lesson embeddings table for semantic search
CREATE TABLE IF NOT EXISTS lesson_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_chunk_id uuid REFERENCES lesson_chunks(id) ON DELETE CASCADE NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension (adjust as needed)
  provider text NOT NULL DEFAULT 'openai', -- openai, cohere, etc.
  model text NOT NULL DEFAULT 'text-embedding-ada-002', -- embedding model name
  metadata jsonb DEFAULT '{}'::jsonb, -- Additional metadata (concept IDs, course, difficulty, etc.)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_lesson_chunk_provider_model UNIQUE(lesson_chunk_id, provider, model)
);

-- ============================================================================
-- INDICES
-- ============================================================================

-- Create ivfflat index for efficient ANN similarity search
-- Note: ivfflat index requires some data before creation, will be created after initial data
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_embedding 
ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100); -- Adjust lists based on data size (roughly sqrt(rows))

-- Additional indices for filtering
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_lesson_chunk ON lesson_embeddings(lesson_chunk_id);
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_provider ON lesson_embeddings(provider);
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_model ON lesson_embeddings(model);
CREATE INDEX IF NOT EXISTS idx_lesson_embeddings_created_at ON lesson_embeddings(created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_lesson_embeddings_updated_at
  BEFORE UPDATE ON lesson_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to trigger embedding generation when lesson chunks change
CREATE OR REPLACE FUNCTION trigger_embedding_generation()
RETURNS TRIGGER AS $
BEGIN
  -- Only trigger for published lessons to avoid generating embeddings for drafts
  IF EXISTS (
    SELECT 1 FROM lessons l 
    WHERE l.id = NEW.lesson_id 
    AND l.is_published = true
  ) THEN
    -- This would typically call the edge function or enqueue a job
    -- For now, we'll create a placeholder record in a queue table
    INSERT INTO embedding_queue (lesson_chunk_id, action, created_at)
    VALUES (NEW.id, 'generate_embedding', now())
    ON CONFLICT (lesson_chunk_id) DO UPDATE SET
      action = 'generate_embedding',
      created_at = now();
  END IF;
  
  RETURN NEW;
END;
$ language 'plpgsql';

-- Create embedding queue table for job processing
CREATE TABLE IF NOT EXISTS embedding_queue (
  lesson_chunk_id uuid PRIMARY KEY REFERENCES lesson_chunks(id) ON DELETE CASCADE,
  action text NOT NULL DEFAULT 'generate_embedding',
  attempts integer DEFAULT 0,
  last_attempt_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on embedding queue
CREATE INDEX IF NOT EXISTS idx_embedding_queue_created_at ON embedding_queue(created_at);

-- Enable RLS on embedding queue
ALTER TABLE embedding_queue ENABLE ROW LEVEL SECURITY;

-- Policy for embedding queue (only service role can access)
CREATE POLICY "Service role can manage embedding queue"
  ON embedding_queue
  FOR ALL
  TO service_role
  USING (true);

-- Trigger to enqueue embedding generation when lesson chunks are created or updated
CREATE TRIGGER enqueue_embedding_generation
  AFTER INSERT OR UPDATE ON lesson_chunks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_embedding_generation();

-- Trigger to auto-update embedding queue timestamp
CREATE TRIGGER update_embedding_queue_updated_at
  BEFORE UPDATE ON embedding_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE lesson_embeddings ENABLE ROW LEVEL SECURITY;

-- Policy for viewing embeddings of published lessons
DROP POLICY IF EXISTS "Users can view embeddings of published lessons" ON lesson_embeddings;
CREATE POLICY "Users can view embeddings of published lessons"
  ON lesson_embeddings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lesson_chunks lc
      JOIN lessons l ON l.id = lc.lesson_id
      WHERE lc.id = lesson_chunk_id 
      AND (l.is_published = true OR
           EXISTS (
             SELECT 1 FROM profiles p
             WHERE p.id = auth.uid() 
             AND p.role IN ('teacher', 'admin')
           ))
    )
  );

-- Policy for teachers/admins to manage embeddings
DROP POLICY IF EXISTS "Teachers can manage lesson embeddings" ON lesson_embeddings;
CREATE POLICY "Teachers can manage lesson embeddings"
  ON lesson_embeddings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- FUNCTIONS FOR SIMILARITY SEARCH
-- ============================================================================

-- Function to find similar lesson chunks by embedding
CREATE OR REPLACE FUNCTION find_similar_lesson_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.8,
  match_count int DEFAULT 10,
  course_id_filter uuid DEFAULT NULL,
  difficulty_min int DEFAULT NULL,
  difficulty_max int DEFAULT NULL
)
RETURNS TABLE (
  lesson_chunk_id uuid,
  lesson_id uuid,
  chunk_text text,
  chunk_index int,
  similarity float,
  lesson_title text,
  course_id uuid,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lc.id as lesson_chunk_id,
    lc.lesson_id,
    lc.chunk_text,
    lc.chunk_index,
    1 - (le.embedding <=> query_embedding) as similarity,
    l.title as lesson_title,
    l.course_id,
    le.metadata
  FROM lesson_embeddings le
  JOIN lesson_chunks lc ON lc.id = le.lesson_chunk_id
  JOIN lessons l ON l.id = lc.lesson_id
  WHERE 1 - (le.embedding <=> query_embedding) > match_threshold
    AND l.is_published = true
    AND (course_id_filter IS NULL OR l.course_id = course_id_filter)
    AND (difficulty_min IS NULL OR (le.metadata->>'difficulty')::int >= difficulty_min)
    AND (difficulty_max IS NULL OR (le.metadata->>'difficulty')::int <= difficulty_max)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample embedding for testing (will be replaced by actual embeddings)
-- This creates a dummy embedding to ensure the ivfflat index can be created
DO $$
DECLARE
  sample_chunk_id uuid;
BEGIN
  -- Get a sample lesson chunk if exists
  SELECT id INTO sample_chunk_id FROM lesson_chunks LIMIT 1;
  
  IF sample_chunk_id IS NOT NULL THEN
    INSERT INTO lesson_embeddings (
      lesson_chunk_id, 
      embedding, 
      provider, 
      model,
      metadata
    ) VALUES (
      sample_chunk_id,
      -- Create a dummy 1536-dimensional vector (all zeros for now)
      ARRAY_FILL(0.0, ARRAY[1536])::vector(1536),
      'openai',
      'text-embedding-ada-002',
      '{"test": true, "difficulty": 3}'
    )
    ON CONFLICT (lesson_chunk_id, provider, model) DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- NOTES
-- ============================================================================

/*
IMPORTANT NOTES FOR DEVELOPERS:

1. pgvector Extension:
   - This migration enables the pgvector extension
   - Requires PostgreSQL 11+ and pgvector extension installed on the database
   - For local development: CREATE EXTENSION vector;
   - For Supabase: Already available in most projects

2. Embedding Dimensions:
   - Default is 1536 for OpenAI text-embedding-ada-002
   - Adjust vector dimension if using different models:
     * OpenAI text-embedding-3-small: 1536
     * OpenAI text-embedding-3-large: 3072
     * Cohere embed-english-v3.0: 1024

3. Index Performance:
   - ivfflat index requires some data before creation
   - 'lists' parameter should be roughly sqrt(rows)
   - For < 1M rows: lists = rows / 1000
   - For > 1M rows: lists = sqrt(rows)

4. Similarity Search:
   - Use <=> operator for cosine distance (lower = more similar)
   - Use 1 - (embedding <=> query) for cosine similarity (higher = more similar)
   - Typical similarity thresholds: 0.7-0.9 for high quality matches

5. Trigger Integration:
   - This migration creates the table structure
   - Edge function 'ingestLesson' will handle embedding generation
   - Consider adding triggers to auto-generate embeddings when lesson_chunks change

6. Metadata Structure:
   - Store concept IDs as array: metadata->'concept_ids'
   - Store difficulty as integer: metadata->>'difficulty'
   - Store course context: metadata->'course_id'
   - Store any filtering criteria needed for search
*/
-- Homework Helper Feature Migration
-- Creates tables for photo upload homework assistance

-- Create homework_uploads table
CREATE TABLE IF NOT EXISTS homework_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  format TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create homework_analysis table
CREATE TABLE IF NOT EXISTS homework_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
  ocr_text TEXT,
  content_type TEXT,
  sub_topic TEXT,
  question_type TEXT,
  processing_metadata JSONB DEFAULT '{}',
  confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create homework_solutions table
CREATE TABLE IF NOT EXISTS homework_solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES homework_analysis(id) ON DELETE CASCADE,
  explanation TEXT NOT NULL,
  step_by_step_solution JSONB DEFAULT '[]',
  common_mistakes TEXT[],
  related_concepts TEXT[],
  practice_problems JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_homework_uploads_user_id ON homework_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_uploads_created_at ON homework_uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homework_analysis_upload_id ON homework_analysis(upload_id);
CREATE INDEX IF NOT EXISTS idx_homework_solutions_analysis_id ON homework_solutions(analysis_id);

-- Enable Row Level Security
ALTER TABLE homework_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_solutions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for homework_uploads
CREATE POLICY "Users can view their own uploads"
  ON homework_uploads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON homework_uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads"
  ON homework_uploads
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
  ON homework_uploads
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for homework_analysis
CREATE POLICY "Users can view analysis of their uploads"
  ON homework_analysis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework_uploads
      WHERE homework_uploads.id = homework_analysis.upload_id
      AND homework_uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert analysis"
  ON homework_analysis
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM homework_uploads
      WHERE homework_uploads.id = homework_analysis.upload_id
      AND homework_uploads.user_id = auth.uid()
    )
  );

-- Create RLS policies for homework_solutions
CREATE POLICY "Users can view solutions of their analysis"
  ON homework_solutions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework_analysis
      JOIN homework_uploads ON homework_uploads.id = homework_analysis.upload_id
      WHERE homework_analysis.id = homework_solutions.analysis_id
      AND homework_uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert solutions"
  ON homework_solutions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM homework_analysis
      JOIN homework_uploads ON homework_uploads.id = homework_analysis.upload_id
      WHERE homework_analysis.id = homework_solutions.analysis_id
      AND homework_uploads.user_id = auth.uid()
    )
  );

-- Create storage bucket for homework images
INSERT INTO storage.buckets (id, name, public)
VALUES ('homework-images', 'homework-images', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their homework images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'homework-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their homework images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'homework-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their homework images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'homework-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to clean up old homework uploads (optional auto-delete after 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_homework()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete uploads older than 30 days where user has enabled auto-delete
  DELETE FROM homework_uploads
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND (metadata->>'auto_delete')::boolean = true;
END;
$$;

-- Add comment to explain the tables
COMMENT ON TABLE homework_uploads IS 'Stores metadata for uploaded homework images';
COMMENT ON TABLE homework_analysis IS 'Stores OCR and content classification results';
COMMENT ON TABLE homework_solutions IS 'Stores AI-generated solutions and explanations';

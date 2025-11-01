/*
  # Extended Learning Schema Migration
  
  This migration creates a comprehensive learning management system schema including:
  - Lessons and lesson chunks for structured content delivery
  - Assessments with items and attempt tracking
  - Chat sessions for AI tutoring
  - Flashcard system for spaced repetition
  - Concept graph for knowledge mapping
  - Mastery tracking for personalized learning paths
  - Course enrollments with role-based access
  
  All tables include:
  - Proper foreign key relationships
  - Timestamps for audit trails
  - Row Level Security policies for multi-tenant access
  - Supporting indices for performance
*/

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE lesson_type AS ENUM ('video', 'reading', 'interactive', 'practice', 'project');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assessment_type AS ENUM ('quiz', 'test', 'assignment', 'exam', 'practice');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE chat_mode AS ENUM ('tutor', 'concept_explorer', 'study_buddy', 'homework_help');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'guardian', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE mastery_level AS ENUM ('not_started', 'learning', 'practicing', 'mastered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Add role column to profiles if not exists
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'student';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role DEFAULT 'student' NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  lesson_type lesson_type DEFAULT 'reading' NOT NULL,
  content jsonb DEFAULT '{}'::jsonb, -- Flexible content structure
  media_url text, -- Video, image, or other media
  duration_minutes integer, -- Estimated completion time
  order_index integer NOT NULL,
  is_published boolean DEFAULT false,
  prerequisites uuid[], -- Array of lesson IDs
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lesson chunks for RAG/semantic search
CREATE TABLE IF NOT EXISTS lesson_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  chunk_text text NOT NULL,
  chunk_index integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb, -- Embedding vectors, tags, etc.
  created_at timestamptz DEFAULT now()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assessment_type assessment_type DEFAULT 'quiz' NOT NULL,
  time_limit_minutes integer, -- NULL means no time limit
  passing_score integer, -- Percentage needed to pass
  max_attempts integer, -- NULL means unlimited
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT assessment_must_have_parent CHECK (course_id IS NOT NULL OR lesson_id IS NOT NULL)
);

-- Assessment items (questions/tasks)
CREATE TABLE IF NOT EXISTS assessment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  question_type text DEFAULT 'multiple_choice', -- multiple_choice, true_false, short_answer, essay
  options jsonb, -- For multiple choice: {"choices": ["A", "B", "C"], "correct": 0}
  correct_answer text, -- For non-MC questions
  explanation text,
  points integer DEFAULT 1,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User attempts at assessments
CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer, -- Percentage score
  responses jsonb DEFAULT '{}'::jsonb, -- {"item_id": "answer", ...}
  time_spent_seconds integer,
  is_passed boolean,
  created_at timestamptz DEFAULT now()
);

-- Chat sessions for AI tutoring
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  mode chat_mode DEFAULT 'tutor' NOT NULL,
  title text,
  messages jsonb DEFAULT '[]'::jsonb, -- Array of {role, content, timestamp}
  context jsonb DEFAULT '{}'::jsonb, -- Related concepts, materials, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Flashcard sets
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id uuid REFERENCES flashcard_sets(id) ON DELETE CASCADE NOT NULL,
  front_text text NOT NULL,
  back_text text NOT NULL,
  media_url text,
  order_index integer,
  created_at timestamptz DEFAULT now()
);

-- Mastery states for lessons
CREATE TABLE IF NOT EXISTS mastery_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  mastery_level mastery_level DEFAULT 'not_started' NOT NULL,
  last_practiced_at timestamptz,
  practice_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Concepts for knowledge graph
CREATE TABLE IF NOT EXISTS concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  subject_area text, -- Math, Science, Language, etc.
  difficulty_level integer DEFAULT 1, -- 1-10 scale
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Concept edges for prerequisite relationships
CREATE TABLE IF NOT EXISTS concept_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE NOT NULL,
  to_concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE NOT NULL,
  relationship_type text DEFAULT 'prerequisite', -- prerequisite, related, advanced
  strength numeric(3,2) DEFAULT 1.0, -- 0.0 to 1.0
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_concept_id, to_concept_id, relationship_type)
);

-- User concept mastery tracking
CREATE TABLE IF NOT EXISTS user_concept_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE NOT NULL,
  mastery_level mastery_level DEFAULT 'not_started' NOT NULL,
  confidence_score numeric(4,3) DEFAULT 0.0, -- 0.0 to 1.0
  last_practiced_at timestamptz,
  practice_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

-- ============================================================================
-- INDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_lesson_chunks_lesson ON lesson_chunks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_lesson ON assessments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assessment_items_assessment ON assessment_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_incomplete ON attempts(user_id, completed_at) WHERE completed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_sets_user ON flashcard_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_set ON flashcards(set_id);
CREATE INDEX IF NOT EXISTS idx_mastery_states_user ON mastery_states(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_states_lesson ON mastery_states(lesson_id);
CREATE INDEX IF NOT EXISTS idx_concept_edges_from ON concept_edges(from_concept_id);
CREATE INDEX IF NOT EXISTS idx_concept_edges_to ON concept_edges(to_concept_id);
CREATE INDEX IF NOT EXISTS idx_user_concept_mastery_user ON user_concept_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_user_concept_mastery_concept ON user_concept_mastery(concept_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for active prerequisite concept relationships
CREATE OR REPLACE VIEW active_concept_links AS
SELECT 
  ce.id,
  ce.from_concept_id,
  c1.name as from_concept_name,
  ce.to_concept_id,
  c2.name as to_concept_name,
  ce.relationship_type,
  ce.strength
FROM concept_edges ce
JOIN concepts c1 ON ce.from_concept_id = c1.id
JOIN concepts c2 ON ce.to_concept_id = c2.id
WHERE ce.relationship_type = 'prerequisite'
ORDER BY c1.name, c2.name;

-- View for outstanding (incomplete) attempts
CREATE OR REPLACE VIEW outstanding_attempts AS
SELECT 
  a.id,
  a.user_id,
  p.full_name as user_name,
  a.assessment_id,
  asmt.title as assessment_title,
  a.started_at,
  EXTRACT(EPOCH FROM (now() - a.started_at))/60 as minutes_elapsed
FROM attempts a
JOIN assessments asmt ON a.assessment_id = asmt.id
JOIN profiles p ON a.user_id = p.id
WHERE a.completed_at IS NULL
ORDER BY a.started_at DESC;

-- View for user mastery summary
CREATE OR REPLACE VIEW user_mastery_summary AS
SELECT 
  u.id as user_id,
  p.full_name,
  COUNT(DISTINCT ucm.concept_id) as total_concepts,
  COUNT(DISTINCT ucm.concept_id) FILTER (WHERE ucm.mastery_level = 'mastered') as mastered_concepts,
  COUNT(DISTINCT ucm.concept_id) FILTER (WHERE ucm.mastery_level = 'practicing') as practicing_concepts,
  COUNT(DISTINCT ucm.concept_id) FILTER (WHERE ucm.mastery_level = 'learning') as learning_concepts,
  AVG(ucm.confidence_score) as avg_confidence
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN user_concept_mastery ucm ON u.id = ucm.user_id
GROUP BY u.id, p.full_name;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_concept_mastery ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Course Enrollments
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view course enrollments" ON course_enrollments;
CREATE POLICY "Teachers can view course enrollments"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can enroll themselves as students" ON course_enrollments;
CREATE POLICY "Users can enroll themselves as students"
  ON course_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'student');

DROP POLICY IF EXISTS "Teachers can manage enrollments" ON course_enrollments;
CREATE POLICY "Teachers can manage enrollments"
  ON course_enrollments
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
-- RLS POLICIES - Lessons
-- ============================================================================

DROP POLICY IF EXISTS "Students can view published lessons" ON lessons;
CREATE POLICY "Students can view published lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    is_published = true OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

DROP POLICY IF EXISTS "Teachers can manage lessons" ON lessons;
CREATE POLICY "Teachers can manage lessons"
  ON lessons
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
-- RLS POLICIES - Lesson Chunks
-- ============================================================================

DROP POLICY IF EXISTS "Users can view chunks of published lessons" ON lesson_chunks;
CREATE POLICY "Users can view chunks of published lessons"
  ON lesson_chunks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.id = lesson_id 
      AND (l.is_published = true OR
           EXISTS (
             SELECT 1 FROM profiles p
             WHERE p.id = auth.uid() 
             AND p.role IN ('teacher', 'admin')
           ))
    )
  );

DROP POLICY IF EXISTS "Teachers can manage lesson chunks" ON lesson_chunks;
CREATE POLICY "Teachers can manage lesson chunks"
  ON lesson_chunks
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
-- RLS POLICIES - Assessments
-- ============================================================================

DROP POLICY IF EXISTS "Students can view published assessments" ON assessments;
CREATE POLICY "Students can view published assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    is_published = true OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

DROP POLICY IF EXISTS "Teachers can manage assessments" ON assessments;
CREATE POLICY "Teachers can manage assessments"
  ON assessments
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
-- RLS POLICIES - Assessment Items
-- ============================================================================

DROP POLICY IF EXISTS "Users can view items of published assessments" ON assessment_items;
CREATE POLICY "Users can view items of published assessments"
  ON assessment_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_id 
      AND (a.is_published = true OR
           EXISTS (
             SELECT 1 FROM profiles p
             WHERE p.id = auth.uid() 
             AND p.role IN ('teacher', 'admin')
           ))
    )
  );

DROP POLICY IF EXISTS "Teachers can manage assessment items" ON assessment_items;
CREATE POLICY "Teachers can manage assessment items"
  ON assessment_items
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
-- RLS POLICIES - Attempts
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own attempts" ON attempts;
CREATE POLICY "Users can view own attempts"
  ON attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own attempts" ON attempts;
CREATE POLICY "Users can create own attempts"
  ON attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attempts" ON attempts;
CREATE POLICY "Users can update own attempts"
  ON attempts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all attempts" ON attempts;
CREATE POLICY "Teachers can view all attempts"
  ON attempts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- RLS POLICIES - Chat Sessions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own chat sessions" ON chat_sessions;
CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all chat sessions" ON chat_sessions;
CREATE POLICY "Teachers can view all chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- RLS POLICIES - Flashcard Sets
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own flashcard sets" ON flashcard_sets;
CREATE POLICY "Users can view own flashcard sets"
  ON flashcard_sets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can manage own flashcard sets" ON flashcard_sets;
CREATE POLICY "Users can manage own flashcard sets"
  ON flashcard_sets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Flashcards
-- ============================================================================

DROP POLICY IF EXISTS "Users can view flashcards they have access to" ON flashcards;
CREATE POLICY "Users can view flashcards they have access to"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs
      WHERE fs.id = set_id 
      AND (fs.user_id = auth.uid() OR fs.is_public = true)
    )
  );

DROP POLICY IF EXISTS "Users can manage own flashcards" ON flashcards;
CREATE POLICY "Users can manage own flashcards"
  ON flashcards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs
      WHERE fs.id = set_id 
      AND fs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashcard_sets fs
      WHERE fs.id = set_id 
      AND fs.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - Mastery States
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own mastery states" ON mastery_states;
CREATE POLICY "Users can view own mastery states"
  ON mastery_states
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own mastery states" ON mastery_states;
CREATE POLICY "Users can manage own mastery states"
  ON mastery_states
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all mastery states" ON mastery_states;
CREATE POLICY "Teachers can view all mastery states"
  ON mastery_states
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- RLS POLICIES - Concepts
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view concepts" ON concepts;
CREATE POLICY "Anyone can view concepts"
  ON concepts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Teachers can manage concepts" ON concepts;
CREATE POLICY "Teachers can manage concepts"
  ON concepts
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
-- RLS POLICIES - Concept Edges
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view concept edges" ON concept_edges;
CREATE POLICY "Anyone can view concept edges"
  ON concept_edges
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Teachers can manage concept edges" ON concept_edges;
CREATE POLICY "Teachers can manage concept edges"
  ON concept_edges
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
-- RLS POLICIES - User Concept Mastery
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own concept mastery" ON user_concept_mastery;
CREATE POLICY "Users can view own concept mastery"
  ON user_concept_mastery
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own concept mastery" ON user_concept_mastery;
CREATE POLICY "Users can manage own concept mastery"
  ON user_concept_mastery
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all concept mastery" ON user_concept_mastery;
CREATE POLICY "Teachers can view all concept mastery"
  ON user_concept_mastery
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('teacher', 'admin')
    )
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_flashcard_sets_updated_at ON flashcard_sets;
CREATE TRIGGER update_flashcard_sets_updated_at
  BEFORE UPDATE ON flashcard_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mastery_states_updated_at ON mastery_states;
CREATE TRIGGER update_mastery_states_updated_at
  BEFORE UPDATE ON mastery_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_concept_mastery_updated_at ON user_concept_mastery;
CREATE TRIGGER update_user_concept_mastery_updated_at
  BEFORE UPDATE ON user_concept_mastery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

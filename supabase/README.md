# Supabase Learning Schema

This directory contains database migrations for the Fusioned EdTech learning management system.

## Overview

The schema includes comprehensive tables for:
- 📚 **Lessons & Content**: Structured learning materials with chunking for RAG
- 📝 **Assessments**: Quizzes, tests, and assignments with item-level tracking
- 🎯 **Mastery Tracking**: Individual and concept-level progress monitoring
- 💬 **AI Chat Sessions**: Contextual tutoring and study assistance
- 🃏 **Flashcards**: Spaced repetition learning tools
- 🧠 **Concept Graph**: Knowledge prerequisites and relationships
- 👥 **Course Enrollments**: Role-based access control

## Migration Files

### 20250120000000_learning_schema.sql
Main schema migration creating:
- 5 enum types (lesson_type, assessment_type, chat_mode, user_role, mastery_level)
- 13 new tables with foreign keys and timestamps
- 3 supporting views (active_concept_links, outstanding_attempts, user_mastery_summary)
- Comprehensive RLS policies for all roles
- Performance indices
- Automated triggers for updated_at columns

### 20250120000001_seed_learning_data.sql
Seed data migration including:
- 12 programming concepts (Variables through Algorithm Complexity)
- Prerequisite relationships and related concept links
- 3 sample lessons with chunked content
- 2 assessments with multiple-choice items
- 1 public flashcard set with 8 cards
- Sample course enrollments

### 20250120000002_rls_tests.sql
Comprehensive test suite verifying:
- Table creation and structure
- RLS policy enforcement
- View functionality
- Index creation
- Foreign key constraints
- Trigger functionality

## Running Migrations

### Prerequisites
1. Supabase CLI installed: `npm install -g supabase`
2. Supabase project initialized
3. Environment variables configured

### Apply Migrations

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push

# Or run migrations individually
supabase db push --file supabase/migrations/20250120000000_learning_schema.sql
supabase db push --file supabase/migrations/20250120000001_seed_learning_data.sql
supabase db push --file supabase/migrations/20250120000002_rls_tests.sql
```

### Verify Migrations

After running migrations, check the Supabase Studio:
1. Navigate to Table Editor - verify all tables exist
2. Check Database > Roles > Policies - verify RLS policies
3. Run the test queries in the SQL Editor
4. Verify seed data in relevant tables

## Schema Details

### Core Tables

#### `lessons`
Structured learning content with flexible JSON storage:
- Supports video, reading, interactive, practice, and project types
- Content stored as JSONB for flexible schemas
- Prerequisites as UUID array for learning paths

#### `lesson_chunks`
Text chunks for RAG (Retrieval-Augmented Generation):
- Enables semantic search over lesson content
- Metadata field for embeddings and tags
- Linked to parent lesson

#### `assessments` & `assessment_items`
Multi-level assessment system:
- Assessments can belong to courses or lessons
- Items support multiple question types
- Time limits and passing scores configurable

#### `attempts`
User assessment tracking:
- Records start/completion times
- Stores user responses as JSONB
- Calculates pass/fail status

#### `concepts` & `concept_edges`
Knowledge graph for adaptive learning:
- Concepts with difficulty levels
- Edges define relationships (prerequisite, related, advanced)
- Strength weighting for recommendation algorithms

#### `user_concept_mastery`
Personalized learning progress:
- Tracks mastery level per concept
- Confidence scores for adaptive testing
- Practice count and last practice timestamp

### Supporting Tables

- **`course_enrollments`**: User-course relationships with roles
- **`chat_sessions`**: AI tutoring conversation history
- **`flashcard_sets`** & **`flashcards`**: Spaced repetition tools
- **`mastery_states`**: Lesson-level progress tracking

### Views

- **`active_concept_links`**: Prerequisite relationships for learning paths
- **`outstanding_attempts`**: Incomplete assessments needing attention
- **`user_mastery_summary`**: Aggregate learning progress statistics

## Row Level Security (RLS)

### Role Hierarchy
1. **Student**: Can view published content, manage own data
2. **Teacher**: Can view all content, manage enrollments
3. **Guardian**: Can view linked student data (future implementation)
4. **Admin**: Full access to all data

### Policy Patterns

**Published Content**: Students see only published lessons/assessments
```sql
is_published = true OR user_has_teacher_role
```

**Own Data**: Users can only access their own attempts, chat sessions, etc.
```sql
auth.uid() = user_id
```

**Teacher Access**: Teachers and admins can view all content
```sql
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
```

## Usage Examples

### TypeScript Client Usage

```typescript
import { supabase } from './lib/supabase';

// Fetch published lessons for a course
const { data: lessons } = await supabase
  .from('lessons')
  .select('*')
  .eq('course_id', courseId)
  .eq('is_published', true)
  .order('order_index');

// Create an assessment attempt
const { data: attempt } = await supabase
  .from('attempts')
  .insert({
    assessment_id: assessmentId,
    user_id: userId,
    started_at: new Date().toISOString()
  })
  .select()
  .single();

// Get user's concept mastery
const { data: mastery } = await supabase
  .from('user_concept_mastery')
  .select('*, concepts(*)')
  .eq('user_id', userId)
  .gte('confidence_score', 0.7);

// Fetch active concept prerequisites
const { data: links } = await supabase
  .from('active_concept_links')
  .select('*')
  .eq('from_concept_id', conceptId);
```

### SQL Query Examples

```sql
-- Get all lessons with their concepts
SELECT 
  l.*,
  array_agg(c.name) as concept_names
FROM lessons l
LEFT JOIN jsonb_array_elements_text(l.content->'concepts') concept_id ON true
LEFT JOIN concepts c ON c.id = concept_id::uuid
GROUP BY l.id;

-- Find users struggling with a concept
SELECT 
  p.full_name,
  ucm.confidence_score,
  ucm.practice_count
FROM user_concept_mastery ucm
JOIN profiles p ON ucm.user_id = p.id
WHERE ucm.concept_id = 'concept-uuid'
  AND ucm.confidence_score < 0.5
ORDER BY ucm.confidence_score;

-- Get recommended next lessons based on mastery
SELECT 
  l.*,
  COUNT(ms.id) FILTER (WHERE ms.mastery_level = 'mastered') as prerequisites_met
FROM lessons l
LEFT JOIN mastery_states ms ON ms.user_id = 'user-uuid'
  AND ms.lesson_id = ANY(l.prerequisites)
GROUP BY l.id
HAVING COUNT(ms.id) FILTER (WHERE ms.mastery_level = 'mastered') = array_length(l.prerequisites, 1)
  OR l.prerequisites IS NULL;
```

## Maintenance

### Adding New Concepts

```sql
-- Insert a new concept
INSERT INTO concepts (name, description, subject_area, difficulty_level)
VALUES ('New Concept', 'Description', 'Programming', 5);

-- Create prerequisite relationships
INSERT INTO concept_edges (from_concept_id, to_concept_id, relationship_type)
SELECT 
  (SELECT id FROM concepts WHERE name = 'Prerequisite Concept'),
  (SELECT id FROM concepts WHERE name = 'New Concept'),
  'prerequisite';
```

### Updating RLS Policies

If you need to modify access patterns:

```sql
-- Drop old policy
DROP POLICY "policy_name" ON table_name;

-- Create new policy
CREATE POLICY "new_policy_name"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (your_condition);
```

### Performance Monitoring

Check slow queries:
```sql
-- Enable query statistics
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Monitor index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## Troubleshooting

### Migration Fails
- Check for conflicting table names
- Ensure previous migrations completed
- Verify database connection
- Review error logs: `supabase db logs`

### RLS Denies Access
- Verify user role in profiles table
- Check auth.uid() returns correct value
- Test policies in SQL editor with `SET LOCAL role = 'authenticated'`
- Review policy using `\dp table_name` in psql

### Seed Data Not Inserted
- Ensure parent records exist (courses, profiles)
- Check foreign key constraints
- Verify ON CONFLICT clauses work correctly
- Run seed migration separately with verbose logging

## Next Steps

1. **Guardian Role Implementation**: Add guardian-student relationships
2. **API Key Storage**: Integrate with existing user_api_keys table
3. **Analytics Tables**: Track detailed usage metrics
4. **Content Versioning**: Add version tracking for lessons/assessments
5. **Real-time Subscriptions**: Set up Supabase Realtime for live updates

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review migration logs
- Test RLS policies manually in SQL editor
- Validate foreign key relationships

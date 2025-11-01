# Learning Schema Implementation

This document describes the extended learning schema implemented for Fusioned EdTech platform.

## Overview

The learning schema extends the existing course/video structure with comprehensive learning management features including:

- ✅ Structured lessons with flexible content types
- ✅ Multi-level assessment system with attempt tracking
- ✅ Knowledge graph for adaptive learning paths
- ✅ Mastery tracking at lesson and concept levels
- ✅ AI chat sessions for tutoring
- ✅ Flashcard system for spaced repetition
- ✅ Role-based access control (Student, Teacher, Guardian, Admin)

## What's New

### Database Tables (13 new tables)

1. **`lessons`** - Structured learning content with JSONB flexibility
2. **`lesson_chunks`** - Text chunks for RAG and semantic search
3. **`assessments`** - Quizzes, tests, and assignments
4. **`assessment_items`** - Individual questions/tasks
5. **`attempts`** - User assessment attempt tracking
6. **`chat_sessions`** - AI tutoring conversation history
7. **`flashcard_sets`** - Flashcard collection management
8. **`flashcards`** - Individual flashcards
9. **`mastery_states`** - User progress per lesson
10. **`concepts`** - Knowledge graph nodes
11. **`concept_edges`** - Prerequisite relationships
12. **`user_concept_mastery`** - User mastery per concept
13. **`course_enrollments`** - User-course relationships with roles

### Enums

- `lesson_type`: video, reading, interactive, practice, project
- `assessment_type`: quiz, test, assignment, exam, practice
- `chat_mode`: tutor, concept_explorer, study_buddy, homework_help
- `user_role`: student, teacher, guardian, admin
- `mastery_level`: not_started, learning, practicing, mastered

### Views

- `active_concept_links` - Prerequisite concept relationships
- `outstanding_attempts` - Incomplete assessment attempts
- `user_mastery_summary` - Aggregate user progress

### Updated Tables

- **`profiles`** - Added `role` field (defaults to 'student')

## Migration Files

Located in `supabase/migrations/`:

1. **20250120000000_learning_schema.sql** (Main schema)
   - Creates all tables, enums, indices, views
   - Configures RLS policies for all roles
   - Sets up automated triggers

2. **20250120000001_seed_learning_data.sql** (Seed data)
   - 12 programming concepts with relationships
   - 3 sample lessons with content chunks
   - 2 assessments with 6 items total
   - 1 flashcard set with 8 cards

3. **20250120000002_rls_tests.sql** (Tests)
   - Automated test suite for schema verification
   - RLS policy validation
   - Performance checks

## TypeScript Integration

Updated `src/lib/supabase.ts` with:
- Complete type definitions for all new tables
- Exported enum types for type safety
- View types for read-only access
- Insert/Update types for mutations

## Key Features

### 1. Flexible Lesson Content

Lessons support multiple types and store content as JSONB:

```typescript
{
  sections: [
    { heading: "...", body: "..." }
  ],
  exercises: [...],
  concepts: [conceptId1, conceptId2]
}
```

### 2. Concept-Based Learning

The knowledge graph enables:
- Prerequisite tracking
- Adaptive content recommendations
- Personalized learning paths
- Confidence scoring

### 3. Assessment System

Features:
- Multiple question types (multiple choice, short answer, essay)
- Time limits and passing scores
- Attempt limits
- Automatic scoring
- Detailed response tracking

### 4. Role-Based Access

**Student**:
- View published content
- Manage own attempts, chat sessions, flashcards
- Track personal mastery

**Teacher**:
- View all content (published and unpublished)
- Manage lessons, assessments, enrollments
- View all student attempts and progress

**Admin**:
- Full access to all data
- System configuration

### 5. AI Integration Ready

Chat sessions store:
- Conversation history
- Context (related lessons, concepts)
- Chat mode for different AI behaviors
- Links to course/lesson for contextual help

## Usage Examples

### Creating a Lesson

```typescript
const { data: lesson } = await supabase
  .from('lessons')
  .insert({
    course_id: courseId,
    title: 'Introduction to Variables',
    lesson_type: 'reading',
    content: {
      sections: [
        { heading: 'What is a Variable?', body: '...' }
      ]
    },
    order_index: 0,
    is_published: true
  })
  .select()
  .single();
```

### Starting an Assessment

```typescript
const { data: attempt } = await supabase
  .from('attempts')
  .insert({
    assessment_id: assessmentId,
    user_id: userId,
    started_at: new Date().toISOString()
  })
  .select()
  .single();
```

### Tracking Mastery

```typescript
const { data: mastery } = await supabase
  .from('mastery_states')
  .upsert({
    user_id: userId,
    lesson_id: lessonId,
    mastery_level: 'practicing',
    practice_count: currentCount + 1,
    last_practiced_at: new Date().toISOString()
  });
```

### Getting Learning Path

```typescript
// Get concepts user should learn next
const { data: links } = await supabase
  .from('active_concept_links')
  .select('*')
  .in('from_concept_id', masteredConceptIds);
```

## Running Migrations

### Local Development

```bash
# Initialize Supabase (if not already done)
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

### Production Deployment

```bash
# Link to production project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Verify in Supabase Studio
```

## Testing

The test migration includes automated checks for:
- ✅ All 13 tables created
- ✅ RLS enabled on all tables
- ✅ Indices created (15+ indices)
- ✅ Views functional (3 views)
- ✅ Foreign keys enforced (20+ constraints)
- ✅ Triggers active (7+ triggers)

Run tests:
```bash
supabase db push --file supabase/migrations/20250120000002_rls_tests.sql
```

Check logs for test results.

## Security

### Row Level Security

All tables have RLS enabled with policies for:
- Students: Read published content, manage own data
- Teachers: Read/write all content, view all student data
- Admins: Full access

### Data Privacy

- User responses stored as JSONB (encrypted at rest)
- Chat sessions private to user (teachers can view for support)
- Mastery data private to user and teachers
- Public flashcard sets optional

## Performance

### Indices Created

- Foreign key columns (user_id, course_id, lesson_id, etc.)
- Published status columns
- User-specific lookups
- Incomplete attempts
- Concept relationships

### Query Optimization

Views pre-compute common queries:
- Active concept links (joins concepts)
- Outstanding attempts (joins profiles)
- User mastery summary (aggregates)

## Next Steps

Potential enhancements:

1. **Guardian Role**: Add guardian-student relationships
2. **Notifications**: Assessment reminders, mastery milestones
3. **Analytics**: Detailed learning analytics dashboard
4. **Real-time**: Enable Supabase Realtime for live updates
5. **Content Versioning**: Track lesson/assessment versions
6. **Recommendation Engine**: ML-based content suggestions
7. **Social Learning**: Study groups, peer reviews
8. **Gamification**: Badges, streaks, challenges

## Documentation

- Full schema documentation: `supabase/README.md`
- Migration SQL: `supabase/migrations/`
- TypeScript types: `src/lib/supabase.ts`

## Support

For questions or issues:
1. Check `supabase/README.md` for detailed documentation
2. Review migration files for schema details
3. Run test migration to verify setup
4. Check Supabase Studio for data visualization

---

**Implementation Date**: January 2025  
**Schema Version**: 1.0  
**Status**: ✅ Production Ready

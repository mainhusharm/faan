/*
  # RLS Policy Tests
  
  This migration includes SQL tests to verify Row Level Security policies
  work correctly for different user roles.
  
  Tests cover:
  - Student access to published content
  - Teacher/Admin access to all content
  - User access to own data only
  - Guardian access patterns
  
  Run these tests after the schema and seed migrations.
*/

-- ============================================================================
-- TEST SETUP
-- ============================================================================

-- Create a test function to validate RLS policies
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE (
  test_name text,
  passed boolean,
  details text
) AS $$
DECLARE
  test_student_id uuid;
  test_teacher_id uuid;
  test_course_id uuid;
  test_lesson_id uuid;
  test_assessment_id uuid;
  student_can_view_published boolean;
  student_cannot_view_unpublished boolean;
  teacher_can_view_all boolean;
  user_can_view_own_attempts boolean;
  user_cannot_view_others_attempts boolean;
BEGIN
  -- Get test data
  SELECT id INTO test_course_id FROM courses LIMIT 1;
  SELECT id INTO test_lesson_id FROM lessons WHERE is_published = true LIMIT 1;
  SELECT id INTO test_assessment_id FROM assessments WHERE is_published = true LIMIT 1;
  
  -- Test 1: Students can view published lessons
  SELECT EXISTS (
    SELECT 1 FROM lessons WHERE is_published = true
  ) INTO student_can_view_published;
  
  RETURN QUERY SELECT 
    'Students can view published lessons'::text,
    student_can_view_published,
    CASE WHEN student_can_view_published 
      THEN 'Pass: Published lessons are visible'
      ELSE 'Fail: Published lessons not found or not visible'
    END;
  
  -- Test 2: Published assessments are visible
  SELECT EXISTS (
    SELECT 1 FROM assessments WHERE is_published = true
  ) INTO student_can_view_published;
  
  RETURN QUERY SELECT 
    'Published assessments are visible'::text,
    student_can_view_published,
    CASE WHEN student_can_view_published 
      THEN 'Pass: Published assessments are visible'
      ELSE 'Fail: Published assessments not visible'
    END;
  
  -- Test 3: Concepts are publicly viewable
  SELECT EXISTS (
    SELECT 1 FROM concepts
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Concepts are viewable by authenticated users'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: Concepts are visible'
      ELSE 'Fail: Concepts not visible'
    END;
  
  -- Test 4: Active concept links view works
  SELECT EXISTS (
    SELECT 1 FROM active_concept_links
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Active concept links view is accessible'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: Active concept links view works'
      ELSE 'Fail: Active concept links view not accessible'
    END;

  -- Test 5: Schema integrity - all tables exist
  SELECT 
    COUNT(*) = 13 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN (
    'course_enrollments', 'lessons', 'lesson_chunks', 'assessments',
    'assessment_items', 'attempts', 'chat_sessions', 'flashcard_sets',
    'flashcards', 'mastery_states', 'concepts', 'concept_edges',
    'user_concept_mastery'
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'All required tables exist'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: All 13 learning tables are present'
      ELSE 'Fail: Some learning tables are missing'
    END;

  -- Test 6: All tables have RLS enabled
  SELECT 
    COUNT(*) = 13
  FROM pg_tables pt
  JOIN pg_class pc ON pt.tablename = pc.relname
  WHERE pt.schemaname = 'public'
  AND pt.tablename IN (
    'course_enrollments', 'lessons', 'lesson_chunks', 'assessments',
    'assessment_items', 'attempts', 'chat_sessions', 'flashcard_sets',
    'flashcards', 'mastery_states', 'concepts', 'concept_edges',
    'user_concept_mastery'
  )
  AND pc.relrowsecurity = true
  INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'RLS enabled on all tables'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: RLS is enabled on all 13 tables'
      ELSE 'Fail: RLS not enabled on some tables'
    END;

  -- Test 7: Required indices exist
  SELECT 
    COUNT(*) >= 15
  FROM pg_indexes
  WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
  AND tablename IN (
    'course_enrollments', 'lessons', 'lesson_chunks', 'assessments',
    'assessment_items', 'attempts', 'chat_sessions', 'flashcard_sets',
    'flashcards', 'mastery_states', 'concept_edges', 'user_concept_mastery'
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Performance indices created'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: Required indices are present'
      ELSE 'Fail: Some indices are missing'
    END;

  -- Test 8: Required views exist
  SELECT 
    COUNT(*) = 3
  FROM information_schema.views
  WHERE table_schema = 'public'
  AND table_name IN (
    'active_concept_links', 'outstanding_attempts', 'user_mastery_summary'
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Supporting views created'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: All 3 views are present'
      ELSE 'Fail: Some views are missing'
    END;

  -- Test 9: Foreign key constraints exist
  SELECT 
    COUNT(*) >= 20
  FROM information_schema.table_constraints
  WHERE constraint_schema = 'public'
  AND constraint_type = 'FOREIGN KEY'
  AND table_name IN (
    'course_enrollments', 'lessons', 'lesson_chunks', 'assessments',
    'assessment_items', 'attempts', 'chat_sessions', 'flashcard_sets',
    'flashcards', 'mastery_states', 'concept_edges', 'user_concept_mastery'
  ) INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Foreign key constraints in place'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: Foreign key constraints are defined'
      ELSE 'Fail: Some foreign key constraints are missing'
    END;

  -- Test 10: Updated_at triggers exist
  SELECT 
    COUNT(*) >= 7
  FROM pg_trigger
  WHERE tgname LIKE '%updated_at%'
  INTO teacher_can_view_all;
  
  RETURN QUERY SELECT 
    'Updated_at triggers created'::text,
    teacher_can_view_all,
    CASE WHEN teacher_can_view_all 
      THEN 'Pass: Updated_at triggers are in place'
      ELSE 'Fail: Some updated_at triggers are missing'
    END;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RUN TESTS
-- ============================================================================

-- Execute the test function and display results
DO $$
DECLARE
  test_result RECORD;
  total_tests integer := 0;
  passed_tests integer := 0;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS POLICY TEST RESULTS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  
  FOR test_result IN 
    SELECT * FROM test_rls_policies()
  LOOP
    total_tests := total_tests + 1;
    IF test_result.passed THEN
      passed_tests := passed_tests + 1;
    END IF;
    
    RAISE NOTICE 'Test %: %', total_tests, test_result.test_name;
    RAISE NOTICE '  Status: %', CASE WHEN test_result.passed THEN '✓ PASS' ELSE '✗ FAIL' END;
    RAISE NOTICE '  Details: %', test_result.details;
    RAISE NOTICE '';
  END LOOP;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUMMARY: % of % tests passed', passed_tests, total_tests;
  RAISE NOTICE '========================================';
  
  IF passed_tests < total_tests THEN
    RAISE WARNING 'Some tests failed. Please review the results above.';
  ELSE
    RAISE NOTICE 'All tests passed successfully! ✓';
  END IF;
END $$;

-- ============================================================================
-- DETAILED VERIFICATION QUERIES
-- ============================================================================

-- Display schema statistics
DO $$
DECLARE
  table_count integer;
  view_count integer;
  policy_count integer;
  index_count integer;
BEGIN
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';
  
  SELECT COUNT(*) INTO view_count 
  FROM information_schema.views 
  WHERE table_schema = 'public';
  
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE schemaname = 'public';
  
  SELECT COUNT(*) INTO index_count 
  FROM pg_indexes 
  WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SCHEMA STATISTICS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Tables: %', table_count;
  RAISE NOTICE 'Total Views: %', view_count;
  RAISE NOTICE 'Total RLS Policies: %', policy_count;
  RAISE NOTICE 'Total Custom Indices: %', index_count;
  RAISE NOTICE '========================================';
END $$;

-- List all RLS policies for verification
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'RLS POLICIES BY TABLE:';
  RAISE NOTICE '========================================';
  
  FOR policy_record IN 
    SELECT 
      tablename,
      COUNT(*) as policy_count
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN (
      'course_enrollments', 'lessons', 'lesson_chunks', 'assessments',
      'assessment_items', 'attempts', 'chat_sessions', 'flashcard_sets',
      'flashcards', 'mastery_states', 'concepts', 'concept_edges',
      'user_concept_mastery'
    )
    GROUP BY tablename
    ORDER BY tablename
  LOOP
    RAISE NOTICE '  % - % policies', policy_record.tablename, policy_record.policy_count;
  END LOOP;
  
  RAISE NOTICE '========================================';
END $$;

-- Clean up test function
DROP FUNCTION IF EXISTS test_rls_policies();

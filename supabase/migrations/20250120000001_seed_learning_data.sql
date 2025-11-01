/*
  # Seed Learning Data
  
  This migration seeds the database with:
  - A concept graph for fundamental programming concepts
  - Sample lessons linked to concepts
  - Sample assessments with items
  - Flashcard sets for the pilot subject
  
  This provides initial content for testing and pilot deployment.
*/

-- ============================================================================
-- SEED CONCEPTS - Programming Fundamentals
-- ============================================================================

INSERT INTO concepts (id, name, description, subject_area, difficulty_level, metadata) VALUES
  (gen_random_uuid(), 'Variables', 'Understanding how to store and manipulate data in variables', 'Programming', 1, '{"tags": ["fundamentals", "basics"]}'),
  (gen_random_uuid(), 'Data Types', 'Different types of data like numbers, strings, booleans', 'Programming', 1, '{"tags": ["fundamentals", "basics"]}'),
  (gen_random_uuid(), 'Operators', 'Mathematical and logical operators for computations', 'Programming', 2, '{"tags": ["fundamentals"]}'),
  (gen_random_uuid(), 'Conditionals', 'Making decisions in code with if/else statements', 'Programming', 2, '{"tags": ["control-flow"]}'),
  (gen_random_uuid(), 'Loops', 'Repeating actions with for and while loops', 'Programming', 3, '{"tags": ["control-flow"]}'),
  (gen_random_uuid(), 'Functions', 'Creating reusable blocks of code', 'Programming', 3, '{"tags": ["abstraction"]}'),
  (gen_random_uuid(), 'Arrays', 'Working with collections of data', 'Programming', 3, '{"tags": ["data-structures"]}'),
  (gen_random_uuid(), 'Objects', 'Understanding object-oriented programming basics', 'Programming', 4, '{"tags": ["data-structures", "oop"]}'),
  (gen_random_uuid(), 'Classes', 'Creating blueprints for objects', 'Programming', 5, '{"tags": ["oop"]}'),
  (gen_random_uuid(), 'Inheritance', 'Extending classes and code reuse', 'Programming', 6, '{"tags": ["oop", "advanced"]}'),
  (gen_random_uuid(), 'Recursion', 'Functions that call themselves', 'Programming', 6, '{"tags": ["advanced", "algorithms"]}'),
  (gen_random_uuid(), 'Algorithm Complexity', 'Understanding Big O notation and performance', 'Programming', 7, '{"tags": ["advanced", "algorithms"]}')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SEED CONCEPT EDGES - Prerequisite Relationships
-- ============================================================================

DO $$
DECLARE
  variables_id uuid;
  data_types_id uuid;
  operators_id uuid;
  conditionals_id uuid;
  loops_id uuid;
  functions_id uuid;
  arrays_id uuid;
  objects_id uuid;
  classes_id uuid;
  inheritance_id uuid;
  recursion_id uuid;
  complexity_id uuid;
BEGIN
  -- Get concept IDs
  SELECT id INTO variables_id FROM concepts WHERE name = 'Variables';
  SELECT id INTO data_types_id FROM concepts WHERE name = 'Data Types';
  SELECT id INTO operators_id FROM concepts WHERE name = 'Operators';
  SELECT id INTO conditionals_id FROM concepts WHERE name = 'Conditionals';
  SELECT id INTO loops_id FROM concepts WHERE name = 'Loops';
  SELECT id INTO functions_id FROM concepts WHERE name = 'Functions';
  SELECT id INTO arrays_id FROM concepts WHERE name = 'Arrays';
  SELECT id INTO objects_id FROM concepts WHERE name = 'Objects';
  SELECT id INTO classes_id FROM concepts WHERE name = 'Classes';
  SELECT id INTO inheritance_id FROM concepts WHERE name = 'Inheritance';
  SELECT id INTO recursion_id FROM concepts WHERE name = 'Recursion';
  SELECT id INTO complexity_id FROM concepts WHERE name = 'Algorithm Complexity';

  -- Create prerequisite relationships
  INSERT INTO concept_edges (from_concept_id, to_concept_id, relationship_type, strength) VALUES
    (variables_id, data_types_id, 'prerequisite', 1.0),
    (data_types_id, operators_id, 'prerequisite', 0.9),
    (variables_id, operators_id, 'prerequisite', 0.8),
    (operators_id, conditionals_id, 'prerequisite', 1.0),
    (conditionals_id, loops_id, 'prerequisite', 0.9),
    (variables_id, arrays_id, 'prerequisite', 0.8),
    (loops_id, arrays_id, 'prerequisite', 0.7),
    (functions_id, recursion_id, 'prerequisite', 1.0),
    (arrays_id, objects_id, 'prerequisite', 0.7),
    (objects_id, classes_id, 'prerequisite', 1.0),
    (classes_id, inheritance_id, 'prerequisite', 1.0),
    (loops_id, complexity_id, 'prerequisite', 0.8),
    (functions_id, complexity_id, 'prerequisite', 0.8)
  ON CONFLICT (from_concept_id, to_concept_id, relationship_type) DO NOTHING;

  -- Create related concept links
  INSERT INTO concept_edges (from_concept_id, to_concept_id, relationship_type, strength) VALUES
    (arrays_id, loops_id, 'related', 0.9),
    (conditionals_id, operators_id, 'related', 0.8),
    (recursion_id, functions_id, 'related', 0.9),
    (objects_id, arrays_id, 'related', 0.7)
  ON CONFLICT (from_concept_id, to_concept_id, relationship_type) DO NOTHING;
END $$;

-- ============================================================================
-- SEED LESSONS
-- ============================================================================

DO $$
DECLARE
  react_course_id uuid;
  js_course_id uuid;
  variables_concept uuid;
  data_types_concept uuid;
  operators_concept uuid;
  lesson_id uuid;
BEGIN
  -- Get course IDs
  SELECT id INTO react_course_id FROM courses WHERE title = 'Complete React Development Course' LIMIT 1;
  SELECT id INTO js_course_id FROM courses WHERE title = 'Advanced JavaScript Concepts' LIMIT 1;
  
  -- Get concept IDs
  SELECT id INTO variables_concept FROM concepts WHERE name = 'Variables';
  SELECT id INTO data_types_concept FROM concepts WHERE name = 'Data Types';
  SELECT id INTO operators_concept FROM concepts WHERE name = 'Operators';

  -- Insert lessons for JavaScript course
  IF js_course_id IS NOT NULL THEN
    INSERT INTO lessons (id, course_id, title, description, lesson_type, content, duration_minutes, order_index, is_published) VALUES
      (
        gen_random_uuid(),
        js_course_id,
        'Understanding Variables and Scope',
        'Learn about variable declarations with var, let, and const, and understand scope in JavaScript',
        'reading',
        jsonb_build_object(
          'sections', jsonb_build_array(
            jsonb_build_object(
              'heading', 'Variable Declarations',
              'body', 'In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules and use cases.'
            ),
            jsonb_build_object(
              'heading', 'Scope Rules',
              'body', 'var is function-scoped, while let and const are block-scoped. Understanding scope is crucial for writing bug-free code.'
            ),
            jsonb_build_object(
              'heading', 'Best Practices',
              'body', 'Use const by default, let when you need to reassign, and avoid var in modern JavaScript.'
            )
          ),
          'concepts', jsonb_build_array(variables_concept)
        ),
        15,
        0,
        true
      ) RETURNING id INTO lesson_id;

    -- Insert lesson chunks for RAG
    INSERT INTO lesson_chunks (lesson_id, chunk_text, chunk_index, metadata) VALUES
      (lesson_id, 'In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules and use cases.', 0, '{"section": "Variable Declarations"}'),
      (lesson_id, 'var is function-scoped, while let and const are block-scoped. Understanding scope is crucial for writing bug-free code.', 1, '{"section": "Scope Rules"}'),
      (lesson_id, 'Use const by default, let when you need to reassign, and avoid var in modern JavaScript.', 2, '{"section": "Best Practices"}');

    INSERT INTO lessons (id, course_id, title, description, lesson_type, content, duration_minutes, order_index, is_published) VALUES
      (
        gen_random_uuid(),
        js_course_id,
        'JavaScript Data Types',
        'Explore primitive and reference data types in JavaScript',
        'video',
        jsonb_build_object(
          'description', 'Learn about numbers, strings, booleans, null, undefined, objects, and symbols',
          'concepts', jsonb_build_array(data_types_concept)
        ),
        20,
        1,
        true
      ) RETURNING id INTO lesson_id;

    INSERT INTO lesson_chunks (lesson_id, chunk_text, chunk_index, metadata) VALUES
      (lesson_id, 'JavaScript has seven primitive data types: Number, String, Boolean, Null, Undefined, Symbol, and BigInt.', 0, '{"topic": "primitives"}'),
      (lesson_id, 'Objects are reference types in JavaScript. Arrays and functions are special types of objects.', 1, '{"topic": "reference-types"}'),
      (lesson_id, 'Type coercion happens automatically in JavaScript, but understanding explicit type conversion is important for robust code.', 2, '{"topic": "type-conversion"}');

    INSERT INTO lessons (id, course_id, title, description, lesson_type, content, duration_minutes, order_index, is_published) VALUES
      (
        gen_random_uuid(),
        js_course_id,
        'Working with Operators',
        'Master arithmetic, comparison, and logical operators',
        'interactive',
        jsonb_build_object(
          'description', 'Practice using operators in real code examples',
          'exercises', jsonb_build_array(
            jsonb_build_object('prompt', 'Calculate the sum of two numbers', 'solution', 'const sum = a + b;'),
            jsonb_build_object('prompt', 'Check if a number is even', 'solution', 'const isEven = num % 2 === 0;')
          ),
          'concepts', jsonb_build_array(operators_concept)
        ),
        25,
        2,
        true
      ) RETURNING id INTO lesson_id;

    INSERT INTO lesson_chunks (lesson_id, chunk_text, chunk_index, metadata) VALUES
      (lesson_id, 'Arithmetic operators include +, -, *, /, % for basic math operations.', 0, '{"category": "arithmetic"}'),
      (lesson_id, 'Comparison operators like ===, !==, <, > help you compare values and return boolean results.', 1, '{"category": "comparison"}'),
      (lesson_id, 'Logical operators && (AND), || (OR), and ! (NOT) are used to combine or invert boolean values.', 2, '{"category": "logical"}');
  END IF;
END $$;

-- ============================================================================
-- SEED ASSESSMENTS
-- ============================================================================

DO $$
DECLARE
  js_course_id uuid;
  variables_lesson_id uuid;
  assessment_id uuid;
BEGIN
  SELECT id INTO js_course_id FROM courses WHERE title = 'Advanced JavaScript Concepts' LIMIT 1;
  SELECT id INTO variables_lesson_id FROM lessons WHERE title = 'Understanding Variables and Scope' LIMIT 1;

  IF js_course_id IS NOT NULL AND variables_lesson_id IS NOT NULL THEN
    -- Create assessment for variables lesson
    INSERT INTO assessments (id, lesson_id, title, description, assessment_type, time_limit_minutes, passing_score, max_attempts, is_published) VALUES
      (gen_random_uuid(), variables_lesson_id, 'Variables and Scope Quiz', 'Test your understanding of JavaScript variable declarations and scope', 'quiz', 10, 70, 3, true)
      RETURNING id INTO assessment_id;

    -- Insert assessment items
    INSERT INTO assessment_items (assessment_id, question, question_type, options, explanation, points, order_index) VALUES
      (
        assessment_id,
        'Which keyword should you use for a variable that will not be reassigned?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array('var', 'let', 'const', 'static'),
          'correct', 2
        ),
        'const should be used for variables that will not be reassigned. It prevents accidental reassignment and makes code more predictable.',
        1,
        0
      ),
      (
        assessment_id,
        'What is the scope of a variable declared with let inside a for loop?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array('Global scope', 'Function scope', 'Block scope', 'Module scope'),
          'correct', 2
        ),
        'Variables declared with let are block-scoped, meaning they only exist within the block (or loop) where they are declared.',
        1,
        1
      ),
      (
        assessment_id,
        'Can you access a const variable before it is declared in the same scope?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array('Yes, it will be undefined', 'Yes, it will be null', 'No, it will throw a ReferenceError', 'No, it will throw a TypeError'),
          'correct', 2
        ),
        'This is called the Temporal Dead Zone (TDZ). Accessing let or const variables before declaration throws a ReferenceError.',
        1,
        2
      ),
      (
        assessment_id,
        'Which statement correctly describes var?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array(
            'var is block-scoped and can be reassigned',
            'var is function-scoped and can be reassigned',
            'var is block-scoped and cannot be reassigned',
            'var is constant and cannot be changed'
          ),
          'correct', 1
        ),
        'var is function-scoped (or globally scoped if declared outside a function) and can be reassigned. This is why let and const are preferred in modern JavaScript.',
        1,
        3
      );

    -- Create course-level assessment
    INSERT INTO assessments (id, course_id, title, description, assessment_type, time_limit_minutes, passing_score, is_published) VALUES
      (gen_random_uuid(), js_course_id, 'JavaScript Fundamentals Test', 'Comprehensive test covering variables, data types, and operators', 'test', 30, 75, true)
      RETURNING id INTO assessment_id;

    INSERT INTO assessment_items (assessment_id, question, question_type, options, explanation, points, order_index) VALUES
      (
        assessment_id,
        'What will console.log(typeof null) output?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array('null', 'undefined', 'object', 'number'),
          'correct', 2
        ),
        'This is a famous JavaScript quirk. typeof null returns "object" due to a bug in the original JavaScript implementation that was never fixed for backwards compatibility.',
        2,
        0
      ),
      (
        assessment_id,
        'What is the result of 5 + "5" in JavaScript?',
        'multiple_choice',
        jsonb_build_object(
          'choices', jsonb_build_array('10', '"55"', '55', 'Error'),
          'correct', 1
        ),
        'JavaScript performs type coercion here. The number 5 is converted to a string and concatenated with "5", resulting in the string "55".',
        2,
        1
      );
  END IF;
END $$;

-- ============================================================================
-- SEED FLASHCARD SETS
-- ============================================================================

DO $$
DECLARE
  js_course_id uuid;
  flashcard_set_id uuid;
  admin_user_id uuid;
BEGIN
  SELECT id INTO js_course_id FROM courses WHERE title = 'Advanced JavaScript Concepts' LIMIT 1;
  -- Get first user with admin role or first user if no admin exists
  SELECT id INTO admin_user_id FROM profiles WHERE role = 'admin' LIMIT 1;
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM profiles LIMIT 1;
  END IF;

  IF js_course_id IS NOT NULL AND admin_user_id IS NOT NULL THEN
    -- Create public flashcard set
    INSERT INTO flashcard_sets (id, user_id, course_id, title, description, is_public) VALUES
      (gen_random_uuid(), admin_user_id, js_course_id, 'JavaScript Fundamentals', 'Essential JavaScript concepts and terminology', true)
      RETURNING id INTO flashcard_set_id;

    -- Insert flashcards
    INSERT INTO flashcards (set_id, front_text, back_text, order_index) VALUES
      (flashcard_set_id, 'What is a closure?', 'A function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.', 0),
      (flashcard_set_id, 'What does hoisting mean?', 'JavaScript behavior where variable and function declarations are moved to the top of their scope before code execution.', 1),
      (flashcard_set_id, 'What is the difference between == and ===?', '== performs type coercion before comparison, while === checks both value and type without coercion.', 2),
      (flashcard_set_id, 'What is the Temporal Dead Zone?', 'The time between entering scope and declaration where let/const variables cannot be accessed.', 3),
      (flashcard_set_id, 'What is event bubbling?', 'When an event propagates from the target element up through its ancestors in the DOM tree.', 4),
      (flashcard_set_id, 'What is a promise?', 'An object representing the eventual completion or failure of an asynchronous operation.', 5),
      (flashcard_set_id, 'What is destructuring?', 'A syntax that allows unpacking values from arrays or properties from objects into distinct variables.', 6),
      (flashcard_set_id, 'What is the spread operator?', 'The ... syntax that expands an iterable into individual elements.', 7);
  END IF;
END $$;

-- ============================================================================
-- SEED SAMPLE ENROLLMENTS
-- ============================================================================

-- Note: This will only create enrollments for existing users
-- In production, users will enroll themselves or be enrolled by teachers

DO $$
DECLARE
  react_course_id uuid;
  js_course_id uuid;
  user_record RECORD;
BEGIN
  SELECT id INTO react_course_id FROM courses WHERE title = 'Complete React Development Course' LIMIT 1;
  SELECT id INTO js_course_id FROM courses WHERE title = 'Advanced JavaScript Concepts' LIMIT 1;

  -- Enroll all existing students in the React course
  FOR user_record IN 
    SELECT id FROM profiles WHERE role = 'student' LIMIT 5
  LOOP
    IF react_course_id IS NOT NULL THEN
      INSERT INTO course_enrollments (course_id, user_id, role) 
      VALUES (react_course_id, user_record.id, 'student')
      ON CONFLICT (course_id, user_id) DO NOTHING;
    END IF;
    
    IF js_course_id IS NOT NULL THEN
      INSERT INTO course_enrollments (course_id, user_id, role) 
      VALUES (js_course_id, user_record.id, 'student')
      ON CONFLICT (course_id, user_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- These queries can be used to verify the seed data was created correctly
-- Comment them out for production deployment

DO $$
BEGIN
  RAISE NOTICE 'Concepts created: %', (SELECT COUNT(*) FROM concepts);
  RAISE NOTICE 'Concept edges created: %', (SELECT COUNT(*) FROM concept_edges);
  RAISE NOTICE 'Lessons created: %', (SELECT COUNT(*) FROM lessons);
  RAISE NOTICE 'Lesson chunks created: %', (SELECT COUNT(*) FROM lesson_chunks);
  RAISE NOTICE 'Assessments created: %', (SELECT COUNT(*) FROM assessments);
  RAISE NOTICE 'Assessment items created: %', (SELECT COUNT(*) FROM assessment_items);
  RAISE NOTICE 'Flashcard sets created: %', (SELECT COUNT(*) FROM flashcard_sets);
  RAISE NOTICE 'Flashcards created: %', (SELECT COUNT(*) FROM flashcards);
  RAISE NOTICE 'Course enrollments created: %', (SELECT COUNT(*) FROM course_enrollments);
END $$;

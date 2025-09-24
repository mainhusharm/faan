/*
  # Seed EduMaster Database with Sample Data

  1. Sample Data
    - Insert sample courses
    - Insert sample videos for courses
    - Insert sample quizzes for videos

  This provides initial content for users to explore the platform.
*/

-- Insert sample courses
INSERT INTO courses (id, title, description, thumbnail_url, instructor, duration, level, rating) VALUES
  (gen_random_uuid(), 'Complete React Development Course', 'Master React from basics to advanced concepts with hands-on projects and real-world examples. Learn components, state, hooks, and modern React patterns.', 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600', 'John Smith', '12 hours', 'Beginner', 4.8),
  (gen_random_uuid(), 'Advanced JavaScript Concepts', 'Deep dive into JavaScript closures, prototypes, async programming, and ES6+ features. Perfect for developers looking to master JavaScript.', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600', 'Sarah Johnson', '8 hours', 'Advanced', 4.9),
  (gen_random_uuid(), 'Python for Data Science', 'Learn Python programming with focus on data analysis, NumPy, Pandas, and machine learning basics. Ideal for aspiring data scientists.', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600', 'Michael Chen', '15 hours', 'Intermediate', 4.7),
  (gen_random_uuid(), 'Web Design Fundamentals', 'Create beautiful and responsive websites with HTML5, CSS3, and modern design principles. Learn typography, color theory, and layout.', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600', 'Emily Davis', '10 hours', 'Beginner', 4.6),
  (gen_random_uuid(), 'Node.js Backend Development', 'Build scalable backend applications with Node.js, Express.js, and MongoDB. Learn REST APIs, authentication, and deployment.', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600', 'David Wilson', '14 hours', 'Intermediate', 4.8),
  (gen_random_uuid(), 'Machine Learning Basics', 'Introduction to machine learning algorithms, supervised and unsupervised learning, and practical applications with Python and scikit-learn.', 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600', 'Dr. Lisa Anderson', '18 hours', 'Advanced', 4.9);

-- Get the course IDs for video insertion (using first course as example)
DO $$
DECLARE
    react_course_id uuid;
    js_course_id uuid;
    python_course_id uuid;
    video_id uuid;
BEGIN
    -- Get course IDs
    SELECT id INTO react_course_id FROM courses WHERE title = 'Complete React Development Course' LIMIT 1;
    SELECT id INTO js_course_id FROM courses WHERE title = 'Advanced JavaScript Concepts' LIMIT 1;
    SELECT id INTO python_course_id FROM courses WHERE title = 'Python for Data Science' LIMIT 1;

    -- Insert videos for React course
    INSERT INTO videos (id, course_id, title, video_url, duration, order_index) VALUES
        (gen_random_uuid(), react_course_id, 'Introduction to React', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 15, 0),
        (gen_random_uuid(), react_course_id, 'React Components and JSX', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 20, 1),
        (gen_random_uuid(), react_course_id, 'State and Props', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', 25, 2),
        (gen_random_uuid(), react_course_id, 'React Hooks', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 30, 3);

    -- Insert videos for JavaScript course
    INSERT INTO videos (id, course_id, title, video_url, duration, order_index) VALUES
        (gen_random_uuid(), js_course_id, 'Closures and Scope', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 18, 0),
        (gen_random_uuid(), js_course_id, 'Prototypes and Inheritance', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 22, 1),
        (gen_random_uuid(), js_course_id, 'Async/Await and Promises', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', 24, 2);

    -- Insert videos for Python course
    INSERT INTO videos (id, course_id, title, video_url, duration, order_index) VALUES
        (gen_random_uuid(), python_course_id, 'Python Basics', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 20, 0),
        (gen_random_uuid(), python_course_id, 'NumPy for Data Analysis', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 28, 1),
        (gen_random_uuid(), python_course_id, 'Pandas DataFrames', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', 32, 2);

    -- Insert sample quizzes for first videos of each course
    SELECT id INTO video_id FROM videos WHERE course_id = react_course_id AND order_index = 0 LIMIT 1;
    INSERT INTO quizzes (video_id, question, options, correct_answer, explanation) VALUES
        (video_id, 'What is the primary purpose of React?', ARRAY['To handle database operations', 'To create user interfaces', 'To manage server requests', 'To style web pages'], 1, 'React is a JavaScript library specifically designed for building user interfaces, particularly for web applications.');

    SELECT id INTO video_id FROM videos WHERE course_id = js_course_id AND order_index = 0 LIMIT 1;
    INSERT INTO quizzes (video_id, question, options, correct_answer, explanation) VALUES
        (video_id, 'What is a closure in JavaScript?', ARRAY['A way to close browser windows', 'A function that has access to outer scope variables', 'A method to end loops', 'A type of error handling'], 1, 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.');

    SELECT id INTO video_id FROM videos WHERE course_id = python_course_id AND order_index = 0 LIMIT 1;
    INSERT INTO quizzes (video_id, question, options, correct_answer, explanation) VALUES
        (video_id, 'Which data type is mutable in Python?', ARRAY['tuple', 'string', 'list', 'integer'], 2, 'Lists are mutable in Python, meaning you can change, add, or remove elements after the list is created. Tuples, strings, and integers are immutable.');

END $$;
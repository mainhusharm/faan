import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bgejxnkyzjamroeikfkr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZWp4bmt5emphbXJvZWlrZmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MzMxODYsImV4cCI6MjA3MTUwOTE4Nn0.BkU0y7VH6FNgSi4bCBA2gnrFXRI_37Gowv6r2SU6aPk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type LessonType = 'video' | 'reading' | 'interactive' | 'practice' | 'project';
export type AssessmentType = 'quiz' | 'test' | 'assignment' | 'exam' | 'practice';
export type ChatMode = 'tutor' | 'concept_explorer' | 'study_buddy' | 'homework_help';
export type UserRole = 'student' | 'teacher' | 'guardian' | 'admin';
export type MasteryLevel = 'not_started' | 'learning' | 'practicing' | 'mastered';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          points: number;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          points?: number;
          role?: UserRole;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          points?: number;
          role?: UserRole;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail_url: string;
          instructor: string;
          duration: string;
          level: string;
          rating: number;
          created_at: string;
        };
      };
      videos: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          video_url: string;
          duration: number;
          order_index: number;
          created_at: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          video_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          video_id: string;
          completed: boolean;
          quiz_score?: number;
          created_at: string;
        };
      };
      course_enrollments: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          role: UserRole;
          enrolled_at: string;
          completed_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          user_id: string;
          role?: UserRole;
          enrolled_at?: string;
          completed_at?: string;
        };
        Update: {
          role?: UserRole;
          completed_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description?: string;
          lesson_type: LessonType;
          content: Record<string, any>;
          media_url?: string;
          duration_minutes?: number;
          order_index: number;
          is_published: boolean;
          prerequisites?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string;
          lesson_type?: LessonType;
          content?: Record<string, any>;
          media_url?: string;
          duration_minutes?: number;
          order_index: number;
          is_published?: boolean;
          prerequisites?: string[];
        };
        Update: {
          title?: string;
          description?: string;
          lesson_type?: LessonType;
          content?: Record<string, any>;
          media_url?: string;
          duration_minutes?: number;
          order_index?: number;
          is_published?: boolean;
          prerequisites?: string[];
        };
      };
      lesson_chunks: {
        Row: {
          id: string;
          lesson_id: string;
          chunk_text: string;
          chunk_index: number;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          chunk_text: string;
          chunk_index: number;
          metadata?: Record<string, any>;
        };
      };
      assessments: {
        Row: {
          id: string;
          course_id?: string;
          lesson_id?: string;
          title: string;
          description?: string;
          assessment_type: AssessmentType;
          time_limit_minutes?: number;
          passing_score?: number;
          max_attempts?: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string;
          lesson_id?: string;
          title: string;
          description?: string;
          assessment_type?: AssessmentType;
          time_limit_minutes?: number;
          passing_score?: number;
          max_attempts?: number;
          is_published?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          assessment_type?: AssessmentType;
          time_limit_minutes?: number;
          passing_score?: number;
          max_attempts?: number;
          is_published?: boolean;
        };
      };
      assessment_items: {
        Row: {
          id: string;
          assessment_id: string;
          question: string;
          question_type: string;
          options?: Record<string, any>;
          correct_answer?: string;
          explanation?: string;
          points: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question: string;
          question_type?: string;
          options?: Record<string, any>;
          correct_answer?: string;
          explanation?: string;
          points?: number;
          order_index: number;
        };
      };
      attempts: {
        Row: {
          id: string;
          assessment_id: string;
          user_id: string;
          started_at: string;
          completed_at?: string;
          score?: number;
          responses: Record<string, any>;
          time_spent_seconds?: number;
          is_passed?: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          user_id: string;
          started_at?: string;
          completed_at?: string;
          score?: number;
          responses?: Record<string, any>;
          time_spent_seconds?: number;
          is_passed?: boolean;
        };
        Update: {
          completed_at?: string;
          score?: number;
          responses?: Record<string, any>;
          time_spent_seconds?: number;
          is_passed?: boolean;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          course_id?: string;
          lesson_id?: string;
          mode: ChatMode;
          title?: string;
          messages: Array<Record<string, any>>;
          context: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string;
          lesson_id?: string;
          mode?: ChatMode;
          title?: string;
          messages?: Array<Record<string, any>>;
          context?: Record<string, any>;
        };
        Update: {
          title?: string;
          messages?: Array<Record<string, any>>;
          context?: Record<string, any>;
        };
      };
      flashcard_sets: {
        Row: {
          id: string;
          user_id: string;
          course_id?: string;
          lesson_id?: string;
          title: string;
          description?: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string;
          lesson_id?: string;
          title: string;
          description?: string;
          is_public?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          is_public?: boolean;
        };
      };
      flashcards: {
        Row: {
          id: string;
          set_id: string;
          front_text: string;
          back_text: string;
          media_url?: string;
          order_index?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          front_text: string;
          back_text: string;
          media_url?: string;
          order_index?: number;
        };
        Update: {
          front_text?: string;
          back_text?: string;
          media_url?: string;
          order_index?: number;
        };
      };
      mastery_states: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          mastery_level: MasteryLevel;
          last_practiced_at?: string;
          practice_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          mastery_level?: MasteryLevel;
          last_practiced_at?: string;
          practice_count?: number;
        };
        Update: {
          mastery_level?: MasteryLevel;
          last_practiced_at?: string;
          practice_count?: number;
        };
      };
      concepts: {
        Row: {
          id: string;
          name: string;
          description?: string;
          subject_area?: string;
          difficulty_level: number;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          subject_area?: string;
          difficulty_level?: number;
          metadata?: Record<string, any>;
        };
        Update: {
          name?: string;
          description?: string;
          subject_area?: string;
          difficulty_level?: number;
          metadata?: Record<string, any>;
        };
      };
      concept_edges: {
        Row: {
          id: string;
          from_concept_id: string;
          to_concept_id: string;
          relationship_type: string;
          strength: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_concept_id: string;
          to_concept_id: string;
          relationship_type?: string;
          strength?: number;
        };
      };
      user_concept_mastery: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          mastery_level: MasteryLevel;
          confidence_score: number;
          last_practiced_at?: string;
          practice_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          mastery_level?: MasteryLevel;
          confidence_score?: number;
          last_practiced_at?: string;
          practice_count?: number;
        };
        Update: {
          mastery_level?: MasteryLevel;
          confidence_score?: number;
          last_practiced_at?: string;
          practice_count?: number;
        };
      };
      homework_uploads: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          file_name: string;
          file_size: number;
          format: string;
          status: string;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          file_name: string;
          file_size: number;
          format: string;
          status?: string;
          metadata?: Record<string, any>;
        };
        Update: {
          status?: string;
          metadata?: Record<string, any>;
        };
      };
      homework_analysis: {
        Row: {
          id: string;
          upload_id: string;
          ocr_text: string | null;
          content_type: string | null;
          sub_topic: string | null;
          question_type: string | null;
          processing_metadata: Record<string, any>;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          upload_id: string;
          ocr_text?: string | null;
          content_type?: string | null;
          sub_topic?: string | null;
          question_type?: string | null;
          processing_metadata?: Record<string, any>;
          confidence?: number | null;
        };
      };
      homework_solutions: {
        Row: {
          id: string;
          analysis_id: string;
          explanation: string;
          step_by_step_solution: Record<string, any>;
          common_mistakes: string[];
          related_concepts: string[];
          practice_problems: Record<string, any>;
          resources: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          explanation: string;
          step_by_step_solution?: Record<string, any>;
          common_mistakes?: string[];
          related_concepts?: string[];
          practice_problems?: Record<string, any>;
          resources?: Record<string, any>;
        };
      };
    };
    Views: {
      active_concept_links: {
        Row: {
          id: string;
          from_concept_id: string;
          from_concept_name: string;
          to_concept_id: string;
          to_concept_name: string;
          relationship_type: string;
          strength: number;
        };
      };
      outstanding_attempts: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          assessment_id: string;
          assessment_title: string;
          started_at: string;
          minutes_elapsed: number;
        };
      };
      user_mastery_summary: {
        Row: {
          user_id: string;
          full_name: string;
          total_concepts: number;
          mastered_concepts: number;
          practicing_concepts: number;
          learning_concepts: number;
          avg_confidence: number;
        };
      };
    };
  };
};
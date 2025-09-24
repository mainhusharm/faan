import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hxkcosdkhrkucrjkugtk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4a2Nvc2RraHJrdWNyamt1Z3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MzE4NTQsImV4cCI6MjA3MzQwNzg1NH0.Kh9FR8K8LNEnoASbDr5LVrMYcR2r0vbZjC3z7kkHRdw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          points?: number;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          points?: number;
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
    };
  };
};
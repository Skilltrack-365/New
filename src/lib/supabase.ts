import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin';
  company?: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  service_id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  instructor_id?: string;
  rating: number;
  student_count: number;
  image_url?: string;
  features: string[];
  objectives: string[];
  prerequisites: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  service?: Service;
  instructor?: Profile;
}

export interface LabCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  lab_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lab {
  id: string;
  category_id?: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  technology: string[];
  provider: string;
  rating: number;
  student_count: number;
  image_url?: string;
  features: string[];
  objectives: string[];
  prerequisites: string[];
  instructions?: string;
  is_popular: boolean;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: LabCategory;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'final_exam';
  time_limit_minutes?: number;
  max_attempts: number;
  passing_score: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
  options: any;
  correct_answer?: string;
  points: number;
  explanation?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface LabSession {
  id: string;
  user_id: string;
  lab_id: string;
  session_id: string;
  status: 'starting' | 'active' | 'paused' | 'completed' | 'expired';
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  environment_data: any;
  progress_data: any;
}
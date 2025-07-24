/*
  # Initial Database Schema for Skilltrack-365 Labs

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
    - `services` - Main service categories (AI/ML, Software Dev, etc.)
    - `courses` - Individual courses within services
    - `labs` - Hands-on lab exercises
    - `lab_categories` - Categories for organizing labs
    - `enrollments` - User course enrollments
    - `lab_sessions` - Active lab sessions
    - `assessments` - Course assessments and quizzes
    - `assessment_questions` - Individual questions for assessments
    - `user_assessment_attempts` - User attempts at assessments
    - `user_assessment_answers` - Individual answers from users
    - `certificates` - Generated certificates for course completion
    - `content_uploads` - File uploads for courses and labs

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Admin-only policies for content management

  3. Functions and Triggers
    - Auto-create profile on user signup
    - Update timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE lab_session_status AS ENUM ('starting', 'active', 'paused', 'completed', 'expired');
CREATE TYPE assessment_type AS ENUM ('quiz', 'assignment', 'final_exam');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay', 'code');
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'student',
  company text,
  experience_level difficulty_level DEFAULT 'Beginner',
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  level difficulty_level NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  instructor_id uuid REFERENCES profiles(id),
  rating decimal(3,2) DEFAULT 0,
  student_count integer DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab categories table
CREATE TABLE IF NOT EXISTS lab_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  lab_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES lab_categories(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty difficulty_level NOT NULL,
  duration text NOT NULL,
  technology text[] DEFAULT '{}',
  provider text NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  student_count integer DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  instructions text,
  is_popular boolean DEFAULT false,
  is_free boolean DEFAULT false,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'active',
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Lab sessions table
CREATE TABLE IF NOT EXISTS lab_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  session_id text UNIQUE NOT NULL,
  status lab_session_status DEFAULT 'starting',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  environment_data jsonb DEFAULT '{}',
  progress_data jsonb DEFAULT '{}'
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type assessment_type NOT NULL,
  time_limit_minutes integer,
  max_attempts integer DEFAULT 1,
  passing_score integer DEFAULT 70,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type question_type NOT NULL,
  options jsonb DEFAULT '{}', -- For multiple choice options
  correct_answer text,
  points integer DEFAULT 1,
  explanation text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User assessment attempts table
CREATE TABLE IF NOT EXISTS user_assessment_attempts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer,
  passed boolean DEFAULT false,
  time_taken_minutes integer,
  UNIQUE(user_id, assessment_id, attempt_number)
);

-- User assessment answers table
CREATE TABLE IF NOT EXISTS user_assessment_answers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id uuid REFERENCES user_assessment_attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES assessment_questions(id) ON DELETE CASCADE,
  answer_text text,
  is_correct boolean,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_at timestamptz DEFAULT now(),
  certificate_url text,
  is_valid boolean DEFAULT true
);

-- Content uploads table
CREATE TABLE IF NOT EXISTS content_uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_url text NOT NULL,
  entity_type text, -- 'course', 'lab', 'assessment', etc.
  entity_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view published services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Instructors can manage their courses" ON courses
  FOR ALL USING (instructor_id = auth.uid());

-- Lab categories policies
CREATE POLICY "Anyone can view lab categories" ON lab_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage lab categories" ON lab_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Labs policies
CREATE POLICY "Anyone can view published labs" ON labs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage labs" ON labs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own enrollments" ON enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab sessions policies
CREATE POLICY "Users can manage own lab sessions" ON lab_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all lab sessions" ON lab_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment policies
CREATE POLICY "Users can view published assessments" ON assessments
  FOR SELECT USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE user_id = auth.uid() AND course_id = assessments.course_id
    )
  );

CREATE POLICY "Admins can manage assessments" ON assessments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment questions policies
CREATE POLICY "Users can view questions for enrolled courses" ON assessment_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN enrollments e ON e.course_id = a.course_id
      WHERE a.id = assessment_questions.assessment_id 
      AND e.user_id = auth.uid()
      AND a.is_published = true
    )
  );

CREATE POLICY "Admins can manage assessment questions" ON assessment_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User assessment attempts policies
CREATE POLICY "Users can manage own assessment attempts" ON user_assessment_attempts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all assessment attempts" ON user_assessment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User assessment answers policies
CREATE POLICY "Users can manage own assessment answers" ON user_assessment_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_assessment_attempts 
      WHERE id = user_assessment_answers.attempt_id 
      AND user_id = auth.uid()
    )
  );

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage certificates" ON certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Content uploads policies
CREATE POLICY "Users can view own uploads" ON content_uploads
  FOR SELECT USING (uploader_id = auth.uid());

CREATE POLICY "Admins can manage all uploads" ON content_uploads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labs_updated_at BEFORE UPDATE ON labs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO services (slug, title, description, icon) VALUES
  ('ai-machine-learning', 'AI & Machine Learning', 'Master artificial intelligence and machine learning with hands-on projects and real-world applications.', 'Brain'),
  ('software-development', 'Software Development', 'Master modern software development practices with full-stack technologies and best practices.', 'Code'),
  ('cloud-solutions', 'Cloud Solutions', 'Learn cloud computing with AWS, Azure, and Google Cloud Platform for scalable applications.', 'Cloud'),
  ('mobile-development', 'Mobile Development', 'Create native and cross-platform mobile applications for iOS and Android platforms.', 'Smartphone'),
  ('data-engineering', 'Data Engineering', 'Build robust data pipelines and analytics platforms to process and analyze big data.', 'Database'),
  ('cybersecurity', 'Cybersecurity', 'Protect digital assets and learn ethical hacking, security auditing, and incident response.', 'Shield');

INSERT INTO lab_categories (slug, name, description, icon) VALUES
  ('cloud-computing', 'Cloud Computing', 'Hands-on labs for AWS, Azure, and Google Cloud', 'Cloud'),
  ('devops', 'DevOps', 'CI/CD, Docker, Kubernetes, and automation', 'GitBranch'),
  ('cybersecurity', 'Cybersecurity', 'Security testing, penetration testing, and compliance', 'Shield'),
  ('data-science', 'Data Science', 'Machine learning, analytics, and big data', 'BarChart3'),
  ('web-development', 'Web Development', 'Frontend, backend, and full-stack development', 'Code'),
  ('mobile-development', 'Mobile Development', 'iOS, Android, and cross-platform development', 'Smartphone'),
  ('blockchain', 'Blockchain', 'Smart contracts, DeFi, and cryptocurrency', 'Link'),
  ('ai-ml', 'AI & Machine Learning', 'Deep learning, NLP, and computer vision', 'Brain');
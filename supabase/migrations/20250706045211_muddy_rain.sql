-- Create additional enum types
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'stripe');
CREATE TYPE notification_type AS ENUM ('system', 'course', 'lab', 'payment', 'achievement', 'reminder');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE environment_type AS ENUM ('ubuntu', 'centos', 'alpine', 'debian', 'windows');
CREATE TYPE environment_status AS ENUM ('creating', 'running', 'stopped', 'error', 'terminated');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');
CREATE TYPE content_type AS ENUM ('video', 'text', 'quiz', 'assignment', 'lab', 'resource');
CREATE TYPE forum_post_type AS ENUM ('question', 'discussion', 'announcement', 'answer');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE session_type AS ENUM ('web', 'mobile', 'api');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout');
CREATE TYPE achievement_type AS ENUM ('course_completion', 'lab_completion', 'streak', 'skill_mastery', 'community');
CREATE TYPE mentorship_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE webinar_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');

-- Enhanced Profiles table (extending existing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
    ALTER TABLE profiles ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language') THEN
    ALTER TABLE profiles ADD COLUMN language text DEFAULT 'en';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
    ALTER TABLE profiles ADD COLUMN linkedin_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'github_url') THEN
    ALTER TABLE profiles ADD COLUMN github_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website_url') THEN
    ALTER TABLE profiles ADD COLUMN website_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'skills') THEN
    ALTER TABLE profiles ADD COLUMN skills text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'interests') THEN
    ALTER TABLE profiles ADD COLUMN interests text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'learning_goals') THEN
    ALTER TABLE profiles ADD COLUMN learning_goals text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email_notifications') THEN
    ALTER TABLE profiles ADD COLUMN email_notifications boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'push_notifications') THEN
    ALTER TABLE profiles ADD COLUMN push_notifications boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_emails') THEN
    ALTER TABLE profiles ADD COLUMN marketing_emails boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
    ALTER TABLE profiles ADD COLUMN last_login_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'login_count') THEN
    ALTER TABLE profiles ADD COLUMN login_count integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_expires_at') THEN
    ALTER TABLE profiles ADD COLUMN subscription_expires_at timestamptz;
  END IF;
END $$;

-- Lab Environments table
CREATE TABLE IF NOT EXISTS lab_environments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  environment_type environment_type NOT NULL,
  base_image text NOT NULL,
  cpu_cores integer DEFAULT 2,
  memory_gb integer DEFAULT 4,
  storage_gb integer DEFAULT 20,
  network_enabled boolean DEFAULT true,
  internet_access boolean DEFAULT true,
  pre_installed_software text[] DEFAULT '{}',
  startup_script text,
  environment_variables jsonb DEFAULT '{}',
  exposed_ports integer[] DEFAULT '{}',
  max_session_duration_minutes integer DEFAULT 120,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Lab Sessions (extending existing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'environment_id') THEN
    ALTER TABLE lab_sessions ADD COLUMN environment_id uuid REFERENCES lab_environments(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'container_id') THEN
    ALTER TABLE lab_sessions ADD COLUMN container_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'ip_address') THEN
    ALTER TABLE lab_sessions ADD COLUMN ip_address inet;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'cpu_usage_avg') THEN
    ALTER TABLE lab_sessions ADD COLUMN cpu_usage_avg decimal(5,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'memory_usage_avg') THEN
    ALTER TABLE lab_sessions ADD COLUMN memory_usage_avg decimal(5,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'network_rx_bytes') THEN
    ALTER TABLE lab_sessions ADD COLUMN network_rx_bytes bigint DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'network_tx_bytes') THEN
    ALTER TABLE lab_sessions ADD COLUMN network_tx_bytes bigint DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'commands_executed') THEN
    ALTER TABLE lab_sessions ADD COLUMN commands_executed integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'files_created') THEN
    ALTER TABLE lab_sessions ADD COLUMN files_created integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'completion_percentage') THEN
    ALTER TABLE lab_sessions ADD COLUMN completion_percentage integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'feedback_rating') THEN
    ALTER TABLE lab_sessions ADD COLUMN feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lab_sessions' AND column_name = 'feedback_comment') THEN
    ALTER TABLE lab_sessions ADD COLUMN feedback_comment text;
  END IF;
END $$;

-- Payment Transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  stripe_charge_id text,
  transaction_fee decimal(10,2) DEFAULT 0,
  net_amount decimal(10,2),
  payment_date timestamptz,
  refund_date timestamptz,
  refund_amount decimal(10,2),
  refund_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course Modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  estimated_duration_minutes integer,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course Lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_type content_type NOT NULL,
  content_url text,
  content_text text,
  duration_minutes integer,
  sort_order integer DEFAULT 0,
  is_free boolean DEFAULT false,
  is_published boolean DEFAULT false,
  video_transcript text,
  attachments jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Lesson Progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'not_started',
  progress_percentage integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  notes text,
  bookmarks jsonb DEFAULT '{}',
  UNIQUE(user_id, lesson_id)
);

-- User Progress table (overall tracking)
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  overall_progress_percentage integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  total_lessons integer DEFAULT 0,
  labs_completed integer DEFAULT 0,
  total_labs integer DEFAULT 0,
  assessments_passed integer DEFAULT 0,
  total_assessments integer DEFAULT 0,
  total_time_spent_minutes integer DEFAULT 0,
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  last_activity_at timestamptz DEFAULT now(),
  estimated_completion_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id, lab_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type notification_type NOT NULL,
  priority notification_priority DEFAULT 'medium',
  is_read boolean DEFAULT false,
  is_email_sent boolean DEFAULT false,
  is_push_sent boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  expires_at timestamptz,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Discussion Forums table
CREATE TABLE IF NOT EXISTS discussion_forums (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  last_post_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  forum_id uuid REFERENCES discussion_forums(id) ON DELETE CASCADE,
  parent_post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  post_type forum_post_type DEFAULT 'discussion',
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  last_reply_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course Reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text,
  is_verified_purchase boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Instructor Applications table
CREATE TABLE IF NOT EXISTS instructor_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  application_status application_status DEFAULT 'pending',
  expertise_areas text[] DEFAULT '{}',
  years_of_experience integer,
  education_background text,
  work_experience text,
  teaching_experience text,
  portfolio_url text,
  sample_content_url text,
  motivation text,
  reference_contacts jsonb DEFAULT '{}',
  admin_notes text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Templates table
CREATE TABLE IF NOT EXISTS lab_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES lab_categories(id),
  environment_id uuid REFERENCES lab_environments(id),
  template_config jsonb NOT NULL,
  setup_instructions text,
  cleanup_instructions text,
  estimated_setup_time_minutes integer DEFAULT 5,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  session_type session_type DEFAULT 'web',
  ip_address inet,
  user_agent text,
  device_info jsonb DEFAULT '{}',
  location_info jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_activity_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  table_name text NOT NULL,
  record_id uuid,
  action audit_action NOT NULL,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Email Templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key text UNIQUE NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  variables jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course Prerequisites table
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, prerequisite_course_id)
);

-- Skill Assessments table
CREATE TABLE IF NOT EXISTS skill_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  skill_area text NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  time_limit_minutes integer DEFAULT 60,
  passing_score integer DEFAULT 70,
  questions_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning Paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  difficulty_level difficulty_level NOT NULL,
  estimated_duration_weeks integer,
  course_sequence uuid[] DEFAULT '{}',
  lab_sequence uuid[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  learning_outcomes text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  enrollment_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  achievement_type achievement_type NOT NULL,
  icon_url text,
  badge_color text DEFAULT '#3B82F6',
  criteria jsonb NOT NULL,
  points_value integer DEFAULT 0,
  is_active boolean DEFAULT true,
  rarity_level text DEFAULT 'common',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  progress_data jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Mentorship Sessions table
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status mentorship_status DEFAULT 'scheduled',
  meeting_url text,
  notes text,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webinar Sessions table
CREATE TABLE IF NOT EXISTS webinar_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES profiles(id),
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 90,
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  status webinar_status DEFAULT 'scheduled',
  meeting_url text,
  recording_url text,
  registration_required boolean DEFAULT true,
  is_free boolean DEFAULT false,
  price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webinar Registrations table
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  webinar_id uuid REFERENCES webinar_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  attended boolean DEFAULT false,
  attendance_duration_minutes integer DEFAULT 0,
  UNIQUE(webinar_id, user_id)
);

-- Resource Library table
CREATE TABLE IF NOT EXISTS resource_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  resource_type text NOT NULL,
  file_url text,
  file_size_bytes bigint,
  download_count integer DEFAULT 0,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  lab_id uuid REFERENCES labs(id) ON DELETE SET NULL,
  is_public boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  key_name text NOT NULL,
  api_key_hash text NOT NULL,
  permissions text[] DEFAULT '{}',
  rate_limit_per_hour integer DEFAULT 1000,
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lab_sessions_user_id ON lab_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_lab_id ON lab_sessions(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_status ON lab_sessions(status);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_started_at ON lab_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_activity ON user_progress(last_activity_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_date ON payment_transactions(payment_date);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_sort_order ON course_modules(sort_order);

CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort_order ON course_lessons(sort_order);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_id ON forum_posts(parent_post_id);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON course_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS on new tables
ALTER TABLE lab_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables

-- Lab Environments policies
CREATE POLICY "Anyone can view active lab environments" ON lab_environments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage lab environments" ON lab_environments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment Transactions policies
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course Modules policies
CREATE POLICY "Anyone can view published course modules" ON course_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage course modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course Lessons policies
CREATE POLICY "Anyone can view published course lessons" ON course_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage course lessons" ON course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User Lesson Progress policies
CREATE POLICY "Users can manage own lesson progress" ON user_lesson_progress
  FOR ALL USING (user_id = auth.uid());

-- User Progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert progress records" ON user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Discussion Forums policies
CREATE POLICY "Anyone can view active forums" ON discussion_forums
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage forums" ON discussion_forums
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Forum Posts policies
CREATE POLICY "Anyone can view forum posts" ON forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own posts" ON forum_posts
  FOR UPDATE USING (user_id = auth.uid());

-- Course Reviews policies
CREATE POLICY "Anyone can view course reviews" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON course_reviews
  FOR ALL USING (user_id = auth.uid());

-- User Achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can award achievements" ON user_achievements
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Mentorship Sessions policies
CREATE POLICY "Users can view own mentorship sessions" ON mentorship_sessions
  FOR SELECT USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Users can manage own mentorship sessions" ON mentorship_sessions
  FOR ALL USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

-- Webinar Sessions policies
CREATE POLICY "Anyone can view scheduled webinars" ON webinar_sessions
  FOR SELECT USING (true);

CREATE POLICY "Instructors can manage own webinars" ON webinar_sessions
  FOR ALL USING (instructor_id = auth.uid());

-- Webinar Registrations policies
CREATE POLICY "Users can manage own webinar registrations" ON webinar_registrations
  FOR ALL USING (user_id = auth.uid());

-- Resource Library policies
CREATE POLICY "Anyone can view public resources" ON resource_library
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view course resources" ON resource_library
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- API Keys policies
CREATE POLICY "Users can manage own API keys" ON api_keys
  FOR ALL USING (user_id = auth.uid());

-- Functions for automated tasks

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE courses 
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM course_reviews 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for course rating updates
DROP TRIGGER IF EXISTS update_course_rating_trigger ON course_reviews;
CREATE TRIGGER update_course_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- Function to update forum post counts
CREATE OR REPLACE FUNCTION update_forum_post_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussion_forums 
    SET post_count = post_count + 1,
        last_post_at = NEW.created_at
    WHERE id = NEW.forum_id;
    
    IF NEW.parent_post_id IS NOT NULL THEN
      UPDATE forum_posts 
      SET reply_count = reply_count + 1,
          last_reply_at = NEW.created_at
      WHERE id = NEW.parent_post_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussion_forums 
    SET post_count = post_count - 1
    WHERE id = OLD.forum_id;
    
    IF OLD.parent_post_id IS NOT NULL THEN
      UPDATE forum_posts 
      SET reply_count = reply_count - 1
      WHERE id = OLD.parent_post_id;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for forum post counts
DROP TRIGGER IF EXISTS update_forum_post_count_trigger ON forum_posts;
CREATE TRIGGER update_forum_post_count_trigger
  AFTER INSERT OR DELETE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_forum_post_count();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE TG_OP
      WHEN 'INSERT' THEN 'create'::audit_action
      WHEN 'UPDATE' THEN 'update'::audit_action
      WHEN 'DELETE' THEN 'delete'::audit_action
    END,
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables
DROP TRIGGER IF EXISTS audit_profiles_trigger ON profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

DROP TRIGGER IF EXISTS audit_courses_trigger ON courses;
CREATE TRIGGER audit_courses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON courses
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

DROP TRIGGER IF EXISTS audit_labs_trigger ON labs;
CREATE TRIGGER audit_labs_trigger
  AFTER INSERT OR UPDATE OR DELETE ON labs
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Insert initial system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
  ('site_name', '"Skilltrack-365 Labs"', 'Website name', true),
  ('site_description', '"Interactive learning platform for technology skills"', 'Website description', true),
  ('max_lab_session_duration', '180', 'Maximum lab session duration in minutes', false),
  ('default_lab_environment', '"ubuntu"', 'Default lab environment type', false),
  ('email_notifications_enabled', 'true', 'Enable email notifications', false),
  ('maintenance_mode', 'false', 'Enable maintenance mode', false),
  ('registration_enabled', 'true', 'Enable user registration', true),
  ('course_enrollment_enabled', 'true', 'Enable course enrollment', true),
  ('lab_access_enabled', 'true', 'Enable lab access', true),
  ('forum_enabled', 'true', 'Enable discussion forums', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default achievements
INSERT INTO achievements (title, description, achievement_type, criteria, points_value) VALUES
  ('First Steps', 'Complete your first lesson', 'course_completion', '{"lessons_completed": 1}', 10),
  ('Course Starter', 'Enroll in your first course', 'course_completion', '{"courses_enrolled": 1}', 5),
  ('Lab Explorer', 'Complete your first lab session', 'lab_completion', '{"labs_completed": 1}', 15),
  ('Week Warrior', 'Maintain a 7-day learning streak', 'streak', '{"streak_days": 7}', 25),
  ('Month Master', 'Maintain a 30-day learning streak', 'streak', '{"streak_days": 30}', 100),
  ('Course Completer', 'Complete your first course', 'course_completion', '{"courses_completed": 1}', 50),
  ('Lab Master', 'Complete 10 lab sessions', 'lab_completion', '{"labs_completed": 10}', 75),
  ('Community Helper', 'Help others by answering 5 forum questions', 'community', '{"forum_answers": 5}', 30),
  ('Skill Specialist', 'Master a specific skill area', 'skill_mastery', '{"skill_assessments_passed": 3}', 100)
ON CONFLICT DO NOTHING;

-- Insert default email templates
INSERT INTO email_templates (template_key, subject, html_content, text_content) VALUES
  ('welcome', 'Welcome to Skilltrack-365 Labs!', '<h1>Welcome {{user_name}}!</h1><p>Thank you for joining our learning platform.</p>', 'Welcome {{user_name}}! Thank you for joining our learning platform.'),
  ('course_enrollment', 'Course Enrollment Confirmation', '<h1>Course Enrollment Confirmed</h1><p>You have successfully enrolled in {{course_name}}.</p>', 'Course Enrollment Confirmed. You have successfully enrolled in {{course_name}}.'),
  ('lab_session_reminder', 'Lab Session Reminder', '<h1>Lab Session Reminder</h1><p>Your lab session for {{lab_name}} is starting soon.</p>', 'Lab Session Reminder. Your lab session for {{lab_name}} is starting soon.'),
  ('achievement_earned', 'Achievement Unlocked!', '<h1>Congratulations!</h1><p>You have earned the {{achievement_name}} achievement!</p>', 'Congratulations! You have earned the {{achievement_name}} achievement!')
ON CONFLICT (template_key) DO NOTHING;

-- Insert default lab environments
INSERT INTO lab_environments (name, description, environment_type, base_image, cpu_cores, memory_gb, storage_gb) VALUES
  ('Ubuntu 22.04 LTS', 'Standard Ubuntu environment for general development', 'ubuntu', 'ubuntu:22.04', 2, 4, 20),
  ('CentOS 8', 'Enterprise-grade CentOS environment', 'centos', 'centos:8', 2, 4, 20),
  ('Alpine Linux', 'Lightweight Alpine Linux for containerized applications', 'alpine', 'alpine:latest', 1, 2, 10),
  ('Debian 11', 'Stable Debian environment for development', 'debian', 'debian:11', 2, 4, 20)
ON CONFLICT DO NOTHING;
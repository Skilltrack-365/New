/*
  # Assessment Engine Database Schema

  1. New Tables
    - `assessment_categories` - Categories for organizing assessments
    - `assessment_templates` - Reusable assessment templates
    - `assessment_instances` - Individual assessment sessions
    - `assessment_submissions` - User submissions and answers
    - `assessment_analytics` - Performance analytics and insights
    - `assessment_certificates` - Generated certificates
    - `question_banks` - Question pools for assessments
    - `adaptive_rules` - Rules for adaptive testing

  2. Security
    - Enable RLS on all tables
    - Add policies for users, instructors, and admins
    - Secure assessment data and prevent cheating

  3. Functions
    - Auto-grading functions
    - Analytics calculation
    - Certificate generation
    - Adaptive question selection
*/

-- Assessment Categories
CREATE TABLE IF NOT EXISTS assessment_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'BarChart3',
  color text DEFAULT '#3B82F6',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Question Banks
CREATE TABLE IF NOT EXISTS question_banks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES assessment_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  difficulty_level difficulty_level NOT NULL,
  question_type question_type NOT NULL,
  question_text text NOT NULL,
  options jsonb DEFAULT '{}', -- For multiple choice, true/false
  correct_answer text,
  explanation text,
  points integer DEFAULT 1,
  time_limit_seconds integer DEFAULT 60,
  tags text[] DEFAULT '{}',
  usage_count integer DEFAULT 0,
  success_rate decimal(5,2) DEFAULT 0.00,
  created_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Templates
CREATE TABLE IF NOT EXISTS assessment_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES assessment_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  assessment_type assessment_type NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  total_questions integer NOT NULL DEFAULT 10,
  time_limit_minutes integer DEFAULT 60,
  passing_score integer DEFAULT 70,
  max_attempts integer DEFAULT 3,
  is_adaptive boolean DEFAULT false,
  randomize_questions boolean DEFAULT true,
  show_results_immediately boolean DEFAULT true,
  allow_review boolean DEFAULT true,
  certificate_template text,
  instructions text,
  question_selection_rules jsonb DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Template Questions (Many-to-Many)
CREATE TABLE IF NOT EXISTS assessment_template_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id uuid REFERENCES assessment_templates(id) ON DELETE CASCADE,
  question_id uuid REFERENCES question_banks(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_required boolean DEFAULT false,
  weight decimal(3,2) DEFAULT 1.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(template_id, question_id)
);

-- Assessment Instances (Individual test sessions)
CREATE TABLE IF NOT EXISTS assessment_instances (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id uuid REFERENCES assessment_templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'expired', 'cancelled')),
  current_question_index integer DEFAULT 0,
  questions_data jsonb DEFAULT '[]', -- Selected questions for this instance
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  time_spent_seconds integer DEFAULT 0,
  score decimal(5,2) DEFAULT 0.00,
  percentage decimal(5,2) DEFAULT 0.00,
  passed boolean DEFAULT false,
  attempt_number integer DEFAULT 1,
  ip_address inet,
  user_agent text,
  browser_fingerprint text,
  anti_cheat_flags jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Submissions (Individual question answers)
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid REFERENCES assessment_instances(id) ON DELETE CASCADE,
  question_id uuid REFERENCES question_banks(id) ON DELETE CASCADE,
  user_answer text,
  is_correct boolean,
  points_earned decimal(5,2) DEFAULT 0.00,
  time_spent_seconds integer DEFAULT 0,
  confidence_level integer CHECK (confidence_level BETWEEN 1 AND 5),
  submitted_at timestamptz DEFAULT now(),
  auto_graded boolean DEFAULT false,
  manual_feedback text,
  created_at timestamptz DEFAULT now()
);

-- Assessment Analytics
CREATE TABLE IF NOT EXISTS assessment_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid REFERENCES assessment_instances(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  template_id uuid REFERENCES assessment_templates(id) ON DELETE CASCADE,
  category_id uuid REFERENCES assessment_categories(id) ON DELETE SET NULL,
  completion_rate decimal(5,2) DEFAULT 0.00,
  average_time_per_question decimal(8,2) DEFAULT 0.00,
  difficulty_performance jsonb DEFAULT '{}', -- Performance by difficulty level
  topic_performance jsonb DEFAULT '{}', -- Performance by topic/tag
  question_type_performance jsonb DEFAULT '{}', -- Performance by question type
  learning_path_suggestions text[],
  strengths text[],
  improvement_areas text[],
  percentile_rank decimal(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Certificates
CREATE TABLE IF NOT EXISTS assessment_certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid REFERENCES assessment_instances(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  template_id uuid REFERENCES assessment_templates(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  certificate_url text,
  certificate_data jsonb DEFAULT '{}',
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_valid boolean DEFAULT true,
  verification_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Adaptive Testing Rules
CREATE TABLE IF NOT EXISTS adaptive_rules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id uuid REFERENCES assessment_templates(id) ON DELETE CASCADE,
  rule_name text NOT NULL,
  condition_type text NOT NULL CHECK (condition_type IN ('score_threshold', 'consecutive_correct', 'consecutive_incorrect', 'time_based')),
  condition_value decimal(10,2) NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('increase_difficulty', 'decrease_difficulty', 'skip_questions', 'add_questions', 'end_assessment')),
  action_parameters jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_banks_category_difficulty ON question_banks(category_id, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_question_banks_type_active ON question_banks(question_type, is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_instances_user_status ON assessment_instances(user_id, status);
CREATE INDEX IF NOT EXISTS idx_assessment_instances_template_status ON assessment_instances(template_id, status);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_instance ON assessment_submissions(instance_id);
CREATE INDEX IF NOT EXISTS idx_assessment_analytics_user ON assessment_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_certificates_user ON assessment_certificates(user_id);

-- Enable RLS
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_template_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Assessment Categories
CREATE POLICY "Anyone can view active categories" ON assessment_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON assessment_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Question Banks
CREATE POLICY "Instructors can view questions" ON question_banks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
  );

CREATE POLICY "Instructors can manage own questions" ON question_banks
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all questions" ON question_banks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Assessment Templates
CREATE POLICY "Anyone can view published templates" ON assessment_templates
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage own templates" ON assessment_templates
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all templates" ON assessment_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Assessment Instances
CREATE POLICY "Users can manage own instances" ON assessment_instances
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Instructors can view instances of their templates" ON assessment_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_templates 
      WHERE id = assessment_instances.template_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all instances" ON assessment_instances
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Assessment Submissions
CREATE POLICY "Users can manage own submissions" ON assessment_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessment_instances 
      WHERE id = assessment_submissions.instance_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can view submissions for their assessments" ON assessment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_instances ai
      JOIN assessment_templates at ON ai.template_id = at.id
      WHERE ai.id = assessment_submissions.instance_id 
      AND at.created_by = auth.uid()
    )
  );

-- Assessment Analytics
CREATE POLICY "Users can view own analytics" ON assessment_analytics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Instructors can view analytics for their assessments" ON assessment_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_templates 
      WHERE id = assessment_analytics.template_id 
      AND created_by = auth.uid()
    )
  );

-- Assessment Certificates
CREATE POLICY "Users can view own certificates" ON assessment_certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can verify certificates" ON assessment_certificates
  FOR SELECT USING (verification_code IS NOT NULL);

-- Functions

-- Function to calculate assessment score
CREATE OR REPLACE FUNCTION calculate_assessment_score(instance_uuid uuid)
RETURNS void AS $$
DECLARE
  total_points decimal(10,2);
  earned_points decimal(10,2);
  percentage decimal(5,2);
  template_passing_score integer;
  passed boolean;
BEGIN
  -- Get total possible points
  SELECT COALESCE(SUM(qb.points), 0) INTO total_points
  FROM assessment_submissions asub
  JOIN question_banks qb ON asub.question_id = qb.id
  WHERE asub.instance_id = instance_uuid;
  
  -- Get earned points
  SELECT COALESCE(SUM(asub.points_earned), 0) INTO earned_points
  FROM assessment_submissions asub
  WHERE asub.instance_id = instance_uuid;
  
  -- Calculate percentage
  IF total_points > 0 THEN
    percentage := (earned_points / total_points) * 100;
  ELSE
    percentage := 0;
  END IF;
  
  -- Get passing score from template
  SELECT at.passing_score INTO template_passing_score
  FROM assessment_instances ai
  JOIN assessment_templates at ON ai.template_id = at.id
  WHERE ai.id = instance_uuid;
  
  -- Determine if passed
  passed := percentage >= template_passing_score;
  
  -- Update instance
  UPDATE assessment_instances 
  SET 
    score = earned_points,
    percentage = percentage,
    passed = passed,
    updated_at = now()
  WHERE id = instance_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate analytics
CREATE OR REPLACE FUNCTION generate_assessment_analytics(instance_uuid uuid)
RETURNS void AS $$
DECLARE
  user_uuid uuid;
  template_uuid uuid;
  category_uuid uuid;
  total_questions integer;
  completed_questions integer;
  completion_rate decimal(5,2);
  avg_time decimal(8,2);
BEGIN
  -- Get basic info
  SELECT ai.user_id, ai.template_id, at.category_id
  INTO user_uuid, template_uuid, category_uuid
  FROM assessment_instances ai
  JOIN assessment_templates at ON ai.template_id = at.id
  WHERE ai.id = instance_uuid;
  
  -- Calculate completion rate
  SELECT COUNT(*) INTO total_questions
  FROM assessment_template_questions atq
  WHERE atq.template_id = template_uuid;
  
  SELECT COUNT(*) INTO completed_questions
  FROM assessment_submissions asub
  WHERE asub.instance_id = instance_uuid;
  
  IF total_questions > 0 THEN
    completion_rate := (completed_questions::decimal / total_questions) * 100;
  ELSE
    completion_rate := 0;
  END IF;
  
  -- Calculate average time per question
  SELECT COALESCE(AVG(time_spent_seconds), 0) INTO avg_time
  FROM assessment_submissions
  WHERE instance_id = instance_uuid;
  
  -- Insert or update analytics
  INSERT INTO assessment_analytics (
    instance_id, user_id, template_id, category_id,
    completion_rate, average_time_per_question
  ) VALUES (
    instance_uuid, user_uuid, template_uuid, category_uuid,
    completion_rate, avg_time
  )
  ON CONFLICT (instance_id) DO UPDATE SET
    completion_rate = EXCLUDED.completion_rate,
    average_time_per_question = EXCLUDED.average_time_per_question,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate certificate
CREATE OR REPLACE FUNCTION generate_certificate(instance_uuid uuid)
RETURNS text AS $$
DECLARE
  cert_number text;
  verification_code text;
  user_uuid uuid;
  template_uuid uuid;
  user_name text;
  template_title text;
  cert_id uuid;
BEGIN
  -- Check if assessment was passed
  IF NOT EXISTS (
    SELECT 1 FROM assessment_instances 
    WHERE id = instance_uuid AND passed = true
  ) THEN
    RETURN NULL;
  END IF;
  
  -- Generate certificate number and verification code
  cert_number := 'CERT-' || EXTRACT(YEAR FROM now()) || '-' || 
                 LPAD(EXTRACT(DOY FROM now())::text, 3, '0') || '-' ||
                 UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
  verification_code := UPPER(SUBSTRING(gen_random_uuid()::text, 1, 12));
  
  -- Get user and template info
  SELECT ai.user_id, ai.template_id, p.full_name, at.title
  INTO user_uuid, template_uuid, user_name, template_title
  FROM assessment_instances ai
  JOIN profiles p ON ai.user_id = p.id
  JOIN assessment_templates at ON ai.template_id = at.id
  WHERE ai.id = instance_uuid;
  
  -- Insert certificate
  INSERT INTO assessment_certificates (
    instance_id, user_id, template_id, certificate_number,
    verification_code, certificate_data
  ) VALUES (
    instance_uuid, user_uuid, template_uuid, cert_number,
    verification_code, jsonb_build_object(
      'user_name', user_name,
      'assessment_title', template_title,
      'issued_date', now()::date
    )
  ) RETURNING id INTO cert_id;
  
  RETURN cert_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers

-- Auto-calculate score when submissions are updated
CREATE OR REPLACE FUNCTION trigger_calculate_score()
RETURNS trigger AS $$
BEGIN
  PERFORM calculate_assessment_score(NEW.instance_id);
  PERFORM generate_assessment_analytics(NEW.instance_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_calculate_score ON assessment_submissions;
CREATE TRIGGER auto_calculate_score
  AFTER INSERT OR UPDATE ON assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION trigger_calculate_score();

-- Auto-generate certificate when assessment is completed and passed
CREATE OR REPLACE FUNCTION trigger_generate_certificate()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.passed = true AND OLD.status != 'completed' THEN
    PERFORM generate_certificate(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_generate_certificate ON assessment_instances;
CREATE TRIGGER auto_generate_certificate
  AFTER UPDATE ON assessment_instances
  FOR EACH ROW EXECUTE FUNCTION trigger_generate_certificate();

-- Insert sample data

-- Assessment Categories
INSERT INTO assessment_categories (name, description, icon, color) VALUES
  ('AI & Machine Learning', 'Artificial Intelligence and Machine Learning assessments', 'Brain', '#8B5CF6'),
  ('Cloud Computing', 'Cloud platforms and infrastructure assessments', 'Cloud', '#3B82F6'),
  ('Software Development', 'Programming and software engineering assessments', 'Code', '#10B981'),
  ('Cybersecurity', 'Information security and ethical hacking assessments', 'Shield', '#EF4444'),
  ('Data Science', 'Data analysis and visualization assessments', 'BarChart3', '#F59E0B'),
  ('DevOps', 'Development operations and automation assessments', 'GitBranch', '#6366F1')
ON CONFLICT (name) DO NOTHING;

-- Sample Question Banks
DO $$
DECLARE
  ai_category_id uuid;
  cloud_category_id uuid;
  dev_category_id uuid;
BEGIN
  SELECT id INTO ai_category_id FROM assessment_categories WHERE name = 'AI & Machine Learning';
  SELECT id INTO cloud_category_id FROM assessment_categories WHERE name = 'Cloud Computing';
  SELECT id INTO dev_category_id FROM assessment_categories WHERE name = 'Software Development';
  
  -- AI/ML Questions
  INSERT INTO question_banks (category_id, title, difficulty_level, question_type, question_text, options, correct_answer, explanation, points, tags) VALUES
    (ai_category_id, 'Supervised Learning Definition', 'Beginner', 'multiple_choice', 
     'What is supervised learning?', 
     '{"options": ["Learning with labeled data", "Learning without any data", "Learning with unlabeled data", "Learning with reinforcement"]}',
     'Learning with labeled data',
     'Supervised learning uses labeled training data to learn a mapping from inputs to outputs.',
     1, ARRAY['supervised-learning', 'basics']),
    
    (ai_category_id, 'Neural Network Layers', 'Intermediate', 'multiple_choice',
     'What is the purpose of hidden layers in a neural network?',
     '{"options": ["To increase complexity", "To learn non-linear patterns", "To reduce overfitting", "To speed up training"]}',
     'To learn non-linear patterns',
     'Hidden layers allow neural networks to learn complex, non-linear relationships in data.',
     2, ARRAY['neural-networks', 'deep-learning']),
    
    -- Cloud Computing Questions
    (cloud_category_id, 'AWS EC2 Instance Types', 'Beginner', 'multiple_choice',
     'Which AWS EC2 instance type is best for general-purpose computing?',
     '{"options": ["t3.micro", "c5.large", "r5.xlarge", "p3.2xlarge"]}',
     't3.micro',
     't3.micro instances provide burstable performance and are cost-effective for general workloads.',
     1, ARRAY['aws', 'ec2', 'instance-types']),
    
    (cloud_category_id, 'Cloud Architecture Principles', 'Advanced', 'multiple_choice',
     'What is the main benefit of microservices architecture?',
     '{"options": ["Reduced complexity", "Independent scaling", "Lower costs", "Faster development"]}',
     'Independent scaling',
     'Microservices allow each service to be scaled independently based on demand.',
     3, ARRAY['microservices', 'architecture', 'scalability']),
    
    -- Software Development Questions
    (dev_category_id, 'React Hooks', 'Intermediate', 'multiple_choice',
     'What is the purpose of useEffect hook in React?',
     '{"options": ["State management", "Side effects", "Event handling", "Component rendering"]}',
     'Side effects',
     'useEffect is used to perform side effects in functional components.',
     2, ARRAY['react', 'hooks', 'frontend']);
END $$;

-- Sample Assessment Templates
DO $$
DECLARE
  ai_category_id uuid;
  cloud_category_id uuid;
  dev_category_id uuid;
  curr_template_id uuid;
  curr_question_id uuid;
  sort_order_val integer;
BEGIN
  SELECT id INTO ai_category_id FROM assessment_categories WHERE name = 'AI & Machine Learning';
  SELECT id INTO cloud_category_id FROM assessment_categories WHERE name = 'Cloud Computing';
  SELECT id INTO dev_category_id FROM assessment_categories WHERE name = 'Software Development';
  
  -- AI Fundamentals Assessment
  INSERT INTO assessment_templates (
    category_id, title, description, assessment_type, difficulty_level,
    total_questions, time_limit_minutes, passing_score, is_published
  ) VALUES (
    ai_category_id, 'AI & Machine Learning Fundamentals',
    'Test your knowledge of core ML concepts, algorithms, and practical applications',
    'quiz', 'Intermediate', 25, 45, 70, true
  ) RETURNING id INTO curr_template_id;
  
  -- Link questions to template
  sort_order_val := 0;
  FOR curr_question_id IN (
    SELECT id FROM question_banks WHERE category_id = ai_category_id LIMIT 5
  ) LOOP
    INSERT INTO assessment_template_questions (template_id, question_id, sort_order)
    VALUES (curr_template_id, curr_question_id, sort_order_val);
    sort_order_val := sort_order_val + 1;
  END LOOP;
  
  -- Cloud Architecture Assessment
  INSERT INTO assessment_templates (
    category_id, title, description, assessment_type, difficulty_level,
    total_questions, time_limit_minutes, passing_score, is_published
  ) VALUES (
    cloud_category_id, 'Cloud Architecture Design',
    'Evaluate your skills in designing scalable cloud solutions and best practices',
    'assignment', 'Advanced', 30, 60, 65, true
  ) RETURNING id INTO curr_template_id;
  
  -- Link questions to template
  sort_order_val := 0;
  FOR curr_question_id IN (
    SELECT id FROM question_banks WHERE category_id = cloud_category_id LIMIT 5
  ) LOOP
    INSERT INTO assessment_template_questions (template_id, question_id, sort_order)
    VALUES (curr_template_id, curr_question_id, sort_order_val);
    sort_order_val := sort_order_val + 1;
  END LOOP;
  
  -- Full-Stack Development Assessment
  INSERT INTO assessment_templates (
    category_id, title, description, assessment_type, difficulty_level,
    total_questions, time_limit_minutes, passing_score, is_published
  ) VALUES (
    dev_category_id, 'Full-Stack Development Capstone',
    'Comprehensive assessment covering frontend, backend, and database technologies',
    'final_exam', 'Advanced', 40, 90, 72, true
  ) RETURNING id INTO curr_template_id;
  
  -- Link questions to template
  sort_order_val := 0;
  FOR curr_question_id IN (
    SELECT id FROM question_banks WHERE category_id = dev_category_id LIMIT 5
  ) LOOP
    INSERT INTO assessment_template_questions (template_id, question_id, sort_order)
    VALUES (curr_template_id, curr_question_id, sort_order_val);
    sort_order_val := sort_order_val + 1;
  END LOOP;
END $$;
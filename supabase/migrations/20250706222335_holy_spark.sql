-- Create enum types
CREATE TYPE lab_environment_status AS ENUM ('provisioning', 'running', 'paused', 'stopping', 'stopped', 'failed', 'expired');
CREATE TYPE lab_environment_provider AS ENUM ('aws', 'azure', 'gcp', 'kubernetes', 'docker');
CREATE TYPE lab_objective_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
CREATE TYPE lab_mode AS ENUM ('guided', 'challenge');

-- Lab Environment Templates
CREATE TABLE IF NOT EXISTS lab_environment_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  provider lab_environment_provider NOT NULL,
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
  terraform_template text,
  cloudformation_template text,
  arm_template text,
  kubernetes_manifest text,
  docker_compose text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Environment Instances
CREATE TABLE IF NOT EXISTS lab_environment_instances (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  template_id uuid REFERENCES lab_environment_templates(id),
  session_id text UNIQUE NOT NULL,
  status lab_environment_status DEFAULT 'provisioning',
  provider lab_environment_provider NOT NULL,
  region text NOT NULL,
  instance_type text,
  public_ip text,
  private_ip text,
  dns_name text,
  ssh_username text,
  ssh_key_pair text,
  web_console_url text,
  connection_info jsonb DEFAULT '{}',
  resource_ids jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  paused_at timestamptz,
  stopped_at timestamptz,
  total_runtime_seconds integer DEFAULT 0,
  max_duration_minutes integer DEFAULT 120,
  is_extended boolean DEFAULT false,
  extension_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Environment Resources
CREATE TABLE IF NOT EXISTS lab_environment_resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid REFERENCES lab_environment_instances(id) ON DELETE CASCADE,
  resource_type text NOT NULL, -- vm, container, network, storage, etc.
  resource_id text NOT NULL, -- cloud provider resource ID
  resource_name text NOT NULL,
  status text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Environment Logs
CREATE TABLE IF NOT EXISTS lab_environment_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid REFERENCES lab_environment_instances(id) ON DELETE CASCADE,
  log_type text NOT NULL, -- provision, command, error, system, etc.
  message text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Lab Objectives
CREATE TABLE IF NOT EXISTS lab_objectives (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  acceptance_criteria text,
  hint text,
  solution text,
  sort_order integer DEFAULT 0,
  is_required boolean DEFAULT true,
  points integer DEFAULT 10,
  validation_command text,
  validation_script text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Objective Validations
CREATE TABLE IF NOT EXISTS lab_objective_validations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id uuid REFERENCES lab_objectives(id) ON DELETE CASCADE,
  validation_type text NOT NULL, -- command, file_exists, file_content, api, etc.
  validation_rule text NOT NULL,
  expected_result text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Lab User Progress
CREATE TABLE IF NOT EXISTS lab_user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  instance_id uuid REFERENCES lab_environment_instances(id) ON DELETE SET NULL,
  objective_id uuid REFERENCES lab_objectives(id) ON DELETE CASCADE,
  status lab_objective_status DEFAULT 'pending',
  attempts integer DEFAULT 0,
  last_attempt_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lab_id, objective_id)
);

-- Lab User Sessions
CREATE TABLE IF NOT EXISTS lab_user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  instance_id uuid REFERENCES lab_environment_instances(id) ON DELETE CASCADE,
  mode lab_mode DEFAULT 'guided',
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration_seconds integer,
  completed boolean DEFAULT false,
  score integer,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text,
  created_at timestamptz DEFAULT now()
);

-- Lab Guides
CREATE TABLE IF NOT EXISTS lab_guides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text NOT NULL, -- markdown, html, video
  content text,
  video_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Resources
CREATE TABLE IF NOT EXISTS lab_resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  resource_type text NOT NULL, -- documentation, api_reference, sample_code, etc.
  url text,
  content text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lab_environment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_environment_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_environment_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_environment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_objective_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Lab Environment Templates
CREATE POLICY "Anyone can view active templates" ON lab_environment_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON lab_environment_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Environment Instances
CREATE POLICY "Users can view own instances" ON lab_environment_instances
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own instances" ON lab_environment_instances
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all instances" ON lab_environment_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Environment Resources
CREATE POLICY "Users can view own resources" ON lab_environment_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lab_environment_instances
      WHERE id = lab_environment_resources.instance_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all resources" ON lab_environment_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Environment Logs
CREATE POLICY "Users can view own logs" ON lab_environment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lab_environment_instances
      WHERE id = lab_environment_logs.instance_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all logs" ON lab_environment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Objectives
CREATE POLICY "Anyone can view lab objectives" ON lab_objectives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM labs
      WHERE id = lab_objectives.lab_id
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage objectives" ON lab_objectives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab User Progress
CREATE POLICY "Users can view own progress" ON lab_user_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON lab_user_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON lab_user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab User Sessions
CREATE POLICY "Users can view own sessions" ON lab_user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON lab_user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Guides
CREATE POLICY "Anyone can view lab guides" ON lab_guides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM labs
      WHERE id = lab_guides.lab_id
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage guides" ON lab_guides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Resources
CREATE POLICY "Anyone can view lab resources" ON lab_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM labs
      WHERE id = lab_resources.lab_id
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage resources" ON lab_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions

-- Function to provision a lab environment
CREATE OR REPLACE FUNCTION provision_lab_environment(
  p_user_id uuid,
  p_lab_id uuid,
  p_template_id uuid,
  p_duration_minutes integer DEFAULT 120,
  p_provider lab_environment_provider DEFAULT 'docker',
  p_region text DEFAULT 'us-east-1'
)
RETURNS uuid AS $$
DECLARE
  v_session_id text;
  v_instance_id uuid;
  v_expires_at timestamptz;
BEGIN
  -- Generate a unique session ID
  v_session_id := 'lab-' || p_lab_id::text || '-' || p_user_id::text || '-' || extract(epoch from now())::text;
  
  -- Calculate expiration time
  v_expires_at := now() + (p_duration_minutes * interval '1 minute');
  
  -- Create the lab environment instance
  INSERT INTO lab_environment_instances (
    user_id,
    lab_id,
    template_id,
    session_id,
    provider,
    region,
    expires_at,
    max_duration_minutes
  ) VALUES (
    p_user_id,
    p_lab_id,
    p_template_id,
    v_session_id,
    p_provider,
    p_region,
    v_expires_at,
    p_duration_minutes
  ) RETURNING id INTO v_instance_id;
  
  -- Log the provisioning request
  INSERT INTO lab_environment_logs (
    instance_id,
    log_type,
    message,
    details
  ) VALUES (
    v_instance_id,
    'provision',
    'Lab environment provisioning requested',
    jsonb_build_object(
      'user_id', p_user_id,
      'lab_id', p_lab_id,
      'template_id', p_template_id,
      'duration_minutes', p_duration_minutes,
      'provider', p_provider,
      'region', p_region
    )
  );
  
  -- In a real implementation, this would trigger an external service to provision the actual resources
  -- For now, we'll just return the instance ID
  
  RETURN v_instance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to extend lab environment duration
CREATE OR REPLACE FUNCTION extend_lab_environment(
  p_instance_id uuid,
  p_additional_minutes integer DEFAULT 30
)
RETURNS boolean AS $$
DECLARE
  v_user_id uuid;
  v_current_expires_at timestamptz;
  v_new_expires_at timestamptz;
  v_extension_count integer;
BEGIN
  -- Get current expiration time and user ID
  SELECT user_id, expires_at, extension_count
  INTO v_user_id, v_current_expires_at, v_extension_count
  FROM lab_environment_instances
  WHERE id = p_instance_id;
  
  -- Check if the user is the owner of this instance
  IF v_user_id != auth.uid() THEN
    RETURN false;
  END IF;
  
  -- Calculate new expiration time
  v_new_expires_at := v_current_expires_at + (p_additional_minutes * interval '1 minute');
  
  -- Update the instance
  UPDATE lab_environment_instances
  SET expires_at = v_new_expires_at,
      is_extended = true,
      extension_count = v_extension_count + 1
  WHERE id = p_instance_id;
  
  -- Log the extension
  INSERT INTO lab_environment_logs (
    instance_id,
    log_type,
    message,
    details
  ) VALUES (
    p_instance_id,
    'extension',
    'Lab environment duration extended',
    jsonb_build_object(
      'additional_minutes', p_additional_minutes,
      'old_expires_at', v_current_expires_at,
      'new_expires_at', v_new_expires_at,
      'extension_count', v_extension_count + 1
    )
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate a lab objective
CREATE OR REPLACE FUNCTION validate_lab_objective(
  p_user_id uuid,
  p_lab_id uuid,
  p_objective_id uuid,
  p_instance_id uuid,
  p_validation_result jsonb
)
RETURNS boolean AS $$
DECLARE
  v_is_valid boolean;
  v_status lab_objective_status;
BEGIN
  -- Determine if the validation passed
  v_is_valid := (p_validation_result->>'passed')::boolean;
  
  -- Set the status based on the validation result
  IF v_is_valid THEN
    v_status := 'completed';
  ELSE
    v_status := 'failed';
  END IF;
  
  -- Update or insert the user progress
  INSERT INTO lab_user_progress (
    user_id,
    lab_id,
    instance_id,
    objective_id,
    status,
    attempts,
    last_attempt_at,
    completed_at,
    notes
  ) VALUES (
    p_user_id,
    p_lab_id,
    p_instance_id,
    p_objective_id,
    v_status,
    1,
    now(),
    CASE WHEN v_is_valid THEN now() ELSE NULL END,
    p_validation_result->>'message'
  )
  ON CONFLICT (user_id, lab_id, objective_id) DO UPDATE
  SET status = v_status,
      attempts = lab_user_progress.attempts + 1,
      last_attempt_at = now(),
      completed_at = CASE WHEN v_is_valid THEN now() ELSE lab_user_progress.completed_at END,
      notes = p_validation_result->>'message';
  
  -- Log the validation attempt
  INSERT INTO lab_environment_logs (
    instance_id,
    log_type,
    message,
    details
  ) VALUES (
    p_instance_id,
    'validation',
    CASE WHEN v_is_valid THEN 'Objective completed successfully' ELSE 'Objective validation failed' END,
    jsonb_build_object(
      'objective_id', p_objective_id,
      'validation_result', p_validation_result
    )
  );
  
  RETURN v_is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired lab environments
CREATE OR REPLACE FUNCTION cleanup_expired_lab_environments()
RETURNS integer AS $$
DECLARE
  v_count integer := 0;
  v_instance record;
BEGIN
  -- Find expired instances that are still running
  FOR v_instance IN
    SELECT id, user_id, lab_id, session_id
    FROM lab_environment_instances
    WHERE expires_at < now()
    AND status IN ('running', 'paused')
  LOOP
    -- Update the instance status
    UPDATE lab_environment_instances
    SET status = 'expired',
        stopped_at = now()
    WHERE id = v_instance.id;
    
    -- Log the expiration
    INSERT INTO lab_environment_logs (
      instance_id,
      log_type,
      message,
      details
    ) VALUES (
      v_instance.id,
      'expiration',
      'Lab environment expired and stopped',
      jsonb_build_object(
        'user_id', v_instance.user_id,
        'lab_id', v_instance.lab_id,
        'session_id', v_instance.session_id
      )
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  -- In a real implementation, this would trigger an external service to cleanup the actual resources
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data

-- Sample Lab Environment Templates
INSERT INTO lab_environment_templates (
  name, 
  description, 
  provider, 
  base_image, 
  pre_installed_software, 
  startup_script
) VALUES 
(
  'AWS Cloud Development', 
  'AWS environment with pre-installed AWS CLI, SDK, and development tools',
  'aws',
  'ami-0c55b159cbfafe1f0',
  ARRAY['aws-cli', 'python', 'node.js', 'docker', 'git'],
  '#!/bin/bash
echo "Setting up AWS Cloud Development Environment..."
apt-get update
apt-get install -y python3-pip
pip3 install awscli boto3
npm install -g aws-sdk
echo "Environment setup complete!"'
),
(
  'Kubernetes Cluster', 
  'Kubernetes environment with pre-installed kubectl, helm, and k9s',
  'kubernetes',
  'ubuntu:20.04',
  ARRAY['kubectl', 'helm', 'k9s', 'docker', 'git'],
  '#!/bin/bash
echo "Setting up Kubernetes Development Environment..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "Environment setup complete!"'
),
(
  'Full-Stack Development', 
  'Development environment with Node.js, React, MongoDB, and Express',
  'docker',
  'node:16',
  ARRAY['node.js', 'npm', 'mongodb', 'express', 'react', 'git'],
  '#!/bin/bash
echo "Setting up Full-Stack Development Environment..."
npm install -g create-react-app express-generator
apt-get update
apt-get install -y mongodb
echo "Environment setup complete!"'
);

-- Sample Lab Objectives for an AWS Lab
DO $$
DECLARE
  v_lab_id uuid;
BEGIN
  -- Get a sample lab ID
  SELECT id INTO v_lab_id FROM labs WHERE title = 'AWS EC2 Instance Setup and Configuration' LIMIT 1;
  
  IF v_lab_id IS NOT NULL THEN
    -- Insert objectives
    INSERT INTO lab_objectives (
      lab_id,
      title,
      description,
      acceptance_criteria,
      hint,
      solution,
      sort_order,
      validation_command
    ) VALUES 
    (
      v_lab_id,
      'Launch an EC2 Instance',
      'Launch a t2.micro EC2 instance with Amazon Linux 2 AMI',
      'An EC2 instance is running with the correct instance type and AMI',
      'Use the AWS Management Console or AWS CLI to launch an EC2 instance',
      'aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t2.micro --key-name MyKeyPair',
      1,
      'aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro" "Name=instance-state-name,Values=running" --query "Reservations[].Instances[].InstanceId" --output text'
    ),
    (
      v_lab_id,
      'Configure Security Group',
      'Create a security group allowing SSH (port 22) and HTTP (port 80) access',
      'A security group exists with inbound rules for ports 22 and 80',
      'Use the AWS Management Console or AWS CLI to create and configure a security group',
      'aws ec2 create-security-group --group-name MySecurityGroup --description "My security group"\naws ec2 authorize-security-group-ingress --group-name MySecurityGroup --protocol tcp --port 22 --cidr 0.0.0.0/0\naws ec2 authorize-security-group-ingress --group-name MySecurityGroup --protocol tcp --port 80 --cidr 0.0.0.0/0',
      2,
      'aws ec2 describe-security-groups --group-names MySecurityGroup --query "SecurityGroups[].IpPermissions[].{Protocol:IpProtocol,Port:FromPort}" --output text'
    ),
    (
      v_lab_id,
      'Connect to EC2 Instance',
      'Connect to your EC2 instance using SSH',
      'Successfully connected to the EC2 instance via SSH',
      'Use the SSH key pair and the public DNS name of your instance',
      'ssh -i MyKeyPair.pem ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com',
      3,
      'echo "Connected to $(hostname)"'
    ),
    (
      v_lab_id,
      'Install Web Server',
      'Install and configure Apache web server on your EC2 instance',
      'Apache web server is installed, running, and serving a test page',
      'Use yum to install httpd package and systemctl to start the service',
      'sudo yum update -y\nsudo yum install -y httpd\nsudo systemctl start httpd\nsudo systemctl enable httpd',
      4,
      'sudo systemctl is-active httpd && curl -s localhost | grep -i apache'
    ),
    (
      v_lab_id,
      'Deploy Sample Website',
      'Create and deploy a simple HTML website to your Apache server',
      'A custom HTML page is accessible via the EC2 instance''s public IP',
      'Create an index.html file in /var/www/html/',
      'sudo bash -c ''echo "<html><body><h1>My AWS Website</h1><p>This is running on EC2!</p></body></html>" > /var/www/html/index.html''',
      5,
      'curl -s localhost | grep -i "My AWS Website"'
    );
    
    -- Insert validations for the first objective
    INSERT INTO lab_objective_validations (
      objective_id,
      validation_type,
      validation_rule,
      expected_result,
      error_message
    ) VALUES
    (
      (SELECT id FROM lab_objectives WHERE lab_id = v_lab_id AND sort_order = 1),
      'command',
      'aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro" "Name=instance-state-name,Values=running" --query "length(Reservations[].Instances[])" --output text',
      '1',
      'No running t2.micro EC2 instance found. Please launch an EC2 instance with the t2.micro instance type.'
    );
  END IF;
END $$;

-- Create a cron job to clean up expired lab environments
-- This would typically be handled by an external scheduler in a real implementation
-- For Supabase, you would use a scheduled function or an external service
-- Here we'll just create the function that would be called

-- Create a config table for system settings if it doesn't exist
CREATE TABLE IF NOT EXISTS config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Insert default config for lab environment cleanup interval
INSERT INTO config (key, value)
VALUES ('lab_environment_cleanup_interval_minutes', '5')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
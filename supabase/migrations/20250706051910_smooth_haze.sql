/*
  # Cloud Provider Integration Schema

  1. New Tables
    - `cloud_providers` - AWS, Azure, GCP provider configurations
    - `cloud_accounts` - User cloud account connections
    - `cloud_resources` - Provisioned cloud resources for labs
    - `cloud_sessions` - Active cloud lab sessions
    - `cloud_templates` - Infrastructure as Code templates
    - `cloud_costs` - Cost tracking and billing

  2. Enhanced Lab Sessions
    - Real cloud environment provisioning
    - Resource lifecycle management
    - Cost monitoring and limits

  3. Security & Compliance
    - Secure credential management
    - Resource isolation
    - Automatic cleanup
*/

-- Create cloud provider enum types
CREATE TYPE cloud_provider_type AS ENUM ('aws', 'azure', 'gcp');
CREATE TYPE cloud_resource_type AS ENUM ('vm', 'container', 'database', 'storage', 'network', 'kubernetes');
CREATE TYPE cloud_resource_status AS ENUM ('provisioning', 'running', 'stopping', 'stopped', 'terminated', 'error');
CREATE TYPE cloud_session_type AS ENUM ('sandbox', 'guided', 'assessment', 'project');

-- Cloud Providers table
CREATE TABLE IF NOT EXISTS cloud_providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  provider_type cloud_provider_type NOT NULL,
  display_name text NOT NULL,
  description text,
  logo_url text,
  api_endpoint text NOT NULL,
  regions text[] DEFAULT '{}',
  supported_services text[] DEFAULT '{}',
  pricing_model jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  configuration jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cloud Accounts table (user cloud account connections)
CREATE TABLE IF NOT EXISTS cloud_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  account_name text NOT NULL,
  account_id text NOT NULL, -- AWS Account ID, Azure Subscription ID, GCP Project ID
  credentials_encrypted text NOT NULL, -- Encrypted credentials
  region text NOT NULL,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  monthly_budget decimal(10,2) DEFAULT 100.00,
  current_spend decimal(10,2) DEFAULT 0.00,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider_id, account_id)
);

-- Cloud Templates table (Infrastructure as Code)
CREATE TABLE IF NOT EXISTS cloud_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  template_type text NOT NULL, -- terraform, cloudformation, arm, deployment-manager
  template_content text NOT NULL,
  variables jsonb DEFAULT '{}',
  estimated_cost_per_hour decimal(8,4) DEFAULT 0.0000,
  max_duration_minutes integer DEFAULT 120,
  auto_cleanup boolean DEFAULT true,
  resource_tags jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cloud Resources table
CREATE TABLE IF NOT EXISTS cloud_resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL, -- References cloud_sessions.id
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  account_id uuid REFERENCES cloud_accounts(id) ON DELETE CASCADE,
  resource_type cloud_resource_type NOT NULL,
  resource_id text NOT NULL, -- Cloud provider resource ID
  resource_name text NOT NULL,
  region text NOT NULL,
  status cloud_resource_status DEFAULT 'provisioning',
  configuration jsonb DEFAULT '{}',
  endpoints jsonb DEFAULT '{}', -- Public IPs, URLs, connection strings
  cost_per_hour decimal(8,4) DEFAULT 0.0000,
  total_cost decimal(10,4) DEFAULT 0.0000,
  provisioned_at timestamptz DEFAULT now(),
  terminated_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Cloud Sessions table
CREATE TABLE IF NOT EXISTS cloud_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  account_id uuid REFERENCES cloud_accounts(id) ON DELETE CASCADE,
  template_id uuid REFERENCES cloud_templates(id),
  session_type cloud_session_type DEFAULT 'sandbox',
  session_name text NOT NULL,
  status lab_session_status DEFAULT 'starting',
  region text NOT NULL,
  max_duration_minutes integer DEFAULT 120,
  auto_cleanup boolean DEFAULT true,
  budget_limit decimal(10,2) DEFAULT 50.00,
  current_cost decimal(10,4) DEFAULT 0.0000,
  access_credentials jsonb DEFAULT '{}', -- Temporary access keys, URLs
  connection_info jsonb DEFAULT '{}', -- SSH keys, RDP info, web URLs
  resource_count integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  last_activity_at timestamptz DEFAULT now(),
  cleanup_completed_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cloud Costs table
CREATE TABLE IF NOT EXISTS cloud_costs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES cloud_sessions(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES cloud_resources(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  cost_type text NOT NULL, -- compute, storage, network, data-transfer
  amount decimal(10,4) NOT NULL,
  currency text DEFAULT 'USD',
  billing_period_start timestamptz NOT NULL,
  billing_period_end timestamptz NOT NULL,
  usage_quantity decimal(12,4),
  usage_unit text, -- hours, GB, requests
  rate_per_unit decimal(10,6),
  tags jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Lab Cloud Configurations table
CREATE TABLE IF NOT EXISTS lab_cloud_configs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  template_id uuid REFERENCES cloud_templates(id) ON DELETE CASCADE,
  is_default boolean DEFAULT false,
  min_resources jsonb DEFAULT '{}',
  max_resources jsonb DEFAULT '{}',
  estimated_cost_per_hour decimal(8,4) DEFAULT 0.0000,
  max_session_duration_minutes integer DEFAULT 120,
  auto_cleanup_delay_minutes integer DEFAULT 5,
  required_permissions text[] DEFAULT '{}',
  setup_instructions text,
  cleanup_instructions text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, provider_id)
);

-- Cloud Quotas table
CREATE TABLE IF NOT EXISTS cloud_quotas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES cloud_providers(id) ON DELETE CASCADE,
  quota_type text NOT NULL, -- daily_budget, concurrent_sessions, monthly_hours
  quota_limit decimal(10,2) NOT NULL,
  quota_used decimal(10,2) DEFAULT 0.00,
  reset_period text DEFAULT 'daily', -- daily, weekly, monthly
  last_reset_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider_id, quota_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cloud_sessions_user_id ON cloud_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_sessions_status ON cloud_sessions(status);
CREATE INDEX IF NOT EXISTS idx_cloud_sessions_provider_id ON cloud_sessions(provider_id);
CREATE INDEX IF NOT EXISTS idx_cloud_sessions_started_at ON cloud_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_cloud_resources_session_id ON cloud_resources(session_id);
CREATE INDEX IF NOT EXISTS idx_cloud_resources_status ON cloud_resources(status);
CREATE INDEX IF NOT EXISTS idx_cloud_resources_provider_id ON cloud_resources(provider_id);

CREATE INDEX IF NOT EXISTS idx_cloud_costs_session_id ON cloud_costs(session_id);
CREATE INDEX IF NOT EXISTS idx_cloud_costs_user_id ON cloud_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_costs_billing_period ON cloud_costs(billing_period_start, billing_period_end);

CREATE INDEX IF NOT EXISTS idx_cloud_accounts_user_id ON cloud_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_accounts_provider_id ON cloud_accounts(provider_id);

-- Enable RLS on all new tables
ALTER TABLE cloud_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_cloud_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_quotas ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Cloud Providers policies
CREATE POLICY "Anyone can view active cloud providers" ON cloud_providers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cloud providers" ON cloud_providers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Accounts policies
CREATE POLICY "Users can manage own cloud accounts" ON cloud_accounts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all cloud accounts" ON cloud_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Templates policies
CREATE POLICY "Anyone can view public cloud templates" ON cloud_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own cloud templates" ON cloud_templates
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all cloud templates" ON cloud_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Sessions policies
CREATE POLICY "Users can manage own cloud sessions" ON cloud_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all cloud sessions" ON cloud_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Resources policies
CREATE POLICY "Users can view own cloud resources" ON cloud_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cloud_sessions 
      WHERE id = cloud_resources.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all cloud resources" ON cloud_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Costs policies
CREATE POLICY "Users can view own cloud costs" ON cloud_costs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all cloud costs" ON cloud_costs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cloud Quotas policies
CREATE POLICY "Users can view own cloud quotas" ON cloud_quotas
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all cloud quotas" ON cloud_quotas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lab Cloud Configs policies
CREATE POLICY "Anyone can view active lab cloud configs" ON lab_cloud_configs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage lab cloud configs" ON lab_cloud_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for cloud resource management

-- Function to calculate session costs
CREATE OR REPLACE FUNCTION calculate_session_cost(session_uuid uuid)
RETURNS decimal(10,4) AS $$
DECLARE
  total_cost decimal(10,4) := 0.0000;
BEGIN
  SELECT COALESCE(SUM(amount), 0.0000) INTO total_cost
  FROM cloud_costs
  WHERE session_id = session_uuid;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user quotas
CREATE OR REPLACE FUNCTION check_user_quota(user_uuid uuid, provider_uuid uuid, quota_type_param text)
RETURNS boolean AS $$
DECLARE
  quota_limit decimal(10,2);
  quota_used decimal(10,2);
BEGIN
  SELECT quota_limit, quota_used INTO quota_limit, quota_used
  FROM cloud_quotas
  WHERE user_id = user_uuid AND provider_id = provider_uuid AND quota_type = quota_type_param;
  
  IF NOT FOUND THEN
    RETURN true; -- No quota set, allow
  END IF;
  
  RETURN quota_used < quota_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update resource costs
CREATE OR REPLACE FUNCTION update_cloud_session_cost()
RETURNS trigger AS $$
BEGIN
  UPDATE cloud_sessions 
  SET current_cost = calculate_session_cost(NEW.session_id),
      updated_at = now()
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for cost updates
CREATE TRIGGER update_session_cost_trigger
  AFTER INSERT OR UPDATE ON cloud_costs
  FOR EACH ROW EXECUTE FUNCTION update_cloud_session_cost();

-- Insert default cloud providers
INSERT INTO cloud_providers (name, provider_type, display_name, description, api_endpoint, regions, supported_services) VALUES
  ('aws', 'aws', 'Amazon Web Services', 'Leading cloud platform with comprehensive services', 'https://aws.amazon.com', 
   ARRAY['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'], 
   ARRAY['ec2', 's3', 'rds', 'lambda', 'eks', 'vpc']),
  ('azure', 'azure', 'Microsoft Azure', 'Enterprise cloud platform with integrated Microsoft services', 'https://management.azure.com',
   ARRAY['eastus', 'westus2', 'westeurope', 'southeastasia'],
   ARRAY['vm', 'storage', 'sql', 'functions', 'aks', 'vnet']),
  ('gcp', 'gcp', 'Google Cloud Platform', 'Google''s cloud platform with advanced AI and data services', 'https://cloud.google.com',
   ARRAY['us-central1', 'us-west1', 'europe-west1', 'asia-southeast1'],
   ARRAY['compute', 'storage', 'sql', 'functions', 'gke', 'vpc'])
ON CONFLICT DO NOTHING;

-- Insert default cloud templates
INSERT INTO cloud_templates (name, description, provider_id, template_type, template_content, estimated_cost_per_hour) VALUES
  ('Basic Ubuntu VM', 'Single Ubuntu 22.04 virtual machine for development', 
   (SELECT id FROM cloud_providers WHERE name = 'aws'), 'terraform',
   '# AWS EC2 Instance
resource "aws_instance" "lab_vm" {
  ami           = "ami-0c02fb55956c7d316"  # Ubuntu 22.04 LTS
  instance_type = "t3.micro"
  
  tags = {
    Name = "skilltrack-lab-${var.session_id}"
    Environment = "lab"
    AutoCleanup = "true"
  }
}

output "public_ip" {
  value = aws_instance.lab_vm.public_ip
}', 0.0116),

  ('Docker Container Environment', 'Container-based development environment',
   (SELECT id FROM cloud_providers WHERE name = 'azure'), 'arm',
   '{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2021-03-01",
      "name": "[concat(''skilltrack-lab-'', parameters(''sessionId''))]",
      "location": "[resourceGroup().location]",
      "properties": {
        "containers": [
          {
            "name": "lab-container",
            "properties": {
              "image": "ubuntu:22.04",
              "resources": {
                "requests": {
                  "cpu": 1,
                  "memoryInGb": 2
                }
              },
              "ports": [
                {
                  "port": 22,
                  "protocol": "TCP"
                }
              ]
            }
          }
        ],
        "osType": "Linux",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "port": 22,
              "protocol": "TCP"
            }
          ]
        }
      }
    }
  ]
}', 0.0200),

  ('Kubernetes Cluster', 'Managed Kubernetes cluster for container orchestration',
   (SELECT id FROM cloud_providers WHERE name = 'gcp'), 'deployment-manager',
   'resources:
- name: skilltrack-gke-cluster
  type: container.v1.cluster
  properties:
    zone: us-central1-a
    cluster:
      name: skilltrack-lab-{{ session_id }}
      initialNodeCount: 1
      nodeConfig:
        machineType: e2-micro
        diskSizeGb: 10
        oauthScopes:
        - https://www.googleapis.com/auth/cloud-platform
      addonsConfig:
        httpLoadBalancing:
          disabled: false
        horizontalPodAutoscaling:
          disabled: false', 0.0500)
ON CONFLICT DO NOTHING;

-- Insert default quotas for new users (via trigger)
CREATE OR REPLACE FUNCTION create_default_cloud_quotas()
RETURNS trigger AS $$
BEGIN
  -- Insert default quotas for each cloud provider
  INSERT INTO cloud_quotas (user_id, provider_id, quota_type, quota_limit)
  SELECT 
    NEW.id,
    cp.id,
    'daily_budget',
    25.00
  FROM cloud_providers cp
  WHERE cp.is_active = true;
  
  INSERT INTO cloud_quotas (user_id, provider_id, quota_type, quota_limit)
  SELECT 
    NEW.id,
    cp.id,
    'concurrent_sessions',
    2
  FROM cloud_providers cp
  WHERE cp.is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default quotas for new users
CREATE TRIGGER create_user_cloud_quotas_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_cloud_quotas();
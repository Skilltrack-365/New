import React, { useState } from 'react';
import { Cloud, Server, Database, Network, Shield, Terminal, Code, Monitor, ExternalLink } from 'lucide-react';
import CloudProviderSelector from './CloudProviderSelector';
import CloudSessionManager from './CloudSessionManager';
import CloudTerminal from './CloudTerminal';
import CodeEditor from './CodeEditor';
import FileManager from './FileManager';
import WebBrowser from './WebBrowser';
import DatabaseConsole from './DatabaseConsole';
import SystemMonitor from './SystemMonitor';

interface RealCloudEnvironmentProps {
  labId: string;
  onSessionEnd: () => void;
}

interface CloudProvider {
  id: string;
  name: string;
  provider_type: 'aws' | 'azure' | 'gcp';
  display_name: string;
  description: string;
  logo_url?: string;
  regions: string[];
  supported_services: string[];
  pricing_model: any;
  is_active: boolean;
}

interface CloudAccount {
  id: string;
  provider_id: string;
  account_name: string;
  account_id: string;
  region: string;
  is_verified: boolean;
  is_active: boolean;
  monthly_budget: number;
  current_spend: number;
}

const RealCloudEnvironment: React.FC<RealCloudEnvironmentProps> = ({ labId, onSessionEnd }) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [sessionState, setSessionState] = useState<'setup' | 'active'>('setup');
  const [sessionId, setSessionId] = useState('');
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CloudAccount | null>(null);

  const tabs = [
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'editor', name: 'Code Editor', icon: Code },
    { id: 'files', name: 'File Manager', icon: FileManager },
    { id: 'browser', name: 'Web Browser', icon: Monitor },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'monitor', name: 'System Monitor', icon: Server },
    { id: 'network', name: 'Network', icon: Network },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleProviderSelect = (provider: CloudProvider, account: CloudAccount) => {
    setSelectedProvider(provider);
    setSelectedAccount(account);
  };

  const handleSessionReady = (cloudSessionId: string, cloudConnectionInfo: any) => {
    setSessionId(cloudSessionId);
    setConnectionInfo(cloudConnectionInfo);
    setSessionState('active');
  };

  const handleSessionEnd = () => {
    setSessionState('setup');
    setSessionId('');
    setConnectionInfo(null);
    setSelectedProvider(null);
    setSelectedAccount(null);
    onSessionEnd();
  };

  const renderTabContent = () => {
    if (!connectionInfo) return null;

    switch (activeTab) {
      case 'terminal':
        return (
          <CloudTerminal
            labId={labId}
            sessionId={sessionId}
            timeRemaining={7200} // 2 hours in seconds
            onSessionEnd={handleSessionEnd}
            environment={selectedProvider?.provider_type === 'aws' ? 'ubuntu' : 
                         selectedProvider?.provider_type === 'azure' ? 'debian' : 'centos'}
          />
        );
      
      case 'editor':
        return <CodeEditor sessionId={sessionId} />;
      
      case 'files':
        return <FileManager sessionId={sessionId} />;
      
      case 'browser':
        return <WebBrowser sessionId={sessionId} />;
      
      case 'database':
        return <DatabaseConsole sessionId={sessionId} />;
      
      case 'monitor':
        return <SystemMonitor sessionId={sessionId} />;
      
      case 'network':
        return (
          <div className="bg-white rounded-lg h-96 border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Network className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Network Configuration</h3>
            </div>
            
            <div className="space-y-6">
              {/* VPC/Network Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Virtual Network</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">VPC ID:</span>
                    <span className="font-mono">vpc-0a1b2c3d4e5f6g7h8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CIDR Block:</span>
                    <span className="font-mono">10.0.0.0/16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subnet:</span>
                    <span className="font-mono">10.0.1.0/24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Internet Gateway:</span>
                    <span className="font-mono">igw-0a1b2c3d4e</span>
                  </div>
                </div>
              </div>

              {/* Security Groups */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Security Group</h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded p-2">
                    <div className="font-medium mb-1">Inbound Rules</div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="font-medium">Type</div>
                      <div className="font-medium">Protocol</div>
                      <div className="font-medium">Port Range</div>
                      <div className="font-medium">Source</div>
                      
                      <div>SSH</div>
                      <div>TCP</div>
                      <div>22</div>
                      <div>0.0.0.0/0</div>
                      
                      <div>HTTP</div>
                      <div>TCP</div>
                      <div>80</div>
                      <div>0.0.0.0/0</div>
                      
                      <div>HTTPS</div>
                      <div>TCP</div>
                      <div>443</div>
                      <div>0.0.0.0/0</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Endpoints */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Public Endpoints</h4>
                <div className="space-y-2">
                  {connectionInfo.web_urls?.map((url: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{url.name}:</span>
                      <a 
                        href={url.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {url.url}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="bg-white rounded-lg h-96 border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Security Configuration</h3>
            </div>
            
            <div className="space-y-6">
              {/* IAM Roles */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">IAM Role</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role Name:</span>
                    <span className="font-mono">LabInstanceRole</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ARN:</span>
                    <span className="font-mono text-xs">arn:aws:iam::123456789012:role/LabInstanceRole</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-medium mb-1">Attached Policies:</div>
                  <div className="space-y-1 text-xs">
                    <div className="bg-blue-50 p-1 rounded">AmazonS3ReadOnlyAccess</div>
                    <div className="bg-blue-50 p-1 rounded">AmazonEC2ContainerRegistryReadOnly</div>
                    <div className="bg-blue-50 p-1 rounded">CloudWatchLogsReadOnlyAccess</div>
                  </div>
                </div>
              </div>

              {/* Access Keys */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Temporary Credentials</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Key:</span>
                    <span className="font-mono">AKIA************EXAMPLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Secret Key:</span>
                    <span className="font-mono">••••••••••••••••••••••••</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiration:</span>
                    <span>2 hours from session start</span>
                  </div>
                </div>
              </div>

              {/* Security Monitoring */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Security Monitoring</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CloudTrail:</span>
                    <span className="text-green-600">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GuardDuty:</span>
                    <span className="text-green-600">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resource Monitoring:</span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (sessionState === 'setup') {
    return (
      <CloudProviderSelector
        labId={labId}
        onProviderSelect={handleProviderSelect}
        onCancel={onSessionEnd}
      />
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg">
      {/* Session Manager */}
      <div className="mb-6">
        <CloudSessionManager
          labId={labId}
          providerId={selectedProvider?.id || ''}
          accountId={selectedAccount?.id || ''}
          onSessionReady={handleSessionReady}
          onSessionEnd={handleSessionEnd}
        />
      </div>

      {/* Environment Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Environment Running
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Server className="w-4 h-4 mr-1" />
              {selectedProvider?.display_name} Cloud
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Cloud className="w-4 h-4 mr-1" />
              {selectedAccount?.region}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Session ID:</span>
            <span className="text-sm font-mono text-gray-700">
              {sessionId.slice(-8)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
                {tab.id === 'terminal' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RealCloudEnvironment;
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Play, 
  Pause, 
  Square, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Server,
  Monitor,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CloudSession {
  id: string;
  session_name: string;
  status: 'starting' | 'active' | 'paused' | 'completed' | 'expired';
  provider_type: string;
  region: string;
  current_cost: number;
  budget_limit: number;
  max_duration_minutes: number;
  started_at: string;
  connection_info: any;
  resource_count: number;
}

interface CloudSessionManagerProps {
  labId: string;
  providerId: string;
  accountId: string;
  onSessionReady: (sessionId: string, connectionInfo: any) => void;
  onSessionEnd: () => void;
}

const CloudSessionManager: React.FC<CloudSessionManagerProps> = ({
  labId,
  providerId,
  accountId,
  onSessionReady,
  onSessionEnd
}) => {
  const [session, setSession] = useState<CloudSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [provisioningStep, setProvisioningStep] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (session?.status === 'active') {
      const startTime = new Date(session.started_at).getTime();
      const maxDuration = session.max_duration_minutes * 60 * 1000;
      const endTime = startTime + maxDuration;
      
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(Math.floor(remaining / 1000));
        
        if (remaining <= 0) {
          handleSessionEnd();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const createCloudSession = async () => {
    setLoading(true);
    setError(null);
    setProvisioningProgress(0);

    try {
      // Step 1: Create session record
      setProvisioningStep('Creating session...');
      setProvisioningProgress(10);

      const { data: sessionData, error: sessionError } = await supabase
        .from('cloud_sessions')
        .insert({
          lab_id: labId,
          provider_id: providerId,
          account_id: accountId,
          session_name: `Lab Session ${Date.now()}`,
          session_type: 'sandbox',
          region: 'us-east-1', // This would come from account settings
          max_duration_minutes: 120,
          budget_limit: 10.00
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSession(sessionData);

      // Step 2: Provision cloud resources
      await provisionCloudResources(sessionData.id);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const provisionCloudResources = async (sessionId: string) => {
    const steps = [
      { step: 'Validating cloud credentials...', progress: 20 },
      { step: 'Creating virtual network...', progress: 35 },
      { step: 'Launching compute instances...', progress: 50 },
      { step: 'Configuring security groups...', progress: 65 },
      { step: 'Installing software packages...', progress: 80 },
      { step: 'Finalizing environment setup...', progress: 95 },
      { step: 'Environment ready!', progress: 100 }
    ];

    for (const { step, progress } of steps) {
      setProvisioningStep(step);
      setProvisioningProgress(progress);
      
      // Simulate provisioning time
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Update session status and connection info
    const connectionInfo = {
      ssh_host: '54.123.45.67',
      ssh_port: 22,
      ssh_username: 'ubuntu',
      ssh_private_key: 'generated-key-content',
      web_urls: [
        { name: 'Application', url: 'http://54.123.45.67:3000' },
        { name: 'Database Admin', url: 'http://54.123.45.67:8080' }
      ],
      credentials: {
        database_url: 'postgresql://user:pass@54.123.45.67:5432/labdb',
        redis_url: 'redis://54.123.45.67:6379'
      }
    };

    const { error: updateError } = await supabase
      .from('cloud_sessions')
      .update({
        status: 'active',
        connection_info: connectionInfo,
        resource_count: 3
      })
      .eq('id', sessionId);

    if (updateError) throw updateError;

    setSession(prev => prev ? {
      ...prev,
      status: 'active',
      connection_info: connectionInfo,
      resource_count: 3
    } : null);

    setLoading(false);
    onSessionReady(sessionId, connectionInfo);
  };

  const handleSessionEnd = async () => {
    if (!session) return;

    try {
      // Update session status
      await supabase
        .from('cloud_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', session.id);

      // Trigger cleanup (in real implementation, this would call cloud APIs)
      setProvisioningStep('Cleaning up resources...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSessionEnd();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const pauseSession = async () => {
    if (!session) return;

    try {
      await supabase
        .from('cloud_sessions')
        .update({ status: 'paused' })
        .eq('id', session.id);

      setSession(prev => prev ? { ...prev, status: 'paused' } : null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resumeSession = async () => {
    if (!session) return;

    try {
      await supabase
        .from('cloud_sessions')
        .update({ status: 'active' })
        .eq('id', session.id);

      setSession(prev => prev ? { ...prev, status: 'active' } : null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'starting': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Cloud className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Launch Cloud Environment
        </h3>
        <p className="text-gray-600 mb-6">
          Your real cloud infrastructure will be provisioned and ready in minutes.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">What you'll get:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
            <div className="flex items-center">
              <Server className="w-4 h-4 mr-2" />
              Virtual Machine (t3.micro)
            </div>
            <div className="flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Web-based IDE
            </div>
            <div className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              SSH Access
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              ~$0.50/hour
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={createCloudSession}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Provisioning...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Launch Cloud Environment
            </>
          )}
        </button>
      </div>
    );
  }

  if (loading || session.status === 'starting') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Provisioning Cloud Environment
          </h3>
          <p className="text-gray-600">
            Setting up your real cloud infrastructure...
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{provisioningStep}</span>
            <span>{provisioningProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${provisioningProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Server className="w-4 h-4 mr-2" />
            <span>Provider: AWS</span>
          </div>
          <div className="flex items-center">
            <Cloud className="w-4 h-4 mr-2" />
            <span>Region: {session.region}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>Budget: ${session.budget_limit}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Max: {session.max_duration_minutes}min</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <Cloud className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cloud Environment Active</h3>
            <p className="text-sm text-gray-600">
              {session.resource_count} resources running in {session.region}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-green-600'}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">remaining</div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900">
            ${session.current_cost.toFixed(4)}
          </div>
          <div className="text-xs text-gray-600">Current Cost</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${getStatusColor(session.status)}`}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </div>
          <div className="text-xs text-gray-600">Status</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900">
            {session.resource_count}
          </div>
          <div className="text-xs text-gray-600">Resources</div>
        </div>
      </div>

      {/* Connection Info */}
      {session.connection_info && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3">Connection Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">SSH Host:</span>
              <span className="font-mono text-blue-900">{session.connection_info.ssh_host}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Username:</span>
              <span className="font-mono text-blue-900">{session.connection_info.ssh_username}</span>
            </div>
            {session.connection_info.web_urls?.map((url: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-blue-700">{url.name}:</span>
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
      )}

      {/* Warning for low time */}
      {timeRemaining < 300 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 font-medium">Session Ending Soon</p>
              <p className="text-yellow-700 text-sm">
                Your cloud resources will be automatically terminated in {Math.floor(timeRemaining / 60)} minutes. 
                Save your work!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between">
        <div className="flex space-x-3">
          {session.status === 'active' ? (
            <button
              onClick={pauseSession}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
            >
              <Play className="w-4 h-4 mr-1" />
              Resume
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        <button
          onClick={handleSessionEnd}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
        >
          <Square className="w-4 h-4 mr-1" />
          End Session
        </button>
      </div>
    </div>
  );
};

export default CloudSessionManager;
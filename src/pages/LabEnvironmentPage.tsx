import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LabInterface from '../components/LabInterface';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Server, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Monitor,
  Cloud
} from 'lucide-react';

interface LabEnvironmentParams {
  labId: string;
}

const LabEnvironmentPage: React.FC = () => {
  const { labId } = useParams<LabEnvironmentParams>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lab, setLab] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionState, setSessionState] = useState<'setup' | 'provisioning' | 'active' | 'ended'>('setup');
  const [sessionId, setSessionId] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [labMode, setLabMode] = useState<'guided' | 'challenge'>('guided');
  const [duration, setDuration] = useState(60); // minutes

  useEffect(() => {
    if (labId) {
      fetchLabDetails();
      fetchTemplates();
    }
  }, [labId]);

  useEffect(() => {
    if (sessionState === 'active' && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sessionState, timeRemaining]);

  const fetchLabDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .eq('id', labId)
        .single();

      if (error) throw error;
      setLab(data);
    } catch (error) {
      console.error('Error fetching lab details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_environment_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
      
      if (data && data.length > 0) {
        setSelectedTemplate(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const startLabSession = async () => {
    if (!user || !labId || !selectedTemplate) return;
    
    setSessionState('provisioning');
    setProvisioningProgress(0);
    
    try {
      // Call the RPC function to provision a lab environment
      const { data, error } = await supabase.rpc('provision_lab_environment', {
        p_user_id: user.id,
        p_lab_id: labId,
        p_template_id: selectedTemplate,
        p_duration_minutes: duration
      });

      if (error) throw error;
      
      // Simulate provisioning progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setProvisioningProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Set session as active
          setSessionId(data);
          setTimeRemaining(duration * 60); // Convert minutes to seconds
          setSessionState('active');
        }
      }, 500);
      
    } catch (error) {
      console.error('Error starting lab session:', error);
      setSessionState('setup');
    }
  };

  const handleSessionEnd = () => {
    setSessionState('ended');
    setSessionId('');
    setTimeRemaining(0);
  };

  const resetSession = () => {
    setSessionState('setup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Lab Not Found</h1>
            <p className="text-gray-600 mb-8">The lab you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/labs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Labs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (sessionState === 'active') {
    return (
      <LabInterface
        labId={labId || ''}
        sessionId={sessionId}
        mode={labMode}
        timeRemaining={timeRemaining}
        onSessionEnd={handleSessionEnd}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/labs/${labId}`)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Lab Details
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lab.title}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{lab.description}</p>
            </div>
            
            {sessionState === 'setup' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Lab Environment Setup</h2>
                      <p className="text-gray-600 mb-4">
                        Configure your lab environment settings before starting the session.
                        Once started, you'll have access to a fully configured environment with all the tools you need.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Environment Template
                          </label>
                          <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {templates.map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            Select the environment that best matches your needs for this lab.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Duration
                          </label>
                          <select
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            Choose how long you need the lab environment to be available.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lab Mode
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="labMode"
                                value="guided"
                                checked={labMode === 'guided'}
                                onChange={() => setLabMode('guided')}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Guided</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="labMode"
                                value="challenge"
                                checked={labMode === 'challenge'}
                                onChange={() => setLabMode('challenge')}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Challenge</span>
                            </label>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Guided mode provides step-by-step instructions. Challenge mode tests your skills without hints.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Details</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Monitor className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Ubuntu 20.04 LTS</span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">2 vCPUs / 4GB RAM</span>
                    </div>
                    <div className="flex items-center">
                      <Cloud className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Cloud Provider: AWS</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Pre-installed tools: Git, Docker, AWS CLI, Node.js, Python</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>In-browser terminal, code editor, and file manager</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Step-by-step instructions and validation</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automatic environment cleanup when session ends</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={startLabSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Lab Session
                  </button>
                </div>
              </div>
            )}
            
            {sessionState === 'provisioning' && (
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Provisioning Your Lab Environment</h2>
                <p className="text-gray-600 mb-8">
                  Please wait while we set up your cloud environment. This may take a few minutes.
                </p>
                
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{provisioningProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${provisioningProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 inline-block">
                  <h3 className="font-medium text-gray-900 mb-3">Provisioning Steps:</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-600">Initializing environment</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-600">Allocating compute resources</span>
                    </li>
                    <li className="flex items-center text-sm">
                      {provisioningProgress >= 50 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2 animate-pulse"></div>
                      )}
                      <span className="text-gray-600">Configuring network access</span>
                    </li>
                    <li className="flex items-center text-sm">
                      {provisioningProgress >= 75 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                      )}
                      <span className="text-gray-600">Installing required software</span>
                    </li>
                    <li className="flex items-center text-sm">
                      {provisioningProgress >= 90 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                      )}
                      <span className="text-gray-600">Finalizing setup</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {sessionState === 'ended' && (
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lab Session Completed</h2>
                <p className="text-gray-600 mb-8">
                  Your lab session has ended. All resources have been cleaned up automatically.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8 inline-block">
                  <h3 className="font-medium text-gray-900 mb-3">Session Summary:</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Duration: {duration} minutes</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-600">Objectives Completed: 3/5</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Server className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Resources Cleaned Up: 100%</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Start New Session
                  </button>
                  <button
                    onClick={() => navigate(`/labs/${labId}`)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                  >
                    Back to Lab Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LabEnvironmentPage;
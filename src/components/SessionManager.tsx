import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, AlertTriangle, CheckCircle, Server, Zap, Monitor, Cloud, ToggleLeft, ToggleRight } from 'lucide-react';

interface SessionManagerProps {
  labId: string;
  duration: number; // in minutes
  useRealCloud: boolean;
  onToggleCloudType: () => void;
  onSessionStart: (sessionId: string) => void;
  onSessionEnd: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  labId,
  duration,
  useRealCloud,
  onToggleCloudType,
  onSessionStart,
  onSessionEnd
}) => {
  const [sessionState, setSessionState] = useState<'idle' | 'starting' | 'active' | 'paused' | 'ended'>('idle');
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [sessionId, setSessionId] = useState<string>('');
  const [startupProgress, setStartupProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionState === 'active' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionState('ended');
            onSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionState, timeRemaining, onSessionEnd]);

  const startSession = () => {
    setSessionState('starting');
    setStartupProgress(0);
    const newSessionId = `lab-${labId}-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Simulate progressive startup
    const startupSteps = [
      { progress: 20, message: 'Allocating cloud resources...' },
      { progress: 40, message: 'Initializing container environment...' },
      { progress: 60, message: 'Installing dependencies...' },
      { progress: 80, message: 'Configuring network access...' },
      { progress: 100, message: 'Environment ready!' }
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < startupSteps.length) {
        setStartupProgress(startupSteps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          setSessionState('active');
          onSessionStart(newSessionId);
        }, 500);
      }
    }, 600);
  };

  const pauseSession = () => {
    setSessionState('paused');
  };

  const resumeSession = () => {
    setSessionState('active');
  };

  const endSession = () => {
    setSessionState('ended');
    onSessionEnd();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (duration * 60)) * 100;
    if (percentage > 50) return 'text-green-500';
    if (percentage > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              useRealCloud 
                ? 'bg-gradient-to-r from-blue-600 to-green-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              {useRealCloud ? <Cloud className="w-5 h-5 text-white" /> : <Server className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {useRealCloud ? 'Real Cloud Environment' : 'Simulated Lab Environment'}
              </h3>
              <p className="text-sm text-gray-600">
                {useRealCloud ? 'AWS, Azure, or GCP infrastructure' : 'Interactive development environment'}
              </p>
            </div>
          </div>
          {sessionState !== 'idle' && (
            <div className={`flex items-center text-2xl font-mono font-bold ${getTimeColor()}`}>
              <Clock className="w-5 h-5 mr-2" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        {/* Session Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                sessionState === 'active' ? 'bg-green-500 animate-pulse' : 
                sessionState === 'starting' ? 'bg-yellow-500 animate-pulse' :
                sessionState === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {sessionState === 'starting' ? 'Initializing' : sessionState}
              </span>
            </div>
            {sessionId && (
              <div className="text-xs text-gray-500">
                Session: {sessionId.slice(-8)}
              </div>
            )}
          </div>
          
          {sessionState === 'active' && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Monitor className="w-4 h-4" />
              <span>Ubuntu 20.04 • 2 vCPU • 4GB RAM</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {sessionState === 'idle' && (
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              useRealCloud ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {useRealCloud ? 
                <Cloud className="w-8 h-8 text-green-600" /> : 
                <Zap className="w-8 h-8 text-blue-600" />
              }
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {useRealCloud ? 'Ready to Launch Real Cloud Environment' : 'Ready to Start Your Lab'}
            </h4>
            <p className="text-gray-600 mb-6">
              {useRealCloud 
                ? 'Launch infrastructure in AWS, Azure, or GCP with your own cloud account.' 
                : 'Launch your simulated environment with instant access to terminals, code editors, and development tools.'}
            </p>
            
            {/* Environment Type Toggle */}
            <div className="flex items-center justify-center mb-6">
              <button 
                onClick={onToggleCloudType}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm"
              >
                <span className={!useRealCloud ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                  Simulated
                </span>
                {useRealCloud ? (
                  <ToggleRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-blue-600" />
                )}
                <span className={useRealCloud ? 'font-semibold text-green-600' : 'text-gray-600'}>
                  Real Cloud
                </span>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-gray-900 mb-3">
                {useRealCloud ? 'Real Cloud Features:' : 'What\'s Included:'}
              </h5>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                {useRealCloud ? (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Real AWS/Azure/GCP Resources
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Full Admin Access
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      SSH/RDP Access
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Public IP Addresses
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Auto-Cleanup
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Cost Monitoring
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Interactive Terminal
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Code Editor
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      File Manager
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Web Browser
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Database Console
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      System Monitor
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={useRealCloud ? onToggleCloudType : startSession}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto text-white ${
                useRealCloud 
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {useRealCloud ? (
                <>
                  <Cloud className="w-5 h-5 mr-2" />
                  Continue to Cloud Setup
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Launch Simulated Environment
                </>
              )}
            </button>
          </div>
        )}

        {sessionState === 'starting' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Initializing Environment</h4>
            <p className="text-gray-600 mb-6">Setting up your cloud workspace...</p>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${startupProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{startupProgress}% Complete</p>
          </div>
        )}

        {(sessionState === 'active' || sessionState === 'paused') && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Environment Active</h4>
                  <p className="text-sm text-gray-600">Your cloud workspace is ready to use</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {sessionState === 'active' ? (
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
                  onClick={endSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                >
                  <Square className="w-4 h-4 mr-1" />
                  End Session
                </button>
              </div>
            </div>

            {timeRemaining < 300 && ( // 5 minutes warning
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-yellow-800 font-medium">Session Ending Soon</p>
                    <p className="text-yellow-700 text-sm">Save your work! Your session will end in {Math.floor(timeRemaining / 60)} minutes.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Session Progress</span>
                <span>{Math.round(((duration * 60 - timeRemaining) / (duration * 60)) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((duration * 60 - timeRemaining) / (duration * 60)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {sessionState === 'ended' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Session Completed</h4>
            <p className="text-gray-600 mb-6">
              Great work! Your lab session has ended successfully.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-gray-900 mb-2">Session Summary</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Duration: {duration} minutes</div>
                <div>Environment: Ubuntu 20.04 LTS</div>
                <div>Session ID: {sessionId}</div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSessionState('idle');
                setTimeRemaining(duration * 60);
                setSessionId('');
                setStartupProgress(0);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
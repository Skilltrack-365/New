import React, { useState } from 'react';
import { Monitor, Code, Terminal, Globe, Database, Settings, FileText, Download, Play, Pause, Square, Layers, Server, Network } from 'lucide-react';
import CloudTerminal from './CloudTerminal';
import CodeEditor from './CodeEditor';
import FileManager from './FileManager';
import DatabaseConsole from './DatabaseConsole';
import WebBrowser from './WebBrowser';
import SystemMonitor from './SystemMonitor';

interface CloudEnvironmentProps {
  labId: string;
  sessionId: string;
  timeRemaining: number;
  onSessionEnd: () => void;
  environment?: 'ubuntu' | 'centos' | 'alpine' | 'debian';
}

const CloudEnvironment: React.FC<CloudEnvironmentProps> = ({
  labId,
  sessionId,
  timeRemaining,
  onSessionEnd,
  environment = 'ubuntu'
}) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [isEnvironmentRunning, setIsEnvironmentRunning] = useState(true);

  const tabs = [
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'editor', name: 'Code Editor', icon: Code },
    { id: 'files', name: 'File Manager', icon: FileText },
    { id: 'browser', name: 'Web Browser', icon: Globe },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'monitor', name: 'System Monitor', icon: Monitor },
    { id: 'settings', name: 'Environment', icon: Settings }
  ];

  const handleEnvironmentControl = (action: 'pause' | 'resume' | 'restart') => {
    switch (action) {
      case 'pause':
        setIsEnvironmentRunning(false);
        break;
      case 'resume':
        setIsEnvironmentRunning(true);
        break;
      case 'restart':
        setIsEnvironmentRunning(false);
        setTimeout(() => setIsEnvironmentRunning(true), 2000);
        break;
    }
  };

  const renderTabContent = () => {
    if (!isEnvironmentRunning && activeTab !== 'settings') {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Environment Paused</h3>
            <p className="text-gray-500 mb-4">Your cloud environment is currently paused</p>
            <button
              onClick={() => handleEnvironmentControl('resume')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume Environment
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'terminal':
        return (
          <CloudTerminal
            labId={labId}
            sessionId={sessionId}
            timeRemaining={timeRemaining}
            onSessionEnd={onSessionEnd}
            environment={environment}
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
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg h-96 border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Environment Settings</h3>
            </div>
            
            <div className="space-y-6">
              {/* Environment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Environment Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">OS:</span>
                    <span className="ml-2 font-medium">{environment.charAt(0).toUpperCase() + environment.slice(1)} 20.04 LTS</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Session ID:</span>
                    <span className="ml-2 font-mono text-xs">{sessionId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">CPU:</span>
                    <span className="ml-2 font-medium">2 vCPUs</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Memory:</span>
                    <span className="ml-2 font-medium">4 GB RAM</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Storage:</span>
                    <span className="ml-2 font-medium">20 GB SSD</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Network:</span>
                    <span className="ml-2 font-medium">1 Gbps</span>
                  </div>
                </div>
              </div>

              {/* Environment Controls */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Environment Controls</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEnvironmentControl('pause')}
                    disabled={!isEnvironmentRunning}
                    className="flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-lg text-sm"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={() => handleEnvironmentControl('resume')}
                    disabled={isEnvironmentRunning}
                    className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg text-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                  <button
                    onClick={() => handleEnvironmentControl('restart')}
                    className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Restart
                  </button>
                </div>
              </div>

              {/* Installed Software */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Installed Software</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-blue-50 px-2 py-1 rounded text-blue-800">Docker 20.10</div>
                  <div className="bg-green-50 px-2 py-1 rounded text-green-800">Node.js 16</div>
                  <div className="bg-yellow-50 px-2 py-1 rounded text-yellow-800">Python 3.9</div>
                  <div className="bg-purple-50 px-2 py-1 rounded text-purple-800">kubectl</div>
                  <div className="bg-red-50 px-2 py-1 rounded text-red-800">Git 2.34</div>
                  <div className="bg-indigo-50 px-2 py-1 rounded text-indigo-800">Vim 8.2</div>
                </div>
              </div>

              {/* Network Ports */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Ports</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Port 3000</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Port 8080</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Port 5432</span>
                    <span className="text-blue-600 font-medium">PostgreSQL</span>
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

  return (
    <div className="bg-gray-50 rounded-lg">
      {/* Environment Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isEnvironmentRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isEnvironmentRunning ? 'Environment Running' : 'Environment Paused'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Server className="w-4 h-4 mr-1" />
              {environment.charAt(0).toUpperCase() + environment.slice(1)} 20.04
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Network className="w-4 h-4 mr-1" />
              cloud-lab-{sessionId.slice(-8)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Session expires in:</span>
            <span className="text-sm font-mono font-bold text-red-600">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

export default CloudEnvironment;
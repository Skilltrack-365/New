import React, { useState } from 'react';
import { Globe, RefreshCw, ArrowLeft, ArrowRight, Home, Lock, ExternalLink } from 'lucide-react';

interface WebBrowserProps {
  sessionId: string;
}

const WebBrowser: React.FC<WebBrowserProps> = ({ sessionId }) => {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(['http://localhost:3000']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    
    // Add to history if it's a new navigation
    if (url !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(url);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(currentUrl);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (currentUrl.includes('localhost:3000')) {
      return (
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Your Cloud App! 🚀
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Your Node.js application is running successfully in the cloud environment.
              </p>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Application Status</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">✓</div>
                    <p className="text-sm text-gray-600">Server Running</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">⚡</div>
                    <p className="text-sm text-gray-600">Fast Response</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">API Endpoints</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">GET /</span>
                    <span className="text-green-600 text-sm">200 OK</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">GET /api/health</span>
                    <span className="text-green-600 text-sm">200 OK</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">GET /api/users</span>
                    <span className="text-green-600 text-sm">200 OK</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Environment Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session ID:</span>
                    <span className="font-mono">{sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Node.js:</span>
                    <span>v16.14.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span>Development</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span>2m 34s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Tip:</strong> You can modify your application code in the Code Editor tab 
                  and see the changes reflected here in real-time!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentUrl.includes('localhost:8080')) {
      return (
        <div className="h-full bg-gray-100 p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Admin Panel</h1>
            <p className="text-gray-600 mb-6">
              Manage your PostgreSQL database through this web interface.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <h3 className="font-semibold">View Tables</h3>
                <p className="text-sm text-gray-600">Browse database tables</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <h3 className="font-semibold">Run Queries</h3>
                <p className="text-sm text-gray-600">Execute SQL commands</p>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Browser</h3>
          <p className="text-gray-600 mb-4">Navigate to a URL to view web content</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('http://localhost:3000')}
              className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700"
            >
              http://localhost:3000 - Your App
            </button>
            <button
              onClick={() => navigate('http://localhost:8080')}
              className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700"
            >
              http://localhost:8080 - Database Admin
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg h-96 border flex flex-col">
      {/* Browser Header */}
      <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 mr-4">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={refresh}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('http://localhost:3000')}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Home className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Lock className="w-4 h-4 text-green-600 mr-2" />
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Enter URL..."
            />
            <button type="submit" className="ml-2 p-1 hover:bg-gray-100 rounded">
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </form>

        <div className="ml-4 flex items-center space-x-2">
          <div className="text-xs text-gray-500">
            Session: {sessionId.slice(-8)}
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default WebBrowser;
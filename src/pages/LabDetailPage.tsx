import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Monitor, Code, Terminal, Book, Award, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SessionManager from '../components/SessionManager';
import CloudEnvironment from '../components/CloudEnvironment';
import RealCloudEnvironment from '../components/RealCloudEnvironment';
import { labs } from '../data/labsData';

const LabDetailPage = () => {
  const { labId } = useParams();
  const lab = labs.find(l => l.id === labId);
  const [sessionState, setSessionState] = useState<'preview' | 'active'>('preview');
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [useRealCloud, setUseRealCloud] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  if (!lab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lab Not Found</h1>
          <Link to="/labs" className="text-blue-600 hover:text-blue-700">
            Back to Labs
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSessionStart = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSessionState('active');
    
    // Extract duration from lab.duration string (e.g., "45 minutes" -> 45)
    const durationMatch = lab.duration.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 60;
    setTimeRemaining(duration * 60); // Convert to seconds
  };

  const handleSessionEnd = () => {
    setSessionState('preview');
    setCurrentSessionId('');
    setTimeRemaining(0);
  };

  const toggleCloudType = () => {
    setUseRealCloud(!useRealCloud);
    setSessionState('preview');
  };

  if (sessionState === 'active') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Lab Environment Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <h1 className="text-xl font-semibold text-gray-900">{lab.title}</h1>
              <span className="ml-4 text-sm text-gray-500">Session: {currentSessionId}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
              </div>
              <button
                onClick={handleSessionEnd}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Lab Environment */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Instructions Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lab Instructions</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-2">Objectives</h3>
                    <ul className="space-y-1">
                      {lab.objectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-2">Progress</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Environment Setup</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs">2</span>
                        </div>
                        <span className="text-gray-700">Configuration</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                          <span className="text-gray-600 text-xs">3</span>
                        </div>
                        <span className="text-gray-500">Implementation</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-1">
                      {lab.technology.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Environment */}
            <div className="lg:col-span-3">
              {useRealCloud ? (
                <RealCloudEnvironment
                  labId={lab.id}
                  onSessionEnd={handleSessionEnd}
                />
              ) : (
                <CloudEnvironment
                  labId={lab.id}
                  sessionId={currentSessionId}
                  timeRemaining={timeRemaining}
                  onSessionEnd={handleSessionEnd}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/labs"
            className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Labs
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lab.difficulty)} mr-4`}>
                  {lab.difficulty}
                </span>
                {lab.isFree && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-4">
                    Free
                  </span>
                )}
                <div className="flex items-center text-blue-200">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  {lab.rating} ({lab.students.toLocaleString()} students)
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {lab.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {lab.description}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8 text-blue-100">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {lab.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {lab.students.toLocaleString()} enrolled
                </div>
                <div className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Live Cloud Environment
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={lab.image}
                alt={lab.title}
                className="w-full h-80 object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <Play className="w-8 h-8 text-blue-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Session Manager */}
              <div className="mb-8">
                <SessionManager
                  labId={lab.id}
                  useRealCloud={useRealCloud}
                  onToggleCloudType={toggleCloudType}
                  duration={parseInt(lab.duration.match(/(\d+)/)?.[1] || '60')}
                  onSessionStart={handleSessionStart}
                  onSessionEnd={handleSessionEnd}
                />
              </div>

              {/* Learning Objectives */}
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Learning Objectives</h2>
                <div className="space-y-4">
                  {lab.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Prerequisites</h2>
                <div className="space-y-3">
                  {lab.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-start">
                      <Book className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{prerequisite}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Technologies & Tools</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lab.technology.map((tech, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Code className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Features */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Lab Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {lab.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Lab Info Card */}
              <div className="bg-white rounded-xl p-8 shadow-lg sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {lab.isFree ? 'Free' : 'Premium'}
                  </div>
                  <p className="text-gray-600">Cloud Sandbox Access</p>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-gray-900">This lab includes:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Live cloud environment</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Interactive terminal access</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Pre-configured tools & software</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Step-by-step instructions</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Session recording & playback</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Completion certificate</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Difficulty:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(lab.difficulty)}`}>
                      {lab.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Duration:</span>
                    <span>{lab.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Provider:</span>
                    <span>{lab.provider}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Environment:</span>
                    <span className="text-green-600 font-medium">Cloud Sandbox</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LabDetailPage;
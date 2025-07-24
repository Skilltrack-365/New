import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Monitor, 
  Terminal, 
  FileText, 
  Book, 
  CheckSquare, 
  Link2, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import CloudTerminal from './CloudTerminal';
import CodeEditor from './CodeEditor';
import FileManager from './FileManager';

interface LabObjective {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string;
  hint?: string;
  solution?: string;
  sort_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

interface LabGuide {
  id: string;
  title: string;
  content_type: string;
  content?: string;
  video_url?: string;
}

interface LabResource {
  id: string;
  title: string;
  description?: string;
  resource_type: string;
  url?: string;
}

interface LabInterfaceProps {
  labId: string;
  sessionId: string;
  mode: 'guided' | 'challenge';
  timeRemaining: number;
  onSessionEnd: () => void;
}

const LabInterface: React.FC<LabInterfaceProps> = ({
  labId,
  sessionId,
  mode,
  timeRemaining,
  onSessionEnd
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor' | 'files'>('terminal');
  const [activeSidePanel, setActiveSidePanel] = useState<'guide' | 'objectives' | 'resources'>('guide');
  const [objectives, setObjectives] = useState<LabObjective[]>([]);
  const [guides, setGuides] = useState<LabGuide[]>([]);
  const [resources, setResources] = useState<LabResource[]>([]);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const [showSolution, setShowSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    fetchLabData();
  }, [labId]);

  const fetchLabData = async () => {
    setLoading(true);
    try {
      // Fetch lab objectives
      const { data: objectivesData, error: objectivesError } = await supabase
        .from('lab_objectives')
        .select('*')
        .eq('lab_id', labId)
        .order('sort_order');

      if (objectivesError) throw objectivesError;

      // Fetch user progress for objectives
      const { data: progressData, error: progressError } = await supabase
        .from('lab_user_progress')
        .select('*')
        .eq('lab_id', labId);

      if (progressError) throw progressError;

      // Merge objectives with progress
      const mergedObjectives = objectivesData.map(objective => {
        const progress = progressData.find(p => p.objective_id === objective.id);
        return {
          ...objective,
          status: progress ? progress.status : 'pending'
        };
      });

      setObjectives(mergedObjectives);

      // Fetch lab guides
      const { data: guidesData, error: guidesError } = await supabase
        .from('lab_guides')
        .select('*')
        .eq('lab_id', labId)
        .order('sort_order');

      if (guidesError) throw guidesError;
      setGuides(guidesData || []);

      // Fetch lab resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('lab_resources')
        .select('*')
        .eq('lab_id', labId)
        .order('sort_order');

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);

    } catch (error) {
      console.error('Error fetching lab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateObjective = async (objectiveId: string) => {
    setValidating(objectiveId);
    try {
      const objective = objectives.find(o => o.id === objectiveId);
      if (!objective) return;

      // In a real implementation, this would execute the validation command
      // on the lab environment and return the result
      // For now, we'll simulate a validation with a random result

      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const passed = Math.random() > 0.3; // 70% chance of success

      // Update the objective status
      const updatedObjectives = objectives.map(o => {
        if (o.id === objectiveId) {
          return {
            ...o,
            status: passed ? 'completed' : 'failed'
          };
        }
        return o;
      });

      setObjectives(updatedObjectives);

      // In a real implementation, this would call the validate_lab_objective function
      // to update the user's progress in the database
      const { error } = await supabase.rpc('validate_lab_objective', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_lab_id: labId,
        p_objective_id: objectiveId,
        p_instance_id: sessionId,
        p_validation_result: {
          passed: passed,
          message: passed ? 'Validation successful!' : 'Validation failed. Please check your work and try again.'
        }
      });

      if (error) throw error;

    } catch (error) {
      console.error('Error validating objective:', error);
    } finally {
      setValidating(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionPercentage = () => {
    if (objectives.length === 0) return 0;
    const completedCount = objectives.filter(o => o.status === 'completed').length;
    return Math.round((completedCount / objectives.length) * 100);
  };

  const renderGuideContent = () => {
    if (guides.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No guide content available for this lab.</p>
          </div>
        </div>
      );
    }

    const guide = guides[activeGuideIndex];

    if (guide.content_type === 'video' && guide.video_url) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">{guide.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveGuideIndex(Math.max(0, activeGuideIndex - 1))}
                disabled={activeGuideIndex === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveGuideIndex(Math.min(guides.length - 1, activeGuideIndex + 1))}
                disabled={activeGuideIndex === guides.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <div className="aspect-video w-full">
              <iframe
                src={guide.video_url}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">{guide.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveGuideIndex(Math.max(0, activeGuideIndex - 1))}
              disabled={activeGuideIndex === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveGuideIndex(Math.min(guides.length - 1, activeGuideIndex + 1))}
              disabled={activeGuideIndex === guides.length - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guide.content || '' }}></div>
        </div>
      </div>
    );
  };

  const renderObjectives = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Lab Objectives</h3>
          <div className="mt-1 text-sm text-gray-600">
            {getCompletionPercentage()}% complete ({objectives.filter(o => o.status === 'completed').length}/{objectives.length})
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="space-y-4 p-4">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    {objective.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : objective.status === 'failed' ? (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2"></div>
                    )}
                    <span className="font-medium text-gray-900">{objective.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mode === 'guided' && (
                      <button
                        onClick={() => objective.hint && setShowSolution(objective.id === showSolution ? null : objective.id)}
                        disabled={!objective.hint}
                        className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:text-gray-400"
                        title={objective.hint ? "Show hint" : "No hint available"}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => validateObjective(objective.id)}
                      disabled={validating === objective.id}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        validating === objective.id
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {validating === objective.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 inline-block mr-1 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        'Validate'
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-2">{objective.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Acceptance Criteria:</strong> {objective.acceptance_criteria}
                  </div>
                  
                  {showSolution === objective.id && objective.hint && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">Hint:</div>
                      <p className="text-sm text-blue-700">{objective.hint}</p>
                      
                      {mode === 'guided' && objective.solution && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <details className="text-sm">
                            <summary className="font-medium text-blue-800 cursor-pointer">Solution</summary>
                            <pre className="mt-2 p-2 bg-gray-800 text-green-400 rounded overflow-auto text-xs">{objective.solution}</pre>
                          </details>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Additional Resources</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="space-y-4 p-4">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      {resource.resource_type === 'documentation' ? (
                        <FileText className="w-4 h-4 text-blue-600" />
                      ) : resource.resource_type === 'api_reference' ? (
                        <Book className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Link2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      )}
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
                        >
                          Open Resource
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No additional resources available for this lab.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'terminal':
        return (
          <CloudTerminal
            labId={labId}
            sessionId={sessionId}
            timeRemaining={timeRemaining}
            onSessionEnd={onSessionEnd}
          />
        );
      case 'editor':
        return <CodeEditor sessionId={sessionId} />;
      case 'files':
        return <FileManager sessionId={sessionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="font-medium text-gray-900">Lab Environment</span>
          <span className="ml-2 text-sm text-gray-500">Session: {sessionId.slice(0, 8)}</span>
          <span className="ml-4 text-sm text-gray-500">Mode: {mode === 'guided' ? 'Guided' : 'Challenge'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <button
            onClick={onSessionEnd}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveSidePanel('guide')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeSidePanel === 'guide'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Guide
              </button>
              <button
                onClick={() => setActiveSidePanel('objectives')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeSidePanel === 'objectives'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Objectives
              </button>
              <button
                onClick={() => setActiveSidePanel('resources')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeSidePanel === 'resources'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Resources
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeSidePanel === 'guide' && renderGuideContent()}
            {activeSidePanel === 'objectives' && renderObjectives()}
            {activeSidePanel === 'resources' && renderResources()}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`py-3 px-4 flex items-center text-sm font-medium ${
                  activeTab === 'terminal'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Terminal className="w-4 h-4 mr-2" />
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`py-3 px-4 flex items-center text-sm font-medium ${
                  activeTab === 'editor'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layout className="w-4 h-4 mr-2" />
                Code Editor
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`py-3 px-4 flex items-center text-sm font-medium ${
                  activeTab === 'files'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Files
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabInterface;
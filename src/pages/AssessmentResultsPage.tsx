import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, BarChart3, Download, Share2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

interface AssessmentResult {
  id: string;
  score: number;
  percentage: number;
  passed: boolean;
  time_spent_seconds: number;
  completed_at: string;
  template: {
    title: string;
    description: string;
    passing_score: number;
    total_questions: number;
  };
  submissions: Array<{
    question_id: string;
    user_answer: string;
    is_correct: boolean;
    points_earned: number;
    question: {
      question_text: string;
      correct_answer: string;
      explanation: string;
      points: number;
    };
  }>;
  analytics: {
    completion_rate: number;
    average_time_per_question: number;
    difficulty_performance: any;
    topic_performance: any;
    strengths: string[];
    improvement_areas: string[];
    percentile_rank: number;
  };
  certificate: {
    certificate_number: string;
    verification_code: string;
    issued_at: string;
  } | null;
}

const AssessmentResultsPage: React.FC = () => {
  const { instanceId } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (instanceId) {
      fetchAssessmentResult();
    }
  }, [instanceId]);

  const fetchAssessmentResult = async () => {
    try {
      const { data: instance, error: instanceError } = await supabase
        .from('assessment_instances')
        .select(`
          *,
          template:assessment_templates(
            title,
            description,
            passing_score,
            total_questions
          )
        `)
        .eq('id', instanceId)
        .eq('user_id', user?.id)
        .single();

      if (instanceError) throw instanceError;

      const { data: submissions, error: submissionsError } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          question:question_banks(
            question_text,
            correct_answer,
            explanation,
            points
          )
        `)
        .eq('instance_id', instanceId);

      if (submissionsError) throw submissionsError;

      const { data: analytics, error: analyticsError } = await supabase
        .from('assessment_analytics')
        .select('*')
        .eq('instance_id', instanceId)
        .single();

      const { data: certificate, error: certificateError } = await supabase
        .from('assessment_certificates')
        .select('*')
        .eq('instance_id', instanceId)
        .single();

      setResult({
        ...instance,
        submissions: submissions || [],
        analytics: analytics || {},
        certificate: certificate || null
      });
    } catch (error) {
      console.error('Error fetching assessment result:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const downloadCertificate = () => {
    if (result?.certificate) {
      // In a real implementation, this would generate and download a PDF certificate
      alert('Certificate download would be implemented here');
    }
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `Assessment Result: ${result?.template.title}`,
        text: `I scored ${result?.percentage}% on the ${result?.template.title} assessment!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Results not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/assessments"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assessments
          </Link>

          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                result.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.passed ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {result.template.title}
              </h1>
              
              <div className={`text-6xl font-bold mb-4 ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.percentage.toFixed(1)}%
              </div>
              
              <div className={`text-xl font-semibold mb-6 ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.passed ? 'Passed' : 'Failed'} • {result.score.toFixed(1)} / {result.submissions.reduce((sum, s) => sum + s.question.points, 0)} points
              </div>

              {result.passed && result.certificate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      Certificate Earned! #{result.certificate.certificate_number}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {result.certificate && (
                  <button
                    onClick={downloadCertificate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Certificate
                  </button>
                )}
                <button
                  onClick={shareResult}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Result
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(result.time_spent_seconds)}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.submissions.filter(s => s.is_correct).length} / {result.submissions.length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.analytics.percentile_rank || 0}%
              </div>
              <div className="text-sm text-gray-600">Percentile Rank</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.template.passing_score}%
              </div>
              <div className="text-sm text-gray-600">Passing Score</div>
            </div>
          </div>

          {/* Performance Analysis */}
          {result.analytics && (
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Strengths</h3>
                {result.analytics.strengths?.length > 0 ? (
                  <div className="space-y-2">
                    {result.analytics.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Analysis will be available after more data is collected.</p>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Areas for Improvement</h3>
                {result.analytics.improvement_areas?.length > 0 ? (
                  <div className="space-y-2">
                    {result.analytics.improvement_areas.map((area, index) => (
                      <div key={index} className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-3" />
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Analysis will be available after more data is collected.</p>
                )}
              </div>
            </div>
          )}

          {/* Question Review */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Question Review</h3>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showAnswers ? 'Hide' : 'Show'} Answers
              </button>
            </div>

            {showAnswers && (
              <div className="space-y-6">
                {result.submissions.map((submission, index) => (
                  <div key={submission.question_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center">
                        {submission.is_correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="text-sm font-medium">
                          {submission.points_earned} / {submission.question.points} points
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{submission.question.question_text}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                        <p className={`text-sm ${submission.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                          {submission.user_answer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <p className="text-sm text-green-700">{submission.question.correct_answer}</p>
                      </div>
                    </div>
                    
                    {submission.question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {submission.question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;
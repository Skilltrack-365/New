import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, Award, ArrowLeft, ArrowRight, Flag, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import AssessmentProgress from '../components/AssessmentProgress';
import QuestionRenderer from '../components/QuestionRenderer';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  points: number;
  explanation?: string;
}

interface AssessmentInstance {
  id: string;
  template_id: string;
  status: string;
  current_question_index: number;
  questions_data: Question[];
  time_spent_seconds: number;
  expires_at: string;
  session_token: string;
  template: {
    title: string;
    description: string;
    time_limit_minutes: number;
    total_questions: number;
    passing_score: number;
  };
}

const AssessmentPage: React.FC = () => {
  const { instanceId } = useParams<{ instanceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [instance, setInstance] = useState<AssessmentInstance | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (instanceId) {
      fetchAssessmentInstance();
    }
  }, [instanceId]);

  useEffect(() => {
    if (instance && instance.status === 'in_progress') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [instance]);

  const fetchAssessmentInstance = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_instances')
        .select(`
          *,
          template:assessment_templates(
            title,
            description,
            time_limit_minutes,
            total_questions,
            passing_score
          )
        `)
        .eq('id', instanceId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setInstance(data);
      
      if (data.status === 'in_progress' && data.questions_data?.length > 0) {
        setCurrentQuestion(data.questions_data[data.current_question_index]);
        
        // If there's a saved answer, restore it
        const { data: savedSubmission } = await supabase
          .from('assessment_submissions')
          .select('user_answer, is_correct')
          .eq('instance_id', instanceId)
          .eq('question_id', data.questions_data[data.current_question_index].id)
          .maybeSingle();
          
        if (savedSubmission) {
          setSelectedAnswer(savedSubmission.user_answer);
          setIsCorrect(savedSubmission.is_correct);
        }
        
        // Fetch all answers for progress tracking
        const { data: allSubmissions } = await supabase
          .from('assessment_submissions')
          .select('question_id, user_answer')
          .eq('instance_id', instanceId);
          
        if (allSubmissions) {
          const answerMap: {[key: number]: string} = {};
          allSubmissions.forEach(submission => {
            // Find the index of this question in the questions_data array
            const questionIndex = data.questions_data.findIndex(q => q.id === submission.question_id);
            if (questionIndex >= 0) {
              answerMap[questionIndex] = submission.user_answer;
            }
          });
          setAnswers(answerMap);
        }
        
        // Calculate time remaining
        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeRemaining(remaining);
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async () => {
    try {
      setLoading(true);
      
      // Update instance status and set expiry time
      const expiresAt = new Date(Date.now() + (instance!.template.time_limit_minutes * 60 * 1000));
      
      const { error } = await supabase
        .from('assessment_instances')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('id', instanceId);

      if (error) throw error;

      await fetchAssessmentInstance();
    } catch (error) {
      console.error('Error starting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    try {
      setSubmitting(true);

      // Check if answer is correct
      const isCorrect = selectedAnswer === currentQuestion.options?.correct_answer;
      const pointsEarned = isCorrect ? currentQuestion.points : 0;
      
      setIsCorrect(isCorrect);
      setShowExplanation(true);
      
      // Update answers map for progress tracking
      setAnswers(prev => ({
        ...prev,
        [instance!.current_question_index]: selectedAnswer
      }));

      // Submit answer
      const { error } = await supabase
        .from('assessment_submissions')
        .insert({
          instance_id: instanceId,
          question_id: currentQuestion.id,
          user_answer: selectedAnswer,
          is_correct: isCorrect,
          points_earned: pointsEarned,
          time_spent_seconds: 60 - (timeRemaining % 60), // Approximate time spent
          auto_graded: true
        });

      if (error) throw error;

      // Give user time to see the explanation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to next question or complete assessment
      const nextIndex = instance!.current_question_index + 1;
      
      if (nextIndex >= instance!.questions_data.length) {
        // Assessment completed
        await completeAssessment();
      } else {
        // Move to next question
        await supabase
          .from('assessment_instances')
          .update({ current_question_index: nextIndex })
          .eq('id', instanceId);

        setCurrentQuestion(instance!.questions_data[nextIndex]);
        setSelectedAnswer('');
        setShowExplanation(false);
        setIsCorrect(undefined);
        
        // Update local state
        setInstance(prev => prev ? {
          ...prev,
          current_question_index: nextIndex
        } : null);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const completeAssessment = async () => {
    try {
      const { error } = await supabase
        .from('assessment_instances')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', instanceId);

      if (error) throw error;

      navigate(`/assessment/${instanceId}/results`);
    } catch (error) {
      console.error('Error completing assessment:', error);
    }
  };

  const handleTimeExpired = async () => {
    await completeAssessment();
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

  if (!instance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Assessment not found</h1>
        </div>
      </div>
    );
  }

  // Assessment not started
  if (instance.status === 'not_started') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {instance.template.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {instance.template.description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{instance.template.time_limit_minutes}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{instance.template.total_questions}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{instance.template.passing_score}%</div>
                  <div className="text-sm text-gray-600">To Pass</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-1">Important Instructions</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Once started, the timer cannot be paused</li>
                      <li>• You cannot go back to previous questions</li>
                      <li>• Make sure you have a stable internet connection</li>
                      <li>• Do not refresh the page during the assessment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assessment in progress
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Assessment Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">{instance.template.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              <Clock className="w-5 h-5 inline mr-2" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <AssessmentProgress 
        currentQuestion={instance.current_question_index}
        totalQuestions={instance.questions_data.length}
        timeRemaining={timeRemaining}
        answers={answers}
      />

      {/* Question Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentQuestion && (
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <QuestionRenderer
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={setSelectedAnswer}
                showExplanation={showExplanation}
                isSubmitting={submitting}
                isCorrect={isCorrect}
              />

              <div className="flex justify-between mt-8">
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
                
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer || submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {instance.current_question_index + 1 === instance.questions_data.length ? 'Finish' : 'Next'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Assessment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your assessment? You cannot change your answers after submission.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={completeAssessment}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
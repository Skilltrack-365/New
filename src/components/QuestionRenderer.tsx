import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  explanation?: string;
  points: number;
}

interface QuestionRendererProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  showExplanation: boolean;
  isSubmitting: boolean;
  isCorrect?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  isSubmitting,
  isCorrect
}) => {
  const [showHint, setShowHint] = useState(false);

  const renderMultipleChoice = () => {
    return (
      <div className="space-y-4 mb-8">
        {question.options?.options?.map((option: string, index: number) => (
          <label
            key={index}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitting ? 'pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => onAnswerSelect(e.target.value)}
              className="sr-only"
              disabled={isSubmitting}
            />
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
              
              {showExplanation && selectedAnswer === option && (
                <div className="ml-auto">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    );
  };

  const renderTrueFalse = () => {
    return (
      <div className="space-y-4 mb-8">
        {['True', 'False'].map((option) => (
          <label
            key={option}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitting ? 'pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => onAnswerSelect(e.target.value)}
              className="sr-only"
              disabled={isSubmitting}
            />
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
              
              {showExplanation && selectedAnswer === option && (
                <div className="ml-auto">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    );
  };

  const renderShortAnswer = () => {
    return (
      <div className="mb-8">
        <textarea
          value={selectedAnswer}
          onChange={(e) => onAnswerSelect(e.target.value)}
          placeholder="Enter your answer here..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          disabled={isSubmitting}
        />
      </div>
    );
  };

  const renderCodeQuestion = () => {
    return (
      <div className="mb-8">
        <textarea
          value={selectedAnswer}
          onChange={(e) => onAnswerSelect(e.target.value)}
          placeholder="Write your code here..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          rows={8}
          disabled={isSubmitting}
        />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-600 mr-2">
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
            {question.explanation && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-gray-400 hover:text-gray-600"
                title="Show hint"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question.question_text}
        </h2>
        
        {showHint && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">{question.explanation}</p>
          </div>
        )}
      </div>

      {question.question_type === 'multiple_choice' && renderMultipleChoice()}
      {question.question_type === 'true_false' && renderTrueFalse()}
      {question.question_type === 'short_answer' && renderShortAnswer()}
      {question.question_type === 'code' && renderCodeQuestion()}

      {showExplanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
          <p className="text-blue-700">{question.explanation || "No explanation available for this question."}</p>
          {question.options?.correct_answer && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-blue-800 font-medium">
                Correct answer: <span className="text-green-600">{question.options.correct_answer}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
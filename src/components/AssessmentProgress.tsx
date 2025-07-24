import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  answers: { [key: number]: string };
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  answers
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 fixed top-16 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center space-x-1 overflow-x-auto py-1">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <div 
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                ${currentQuestion === index 
                  ? 'bg-blue-600 text-white' 
                  : answers[index] 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentProgress;
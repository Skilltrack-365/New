import React from 'react';
import { CheckCircle, Clock, BarChart3, Target, Award } from 'lucide-react';

interface AssessmentCardProps {
  assessment: {
    id: string;
    title: string;
    description: string;
    assessment_type: 'quiz' | 'assignment' | 'final_exam';
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    total_questions: number;
    time_limit_minutes: number;
    passing_score: number;
  };
  onStart: (id: string) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onStart }) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'assignment':
        return <Target className="w-5 h-5 text-purple-600" />;
      case 'final_exam':
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-purple-100 text-purple-800';
      case 'final_exam':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getTypeIcon(assessment.assessment_type)}
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assessment.assessment_type)}`}>
            {assessment.assessment_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(assessment.difficulty_level)}`}>
          {assessment.difficulty_level}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {assessment.title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {assessment.description}
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {assessment.time_limit_minutes} minutes
          </div>
          <div className="flex items-center text-gray-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            {assessment.total_questions} questions
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pass Score</span>
            <span className="font-semibold text-gray-900">{assessment.passing_score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${assessment.passing_score}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onStart(assessment.id)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center"
      >
        <Target className="w-5 h-5 mr-2" />
        Start Assessment
      </button>
    </div>
  );
};

export default AssessmentCard;
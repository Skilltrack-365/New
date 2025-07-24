import React from 'react';
import { CheckCircle, Clock, Award, BarChart3, Target, Zap } from 'lucide-react';

const Assessments = () => {
  const assessments = [
    {
      title: "AI & Machine Learning Fundamentals",
      description: "Test your knowledge of core ML concepts, algorithms, and practical applications",
      duration: "45 minutes",
      questions: 25,
      difficulty: "Intermediate",
      topics: ["Supervised Learning", "Neural Networks", "Model Evaluation", "Feature Engineering"],
      passRate: 78,
      attempts: 1250,
      type: "quiz"
    },
    {
      title: "Cloud Architecture Design",
      description: "Evaluate your skills in designing scalable cloud solutions and best practices",
      duration: "60 minutes", 
      questions: 30,
      difficulty: "Advanced",
      topics: ["AWS Services", "Microservices", "Security", "Cost Optimization"],
      passRate: 65,
      attempts: 890,
      type: "assignment"
    },
    {
      title: "Full-Stack Development Capstone",
      description: "Comprehensive assessment covering frontend, backend, and database technologies",
      duration: "90 minutes",
      questions: 40,
      difficulty: "Advanced", 
      topics: ["React", "Node.js", "Database Design", "API Development"],
      passRate: 72,
      attempts: 650,
      type: "final_exam"
    }
  ];

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/10 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
            <BarChart3 className="w-4 h-4 mr-2" />
            Skill Validation & Certification
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Assessments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Validate your skills and earn industry-recognized certifications through our 
            comprehensive assessment platform designed by experts.
          </p>
        </div>

        {/* Assessment Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
            <div className="text-gray-600">Assessment Topics</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">25K+</div>
            <div className="text-gray-600">Certificates Issued</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">92%</div>
            <div className="text-gray-600">Industry Recognition</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Real-time</div>
            <div className="text-gray-600">Results & Feedback</div>
          </div>
        </div>

        {/* Featured Assessments */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assessments.map((assessment, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getTypeIcon(assessment.type)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assessment.type)}`}>
                    {assessment.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                  {assessment.difficulty}
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
                    {assessment.duration}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {assessment.questions} questions
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pass Rate</span>
                    <span className="font-semibold text-gray-900">{assessment.passRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${assessment.passRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {assessment.attempts.toLocaleString()} attempts completed
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Assessment Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.topics.map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="px-2 py-1 bg-white text-gray-700 text-xs rounded-md border border-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                <Target className="w-5 h-5 mr-2" />
                Start Assessment
              </button>
            </div>
          ))}
        </div>

        {/* Assessment Features */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Assessments?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our assessment platform is designed to provide accurate skill evaluation and meaningful certification
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Results</h4>
              <p className="text-sm text-gray-600">Get immediate feedback and detailed performance analytics</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Industry Recognition</h4>
              <p className="text-sm text-gray-600">Certificates recognized by leading tech companies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Adaptive Testing</h4>
              <p className="text-sm text-gray-600">Questions adapt to your skill level for accurate assessment</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Analytics</h4>
              <p className="text-sm text-gray-600">Comprehensive reports showing strengths and improvement areas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assessments;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Award, BarChart3, Target, Zap, ArrowRight, Filter, Search, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

interface AssessmentTemplate {
  id: string;
  title: string;
  description: string;
  assessment_type: 'quiz' | 'assignment' | 'final_exam';
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  total_questions: number;
  time_limit_minutes: number;
  passing_score: number;
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

const AssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentTemplate[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [categories, setCategories] = useState<{id: string, name: string, count: number}[]>([]);

  useEffect(() => {
    fetchAssessments();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAssessments();
  }, [assessments, searchTerm, selectedCategory, selectedDifficulty, selectedType]);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_templates')
        .select(`
          *,
          category:assessment_categories(
            name,
            icon,
            color
          )
        `)
        .eq('is_published', true);

      if (error) throw error;
      setAssessments(data || []);
      setFilteredAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_categories')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      
      // Count assessments per category
      const categoriesWithCount = data?.map(category => {
        const count = assessments.filter(a => a.category?.id === category.id).length;
        return { ...category, count };
      }) || [];
      
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAssessments = () => {
    const filtered = assessments.filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || assessment.category?.id === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || assessment.difficulty_level === selectedDifficulty;
      const matchesType = selectedType === 'all' || assessment.assessment_type === selectedType;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
    });

    setFilteredAssessments(filtered);
  };

  const startAssessment = async (templateId: string) => {
    if (!user) return;
    
    try {
      // Check if there's an existing incomplete instance
      const { data: existingInstances, error: fetchError } = await supabase
        .from('assessment_instances')
        .select('*')
        .eq('template_id', templateId)
        .eq('user_id', user.id)
        .eq('status', 'not_started')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingInstances && existingInstances.length > 0) {
        // Use existing instance
        window.location.href = `/assessment/${existingInstances[0].id}`;
        return;
      }

      // Create a new assessment instance
      const { data: template, error: templateError } = await supabase
        .from('assessment_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Get questions for this template
      const { data: questions, error: questionsError } = await supabase
        .from('assessment_template_questions')
        .select(`
          *,
          question:question_banks(*)
        `)
        .eq('template_id', templateId)
        .order('sort_order');

      if (questionsError) throw questionsError;

      // Create the assessment instance
      const { data: instance, error: instanceError } = await supabase
        .from('assessment_instances')
        .insert({
          template_id: templateId,
          user_id: user.id,
          status: 'not_started',
          questions_data: questions.map(q => q.question)
        })
        .select()
        .single();

      if (instanceError) throw instanceError;

      // Redirect to the assessment page
      window.location.href = `/assessment/${instance.id}`;
    } catch (error) {
      console.error('Error starting assessment:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-200 text-sm font-medium mb-8">
              <BarChart3 className="w-4 h-4 mr-2" />
              Skill Validation & Certification
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Assessments
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Validate your skills and earn industry-recognized certifications through our 
              comprehensive assessment platform designed by experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-400" />
                <span>Earn Certificates</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                <span>Detailed Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="final_exam">Final Exam</option>
              </select>
              
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedType('all');
                  setSearchTerm('');
                }}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAssessments.length} of {assessments.length} assessments
          </div>
        </div>
      </section>

      {/* Assessment Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 animate-pulse">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                      <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
                  <div className="h-4 w-56 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-48 bg-gray-100 rounded mb-4" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-24 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredAssessments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
                    >
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
                        onClick={() => startAssessment(assessment.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center"
                      >
                        <Target className="w-5 h-5 mr-2" />
                        Start Assessment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or browse our categories above.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                      setSelectedType('all');
                      setSearchTerm('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View All Assessments
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AssessmentsPage;
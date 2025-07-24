import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users, Play, Award, Zap, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { labs, labCategories } from '../data/labsData';

const LabsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  // Simulate loading state for demo (replace with real loading logic if fetching from API)
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.technology.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || lab.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || lab.difficulty === selectedDifficulty;
    const matchesFree = !showFreeOnly || lab.isFree;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesFree;
  });

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

  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Cloud': <div className="w-6 h-6 bg-blue-500 rounded"></div>,
      'GitBranch': <div className="w-6 h-6 bg-green-500 rounded"></div>,
      'Shield': <div className="w-6 h-6 bg-red-500 rounded"></div>,
      'BarChart3': <div className="w-6 h-6 bg-purple-500 rounded"></div>,
      'Code': <div className="w-6 h-6 bg-orange-500 rounded"></div>,
      'Smartphone': <div className="w-6 h-6 bg-pink-500 rounded"></div>,
      'Link': <div className="w-6 h-6 bg-yellow-500 rounded"></div>,
      'Brain': <div className="w-6 h-6 bg-indigo-500 rounded"></div>
    };
    return iconMap[iconName] || <div className="w-6 h-6 bg-gray-500 rounded"></div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-200 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Hands-on Learning Experience
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Interactive Labs
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Practice real-world skills in live environments. No setup required - 
              start coding, configuring, and building immediately.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-100">
              <div className="flex items-center">
                <Play className="w-5 h-5 mr-2 text-blue-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-400" />
                <span>Industry Tools</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                <span>Step-by-Step Guides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600">Choose from our comprehensive collection of hands-on labs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center mb-4">
                  {getCategoryIcon(category.icon)}
                  <span className="ml-3 text-sm font-medium text-gray-500">{category.count} labs</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search labs by title, technology, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
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
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFreeOnly}
                  onChange={(e) => setShowFreeOnly(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Free labs only</span>
              </label>
              
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setShowFreeOnly(false);
                  setSearchTerm('');
                }}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLabs.length} of {labs.length} labs
          </div>
        </div>
      </section>

      {/* Labs Grid */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse h-56" />
              ))
            ) : (
              filteredLabs.map((lab) => {
                const [expanded, setExpanded] = useState(false);
                return (
                  <div
                    key={lab.id}
                    className="relative group bg-white rounded-lg shadow hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col h-56 cursor-pointer"
                    style={{ minHeight: '14rem', maxHeight: expanded ? 'auto' : '14rem' }}
                    onClick={() => setExpanded((prev) => !prev)}
                  >
                    {/* Essentials Row */}
                    <div className="flex items-center gap-3 px-3 pt-3">
                      <img
                        src={lab.image}
                        alt={lab.title}
                        className="w-10 h-10 object-cover rounded-md border"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{lab.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(lab.difficulty)}`}>{lab.difficulty}</span>
                          {lab.isFree && <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Free</span>}
                        </div>
                      </div>
                      <button
                        className="ml-2 px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                        onClick={e => { e.stopPropagation(); setExpanded((prev) => !prev); }}
                        aria-label={expanded ? 'Collapse details' : 'Expand details'}
                      >
                        {expanded ? 'Less' : 'More'}
                      </button>
                    </div>
                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-1 px-3 mt-2">
                      {lab.technology.slice(0, 2).map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md truncate max-w-[5rem]">{tech}</span>
                      ))}
                      {lab.technology.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md">+{lab.technology.length - 2}</span>
                      )}
                    </div>
                    {/* Start Button */}
                    <div className="mt-auto px-3 pb-3 flex justify-end">
                      <Link
                        to={`/labs/${lab.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded text-sm font-semibold transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        Start
                      </Link>
                    </div>
                    {/* Expandable Details */}
                    {expanded && (
                      <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-4 animate-fade-in border-t border-gray-100" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">{lab.provider}</span>
                          <span className="text-xs text-gray-500">{lab.duration}</span>
                        </div>
                        <p className="text-xs text-gray-700 mb-2 line-clamp-3">{lab.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Star className="w-4 h-4 text-yellow-400" /> {lab.rating}
                          <Users className="w-4 h-4 ml-2" /> {lab.students.toLocaleString()} students
                        </div>
                        <button
                          className="mt-auto ml-auto px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                          onClick={e => { e.stopPropagation(); setExpanded(false); }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {filteredLabs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No labs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse our categories above.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setShowFreeOnly(false);
                  setSearchTerm('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Labs
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LabsPage;
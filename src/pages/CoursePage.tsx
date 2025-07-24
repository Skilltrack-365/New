import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, BookOpen, CheckCircle, Play, Download, Award, Globe } from 'lucide-react';
import { servicesData } from '../data/coursesData';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CoursePage = () => {
  const { serviceId, courseId } = useParams();
  const service = servicesData.find(s => s.id === serviceId);
  const course = service?.courses.find(c => c.id === courseId);

  if (!service || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const modules = [
    { title: 'Introduction and Setup', duration: '45 min', lessons: 5 },
    { title: 'Core Concepts', duration: '2h 30min', lessons: 8 },
    { title: 'Practical Applications', duration: '3h 15min', lessons: 12 },
    { title: 'Advanced Techniques', duration: '2h 45min', lessons: 10 },
    { title: 'Real-world Projects', duration: '4h 20min', lessons: 15 },
    { title: 'Final Assessment', duration: '1h 30min', lessons: 3 }
  ];

  const benefits = [
    'Lifetime access to course materials',
    'Certificate of completion',
    'Direct instructor support',
    'Access to exclusive community',
    'Regular content updates',
    'Mobile and desktop access',
    'Downloadable resources',
    '30-day money-back guarantee'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to={`/services/${serviceId}`}
            className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {service.title}
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)} mr-4`}>
                  {course.level}
                </span>
                <div className="flex items-center text-blue-200">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  {course.rating} ({course.students.toLocaleString()} students)
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8 text-blue-100">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {course.students.toLocaleString()} enrolled
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Online
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/enroll/${serviceId}/${courseId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Enroll Now - ${course.price}
                </Link>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors border border-white/20 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Preview Course
                </button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-80 object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-8 h-8 text-blue-600 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Modules */}
              <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-600">{module.lessons} lessons • {module.duration}</p>
                          </div>
                        </div>
                        <Play className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Instructor</h2>
                <div className="flex items-start">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={course.instructor}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.instructor}</h3>
                    <p className="text-blue-600 font-semibold mb-4">Senior {service.title} Expert</p>
                    <p className="text-gray-600 leading-relaxed">
                      With over 10 years of industry experience, {course.instructor} has worked with leading tech companies 
                      and has trained thousands of students worldwide. Known for making complex concepts easy to understand 
                      and apply in real-world scenarios.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Course Info Card */}
              <div className="bg-white rounded-xl p-8 shadow-lg sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">${course.price}</div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                <Link
                  to={`/enroll/${serviceId}/${courseId}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center mb-6"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Enroll Now
                </Link>

                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-gray-900">This course includes:</h3>
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Certificate
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    Resources
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

export default CoursePage;
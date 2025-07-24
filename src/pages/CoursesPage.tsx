import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Plus, Search, Filter } from 'lucide-react';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');

  // Mock data - in real app, this would come from API
  const courses: Course[] = [
    {
      id: '1',
      name: 'Organic Chemistry I',
      code: 'CHEM 301',
      description: 'Introduction to organic chemistry principles including structure, bonding, and reaction mechanisms.',
      instructor_id: 'inst1',
      semester: 'Fall',
      year: 2024,
      lab_ids: ['1'],
      student_ids: ['s1', 's2', 's3', 's4', 's5'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      name: 'Physics Laboratory',
      code: 'PHYS 205',
      description: 'Hands-on laboratory experiments in mechanics, thermodynamics, and electromagnetism.',
      instructor_id: 'inst2',
      semester: 'Spring',
      year: 2024,
      lab_ids: ['2'],
      student_ids: ['s6', 's7', 's8', 's9'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
    },
    {
      id: '3',
      name: 'Microbiology',
      code: 'BIOL 410',
      description: 'Study of microorganisms including bacteria, viruses, fungi, and their applications.',
      instructor_id: 'inst3',
      semester: 'Fall',
      year: 2024,
      lab_ids: ['3'],
      student_ids: ['s10', 's11', 's12', 's13', 's14', 's15'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    {
      id: '4',
      name: 'Computer Programming Lab',
      code: 'CS 150',
      description: 'Introduction to programming concepts using Python and Java programming languages.',
      instructor_id: 'inst4',
      semester: 'Spring',
      year: 2024,
      lab_ids: ['4'],
      student_ids: ['s16', 's17', 's18', 's19', 's20', 's21', 's22'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-12T00:00:00Z',
    },
    {
      id: '5',
      name: 'Analytical Chemistry',
      code: 'CHEM 450',
      description: 'Advanced analytical techniques including spectroscopy, chromatography, and electrochemistry.',
      instructor_id: 'inst1',
      semester: 'Fall',
      year: 2023,
      lab_ids: ['1'],
      student_ids: ['s23', 's24', 's25'],
      created_at: '2023-08-01T00:00:00Z',
      updated_at: '2023-12-15T00:00:00Z',
    },
  ];

  // Mock instructor data
  const instructors = {
    inst1: { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu' },
    inst2: { name: 'Prof. Michael Chen', email: 'michael.chen@university.edu' },
    inst3: { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@university.edu' },
    inst4: { name: 'Prof. David Kim', email: 'david.kim@university.edu' },
  };

  const filteredCourses = courses.filter((course) => {
    const instructor = instructors[course.instructor_id as keyof typeof instructors];
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || course.semester === semesterFilter;
    const matchesYear = yearFilter === 'all' || course.year === yearFilter;
    return matchesSearch && matchesSemester && matchesYear;
  });

  const uniqueYears = Array.from(new Set(courses.map(course => course.year))).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage courses and student enrollments</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Semesters</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const instructor = instructors[course.instructor_id as keyof typeof instructors];
          return (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{course.semester} {course.year}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    Instructor: {instructor?.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {course.student_ids.length} students enrolled
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {course.lab_ids.length} lab(s) assigned
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                      Active
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(course => course.year === 2024).length}
            </div>
            <div className="text-sm text-gray-600">Current Year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {courses.reduce((total, course) => total + course.student_ids.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(instructors).length}
            </div>
            <div className="text-sm text-gray-600">Active Instructors</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Course Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">New student enrolled in Organic Chemistry I</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Assignment created for Physics Laboratory</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Lab booking confirmed for Microbiology</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
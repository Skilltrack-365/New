import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, User, Plus, Search, Filter, Clock, CheckCircle } from 'lucide-react';
import { Assignment } from '../types';

const AssignmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'past_due' | 'completed' | 'all'>('all');

  // Mock data - in real app, this would come from API
  const assignments: Assignment[] = [
    {
      id: '1',
      course_id: '1',
      title: 'Synthesis of Aspirin Lab Report',
      description: 'Complete a comprehensive lab report on the synthesis of aspirin including mechanism, yield calculations, and analysis.',
      instructions: 'Follow the lab manual guidelines. Include all calculations, observations, and conclusions.',
      due_date: '2024-02-15T23:59:00Z',
      max_score: 100,
      lab_id: '1',
      required_equipment: ['Spectrophotometer', 'Balance'],
      attachments: ['lab_manual.pdf', 'report_template.docx'],
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    {
      id: '2',
      course_id: '2',
      title: 'Oscilloscope Measurements',
      description: 'Perform various measurements using digital oscilloscope and analyze waveforms.',
      instructions: 'Complete all measurement tasks and submit analysis report with screenshots.',
      due_date: '2024-02-10T23:59:00Z',
      max_score: 75,
      lab_id: '2',
      required_equipment: ['Oscilloscope', 'Function Generator'],
      created_at: '2024-01-18T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    {
      id: '3',
      course_id: '3',
      title: 'Bacterial Culture Analysis',
      description: 'Analyze bacterial cultures and identify unknown species using various techniques.',
      instructions: 'Use gram staining, biochemical tests, and microscopy. Document all procedures.',
      due_date: '2024-02-20T23:59:00Z',
      max_score: 90,
      lab_id: '3',
      required_equipment: ['Microscope', 'Incubator'],
      created_at: '2024-01-25T00:00:00Z',
      updated_at: '2024-01-25T00:00:00Z',
    },
    {
      id: '4',
      course_id: '4',
      title: 'Python Programming Project',
      description: 'Develop a data analysis program using Python with proper documentation.',
      instructions: 'Code must be well-commented and include error handling. Submit source code and documentation.',
      due_date: '2024-01-30T23:59:00Z',
      max_score: 120,
      lab_id: '4',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '5',
      course_id: '1',
      title: 'HPLC Analysis Assignment',
      description: 'Perform HPLC analysis of pharmaceutical compounds and interpret chromatograms.',
      instructions: 'Follow standard operating procedures. Calculate concentrations and prepare analytical report.',
      due_date: '2024-01-25T23:59:00Z',
      max_score: 85,
      lab_id: '1',
      required_equipment: ['HPLC System'],
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-08T00:00:00Z',
    },
  ];

  // Mock course data
  const courses = {
    '1': { name: 'Organic Chemistry I', code: 'CHEM 301' },
    '2': { name: 'Physics Laboratory', code: 'PHYS 205' },
    '3': { name: 'Microbiology', code: 'BIOL 410' },
    '4': { name: 'Computer Programming Lab', code: 'CS 150' },
  };

  // Mock submission data
  const submissionStats = {
    '1': { submitted: 15, total: 25 },
    '2': { submitted: 18, total: 20 },
    '3': { submitted: 8, total: 22 },
    '4': { submitted: 25, total: 28 },
    '5': { submitted: 22, total: 25 },
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const course = courses[assignment.course_id as keyof typeof courses];
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course?.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || assignment.course_id === courseFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      const stats = submissionStats[assignment.id as keyof typeof submissionStats];
      
      switch (statusFilter) {
        case 'active':
          matchesStatus = dueDate > now;
          break;
        case 'past_due':
          matchesStatus = dueDate <= now && stats.submitted < stats.total;
          break;
        case 'completed':
          matchesStatus = stats.submitted === stats.total;
          break;
      }
    }
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusInfo = (assignment: Assignment) => {
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const stats = submissionStats[assignment.id as keyof typeof submissionStats];
    const isOverdue = dueDate <= now;
    const isCompleted = stats.submitted === stats.total;
    
    if (isCompleted) {
      return { status: 'completed', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle };
    } else if (isOverdue) {
      return { status: 'overdue', color: 'text-red-600 bg-red-50 border-red-200', icon: Clock };
    } else {
      return { status: 'active', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} day(s)`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600 mt-2">Manage course assignments and track submissions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Assignment</span>
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
                placeholder="Search assignments..."
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
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {Object.entries(courses).map(([id, course]) => (
                  <option key={id} value={id}>{course.code} - {course.name}</option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'active' | 'past_due' | 'completed' | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const course = courses[assignment.course_id as keyof typeof courses];
          const stats = submissionStats[assignment.id as keyof typeof submissionStats];
          const statusInfo = getStatusInfo(assignment);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{course?.code} - {course?.name}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{assignment.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.status}
                    </span>
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.max_score} points
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDueDate(assignment.due_date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {stats.submitted}/{stats.total} submitted
                  </div>
                  {assignment.lab_id && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Lab Required
                    </div>
                  )}
                </div>

                {assignment.required_equipment && assignment.required_equipment.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Required Equipment: </span>
                    <span className="text-sm text-gray-600">
                      {assignment.required_equipment.join(', ')}
                    </span>
                  </div>
                )}

                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Attachments: </span>
                    <span className="text-sm text-gray-600">
                      {assignment.attachments.length} file(s)
                    </span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Submission Progress</span>
                    <span>{Math.round((stats.submitted / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.submitted / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(assignment.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                      View Submissions
                    </button>
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {assignments.filter(a => {
                const stats = submissionStats[a.id as keyof typeof submissionStats];
                return stats.submitted === stats.total;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {assignments.filter(a => {
                const dueDate = new Date(a.due_date);
                const stats = submissionStats[a.id as keyof typeof submissionStats];
                return dueDate <= new Date() && stats.submitted < stats.total;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(submissionStats).reduce((total, stats) => total + stats.submitted, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
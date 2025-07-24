import React, { useState } from 'react';
import { PlayCircle, Clock, User, CheckCircle, BookOpen, Calendar, MapPin, Users } from 'lucide-react';

interface LabSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  lab: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  objectives: string[];
  materials: string[];
  isEnrolled: boolean;
}

const LabSessionsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available' | 'completed'>('all');

  // Mock data - in real app, this would come from API
  const labSessions: LabSession[] = [
    {
      id: '1',
      title: 'Organic Synthesis Lab - Aspirin Preparation',
      course: 'Organic Chemistry I',
      instructor: 'Dr. Sarah Johnson',
      lab: 'Chemistry Lab A',
      date: '2024-01-25',
      startTime: '10:00',
      endTime: '13:00',
      duration: 180,
      maxParticipants: 16,
      currentParticipants: 12,
      status: 'upcoming',
      description: 'Learn the fundamentals of organic synthesis by preparing aspirin from salicylic acid.',
      objectives: [
        'Understand esterification reactions',
        'Practice proper laboratory techniques',
        'Calculate theoretical and actual yields',
        'Analyze product purity using melting point determination'
      ],
      materials: ['Lab coat', 'Safety goggles', 'Lab notebook'],
      isEnrolled: true,
    },
    {
      id: '2',
      title: 'Microscopy Techniques Workshop',
      course: 'Cell Biology',
      instructor: 'Prof. Michael Chen',
      lab: 'Biology Lab C',
      date: '2024-01-26',
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      maxParticipants: 12,
      currentParticipants: 8,
      status: 'upcoming',
      description: 'Explore advanced microscopy techniques including fluorescence and confocal microscopy.',
      objectives: [
        'Master different microscopy techniques',
        'Prepare biological samples',
        'Understand image analysis basics',
        'Document observations effectively'
      ],
      materials: ['Lab coat', 'Disposable gloves', 'Sample preparation kit'],
      isEnrolled: false,
    },
    {
      id: '3',
      title: 'Circuit Analysis Lab',
      course: 'Electronics Fundamentals',
      instructor: 'Dr. Emily Rodriguez',
      lab: 'Physics Lab B',
      date: '2024-01-24',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180,
      maxParticipants: 20,
      currentParticipants: 18,
      status: 'in-progress',
      description: 'Hands-on experience with circuit construction and analysis using oscilloscopes.',
      objectives: [
        'Build basic electronic circuits',
        'Use oscilloscopes and multimeters',
        'Analyze circuit behavior',
        'Troubleshoot common issues'
      ],
      materials: ['Circuit kit', 'Multimeter', 'Breadboard'],
      isEnrolled: true,
    },
    {
      id: '4',
      title: 'Protein Purification Techniques',
      course: 'Biochemistry Lab',
      instructor: 'Dr. Sarah Johnson',
      lab: 'Biology Lab A',
      date: '2024-01-20',
      startTime: '13:00',
      endTime: '17:00',
      duration: 240,
      maxParticipants: 14,
      currentParticipants: 14,
      status: 'completed',
      description: 'Learn protein purification using chromatography techniques.',
      objectives: [
        'Understand protein purification principles',
        'Perform column chromatography',
        'Analyze protein purity',
        'Calculate purification efficiency'
      ],
      materials: ['Lab coat', 'Safety goggles', 'Chromatography columns'],
      isEnrolled: true,
    },
  ];

  const filteredSessions = labSessions.filter(session => {
    switch (filter) {
      case 'enrolled':
        return session.isEnrolled;
      case 'available':
        return !session.isEnrolled && session.currentParticipants < session.maxParticipants;
      case 'completed':
        return session.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleEnroll = (sessionId: string) => {
    // In real app, this would make API call
    console.log('Enrolling in session:', sessionId);
    alert('Successfully enrolled in lab session!');
  };

  const handleUnenroll = (sessionId: string) => {
    // In real app, this would make API call
    console.log('Unenrolling from session:', sessionId);
    alert('Successfully unenrolled from lab session!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Sessions</h1>
          <p className="text-gray-600 mt-2">Join hands-on laboratory learning experiences</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Sessions', count: labSessions.length },
            { key: 'enrolled', label: 'My Sessions', count: labSessions.filter(s => s.isEnrolled).length },
            { key: 'available', label: 'Available', count: labSessions.filter(s => !s.isEnrolled && s.currentParticipants < s.maxParticipants).length },
            { key: 'completed', label: 'Completed', count: labSessions.filter(s => s.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                  <p className="text-sm text-gray-600">{session.course}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
                  {getStatusIcon(session.status)}
                  <span className="ml-1 capitalize">{session.status.replace('-', ' ')}</span>
                </span>
              </div>

              {/* Session Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {session.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {session.lab}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {session.startTime} - {session.endTime}
                </div>
              </div>

              {/* Enrollment Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {session.currentParticipants}/{session.maxParticipants} enrolled
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{session.description}</p>

              {/* Learning Objectives */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {session.objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {objective}
                    </li>
                  ))}
                  {session.objectives.length > 2 && (
                    <li className="text-xs text-gray-500">+{session.objectives.length - 2} more objectives</li>
                  )}
                </ul>
              </div>

              {/* Required Materials */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Required Materials:</h4>
                <div className="flex flex-wrap gap-1">
                  {session.materials.map((material, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Duration: {Math.floor(session.duration / 60)}h {session.duration % 60}m
                </div>
                <div className="flex space-x-2">
                  {session.isEnrolled ? (
                    <>
                      {session.status === 'upcoming' && (
                        <button
                          onClick={() => handleUnenroll(session.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Unenroll
                        </button>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                    </>
                  ) : (
                    <>
                      {session.currentParticipants < session.maxParticipants && session.status === 'upcoming' ? (
                        <button
                          onClick={() => handleEnroll(session.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Enroll
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {session.status === 'upcoming' ? 'Full' : 'Closed'}
                        </span>
                      )}
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lab sessions found</h3>
          <p className="text-gray-600">Check back later or adjust your filter criteria.</p>
        </div>
      )}

      {/* Upcoming Sessions Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Upcoming Sessions</h2>
        <div className="space-y-3">
          {labSessions
            .filter(session => session.isEnrolled && session.status === 'upcoming')
            .slice(0, 3)
            .map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.title}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(session.date).toLocaleDateString()} at {session.startTime} - {session.lab}
                  </p>
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  {Math.ceil((new Date(session.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LabSessionsPage;
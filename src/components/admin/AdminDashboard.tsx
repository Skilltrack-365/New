import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Monitor, 
  Award, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLabs: number;
  totalEnrollments: number;
  recentEnrollments: any[];
  recentSessions: any[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalLabs: 0,
    totalEnrollments: 0,
    recentEnrollments: [],
    recentSessions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total counts
      const [usersResult, coursesResult, labsResult, enrollmentsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('labs').select('id', { count: 'exact' }),
        supabase.from('enrollments').select('id', { count: 'exact' })
      ]);

      // Fetch recent enrollments
      const { data: recentEnrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles(full_name, email),
          courses(title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      // Fetch recent lab sessions
      const { data: recentSessions } = await supabase
        .from('lab_sessions')
        .select(`
          *,
          profiles(full_name, email),
          labs(title)
        `)
        .order('started_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalLabs: labsResult.count || 0,
        totalEnrollments: enrollmentsResult.count || 0,
        recentEnrollments: recentEnrollments || [],
        recentSessions: recentSessions || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Available Labs',
      value: stats.totalLabs,
      icon: Monitor,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: Award,
      color: 'bg-orange-500',
      change: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                <div className="h-8 w-20 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Enrollments Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-5 w-5 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-16 bg-gray-100 rounded mb-1" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lab Sessions Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-5 w-5 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-16 bg-gray-100 rounded mb-1" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3" />
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Skilltrack-365 Labs admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Enrollments</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentEnrollments.map((enrollment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{enrollment.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">{enrollment.courses?.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    enrollment.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : enrollment.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentEnrollments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent enrollments</p>
            )}
          </div>
        </div>

        {/* Recent Lab Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Lab Sessions</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{session.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">{session.labs?.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(session.started_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    session.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : session.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentSessions.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent lab sessions</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Course</p>
              <p className="text-sm text-gray-600">Add a new course to the platform</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Monitor className="w-8 h-8 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Lab</p>
              <p className="text-sm text-gray-600">Add a new hands-on lab</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
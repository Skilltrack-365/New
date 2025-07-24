import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FlaskConical,
  Settings,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = {
    totalLabs: 12,
    totalEquipment: 156,
    activeBookings: 23,
    pendingMaintenance: 5,
  };

  const recentBookings = [
    {
      id: '1',
      labName: 'Chemistry Lab A',
      equipment: 'Spectrophotometer',
      user: 'John Doe',
      time: '10:00 AM - 12:00 PM',
      status: 'active',
    },
    {
      id: '2',
      labName: 'Physics Lab B',
      equipment: 'Oscilloscope',
      user: 'Jane Smith',
      time: '2:00 PM - 4:00 PM',
      status: 'pending',
    },
    {
      id: '3',
      labName: 'Biology Lab C',
      equipment: 'Microscope',
      user: 'Mike Johnson',
      time: '9:00 AM - 11:00 AM',
      status: 'completed',
    },
  ];

  const maintenanceAlerts = [
    {
      id: '1',
      equipment: 'Centrifuge Model X200',
      lab: 'Chemistry Lab A',
      dueDate: '2024-01-15',
      priority: 'high',
    },
    {
      id: '2',
      equipment: 'Autoclave Unit 5',
      lab: 'Biology Lab B',
      dueDate: '2024-01-18',
      priority: 'medium',
    },
  ];

  const quickActions = [
    {
      title: 'Book Equipment',
      description: 'Reserve lab equipment for your session',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-blue-600',
    },
    {
      title: 'View Labs',
      description: 'Browse available laboratories',
      icon: FlaskConical,
      href: '/labs',
      color: 'bg-green-600',
    },
    {
      title: 'Equipment Status',
      description: 'Check equipment availability',
      icon: Settings,
      href: '/equipment',
      color: 'bg-purple-600',
    },
    {
      title: 'Reports',
      description: 'Generate usage and analytics reports',
      icon: TrendingUp,
      href: '/reports',
      color: 'bg-orange-600',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your labs today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FlaskConical className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Labs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLabs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingMaintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{booking.labName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{booking.equipment}</p>
                  <p className="text-xs text-gray-500">{booking.user} • {booking.time}</p>
                </div>
                <div className="ml-4">
                  {getStatusIcon(booking.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Alerts</h2>
            <Link to="/maintenance" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {maintenanceAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{alert.equipment}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{alert.lab}</p>
                <p className="text-xs text-gray-500">Due: {alert.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
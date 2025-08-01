import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import {
  Home,
  LayoutDashboard,
  FlaskConical,
  Settings,
  Calendar,
  BookOpen,
  ClipboardList,
  Package,
  Wrench,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Users,
  Shield,
  GraduationCap,
  PlayCircle,
  FileText,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Admin Navigation - Full access to all features
  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Labs', href: '/labs', icon: FlaskConical },
    { name: 'Equipment', href: '/equipment', icon: Settings },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Assignments', href: '/assignments', icon: ClipboardList },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Shield },
  ];

  // Instructor Navigation - Course and lab management focused
  const instructorNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Assignments', href: '/assignments', icon: ClipboardList },
    { name: 'Labs', href: '/labs', icon: FlaskConical },
    { name: 'Equipment', href: '/equipment', icon: Settings },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  // Student Navigation - Learning and lab access focused
  const studentNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/courses', icon: GraduationCap },
    { name: 'Assignments', href: '/assignments', icon: ClipboardList },
    { name: 'Lab Sessions', href: '/lab-sessions', icon: PlayCircle },
    { name: 'Book Lab', href: '/bookings', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: FileText },
  ];

  // Lab Tech Navigation - Equipment and maintenance focused
  const labTechNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Equipment', href: '/equipment', icon: Settings },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Labs', href: '/labs', icon: FlaskConical },
  ];

  // Get navigation based on user role
  const getNavigation = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return adminNavigation;
      case UserRole.INSTRUCTOR:
        return instructorNavigation;
      case UserRole.STUDENT:
        return studentNavigation;
      case UserRole.LAB_TECH:
        return labTechNavigation;
      default:
        return studentNavigation; // Default to student view
    }
  };

  const navigation = getNavigation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.INSTRUCTOR:
        return 'Instructor';
      case UserRole.STUDENT:
        return 'Student';
      case UserRole.LAB_TECH:
        return 'Lab Technician';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-600';
      case UserRole.INSTRUCTOR:
        return 'bg-green-600';
      case UserRole.STUDENT:
        return 'bg-blue-600';
      case UserRole.LAB_TECH:
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">SmartLabs Pro</h1>
            </div>
            {/* Role Badge */}
            <div className="px-4 mt-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(user?.role || UserRole.STUDENT)}`}>
                {getRoleDisplayName(user?.role || UserRole.STUDENT)}
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getRoleColor(user?.role || UserRole.STUDENT)}`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">SmartLabs Pro</h1>
            </div>
            {/* Role Badge */}
            <div className="px-4 mt-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(user?.role || UserRole.STUDENT)}`}>
                {getRoleDisplayName(user?.role || UserRole.STUDENT)}
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getRoleColor(user?.role || UserRole.STUDENT)}`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || UserRole.STUDENT)}</p>
              </div>
              <div className="ml-2 flex space-x-1">
                <Link
                  to="/profile"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                  title="Profile"
                >
                  <User className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Role-specific header message */}
              {user?.role === UserRole.ADMIN && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Administrator View</h3>
                      <p className="text-sm text-red-700 mt-1">
                        You have full system access to manage labs, users, and content.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {user?.role === UserRole.STUDENT && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Student Portal</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Access your courses, assignments, and book lab sessions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
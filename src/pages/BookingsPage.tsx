import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Search, Filter, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Booking, BookingStatus } from '../types';

const BookingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Mock data - in real app, this would come from API
  const bookings: Booking[] = [
    {
      id: '1',
      user_id: 'user1',
      lab_id: '1',
      equipment_ids: ['eq1', 'eq2'],
      start_time: '2024-01-24T10:00:00Z',
      end_time: '2024-01-24T12:00:00Z',
      purpose: 'Organic Chemistry Experiment - Synthesis of Aspirin',
      status: BookingStatus.APPROVED,
      notes: 'Need fume hood access',
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user2',
      lab_id: '2',
      equipment_ids: ['eq4'],
      start_time: '2024-01-24T14:00:00Z',
      end_time: '2024-01-24T16:00:00Z',
      purpose: 'Physics Lab - Oscilloscope Measurements',
      status: BookingStatus.PENDING,
      created_at: '2024-01-23T00:00:00Z',
      updated_at: '2024-01-23T00:00:00Z',
    },
    {
      id: '3',
      user_id: 'user3',
      lab_id: '3',
      equipment_ids: ['eq6', 'eq7'],
      start_time: '2024-01-25T09:00:00Z',
      end_time: '2024-01-25T11:00:00Z',
      purpose: 'Microbiology Culture Preparation',
      status: BookingStatus.APPROVED,
      created_at: '2024-01-21T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    {
      id: '4',
      user_id: 'user4',
      lab_id: '1',
      equipment_ids: ['eq3'],
      start_time: '2024-01-23T13:00:00Z',
      end_time: '2024-01-23T15:00:00Z',
      purpose: 'Analytical Chemistry - HPLC Analysis',
      status: BookingStatus.COMPLETED,
      created_at: '2024-01-18T00:00:00Z',
      updated_at: '2024-01-23T15:00:00Z',
    },
    {
      id: '5',
      user_id: 'user5',
      lab_id: '2',
      equipment_ids: ['eq5'],
      start_time: '2024-01-26T11:00:00Z',
      end_time: '2024-01-26T13:00:00Z',
      purpose: 'Electronics Lab - Circuit Testing',
      status: BookingStatus.REJECTED,
      notes: 'Equipment unavailable due to maintenance',
      created_at: '2024-01-22T00:00:00Z',
      updated_at: '2024-01-23T00:00:00Z',
    },
  ];

  // Mock user data for display
  const users = {
    user1: { name: 'John Doe', email: 'john@example.com' },
    user2: { name: 'Jane Smith', email: 'jane@example.com' },
    user3: { name: 'Mike Johnson', email: 'mike@example.com' },
    user4: { name: 'Sarah Wilson', email: 'sarah@example.com' },
    user5: { name: 'Tom Brown', email: 'tom@example.com' },
  };

  const labs = {
    '1': 'Chemistry Lab A',
    '2': 'Physics Lab B',
    '3': 'Biology Lab C',
  };

  const filteredBookings = bookings.filter((booking) => {
    const user = users[booking.user_id as keyof typeof users];
    const lab = labs[booking.lab_id as keyof typeof labs];
    
    const matchesSearch = booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const bookingDate = new Date(booking.start_time);
      const today = new Date();
      const daysDiff = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff >= 0 && daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff >= 0 && daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'text-green-600 bg-green-50 border-green-200';
      case BookingStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case BookingStatus.REJECTED:
        return 'text-red-600 bg-red-50 border-red-200';
      case BookingStatus.COMPLETED:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case BookingStatus.CANCELLED:
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
      case BookingStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case BookingStatus.REJECTED:
      case BookingStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      case BookingStatus.PENDING:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage lab and equipment reservations</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
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
                placeholder="Search bookings..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={BookingStatus.PENDING}>Pending</option>
                <option value={BookingStatus.APPROVED}>Approved</option>
                <option value={BookingStatus.REJECTED}>Rejected</option>
                <option value={BookingStatus.COMPLETED}>Completed</option>
                <option value={BookingStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'today' | 'week' | 'month' | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const user = users[booking.user_id as keyof typeof users];
          const lab = labs[booking.lab_id as keyof typeof labs];
          const startDateTime = formatDateTime(booking.start_time);
          const endDateTime = formatDateTime(booking.end_time);

          return (
            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.purpose}</h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {user?.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {lab}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {startDateTime.date} | {startDateTime.time} - {endDateTime.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {booking.status === BookingStatus.PENDING && (
                      <>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                          Approve
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                          Reject
                        </button>
                      </>
                    )}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                      View
                    </button>
                  </div>
                </div>

                {booking.equipment_ids && booking.equipment_ids.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Equipment: </span>
                    <span className="text-sm text-gray-600">
                      {booking.equipment_ids.length} item(s) requested
                    </span>
                  </div>
                )}

                {booking.notes && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Notes: </span>
                    <span className="text-sm text-gray-600">{booking.notes}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Created: {new Date(booking.created_at).toLocaleDateString()} | 
                  Updated: {new Date(booking.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === BookingStatus.PENDING).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === BookingStatus.APPROVED).length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === BookingStatus.COMPLETED).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === BookingStatus.REJECTED).length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
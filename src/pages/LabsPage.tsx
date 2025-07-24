import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Users, MapPin, Plus, Search, Filter } from 'lucide-react';
import { Lab, LabStatus } from '../types';

const LabsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LabStatus | 'all'>('all');

  // Mock data - in real app, this would come from API
  const labs: Lab[] = [
    {
      id: '1',
      name: 'Chemistry Lab A',
      description: 'Advanced chemistry laboratory with modern equipment for organic and inorganic chemistry experiments.',
      location: 'Building A, Floor 2, Room 201',
      capacity: 24,
      equipment_ids: ['eq1', 'eq2', 'eq3'],
      instructor_id: 'inst1',
      status: LabStatus.ACTIVE,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      name: 'Physics Lab B',
      description: 'Physics laboratory equipped with oscilloscopes, function generators, and measurement tools.',
      location: 'Building B, Floor 1, Room 105',
      capacity: 20,
      equipment_ids: ['eq4', 'eq5'],
      instructor_id: 'inst2',
      status: LabStatus.ACTIVE,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
    },
    {
      id: '3',
      name: 'Biology Lab C',
      description: 'Microbiology and cell biology laboratory with sterile workbenches and microscopy equipment.',
      location: 'Building C, Floor 3, Room 301',
      capacity: 16,
      equipment_ids: ['eq6', 'eq7', 'eq8'],
      instructor_id: 'inst3',
      status: LabStatus.MAINTENANCE,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    {
      id: '4',
      name: 'Computer Lab D',
      description: 'Computer laboratory with high-performance workstations for programming and simulation.',
      location: 'Building D, Floor 2, Room 205',
      capacity: 30,
      equipment_ids: ['eq9', 'eq10'],
      instructor_id: 'inst4',
      status: LabStatus.ACTIVE,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-12T00:00:00Z',
    },
  ];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lab.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LabStatus) => {
    switch (status) {
      case LabStatus.ACTIVE:
        return 'text-green-600 bg-green-50 border-green-200';
      case LabStatus.MAINTENANCE:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case LabStatus.INACTIVE:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all laboratory facilities</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Lab</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search labs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LabStatus | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={LabStatus.ACTIVE}>Active</option>
                <option value={LabStatus.MAINTENANCE}>Maintenance</option>
                <option value={LabStatus.INACTIVE}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FlaskConical className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lab.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lab.status)}`}>
                      {lab.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lab.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {lab.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  Capacity: {lab.capacity} students
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {lab.equipment_ids.length} equipment items
                </div>
                <Link
                  to={`/labs/${lab.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No labs found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lab Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{labs.length}</div>
            <div className="text-sm text-gray-600">Total Labs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {labs.filter(lab => lab.status === LabStatus.ACTIVE).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {labs.filter(lab => lab.status === LabStatus.MAINTENANCE).length}
            </div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {labs.reduce((total, lab) => total + lab.capacity, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabsPage;
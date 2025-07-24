import React, { useState } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter } from 'lucide-react';
import { MaintenanceRecord, MaintenanceType } from '../types';

const MaintenancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'overdue' | 'all'>('all');

  // Mock data - in real app, this would come from API
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: '1',
      equipment_id: 'eq1',
      technician_id: 'tech1',
      maintenance_type: MaintenanceType.PREVENTIVE,
      description: 'Monthly calibration and cleaning of digital microscope',
      parts_used: ['Calibration kit', 'Cleaning solution'],
      cost: 125.50,
      duration_minutes: 90,
      completed_at: '2024-01-20T14:30:00Z',
      next_maintenance_due: '2024-02-20T00:00:00Z',
    },
    {
      id: '2',
      equipment_id: 'eq2',
      technician_id: 'tech2',
      maintenance_type: MaintenanceType.CORRECTIVE,
      description: 'Repair centrifuge motor bearing replacement',
      parts_used: ['Motor bearing', 'Lubricant'],
      cost: 275.00,
      duration_minutes: 180,
      completed_at: '2024-01-18T10:15:00Z',
      next_maintenance_due: '2024-04-18T00:00:00Z',
    },
    {
      id: '3',
      equipment_id: 'eq3',
      technician_id: 'tech1',
      maintenance_type: MaintenanceType.CALIBRATION,
      description: 'Spectrophotometer wavelength calibration',
      parts_used: ['Calibration standards'],
      cost: 85.00,
      duration_minutes: 60,
      completed_at: '2024-01-22T09:00:00Z',
      next_maintenance_due: '2024-07-22T00:00:00Z',
    },
  ];

  // Mock equipment and technician data
  const equipment = {
    eq1: { name: 'Digital Microscope DM-500', lab: 'Biology Lab A' },
    eq2: { name: 'High-Speed Centrifuge', lab: 'Chemistry Lab B' },
    eq3: { name: 'UV-Vis Spectrophotometer', lab: 'Chemistry Lab A' },
  };

  const technicians = {
    tech1: { name: 'John Smith', specialization: 'Optical Equipment' },
    tech2: { name: 'Sarah Johnson', specialization: 'Mechanical Systems' },
  };

  // Mock upcoming maintenance
  const upcomingMaintenance = [
    {
      id: 'um1',
      equipment_id: 'eq1',
      type: MaintenanceType.PREVENTIVE,
      due_date: '2024-02-20T00:00:00Z',
      description: 'Monthly calibration',
      assigned_to: 'tech1',
    },
    {
      id: 'um2',
      equipment_id: 'eq2',
      type: MaintenanceType.PREVENTIVE,
      due_date: '2024-02-15T00:00:00Z',
      description: 'Quarterly inspection',
      assigned_to: 'tech2',
    },
  ];

  const filteredRecords = maintenanceRecords.filter((record) => {
    const equipmentInfo = equipment[record.equipment_id as keyof typeof equipment];
    const techInfo = technicians[record.technician_id as keyof typeof technicians];
    
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipmentInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         techInfo?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.maintenance_type === typeFilter;
    
    // For status filter, we'll use completed_at to determine status
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      // This is simplified - in real app, you'd have proper status tracking
      matchesStatus = statusFilter === 'completed'; // All records are completed in mock data
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: MaintenanceType) => {
    switch (type) {
      case MaintenanceType.PREVENTIVE:
        return 'text-green-600 bg-green-50 border-green-200';
      case MaintenanceType.CORRECTIVE:
        return 'text-red-600 bg-red-50 border-red-200';
      case MaintenanceType.CALIBRATION:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: MaintenanceType) => {
    switch (type) {
      case MaintenanceType.PREVENTIVE:
        return CheckCircle;
      case MaintenanceType.CORRECTIVE:
        return AlertTriangle;
      case MaintenanceType.CALIBRATION:
        return Wrench;
      default:
        return Clock;
    }
  };

  const getUpcomingStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: 'text-red-600 bg-red-50', days: Math.abs(diffDays) };
    } else if (diffDays <= 7) {
      return { status: 'due soon', color: 'text-orange-600 bg-orange-50', days: diffDays };
    } else {
      return { status: 'scheduled', color: 'text-green-600 bg-green-50', days: diffDays };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-600 mt-2">Track equipment maintenance and service records</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Preventive</p>
              <p className="text-2xl font-bold text-gray-900">
                {maintenanceRecords.filter(r => r.maintenance_type === MaintenanceType.PREVENTIVE).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Corrective</p>
              <p className="text-2xl font-bold text-gray-900">
                {maintenanceRecords.filter(r => r.maintenance_type === MaintenanceType.CORRECTIVE).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingMaintenance.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search maintenance records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as MaintenanceType | 'all')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value={MaintenanceType.PREVENTIVE}>Preventive</option>
                    <option value={MaintenanceType.CORRECTIVE}>Corrective</option>
                    <option value={MaintenanceType.CALIBRATION}>Calibration</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const equipmentInfo = equipment[record.equipment_id as keyof typeof equipment];
              const techInfo = technicians[record.technician_id as keyof typeof technicians];
              const TypeIcon = getTypeIcon(record.maintenance_type);
              
              return (
                <div key={record.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{equipmentInfo?.name}</h3>
                        <p className="text-sm text-gray-600">{equipmentInfo?.lab}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(record.maintenance_type)}`}>
                      {record.maintenance_type}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{record.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Technician:</span>
                      <p className="text-sm text-gray-900">{techInfo?.name}</p>
                      <p className="text-xs text-gray-500">{techInfo?.specialization}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Completed:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(record.completed_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Duration: {Math.floor(record.duration_minutes / 60)}h {record.duration_minutes % 60}m
                      </p>
                    </div>
                  </div>

                  {record.parts_used && record.parts_used.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-600">Parts Used:</span>
                      <p className="text-sm text-gray-900">{record.parts_used.join(', ')}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Cost: <span className="font-medium text-gray-900">${record.cost?.toFixed(2)}</span>
                    </div>
                    {record.next_maintenance_due && (
                      <div className="text-sm text-gray-600">
                        Next Due: <span className="font-medium text-gray-900">
                          {new Date(record.next_maintenance_due).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRecords.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Upcoming Maintenance Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance</h2>
            <div className="space-y-4">
              {upcomingMaintenance.map((item) => {
                const equipmentInfo = equipment[item.equipment_id as keyof typeof equipment];
                const techInfo = technicians[item.assigned_to as keyof typeof technicians];
                const statusInfo = getUpcomingStatus(item.due_date);
                
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{equipmentInfo?.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                        {statusInfo.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-xs text-gray-500">
                      <div>Assigned: {techInfo?.name}</div>
                      <div>Due: {new Date(item.due_date).toLocaleDateString()}</div>
                      <div>
                        {statusInfo.status === 'overdue' 
                          ? `${statusInfo.days} days overdue`
                          : `${statusInfo.days} days remaining`
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Maintenance Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${maintenanceRecords.reduce((total, record) => total + (record.cost || 0), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${(maintenanceRecords.reduce((total, record) => total + (record.cost || 0), 0) / maintenanceRecords.length).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${maintenanceRecords
                    .filter(record => new Date(record.completed_at).getMonth() === new Date().getMonth())
                    .reduce((total, record) => total + (record.cost || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
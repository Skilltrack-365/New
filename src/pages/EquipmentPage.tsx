import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Plus, Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { Equipment, EquipmentStatus, EquipmentCategory } from '../types';

const EquipmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'all'>('all');

  // Mock data - in real app, this would come from API
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Digital Microscope DM-500',
      model: 'DM-500',
      serial_number: 'DM500-2024-001',
      manufacturer: 'SciTech Instruments',
      category: EquipmentCategory.MICROSCOPE,
      status: EquipmentStatus.AVAILABLE,
      lab_id: '1',
      purchase_date: '2024-01-15',
      warranty_expiry: '2027-01-15',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    {
      id: '2',
      name: 'High-Speed Centrifuge',
      model: 'HSC-3000',
      serial_number: 'HSC3000-2023-045',
      manufacturer: 'LabEquip Co.',
      category: EquipmentCategory.CENTRIFUGE,
      status: EquipmentStatus.IN_USE,
      lab_id: '1',
      purchase_date: '2023-08-10',
      warranty_expiry: '2026-08-10',
      created_at: '2023-08-10T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z',
    },
    {
      id: '3',
      name: 'UV-Vis Spectrophotometer',
      model: 'UV-2600',
      serial_number: 'UV2600-2024-012',
      manufacturer: 'Shimadzu',
      category: EquipmentCategory.SPECTROPHOTOMETER,
      status: EquipmentStatus.MAINTENANCE,
      lab_id: '2',
      purchase_date: '2024-02-01',
      warranty_expiry: '2027-02-01',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    {
      id: '4',
      name: 'Autoclave Sterilizer',
      model: 'AS-250',
      serial_number: 'AS250-2023-078',
      manufacturer: 'MedSteril',
      category: EquipmentCategory.AUTOCLAVE,
      status: EquipmentStatus.AVAILABLE,
      lab_id: '3',
      purchase_date: '2023-11-20',
      warranty_expiry: '2026-11-20',
      created_at: '2023-11-20T00:00:00Z',
      updated_at: '2024-01-19T00:00:00Z',
    },
    {
      id: '5',
      name: 'Analytical Balance',
      model: 'AB-220',
      serial_number: 'AB220-2024-003',
      manufacturer: 'Precision Scales',
      category: EquipmentCategory.BALANCE,
      status: EquipmentStatus.OUT_OF_ORDER,
      lab_id: '1',
      purchase_date: '2024-01-05',
      warranty_expiry: '2027-01-05',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-21T00:00:00Z',
    },
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case EquipmentStatus.AVAILABLE:
        return 'text-green-600 bg-green-50 border-green-200';
      case EquipmentStatus.IN_USE:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case EquipmentStatus.MAINTENANCE:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case EquipmentStatus.OUT_OF_ORDER:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: EquipmentStatus) => {
    switch (status) {
      case EquipmentStatus.MAINTENANCE:
      case EquipmentStatus.OUT_OF_ORDER:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const isWarrantyExpiringSoon = (warrantyExpiry?: string) => {
    if (!warrantyExpiry) return false;
    const expiryDate = new Date(warrantyExpiry);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    return expiryDate <= sixMonthsFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all laboratory equipment</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
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
                placeholder="Search equipment..."
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
                onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={EquipmentStatus.AVAILABLE}>Available</option>
                <option value={EquipmentStatus.IN_USE}>In Use</option>
                <option value={EquipmentStatus.MAINTENANCE}>Maintenance</option>
                <option value={EquipmentStatus.OUT_OF_ORDER}>Out of Order</option>
              </select>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as EquipmentCategory | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value={EquipmentCategory.MICROSCOPE}>Microscope</option>
              <option value={EquipmentCategory.CENTRIFUGE}>Centrifuge</option>
              <option value={EquipmentCategory.SPECTROPHOTOMETER}>Spectrophotometer</option>
              <option value={EquipmentCategory.AUTOCLAVE}>Autoclave</option>
              <option value={EquipmentCategory.INCUBATOR}>Incubator</option>
              <option value={EquipmentCategory.BALANCE}>Balance</option>
              <option value={EquipmentCategory.COMPUTER}>Computer</option>
              <option value={EquipmentCategory.OTHER}>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.model}</p>
                  </div>
                </div>
                {isWarrantyExpiringSoon(item.warranty_expiry) && (
                  <div className="p-1 bg-orange-100 rounded-full" title="Warranty expiring soon">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Manufacturer:</span> {item.manufacturer}
                </div>
                <div>
                  <span className="font-medium">Serial:</span> {item.serial_number}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {item.category}
                </div>
                {item.warranty_expiry && (
                  <div>
                    <span className="font-medium">Warranty:</span> {new Date(item.warranty_expiry).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Lab ID: {item.lab_id}
                </div>
                <Link
                  to={`/equipment/${item.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{equipment.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {equipment.filter(item => item.status === EquipmentStatus.AVAILABLE).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {equipment.filter(item => item.status === EquipmentStatus.IN_USE).length}
            </div>
            <div className="text-sm text-gray-600">In Use</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {equipment.filter(item => item.status === EquipmentStatus.MAINTENANCE).length}
            </div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {equipment.filter(item => item.status === EquipmentStatus.OUT_OF_ORDER).length}
            </div>
            <div className="text-sm text-gray-600">Out of Order</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentPage;
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, FlaskConical, Settings } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('usage');
  const [dateRange, setDateRange] = useState<string>('month');

  const reportTypes = [
    { id: 'usage', name: 'Usage Analytics', icon: BarChart3, description: 'Lab and equipment usage statistics' },
    { id: 'maintenance', name: 'Maintenance Reports', icon: Settings, description: 'Equipment maintenance and service records' },
    { id: 'inventory', name: 'Inventory Reports', icon: FlaskConical, description: 'Stock levels and inventory management' },
    { id: 'student', name: 'Student Progress', icon: Users, description: 'Student performance and assignment completion' },
    { id: 'financial', name: 'Financial Reports', icon: TrendingUp, description: 'Cost analysis and budget tracking' },
  ];

  // Mock data for demonstration
  const usageData = {
    totalHours: 1250,
    totalBookings: 145,
    activeUsers: 78,
    utilizationRate: 85,
    topLabs: [
      { name: 'Chemistry Lab A', hours: 350, bookings: 45 },
      { name: 'Physics Lab B', hours: 280, bookings: 32 },
      { name: 'Biology Lab C', hours: 220, bookings: 28 },
    ],
    topEquipment: [
      { name: 'Digital Microscope', hours: 180, bookings: 25 },
      { name: 'Spectrophotometer', hours: 165, bookings: 22 },
      { name: 'Centrifuge', hours: 145, bookings: 20 },
    ],
  };

  const maintenanceData = {
    totalRecords: 25,
    preventiveMaintenance: 18,
    correctiveMaintenance: 7,
    totalCost: 3250.75,
    averageCost: 130.03,
    upcomingMaintenance: 8,
  };

  const inventoryData = {
    totalItems: 156,
    lowStockItems: 12,
    expiredItems: 3,
    totalValue: 45678.90,
    reorderAlerts: 8,
  };

  const studentData = {
    totalStudents: 245,
    activeStudents: 198,
    completedAssignments: 78,
    averageGrade: 85.6,
    coursesActive: 12,
  };

  const renderUsageReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.totalHours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.utilizationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Labs by Usage</h3>
          <div className="space-y-4">
            {usageData.topLabs.map((lab, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lab.name}</p>
                  <p className="text-xs text-gray-500">{lab.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{lab.hours}h</p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(lab.hours / 350) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Equipment by Usage</h3>
          <div className="space-y-4">
            {usageData.topEquipment.map((equipment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{equipment.name}</p>
                  <p className="text-xs text-gray-500">{equipment.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{equipment.hours}h</p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(equipment.hours / 180) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'usage':
        return renderUsageReport();
      case 'maintenance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-gray-900">{maintenanceData.totalRecords}</p>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-green-600">{maintenanceData.preventiveMaintenance}</p>
              <p className="text-sm text-gray-600">Preventive</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-red-600">{maintenanceData.correctiveMaintenance}</p>
              <p className="text-sm text-gray-600">Corrective</p>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-gray-900">{inventoryData.totalItems}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-yellow-600">{inventoryData.lowStockItems}</p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-red-600">{inventoryData.expiredItems}</p>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-green-600">${inventoryData.totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-gray-900">{studentData.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-green-600">{studentData.activeStudents}</p>
              <p className="text-sm text-gray-600">Active Students</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-blue-600">{studentData.completedAssignments}</p>
              <p className="text-sm text-gray-600">Completed Assignments</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-purple-600">{studentData.averageGrade}%</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-green-600">${maintenanceData.totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Maintenance Costs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-blue-600">${inventoryData.totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Inventory Value</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl font-bold text-purple-600">${(maintenanceData.totalCost + inventoryData.totalValue).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        );
      default:
        return renderUsageReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive reports and analyze lab data</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <h3 className="font-medium text-sm">{report.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h2>
            <div className="text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
          {renderReportContent()}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Peak Usage</h3>
            <p className="text-sm text-blue-700">Tuesdays 2-4 PM show highest lab utilization</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900">Efficiency</h3>
            <p className="text-sm text-green-700">Equipment uptime improved by 15% this month</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900">Maintenance</h3>
            <p className="text-sm text-yellow-700">8 equipment items need scheduled maintenance</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900">Student Progress</h3>
            <p className="text-sm text-purple-700">Average assignment completion rate: 89%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
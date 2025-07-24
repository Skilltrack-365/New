import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { InventoryItem } from '../types';

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'low' | 'normal' | 'expired' | 'all'>('all');

  // Mock data - in real app, this would come from API
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Hydrochloric Acid (HCl)',
      category: 'Chemicals',
      sku: 'CHEM-HCL-001',
      current_stock: 5,
      minimum_stock: 10,
      unit: 'bottles',
      cost_per_unit: 15.50,
      supplier_id: 'sup1',
      location: 'Chemical Storage Room A',
      expiry_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    {
      id: '2',
      name: 'Disposable Gloves (Nitrile)',
      category: 'Safety Equipment',
      sku: 'SAFE-GLV-002',
      current_stock: 150,
      minimum_stock: 50,
      unit: 'boxes',
      cost_per_unit: 8.75,
      supplier_id: 'sup2',
      location: 'Safety Equipment Cabinet',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-18T00:00:00Z',
    },
    {
      id: '3',
      name: 'pH Test Strips',
      category: 'Testing Supplies',
      sku: 'TEST-PH-003',
      current_stock: 8,
      minimum_stock: 20,
      unit: 'packs',
      cost_per_unit: 12.00,
      supplier_id: 'sup1',
      location: 'Testing Supplies Shelf B',
      expiry_date: '2024-06-30',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '4',
      name: 'Microscope Slides',
      category: 'Lab Supplies',
      sku: 'LAB-SLD-004',
      current_stock: 500,
      minimum_stock: 100,
      unit: 'pieces',
      cost_per_unit: 0.25,
      supplier_id: 'sup3',
      location: 'Lab Supplies Cabinet C',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    {
      id: '5',
      name: 'Sodium Chloride (NaCl)',
      category: 'Chemicals',
      sku: 'CHEM-NCL-005',
      current_stock: 2,
      minimum_stock: 5,
      unit: 'kg',
      cost_per_unit: 25.00,
      supplier_id: 'sup1',
      location: 'Chemical Storage Room A',
      expiry_date: '2024-03-15',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-19T00:00:00Z',
    },
  ];

  const suppliers = {
    sup1: { name: 'ChemSupply Co.', contact: 'orders@chemsupply.com' },
    sup2: { name: 'SafetyFirst Ltd.', contact: 'sales@safetyfirst.com' },
    sup3: { name: 'LabEquipment Inc.', contact: 'support@labequip.com' },
  };

  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter !== 'all') {
      const isLowStock = item.current_stock <= item.minimum_stock;
      const isExpired = item.expiry_date ? new Date(item.expiry_date) <= new Date() : false;
      const isExpiringSoon = item.expiry_date ? 
        new Date(item.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : false;
      
      switch (stockFilter) {
        case 'low':
          matchesStock = isLowStock;
          break;
        case 'normal':
          matchesStock = !isLowStock && !isExpired && !isExpiringSoon;
          break;
        case 'expired':
          matchesStock = isExpired || isExpiringSoon;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (item: InventoryItem) => {
    const isLowStock = item.current_stock <= item.minimum_stock;
    const isExpired = item.expiry_date ? new Date(item.expiry_date) <= new Date() : false;
    const isExpiringSoon = item.expiry_date ? 
      new Date(item.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : false;
    
    if (isExpired) {
      return { status: 'expired', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle };
    } else if (isExpiringSoon) {
      return { status: 'expiring soon', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertTriangle };
    } else if (isLowStock) {
      return { status: 'low stock', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: TrendingDown };
    } else {
      return { status: 'normal', color: 'text-green-600 bg-green-50 border-green-200', icon: TrendingUp };
    }
  };

  const getTotalValue = () => {
    return inventoryItems.reduce((total, item) => total + (item.current_stock * item.cost_per_unit), 0);
  };

  const getLowStockCount = () => {
    return inventoryItems.filter(item => item.current_stock <= item.minimum_stock).length;
  };

  const getExpiringCount = () => {
    return inventoryItems.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return expiryDate <= thirtyDaysFromNow;
    }).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Track and manage laboratory supplies and chemicals</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${getTotalValue().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{getLowStockCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{getExpiringCount()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'low' | 'normal' | 'expired' | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
              <option value="expired">Expired/Expiring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const statusInfo = getStockStatus(item);
                const StatusIcon = statusInfo.icon;
                const supplier = suppliers[item.supplier_id as keyof typeof suppliers];
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.current_stock} {item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minimum_stock} {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${(item.current_stock * item.cost_per_unit).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.cost_per_unit}/{item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.location}</div>
                      <div className="text-sm text-gray-500">{supplier?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.expiry_date ? (
                        <div className="text-sm text-gray-900">
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-green-600 hover:text-green-900">Restock</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
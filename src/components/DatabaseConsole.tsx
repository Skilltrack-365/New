import React, { useState } from 'react';
import { Database, Play, Save, Download, RefreshCw, Table, BarChart3 } from 'lucide-react';

interface DatabaseConsoleProps {
  sessionId: string;
}

const DatabaseConsole: React.FC<DatabaseConsoleProps> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState('query');
  const [query, setQuery] = useState(`-- Welcome to the Database Console
-- Connected to PostgreSQL 13.7

SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;`);
  
  const [queryHistory, setQueryHistory] = useState([
    'SELECT * FROM users LIMIT 10;',
    'SHOW TABLES;',
    'SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL 7 DAY;'
  ]);

  const [results, setResults] = useState({
    columns: ['table_name', 'table_type'],
    rows: [
      ['users', 'BASE TABLE'],
      ['products', 'BASE TABLE'],
      ['orders', 'BASE TABLE'],
      ['categories', 'BASE TABLE'],
      ['order_items', 'BASE TABLE']
    ],
    rowCount: 5,
    executionTime: '23ms'
  });

  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = () => {
    setIsExecuting(true);
    
    // Add to history
    if (query.trim() && !queryHistory.includes(query.trim())) {
      setQueryHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
    }
    
    // Simulate query execution
    setTimeout(() => {
      // Mock different results based on query content
      if (query.toLowerCase().includes('select * from users')) {
        setResults({
          columns: ['id', 'name', 'email', 'created_at'],
          rows: [
            ['1', 'John Doe', 'john@example.com', '2024-01-15 10:30:00'],
            ['2', 'Jane Smith', 'jane@example.com', '2024-01-14 15:45:00'],
            ['3', 'Bob Johnson', 'bob@example.com', '2024-01-13 09:20:00']
          ],
          rowCount: 3,
          executionTime: '15ms'
        });
      } else if (query.toLowerCase().includes('count')) {
        setResults({
          columns: ['count'],
          rows: [['42']],
          rowCount: 1,
          executionTime: '8ms'
        });
      } else {
        setResults({
          columns: ['status'],
          rows: [['Query executed successfully']],
          rowCount: 1,
          executionTime: '12ms'
        });
      }
      setIsExecuting(false);
    }, 1000);
  };

  const saveQuery = () => {
    const blob = new Blob([query], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportResults = () => {
    const csv = [
      results.columns.join(','),
      ...results.rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'query', name: 'Query Editor', icon: Database },
    { id: 'tables', name: 'Tables', icon: Table },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'query':
        return (
          <div className="flex flex-col h-full">
            {/* Query Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <h4 className="font-medium text-gray-900">SQL Query Editor</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={saveQuery}
                    className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={isExecuting}
                    className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </button>
                </div>
              </div>
              
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-green-400"
                style={{ 
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  lineHeight: '1.5'
                }}
                placeholder="Enter your SQL query here..."
              />
            </div>

            {/* Results */}
            <div className="h-48 border-t border-gray-200">
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <h4 className="font-medium text-gray-900">Results</h4>
                  <span className="text-sm text-gray-600">
                    {results.rowCount} rows • {results.executionTime}
                  </span>
                </div>
                <button
                  onClick={exportResults}
                  className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export CSV
                </button>
              </div>
              
              <div className="overflow-auto h-full">
                {isExecuting ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                    <span className="text-gray-600">Executing query...</span>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {results.columns.map((column, index) => (
                          <th key={index} className="text-left p-2 font-medium text-gray-700 border-b">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-2 border-b border-gray-100">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        );

      case 'tables':
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {['users', 'products', 'orders', 'categories', 'order_items'].map((table) => (
                <div key={table} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{table}</h4>
                    <Table className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {table === 'users' && 'User account information'}
                    {table === 'products' && 'Product catalog data'}
                    {table === 'orders' && 'Customer order records'}
                    {table === 'categories' && 'Product categories'}
                    {table === 'order_items' && 'Individual order line items'}
                  </p>
                  <button
                    onClick={() => {
                      setQuery(`SELECT * FROM ${table} LIMIT 10;`);
                      setActiveTab('query');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Data →
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Total Users</h4>
                <div className="text-3xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-blue-700">+12% from last month</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Total Orders</h4>
                <div className="text-3xl font-bold text-green-600">3,891</div>
                <div className="text-sm text-green-700">+8% from last month</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Products</h4>
                <div className="text-3xl font-bold text-purple-600">156</div>
                <div className="text-sm text-purple-700">+3 new this week</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Revenue</h4>
                <div className="text-3xl font-bold text-orange-600">$45,231</div>
                <div className="text-sm text-orange-700">+15% from last month</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">New user registration</span>
                  <span className="text-xs text-gray-500">2 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Order #1234 completed</span>
                  <span className="text-xs text-gray-500">5 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Product "Widget Pro" updated</span>
                  <span className="text-xs text-gray-500">12 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg h-96 border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Database Console</h3>
          <div className="flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Connected to PostgreSQL
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>labdb (PostgreSQL)</option>
            <option>redis (Redis)</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Query History Sidebar */}
      {activeTab === 'query' && (
        <div className="absolute right-4 top-20 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-48 overflow-auto">
          <h5 className="font-medium text-gray-900 mb-2">Query History</h5>
          <div className="space-y-1">
            {queryHistory.map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(historyQuery)}
                className="w-full text-left p-2 text-xs text-gray-600 hover:bg-gray-50 rounded truncate"
                title={historyQuery}
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseConsole;
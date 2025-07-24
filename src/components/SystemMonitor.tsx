import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, MemoryStick, HardDrive, Network, Activity, Zap, Server } from 'lucide-react';

interface SystemMonitorProps {
  sessionId: string;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ sessionId }) => {
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 15, cores: 2, frequency: '2.4 GHz' },
    memory: { used: 1.8, total: 4.0, percentage: 45 },
    disk: { used: 5.6, total: 20, percentage: 28 },
    network: { rx: 1.2, tx: 0.8, status: 'Connected' },
    uptime: '2h 15m',
    processes: 95,
    loadAverage: [0.15, 0.10, 0.05]
  });

  const [processes] = useState([
    { pid: 1234, name: 'node', cpu: 12.5, memory: 156, user: 'user' },
    { pid: 5678, name: 'postgres', cpu: 8.2, memory: 89, user: 'postgres' },
    { pid: 9012, name: 'redis-server', cpu: 2.1, memory: 45, user: 'redis' },
    { pid: 3456, name: 'nginx', cpu: 1.8, memory: 23, user: 'www-data' },
    { pid: 7890, name: 'docker', cpu: 3.4, memory: 67, user: 'root' },
    { pid: 2345, name: 'ssh', cpu: 0.1, memory: 12, user: 'user' },
    { pid: 6789, name: 'bash', cpu: 0.2, memory: 8, user: 'user' }
  ]);

  const [networkConnections] = useState([
    { local: 'localhost:3000', remote: '*:*', state: 'LISTEN', protocol: 'TCP' },
    { local: 'localhost:5432', remote: '*:*', state: 'LISTEN', protocol: 'TCP' },
    { local: 'localhost:6379', remote: '*:*', state: 'LISTEN', protocol: 'TCP' },
    { local: '10.0.0.15:22', remote: '192.168.1.100:54321', state: 'ESTABLISHED', protocol: 'TCP' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(5, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(20, Math.min(80, prev.memory.percentage + (Math.random() - 0.5) * 5))
        },
        network: {
          ...prev.network,
          rx: Math.max(0, prev.network.rx + (Math.random() - 0.5) * 0.5),
          tx: Math.max(0, prev.network.tx + (Math.random() - 0.5) * 0.3)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (percentage: number) => {
    if (percentage < 30) return 'text-green-600';
    if (percentage < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage < 30) return 'bg-green-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg h-96 border p-6 overflow-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Monitor className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">System Monitor</h3>
        <div className="flex items-center text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Monitoring
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CPU */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cpu className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">CPU</span>
            </div>
            <span className={`text-sm font-bold ${getUsageColor(systemStats.cpu.usage)}`}>
              {systemStats.cpu.usage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getUsageBarColor(systemStats.cpu.usage)}`}
              style={{ width: `${systemStats.cpu.usage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {systemStats.cpu.cores} cores @ {systemStats.cpu.frequency}
          </div>
        </div>

        {/* Memory */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MemoryStick className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Memory</span>
            </div>
            <span className={`text-sm font-bold ${getUsageColor(systemStats.memory.percentage)}`}>
              {systemStats.memory.percentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getUsageBarColor(systemStats.memory.percentage)}`}
              style={{ width: `${systemStats.memory.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {systemStats.memory.used.toFixed(1)} / {systemStats.memory.total} GB
          </div>
        </div>

        {/* Disk */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <HardDrive className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Disk</span>
            </div>
            <span className={`text-sm font-bold ${getUsageColor(systemStats.disk.percentage)}`}>
              {systemStats.disk.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full ${getUsageBarColor(systemStats.disk.percentage)}`}
              style={{ width: `${systemStats.disk.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {systemStats.disk.used} / {systemStats.disk.total} GB
          </div>
        </div>

        {/* Network */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Network className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Network</span>
            </div>
            <span className="text-sm font-bold text-green-600">
              {systemStats.network.status}
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>↓ {systemStats.network.rx.toFixed(1)} MB/s</div>
            <div>↑ {systemStats.network.tx.toFixed(1)} MB/s</div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Server className="w-4 h-4 mr-2" />
            System Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">{systemStats.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processes:</span>
              <span className="font-medium">{systemStats.processes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Load Average:</span>
              <span className="font-medium font-mono">
                {systemStats.loadAverage.map(load => load.toFixed(2)).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session ID:</span>
              <span className="font-medium font-mono text-xs">{sessionId}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Performance Metrics
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">CPU Temperature</span>
                <span className="font-medium">42°C</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">I/O Wait</span>
                <span className="font-medium">2.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '2.1%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Swap Usage</span>
                <span className="font-medium">0.0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-gray-400 h-1 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Top Processes
        </h4>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 font-medium text-gray-700">PID</th>
                <th className="text-left p-2 font-medium text-gray-700">Process</th>
                <th className="text-left p-2 font-medium text-gray-700">CPU %</th>
                <th className="text-left p-2 font-medium text-gray-700">Memory (MB)</th>
                <th className="text-left p-2 font-medium text-gray-700">User</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.pid} className="border-t border-gray-200">
                  <td className="p-2 font-mono">{process.pid}</td>
                  <td className="p-2 font-medium">{process.name}</td>
                  <td className="p-2">
                    <span className={getUsageColor(process.cpu)}>
                      {process.cpu.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-2">{process.memory}</td>
                  <td className="p-2 text-gray-600">{process.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Connections */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Network className="w-4 h-4 mr-2" />
          Network Connections
        </h4>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 font-medium text-gray-700">Protocol</th>
                <th className="text-left p-2 font-medium text-gray-700">Local Address</th>
                <th className="text-left p-2 font-medium text-gray-700">Remote Address</th>
                <th className="text-left p-2 font-medium text-gray-700">State</th>
              </tr>
            </thead>
            <tbody>
              {networkConnections.map((conn, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-2">{conn.protocol}</td>
                  <td className="p-2 font-mono text-xs">{conn.local}</td>
                  <td className="p-2 font-mono text-xs">{conn.remote}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conn.state === 'LISTEN' ? 'bg-blue-100 text-blue-800' :
                      conn.state === 'ESTABLISHED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conn.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
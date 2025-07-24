import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Download, RefreshCw, Settings, Maximize2, Minimize2, Power, Wifi, HardDrive, Cpu, MemoryStick } from 'lucide-react';

interface CloudTerminalProps {
  labId: string;
  sessionId: string;
  timeRemaining: number;
  onSessionEnd: () => void;
  environment?: 'ubuntu' | 'centos' | 'alpine' | 'debian';
}

const CloudTerminal: React.FC<CloudTerminalProps> = ({ 
  labId, 
  sessionId, 
  timeRemaining, 
  onSessionEnd,
  environment = 'ubuntu'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    `Welcome to ${environment.charAt(0).toUpperCase() + environment.slice(1)} Cloud Sandbox`,
    'Session ID: ' + sessionId,
    'Lab Environment: ' + labId,
    'Type "help" for available commands',
    ''
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // System stats
  const [systemStats, setSystemStats] = useState({
    cpu: 15,
    memory: 42,
    disk: 28,
    network: 'Connected'
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 5)),
        disk: prev.disk,
        network: isConnected ? 'Connected' : 'Disconnected'
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const getPrompt = () => {
    const user = 'user';
    const hostname = 'cloud-lab';
    const path = currentPath.replace('/home/user', '~');
    return `${user}@${hostname}:${path}$`;
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    const newHistory = [...terminalHistory, `${getPrompt()} ${trimmedCommand}`];
    
    // Parse command and arguments
    const [cmd, ...args] = trimmedCommand.split(' ');
    
    // Simulate command responses
    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push('Available commands:');
        newHistory.push('  ls [-la]       - List files and directories');
        newHistory.push('  cd <dir>       - Change directory');
        newHistory.push('  pwd            - Print working directory');
        newHistory.push('  cat <file>     - Display file contents');
        newHistory.push('  mkdir <dir>    - Create directory');
        newHistory.push('  touch <file>   - Create empty file');
        newHistory.push('  rm <file>      - Remove file');
        newHistory.push('  whoami         - Display current user');
        newHistory.push('  date           - Show current date and time');
        newHistory.push('  clear          - Clear terminal screen');
        newHistory.push('  ps aux         - List running processes');
        newHistory.push('  top            - Display running processes');
        newHistory.push('  df -h          - Show disk usage');
        newHistory.push('  free -h        - Show memory usage');
        newHistory.push('  uname -a       - System information');
        newHistory.push('  docker ps      - List Docker containers');
        newHistory.push('  kubectl get pods - List Kubernetes pods');
        newHistory.push('  python3        - Start Python interpreter');
        newHistory.push('  node           - Start Node.js REPL');
        newHistory.push('  vim <file>     - Edit file with Vim');
        newHistory.push('  nano <file>    - Edit file with Nano');
        break;
        
      case 'ls':
        if (args.includes('-la') || args.includes('-l')) {
          newHistory.push('total 24');
          newHistory.push('drwxr-xr-x 5 user user 4096 Dec 15 10:30 .');
          newHistory.push('drwxr-xr-x 3 root root 4096 Dec 15 10:00 ..');
          newHistory.push('-rw-r--r-- 1 user user  220 Dec 15 10:00 .bash_logout');
          newHistory.push('-rw-r--r-- 1 user user 3771 Dec 15 10:00 .bashrc');
          newHistory.push('-rw-r--r-- 1 user user  807 Dec 15 10:00 .profile');
          newHistory.push('drwxr-xr-x 2 user user 4096 Dec 15 10:30 projects');
          newHistory.push('drwxr-xr-x 2 user user 4096 Dec 15 10:30 scripts');
          newHistory.push('-rw-r--r-- 1 user user  156 Dec 15 10:30 README.md');
        } else {
          newHistory.push('projects  scripts  README.md');
        }
        break;
        
      case 'pwd':
        newHistory.push(currentPath);
        break;
        
      case 'cd':
        if (args.length === 0 || args[0] === '~') {
          setCurrentPath('/home/user');
        } else if (args[0] === '..') {
          const pathParts = currentPath.split('/').filter(p => p);
          pathParts.pop();
          setCurrentPath('/' + pathParts.join('/') || '/');
        } else if (args[0].startsWith('/')) {
          setCurrentPath(args[0]);
        } else {
          setCurrentPath(currentPath + '/' + args[0]);
        }
        break;
        
      case 'whoami':
        newHistory.push('user');
        break;
        
      case 'date':
        newHistory.push(new Date().toString());
        break;
        
      case 'clear':
        setTerminalHistory(['']);
        return;
        
      case 'uname':
        if (args.includes('-a')) {
          newHistory.push(`Linux cloud-lab 5.15.0-generic #72-Ubuntu SMP Tue Nov 23 20:14:38 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux`);
        } else {
          newHistory.push('Linux');
        }
        break;
        
      case 'ps':
        newHistory.push('  PID TTY          TIME CMD');
        newHistory.push(' 1234 pts/0    00:00:00 bash');
        newHistory.push(' 5678 pts/0    00:00:00 ps');
        break;
        
      case 'top':
        newHistory.push('top - 10:30:45 up 2:15, 1 user, load average: 0.15, 0.10, 0.05');
        newHistory.push('Tasks: 95 total, 1 running, 94 sleeping, 0 stopped, 0 zombie');
        newHistory.push('%Cpu(s): 15.2 us, 2.1 sy, 0.0 ni, 82.5 id, 0.2 wa, 0.0 hi, 0.0 si, 0.0 st');
        newHistory.push('MiB Mem : 2048.0 total, 1186.4 free, 861.6 used, 0.0 buff/cache');
        newHistory.push('');
        newHistory.push('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
        newHistory.push(' 1234 user      20   0   21.5m   4.2m   3.1m S   1.3   0.2   0:00.45 bash');
        break;
        
      case 'df':
        if (args.includes('-h')) {
          newHistory.push('Filesystem      Size  Used Avail Use% Mounted on');
          newHistory.push('/dev/sda1        20G  5.6G   13G  28% /');
          newHistory.push('tmpfs           1.0G     0  1.0G   0% /dev/shm');
          newHistory.push('/dev/sda2       100G   45G   50G  48% /home');
        }
        break;
        
      case 'free':
        if (args.includes('-h')) {
          newHistory.push('               total        used        free      shared  buff/cache   available');
          newHistory.push('Mem:           2.0Gi       861Mi       1.2Gi       0.0Ki       0.0Ki       1.2Gi');
          newHistory.push('Swap:          2.0Gi       0.0Ki       2.0Gi');
        }
        break;
        
      case 'docker':
        if (args[0] === 'ps') {
          newHistory.push('CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                    NAMES');
          newHistory.push('abc123def456   nginx:latest   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:80->80/tcp      web-server');
          newHistory.push('def456ghi789   redis:alpine   "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes   6379/tcp                redis-cache');
        } else {
          newHistory.push('Docker version 20.10.21, build baeda1f');
        }
        break;
        
      case 'kubectl':
        if (args[0] === 'get' && args[1] === 'pods') {
          newHistory.push('NAME                     READY   STATUS    RESTARTS   AGE');
          newHistory.push('frontend-deployment-1    1/1     Running   0          5m');
          newHistory.push('backend-deployment-2     1/1     Running   0          5m');
          newHistory.push('database-deployment-3    1/1     Running   0          10m');
        }
        break;
        
      case 'python3':
        newHistory.push('Python 3.9.2 (default, Feb 28 2021, 17:03:44)');
        newHistory.push('[GCC 10.2.1 20210110] on linux');
        newHistory.push('Type "help", "copyright", "credits" or "license" for more information.');
        newHistory.push('>>> # Type exit() to return to shell');
        break;
        
      case 'node':
        newHistory.push('Welcome to Node.js v16.14.0.');
        newHistory.push('Type ".help" for more information.');
        newHistory.push('> // Type .exit to return to shell');
        break;
        
      case 'cat':
        if (args[0] === 'README.md') {
          newHistory.push('# Cloud Lab Environment');
          newHistory.push('');
          newHistory.push('Welcome to your cloud sandbox! This environment includes:');
          newHistory.push('- Ubuntu 20.04 LTS');
          newHistory.push('- Docker & Kubernetes tools');
          newHistory.push('- Python 3.9 & Node.js 16');
          newHistory.push('- Development tools and editors');
        } else if (args[0]) {
          newHistory.push(`cat: ${args[0]}: No such file or directory`);
        } else {
          newHistory.push('cat: missing file operand');
        }
        break;
        
      case 'mkdir':
        if (args[0]) {
          newHistory.push(`Directory '${args[0]}' created`);
        } else {
          newHistory.push('mkdir: missing operand');
        }
        break;
        
      case 'touch':
        if (args[0]) {
          newHistory.push(`File '${args[0]}' created`);
        } else {
          newHistory.push('touch: missing file operand');
        }
        break;
        
      case 'vim':
      case 'nano':
        if (args[0]) {
          newHistory.push(`Opening ${args[0]} in ${cmd}... (simulated)`);
          newHistory.push('Press Ctrl+C to exit editor simulation');
        } else {
          newHistory.push(`${cmd}: missing file operand`);
        }
        break;
        
      default:
        if (trimmedCommand) {
          newHistory.push(`bash: ${cmd}: command not found`);
          newHistory.push('Type "help" to see available commands');
        }
    }
    
    newHistory.push('');
    setTerminalHistory(newHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for common commands
      const commonCommands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'docker', 'kubectl', 'python3', 'node'];
      const matches = commonCommands.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setCurrentInput(matches[0] + ' ');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onSessionEnd();
    }
  }, [timeRemaining, onSessionEnd]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const copyToClipboard = () => {
    const terminalContent = terminalHistory.join('\n');
    navigator.clipboard.writeText(terminalContent);
  };

  const downloadSession = () => {
    const terminalContent = terminalHistory.join('\n');
    const blob = new Blob([terminalContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-session-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restartEnvironment = () => {
    setTerminalHistory([
      'Restarting environment...',
      'Environment restarted successfully!',
      `Welcome to ${environment.charAt(0).toUpperCase() + environment.slice(1)} Cloud Sandbox`,
      'Session ID: ' + sessionId,
      ''
    ]);
    setCurrentPath('/home/user');
  };

  return (
    <div className={`bg-gray-900 text-green-400 font-mono text-sm ${
      isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-xs">
            {environment.charAt(0).toUpperCase() + environment.slice(1)} Terminal - {sessionId}
          </span>
          <div className={`flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            <Wifi className="w-3 h-3 mr-1" />
            {systemStats.network}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* System Stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <div className="flex items-center">
              <Cpu className="w-3 h-3 mr-1" />
              <span>{systemStats.cpu.toFixed(0)}%</span>
            </div>
            <div className="flex items-center">
              <MemoryStick className="w-3 h-3 mr-1" />
              <span>{systemStats.memory.toFixed(0)}%</span>
            </div>
            <div className="flex items-center">
              <HardDrive className="w-3 h-3 mr-1" />
              <span>{systemStats.disk}%</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-300">
            Time: {formatTime(timeRemaining)}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white p-1 rounded"
              title="Copy terminal content"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={downloadSession}
              className="text-gray-400 hover:text-white p-1 rounded"
              title="Download session"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={restartEnvironment}
              className="text-gray-400 hover:text-white p-1 rounded"
              title="Restart environment"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className="text-gray-400 hover:text-white p-1 rounded"
              title="Toggle connection"
            >
              <Power className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white p-1 rounded">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white p-1 rounded"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        onClick={handleTerminalClick}
        className={`p-4 overflow-y-auto cursor-text ${isFullscreen ? 'h-screen' : 'h-96'}`}
        style={{ backgroundColor: '#0d1117' }}
      >
        {terminalHistory.map((line, index) => (
          <div key={index} className="mb-1 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-blue-400">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="ml-2 bg-transparent border-none outline-none flex-1 text-green-400"
            autoFocus
            disabled={!isConnected}
          />
          <span className="bg-green-400 w-2 h-4 animate-pulse ml-1"></span>
        </div>
      </div>
    </div>
  );
};

export default CloudTerminal;
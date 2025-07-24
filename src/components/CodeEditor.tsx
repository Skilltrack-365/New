import React, { useState } from 'react';
import { Code, Save, Play, Download, Upload, FolderOpen, File, Plus, Trash2, Edit3 } from 'lucide-react';

interface CodeEditorProps {
  sessionId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ sessionId }) => {
  const [activeFile, setActiveFile] = useState('app.js');
  const [files, setFiles] = useState({
    'app.js': `// Welcome to the Cloud Code Editor
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Cloud Lab!',
    session: '${sessionId}',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`,
    'package.json': `{
  "name": "cloud-lab-app",
  "version": "1.0.0",
  "description": "Cloud Lab Application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.3.1"
  }
}`,
    'README.md': `# Cloud Lab Project

This is a sample Node.js application running in the cloud lab environment.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser and navigate to http://localhost:3000

## Features

- Express.js web server
- Hot reload with nodemon
- Environment variables support
- Testing with Jest

## Lab Environment

Session ID: ${sessionId}
Environment: Ubuntu 20.04 LTS
Node.js: v16.14.0
npm: v8.3.1
`,
    'docker-compose.yml': `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: labdb
      POSTGRES_USER: labuser
      POSTGRES_PASSWORD: labpass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`
  });

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const fileExtensions = {
    'js': 'javascript',
    'json': 'json',
    'md': 'markdown',
    'yml': 'yaml',
    'yaml': 'yaml',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'ts': 'typescript',
    'tsx': 'typescript'
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'ts':
      case 'tsx':
        return '🟨';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'yml':
      case 'yaml':
        return '⚙️';
      case 'py':
        return '🐍';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      default:
        return '📄';
    }
  };

  const handleFileChange = (filename: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content
    }));
  };

  const createNewFile = () => {
    const filename = prompt('Enter filename:');
    if (filename && !files[filename]) {
      setFiles(prev => ({
        ...prev,
        [filename]: '// New file\n'
      }));
      setActiveFile(filename);
    }
  };

  const deleteFile = (filename: string) => {
    if (confirm(`Delete ${filename}?`)) {
      const newFiles = { ...files };
      delete newFiles[filename];
      setFiles(newFiles);
      
      if (activeFile === filename) {
        const remainingFiles = Object.keys(newFiles);
        setActiveFile(remainingFiles[0] || '');
      }
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('Starting application...\n');
    
    // Simulate running the code
    setTimeout(() => {
      setOutput(prev => prev + 'Installing dependencies...\n');
    }, 500);
    
    setTimeout(() => {
      setOutput(prev => prev + 'npm install completed\n');
    }, 1500);
    
    setTimeout(() => {
      setOutput(prev => prev + 'Starting server...\n');
    }, 2000);
    
    setTimeout(() => {
      setOutput(prev => prev + 'Server running at http://localhost:3000\n');
      setOutput(prev => prev + 'Application ready! 🚀\n');
      setIsRunning(false);
    }, 3000);
  };

  const saveFile = () => {
    // Simulate saving
    alert(`Saved ${activeFile} successfully!`);
  };

  const downloadFile = () => {
    const content = files[activeFile];
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg h-96 border flex">
      {/* File Explorer */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Files</h3>
            <button
              onClick={createNewFile}
              className="p-1 hover:bg-gray-200 rounded"
              title="New file"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-2">
          {Object.keys(files).map((filename) => (
            <div
              key={filename}
              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                activeFile === filename ? 'bg-blue-50 border border-blue-200' : ''
              }`}
              onClick={() => setActiveFile(filename)}
            >
              <div className="flex items-center">
                <span className="mr-2">{getFileIcon(filename)}</span>
                <span className="text-sm text-gray-700">{filename}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(filename);
                }}
                className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100"
                title="Delete file"
              >
                <Trash2 className="w-3 h-3 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{activeFile}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveFile}
              className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm"
            >
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={downloadFile}
              className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex">
          <div className="flex-1">
            <textarea
              value={files[activeFile] || ''}
              onChange={(e) => handleFileChange(activeFile, e.target.value)}
              className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-green-400"
              style={{ 
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                lineHeight: '1.5'
              }}
              placeholder="Start coding..."
            />
          </div>
          
          {/* Output Panel */}
          {output && (
            <div className="w-80 border-l border-gray-200 bg-gray-900 text-green-400 font-mono text-sm">
              <div className="p-3 border-b border-gray-700 bg-gray-800">
                <h4 className="text-sm font-semibold text-white">Output</h4>
              </div>
              <div className="p-4 h-full overflow-auto">
                <pre className="whitespace-pre-wrap">{output}</pre>
                {isRunning && (
                  <div className="flex items-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                    <span>Running...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
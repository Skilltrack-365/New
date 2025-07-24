import React, { useState } from 'react';
import { FileText, Folder, Download, Upload, Trash2, Edit, Plus, Search, Grid, List } from 'lucide-react';

interface FileManagerProps {
  sessionId: string;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  permissions: string;
}

const FileManager: React.FC<FileManagerProps> = ({ sessionId }) => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [files] = useState<FileItem[]>([
    { name: '..', type: 'folder', modified: '', permissions: 'drwxr-xr-x' },
    { name: 'projects', type: 'folder', modified: '2024-01-15 10:30', permissions: 'drwxr-xr-x' },
    { name: 'scripts', type: 'folder', modified: '2024-01-15 10:25', permissions: 'drwxr-xr-x' },
    { name: 'documents', type: 'folder', modified: '2024-01-14 16:45', permissions: 'drwxr-xr-x' },
    { name: 'downloads', type: 'folder', modified: '2024-01-14 14:20', permissions: 'drwxr-xr-x' },
    { name: 'app.js', type: 'file', size: '2.1 KB', modified: '2024-01-15 11:15', permissions: '-rw-r--r--' },
    { name: 'package.json', type: 'file', size: '1.3 KB', modified: '2024-01-15 10:45', permissions: '-rw-r--r--' },
    { name: 'README.md', type: 'file', size: '856 B', modified: '2024-01-15 10:30', permissions: '-rw-r--r--' },
    { name: 'docker-compose.yml', type: 'file', size: '1.8 KB', modified: '2024-01-15 09:20', permissions: '-rw-r--r--' },
    { name: '.env', type: 'file', size: '245 B', modified: '2024-01-14 18:30', permissions: '-rw-------' },
    { name: '.gitignore', type: 'file', size: '1.1 KB', modified: '2024-01-14 16:15', permissions: '-rw-r--r--' },
    { name: 'config.json', type: 'file', size: '512 B', modified: '2024-01-14 15:45', permissions: '-rw-r--r--' }
  ]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-600" />;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'ts':
        return <div className="w-5 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">JS</div>;
      case 'json':
        return <div className="w-5 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">JSON</div>;
      case 'md':
        return <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">MD</div>;
      case 'yml':
      case 'yaml':
        return <div className="w-5 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">YML</div>;
      case 'env':
        return <div className="w-5 h-5 bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">ENV</div>;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleItemSelect = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      if (file.name === '..') {
        const pathParts = currentPath.split('/').filter(p => p);
        pathParts.pop();
        setCurrentPath('/' + pathParts.join('/') || '/');
      } else {
        setCurrentPath(currentPath + '/' + file.name);
      }
    } else {
      // Open file in editor
      alert(`Opening ${file.name} in editor...`);
    }
  };

  const createNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      alert(`Created folder: ${name}`);
    }
  };

  const createNewFile = () => {
    const name = prompt('Enter file name:');
    if (name) {
      alert(`Created file: ${name}`);
    }
  };

  const deleteSelected = () => {
    if (selectedItems.length > 0 && confirm(`Delete ${selectedItems.length} item(s)?`)) {
      alert(`Deleted: ${selectedItems.join(', ')}`);
      setSelectedItems([]);
    }
  };

  const downloadSelected = () => {
    if (selectedItems.length > 0) {
      alert(`Downloading: ${selectedItems.join(', ')}`);
    }
  };

  const uploadFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        alert(`Uploading ${files.length} file(s)...`);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white rounded-lg h-96 border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">File Manager</h3>
          <div className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
            {currentPath}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={createNewFolder}
            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Folder
          </button>
          <button
            onClick={createNewFile}
            className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New File
          </button>
          <button
            onClick={uploadFiles}
            className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </button>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
            <button
              onClick={downloadSelected}
              className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
            <button
              onClick={deleteSelected}
              className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Size</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Modified</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedItems.includes(file.name) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleItemSelect(file.name)}
                  onDoubleClick={() => handleDoubleClick(file)}
                >
                  <td className="p-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(file.name)}
                        onChange={() => handleItemSelect(file.name)}
                        className="mr-3"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {getFileIcon(file)}
                      <span className="ml-2 text-sm text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{file.size || '-'}</td>
                  <td className="p-3 text-sm text-gray-600">{file.modified}</td>
                  <td className="p-3 text-sm text-gray-600 font-mono">{file.permissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-6 gap-4 p-4">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-center ${
                  selectedItems.includes(file.name) ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => handleItemSelect(file.name)}
                onDoubleClick={() => handleDoubleClick(file)}
              >
                <div className="flex justify-center mb-2">
                  {getFileIcon(file)}
                </div>
                <div className="text-xs text-gray-900 truncate" title={file.name}>
                  {file.name}
                </div>
                {file.size && (
                  <div className="text-xs text-gray-500 mt-1">{file.size}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
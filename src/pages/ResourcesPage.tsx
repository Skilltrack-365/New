import React, { useState } from 'react';
import { FileText, Download, Eye, BookOpen, Video, FileImage, Search, Filter, Calendar } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'image' | 'link' | 'presentation';
  category: string;
  course: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize?: string;
  downloads: number;
  tags: string[];
  url?: string;
}

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock data - in real app, this would come from API
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Organic Chemistry Lab Manual',
      description: 'Comprehensive guide for organic chemistry laboratory procedures and safety protocols.',
      type: 'document',
      category: 'Lab Manuals',
      course: 'Organic Chemistry I',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-15',
      fileSize: '2.4 MB',
      downloads: 156,
      tags: ['chemistry', 'lab-manual', 'safety', 'procedures'],
    },
    {
      id: '2',
      title: 'Microscopy Techniques Video Tutorial',
      description: 'Step-by-step video guide for using different types of microscopes and sample preparation.',
      type: 'video',
      category: 'Tutorials',
      course: 'Cell Biology',
      uploadedBy: 'Prof. Michael Chen',
      uploadDate: '2024-01-18',
      fileSize: '125 MB',
      downloads: 89,
      tags: ['microscopy', 'tutorial', 'biology', 'techniques'],
    },
    {
      id: '3',
      title: 'Circuit Diagram Templates',
      description: 'Collection of standard circuit diagrams and symbols for electronics lab work.',
      type: 'image',
      category: 'Templates',
      course: 'Electronics Fundamentals',
      uploadedBy: 'Dr. Emily Rodriguez',
      uploadDate: '2024-01-20',
      fileSize: '5.2 MB',
      downloads: 67,
      tags: ['electronics', 'circuits', 'templates', 'diagrams'],
    },
    {
      id: '4',
      title: 'Protein Structure Database',
      description: 'External link to comprehensive protein structure database for biochemistry research.',
      type: 'link',
      category: 'External Resources',
      course: 'Biochemistry',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-22',
      downloads: 34,
      tags: ['biochemistry', 'proteins', 'database', 'research'],
      url: 'https://www.rcsb.org/',
    },
    {
      id: '5',
      title: 'Lab Safety Presentation',
      description: 'Essential safety guidelines and emergency procedures for all laboratory work.',
      type: 'presentation',
      category: 'Safety',
      course: 'General Lab Safety',
      uploadedBy: 'Safety Officer',
      uploadDate: '2024-01-10',
      fileSize: '8.7 MB',
      downloads: 234,
      tags: ['safety', 'emergency', 'guidelines', 'mandatory'],
    },
    {
      id: '6',
      title: 'Spectroscopy Data Analysis Guide',
      description: 'Guide for analyzing and interpreting spectroscopy data with software tools.',
      type: 'document',
      category: 'Analysis Guides',
      course: 'Analytical Chemistry',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-25',
      fileSize: '1.8 MB',
      downloads: 45,
      tags: ['spectroscopy', 'analysis', 'data', 'software'],
    },
  ];

  const categories = Array.from(new Set(resources.map(r => r.category)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'image':
        return <FileImage className="h-5 w-5" />;
      case 'presentation':
        return <BookOpen className="h-5 w-5" />;
      case 'link':
        return <Eye className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-blue-600 bg-blue-100';
      case 'video':
        return 'text-red-600 bg-red-100';
      case 'image':
        return 'text-green-600 bg-green-100';
      case 'presentation':
        return 'text-purple-600 bg-purple-100';
      case 'link':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownload = (resource: Resource) => {
    // In real app, this would handle file download
    console.log('Downloading resource:', resource.id);
    alert(`Downloading ${resource.title}...`);
  };

  const handleView = (resource: Resource) => {
    // In real app, this would open the resource
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      console.log('Viewing resource:', resource.id);
      alert(`Opening ${resource.title}...`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-gray-600 mt-2">Access course materials, tutorials, and reference documents</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <span className="text-xs text-gray-500">{resource.course}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                    +{resource.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Meta Information */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(resource.uploadDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Uploaded by:</span> {resource.uploadedBy}
                </div>
                {resource.fileSize && (
                  <div>
                    <span className="font-medium">Size:</span> {resource.fileSize}
                  </div>
                )}
                <div>
                  <span className="font-medium">Downloads:</span> {resource.downloads}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 capitalize">
                  {resource.category}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(resource)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </button>
                  {resource.type !== 'link' && (
                    <button
                      onClick={() => handleDownload(resource)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Quick Access Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-900">Lab Manuals</h3>
            </div>
            <p className="text-sm text-red-700">
              {resources.filter(r => r.category === 'Lab Manuals').length} manuals available
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Video className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-900">Video Tutorials</h3>
            </div>
            <p className="text-sm text-blue-700">
              {resources.filter(r => r.type === 'video').length} videos available
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-yellow-900">Safety Resources</h3>
            </div>
            <p className="text-sm text-yellow-700">
              {resources.filter(r => r.category === 'Safety').length} safety guides
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FileImage className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-900">Templates</h3>
            </div>
            <p className="text-sm text-green-700">
              {resources.filter(r => r.category === 'Templates').length} templates available
            </p>
          </div>
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Downloaded</h2>
        <div className="space-y-3">
          {resources
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, 5)
            .map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-1 rounded ${getTypeColor(resource.type)} mr-3`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                    <p className="text-xs text-gray-600">{resource.course}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {resource.downloads} downloads
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
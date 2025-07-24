import React from 'react';

interface PlaygroundCardProps {
  title: string;
  desc: string;
  onStart?: () => void;
  icon?: React.ReactNode;
}

const PlaygroundCard: React.FC<PlaygroundCardProps> = ({ title, desc, onStart, icon }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
      {icon || <span className="text-2xl font-bold text-white">{title[0]}</span>}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 text-center line-clamp-2">{desc}</p>
    <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full" onClick={onStart}>
      Start {title.replace('Sandbox','')}
    </button>
  </div>
);

export default PlaygroundCard; 
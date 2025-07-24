import React from 'react';

interface BenefitBlockProps {
  title: string;
  desc: string;
}

const BenefitBlock: React.FC<BenefitBlockProps> = ({ title, desc }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
    <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default BenefitBlock; 
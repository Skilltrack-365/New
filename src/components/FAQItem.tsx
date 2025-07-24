import React from 'react';

interface FAQItemProps {
  q: string;
  a: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ q, a }) => (
  <details className="bg-white rounded-lg shadow p-4">
    <summary className="font-semibold text-blue-700 cursor-pointer">{q}</summary>
    <p className="text-gray-600 mt-2 text-sm">{a}</p>
  </details>
);

export default FAQItem; 
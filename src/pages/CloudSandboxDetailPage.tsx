import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sandboxDetails: Record<string, { title: string; desc: string }> = {
  'aws-genai': { title: 'AWS Gen AI Sandbox', desc: 'Experiment with AWS Gen AI tools in a safe, isolated environment.' },
  'aws': { title: 'AWS Sandbox', desc: 'Access a full-featured AWS sandbox for hands-on learning.' },
  'gcp': { title: 'GCP Sandbox', desc: 'Explore Google Cloud Platform with instant access.' },
  'azure': { title: 'Azure Sandbox', desc: 'Try out Microsoft Azure services in a secure sandbox.' },
  'hyperv': { title: 'Microsoft Hyper-V Sandbox', desc: 'Virtualize and test with Hyper-V environments.' },
  'powerbi': { title: 'Power BI Sandbox', desc: 'Analyze and visualize data with Power BI.' },
  'code': { title: 'Code Sandbox', desc: 'Write and run code in a multi-language playground.' },
  'jupyter': { title: 'Jupyter Sandbox', desc: 'Run Python notebooks and data science experiments.' },
};

const CloudSandboxDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const details = slug ? sandboxDetails[slug] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        {details ? (
          <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">{details.title}</h1>
            <p className="text-gray-700 mb-8">{details.desc}</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={() => navigate(-1)}
            >
              Back to Cloud Sandbox
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">Sandbox not found.</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CloudSandboxDetailPage; 
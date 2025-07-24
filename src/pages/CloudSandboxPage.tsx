import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

// Placeholder for navigation links
const navLinks = [
  { label: 'Library', href: '#' },
  { label: 'Platform', href: '#' },
  { label: 'Subscription', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Company Home', href: '#' },
];

// Placeholder for playgrounds
const playgrounds = [
  { slug: 'aws-genai', title: 'AWS Gen AI Sandbox', desc: 'Experiment with AWS Gen AI tools in a safe, isolated environment.' },
  { slug: 'aws', title: 'AWS Sandbox', desc: 'Access a full-featured AWS sandbox for hands-on learning.' },
  { slug: 'gcp', title: 'GCP Sandbox', desc: 'Explore Google Cloud Platform with instant access.' },
  { slug: 'azure', title: 'Azure Sandbox', desc: 'Try out Microsoft Azure services in a secure sandbox.' },
  { slug: 'hyperv', title: 'Microsoft Hyper-V Sandbox', desc: 'Virtualize and test with Hyper-V environments.' },
  { slug: 'powerbi', title: 'Power BI Sandbox', desc: 'Analyze and visualize data with Power BI.' },
  { slug: 'code', title: 'Code Sandbox', desc: 'Write and run code in a multi-language playground.' },
  { slug: 'jupyter', title: 'Jupyter Sandbox', desc: 'Run Python notebooks and data science experiments.' },
];

// Placeholder for benefits
const benefits = [
  { title: 'Zero Environment Setup', desc: 'Instant access, no credit card required.' },
  { title: 'Test your Ideas & Innovations', desc: 'Safely try new things without risk.' },
  { title: 'Secure Environment', desc: 'Each sandbox is isolated and protected.' },
  { title: 'Zero Infrastructure Cost', desc: 'No hidden charges, no surprise bills.' },
  { title: 'Automated Deletion', desc: 'Sandboxes are cleaned up automatically.' },
  { title: 'Product Support', desc: 'Get help when you need it.' },
  { title: 'User-Friendly UI', desc: 'Simple, modern, and easy to use.' },
];

// Placeholder for FAQs
const faqs = [
  { q: 'What is a cloud sandbox?', a: 'A cloud sandbox is a secure, isolated environment for testing, learning, and experimentation.' },
  { q: 'How do I access a sandbox?', a: 'Click "Get Started" or "Start [Sandbox]" to launch a new environment instantly.' },
  { q: 'Are there usage limits?', a: 'Yes, each sandbox has time and resource limits to ensure fair use.' },
  { q: 'Is my data private?', a: 'Yes, your sandbox is isolated and your data is not shared.' },
  { q: 'What is the abuse policy?', a: 'Sandboxes are for learning and testing only. Abuse will result in access restrictions.' },
];

const CloudSandboxPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">{link.label}</a>
            ))}
          </div>
        </div>
      </nav>
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Skilltrack-365's Newest Playground: Cloud Sandbox</h1>
          <p className="text-xl md:text-2xl mb-8">A secure, isolated, contained environment. Explore your own ideas and change the way you learn Cloud.</p>
          <a href="#playgrounds" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg transition-colors">Get Started</a>
        </div>
      </section>
      {/* Playground Tiles/Grid */}
      <section id="playgrounds" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Choose Your Cloud Playground</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {playgrounds.map((pg, i) => (
              <div key={pg.title} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">{i+1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{pg.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center line-clamp-2">{pg.desc}</p>
                <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full" onClick={() => navigate(`/cloud-sandbox/${pg.slug}`)}>
                  Start {pg.title.replace('Sandbox','')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Key Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Use Cloud Sandbox?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map(benefit => (
              <div key={benefit.title} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ/Help Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={faq.q} className="bg-white rounded-lg shadow p-4">
                <summary className="font-semibold text-blue-700 cursor-pointer">{faq.q}</summary>
                <p className="text-gray-600 mt-2 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CloudSandboxPage; 
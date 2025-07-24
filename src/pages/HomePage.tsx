import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Assessments from '../components/Assessments';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LabsPage from './LabsPage';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      {/* Dropdown for Assessments */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="relative inline-block text-left">
          <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="assessments-menu" aria-haspopup="true" aria-expanded="true">
            Assessments
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="assessments-menu">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Exam Simulators</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Auto Evaluated Labs</a>
            </div>
          </div>
        </div>
      </div>
      <Assessments />
      {/* Dropdown for Labs */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="relative inline-block text-left">
          <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="labs-menu" aria-haspopup="true" aria-expanded="true">
            Labs
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.846a.75.75 0 01-1.02 0l-4.25-3.846a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="labs-menu">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Hands-on Labs</a>
              <a href="/cloud-sandbox" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Cloud Sandboxes</a>
            </div>
          </div>
        </div>
      </div>
      {/* Optionally, you can render LabsPage or a Labs summary section here */}
      <About />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;
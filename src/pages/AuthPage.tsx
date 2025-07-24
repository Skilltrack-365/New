import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const AuthPage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (user && profile) {
      setShowModal(false);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect based on user role
  if (user && profile) {
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
      <AuthModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        initialMode="signin"
      />
      {!showModal && (
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Skilltrack-365 Labs</h1>
          <p className="text-xl mb-8">Please sign in to continue</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
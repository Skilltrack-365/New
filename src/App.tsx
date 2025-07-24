import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import CoursePage from './pages/CoursePage';
import EnrollmentPage from './pages/EnrollmentPage';
import LabsPage from './pages/LabsPage';
import LabDetailPage from './pages/LabDetailPage';
import LabEnvironmentPage from './pages/LabEnvironmentPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import AuthPage from './pages/AuthPage';
import CloudProvidersPage from './pages/admin/CloudProvidersPage';
import AdminPage from './pages/admin/AdminPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import NotFoundPage from './pages/NotFoundPage';
import CloudSandboxPage from './pages/CloudSandboxPage';
import CloudSandboxDetailPage from './pages/CloudSandboxDetailPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cloud-sandbox" element={<CloudSandboxPage />} />
          <Route path="/cloud-sandbox/:slug" element={<CloudSandboxDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/services/:serviceId" element={<ServicePage />} />
          <Route path="/course/:serviceId/:courseId" element={<CoursePage />} />
          <Route path="/enroll/:serviceId/:courseId" element={<EnrollmentPage />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/labs/:labId" element={<LabDetailPage />} />
          <Route path="/labs/:labId/environment" element={<LabEnvironmentPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessment/:instanceId" element={<AssessmentPage />} />
          <Route path="/assessment/:instanceId/results" element={<AssessmentResultsPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/services" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminServicesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cloud-providers" 
            element={
              <ProtectedRoute requireAdmin>
                <CloudProvidersPage />
              </ProtectedRoute>
            } 
          />
          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple/20 border-t-brand-purple animate-spin"></div>
        <p className="mt-4 text-xs text-dark-muted font-medium tracking-widest uppercase">Checking session...</p>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render child auth routes
  return <Outlet />;
};

export default GuestRoute;

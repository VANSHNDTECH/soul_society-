import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { isProfileComplete } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireCompleteProfile = true,
}) => {
  const { authSession } = useApp();
  const location = useLocation();

  // 1. Enforce Authentication
  if (!authSession.isAuthenticated) {
    const destination = location.pathname + location.search + location.hash;
    return <Navigate to={`/signin?redirect=${encodeURIComponent(destination)}`} replace />;
  }

  // 2. Enforce Complete Profile before accessing core product features
  if (requireCompleteProfile && !isProfileComplete(authSession.profile)) {
    const destination = location.pathname + location.search + location.hash;
    // Don't loop if user is already attempting to view profile setup
    if (!location.pathname.includes('profile-setup')) {
      return <Navigate to={`/profile-setup?redirect=${encodeURIComponent(destination)}`} replace />;
    }
  }

  return <>{children}</>;
};

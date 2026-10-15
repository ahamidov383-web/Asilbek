import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../lib/types';
import { protectRoute } from '../lib/auth-guard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session } = useAuth();
  const location = useLocation();

  // XAVFSIZLIK: Route himoyasi
  const protection = protectRoute(session, allowedRoles);

  if (!protection.allowed) {
    return <Navigate to={protection.redirect || '/login'} state={{ from: location, error: protection.error }} replace />;
  }

  return <>{children}</>;
}

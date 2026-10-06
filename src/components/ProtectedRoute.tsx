import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. Agar foydalanuvchi kirmagan bo'lsa va bu himoyalangan yo'l bo'lsa
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Agar ruxsat etilgan rollar ko'rsatilgan bo'lsa va foydalanuvchi roli mos kelmasa
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login?error=access_denied" replace />;
  }

  return <>{children}</>;
}

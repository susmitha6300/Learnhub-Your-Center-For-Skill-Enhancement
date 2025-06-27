import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasRole } from '../utils/auth';
import LoadingSkeleton from './LoadingSkeleton';
import { Alert } from 'react-bootstrap';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requireAuth = true,
  fallback = null 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return fallback || <LoadingSkeleton type="card" />;
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user && !hasRole(user, requiredRoles)) {
    return (
      <div className="container py-5">
        <Alert variant="warning">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to access this page.</p>
          <p>Required role(s): {requiredRoles.join(', ')}</p>
          <p>Your role: {user.role}</p>
        </Alert>
      </div>
    );
  }

  return children;
};

// Specific route guards
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['admin']} {...props}>
    {children}
  </ProtectedRoute>
);

export const TeacherRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['teacher', 'admin']} {...props}>
    {children}
  </ProtectedRoute>
);

export const StudentRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['student', 'teacher', 'admin']} {...props}>
    {children}
  </ProtectedRoute>
);

// Public route that redirects authenticated users
export const PublicRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSkeleton type="card" />;
  }

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard
    const dashboardRoute = user.role === 'admin' 
      ? '/dashboard/admin' 
      : user.role === 'teacher' 
        ? '/dashboard/teacher' 
        : '/dashboard/student';
    
    return <Navigate to={redirectTo === '/' ? dashboardRoute : redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

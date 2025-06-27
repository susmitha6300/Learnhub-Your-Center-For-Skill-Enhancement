import { jwtDecode } from 'jwt-decode';

// Token management
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Token validation
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const isTokenExpired = (token) => {
  return !isTokenValid(token);
};

// User data from token
export const getUserFromToken = (token) => {
  if (!token || !isTokenValid(token)) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

// Role checking
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  if (typeof requiredRoles === 'string') {
    return user.role === requiredRoles;
  }
  return requiredRoles.includes(user.role);
};

export const isAdmin = (user) => hasRole(user, 'admin');
export const isTeacher = (user) => hasRole(user, ['teacher', 'admin']);
export const isStudent = (user) => hasRole(user, ['student', 'teacher', 'admin']);

// Auto logout on token expiry
export const setupTokenExpiryCheck = (logoutCallback) => {
  const checkTokenExpiry = () => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      removeTokens();
      logoutCallback();
    }
  };

  // Check every minute
  const interval = setInterval(checkTokenExpiry, 60000);
  
  // Return cleanup function
  return () => clearInterval(interval);
};

// Generate dashboard route based on role
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'teacher':
      return '/dashboard/teacher';
    case 'student':
      return '/dashboard/student';
    default:
      return '/';
  }
};

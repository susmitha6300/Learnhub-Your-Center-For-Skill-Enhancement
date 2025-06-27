// ← App constants & config
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

export const COURSE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Business',
  'Marketing',
  'Photography'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  COURSES: {
    LIST: '/courses',
    CREATE: '/courses',
    DETAIL: '/courses/:id',
    ENROLL: '/courses/:id/enroll',
    PROGRESS: '/courses/:id/progress'
  },
  ADMIN: {
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    STATS: '/admin/stats'
  }
};

export const THEME_COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#f56565',
  info: '#4299e1',
  light: '#f7fafc',
  dark: '#1a202c'
};

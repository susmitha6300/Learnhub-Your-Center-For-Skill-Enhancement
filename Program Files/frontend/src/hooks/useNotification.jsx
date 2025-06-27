import { useNotification as useNotificationContext, NOTIFICATION_TYPES } from '../context/NotificationContext';

// Enhanced notification hook with additional features
export const useNotification = () => {
  const context = useNotificationContext();

  // Enhanced methods with better defaults and error handling
  const notify = {
    success: (message, options = {}) => {
      const { duration = 4000, ...rest } = options;
      return context.showSuccess(message, duration, rest);
    },

    error: (message, options = {}) => {
      const { duration = 6000, ...rest } = options;
      return context.showError(message, duration, rest);
    },

    warning: (message, options = {}) => {
      const { duration = 5000, ...rest } = options;
      return context.showWarning(message, duration, rest);
    },

    info: (message, options = {}) => {
      const { duration = 4000, ...rest } = options;
      return context.showInfo(message, duration, rest);
    },

    // API response handlers
    apiSuccess: (message = 'Operation completed successfully') => {
      return notify.success(message);
    },

    apiError: (error) => {
      let message = 'An error occurred';
      
      if (typeof error === 'string') {
        message = error;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      
      return notify.error(message, { duration: 6000 });
    },

    // Loading states
    loading: (message = 'Loading...') => {
      return context.addNotification(message, NOTIFICATION_TYPES.INFO, 0); // 0 duration = permanent
    },

    // Course-specific notifications
    courseEnrolled: (courseTitle) => {
      return notify.success(`Successfully enrolled in "${courseTitle}"!`);
    },

    courseCompleted: (courseTitle) => {
      return notify.success(`Congratulations! You've completed "${courseTitle}"!`, { duration: 8000 });
    },

    progressUpdated: () => {
      return notify.info('Progress updated', { duration: 2000 });
    },

    // Auth notifications
    loginSuccess: (userName) => {
      return notify.success(`Welcome back, ${userName}!`);
    },

    logoutSuccess: () => {
      return notify.info('You have been logged out');
    },

    sessionExpired: () => {
      return notify.warning('Your session has expired. Please log in again.');
    }
  };

  return {
    ...context,
    notify
  };
};

export default useNotification;

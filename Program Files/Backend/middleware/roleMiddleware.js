const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = authorize('admin');
const requireTeacher = authorize('teacher', 'admin');
const requireStudent = authorize('student', 'teacher', 'admin');

// Check if user owns resource or is admin
const checkOwnership = (resourceField = 'user') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceId = req.params.id || req.params.userId || req.params.courseId;
    
    if (resourceField === 'user' && req.user._id.toString() === resourceId) {
      return next();
    }

    // For other resources, we'll need to fetch and check ownership
    // This will be implemented in specific controllers
    next();
  };
};

// Check if teacher owns course
const checkCourseOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // For teachers, check if they own the course
    if (req.user.role === 'teacher') {
      const Course = require('../models/Course');
      const course = await Course.findById(req.params.id || req.params.courseId);
      
      if (!course) {
        return res.status(404).json({
          status: 'error',
          message: 'Course not found'
        });
      }

      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. You can only manage your own courses'
        });
      }
    }

    next();
  } catch (_error) { /* eslint-disable-line no-unused-vars */
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

module.exports = {
  authorize,
  requireAdmin,
  requireTeacher,
  requireStudent,
  checkOwnership,
  checkCourseOwnership
};

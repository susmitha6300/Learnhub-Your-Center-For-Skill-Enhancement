const { body, param, query, validationResult } = require('express-validator');

// Custom validation helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .isLength({ min: 6, max: 128 })
      .withMessage('Password must be between 6 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
      .optional()
      .isIn(['student', 'teacher'])
      .withMessage('Role must be either student or teacher'),
    
    handleValidationErrors
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    
    handleValidationErrors
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Please provide a valid website URL'),
    
    body('location')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location cannot exceed 100 characters'),
    
    handleValidationErrors
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 6, max: 128 })
      .withMessage('New password must be between 6 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
  ]
};

// Course validation rules
const courseValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Course title must be between 5 and 100 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Course description must be between 50 and 2000 characters'),
    
    body('category')
      .isIn([
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing',
        'Photography'
      ])
      .withMessage('Please select a valid category'),
    
    body('level')
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Please select a valid level'),
    
    body('price')
      .isFloat({ min: 0, max: 9999.99 })
      .withMessage('Price must be between 0 and 9999.99'),
    
    body('requirements')
      .optional()
      .isArray()
      .withMessage('Requirements must be an array'),
    
    body('requirements.*')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Each requirement cannot exceed 200 characters'),
    
    body('whatYouWillLearn')
      .optional()
      .isArray()
      .withMessage('Learning outcomes must be an array'),
    
    body('whatYouWillLearn.*')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Each learning outcome cannot exceed 200 characters'),
    
    handleValidationErrors
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Course title must be between 5 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Course description must be between 50 and 2000 characters'),
    
    body('category')
      .optional()
      .isIn([
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing',
        'Photography'
      ])
      .withMessage('Please select a valid category'),
    
    body('level')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Please select a valid level'),
    
    body('price')
      .optional()
      .isFloat({ min: 0, max: 9999.99 })
      .withMessage('Price must be between 0 and 9999.99'),
    
    handleValidationErrors
  ],

  addSection: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Section title must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Section description cannot exceed 500 characters'),
    
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a non-negative integer'),
    
    handleValidationErrors
  ],

  addLesson: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Lesson title must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Lesson description cannot exceed 1000 characters'),
    
    body('videoUrl')
      .optional()
      .isURL()
      .withMessage('Please provide a valid video URL'),
    
    body('duration')
      .isInt({ min: 1 })
      .withMessage('Duration must be at least 1 minute'),
    
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a non-negative integer'),
    
    handleValidationErrors
  ],

  addReview: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Comment cannot exceed 500 characters'),
    
    handleValidationErrors
  ]
};

// Query validation rules
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
  ],

  courseFilters: [
    query('category')
      .optional()
      .isIn([
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing',
        'Photography'
      ])
      .withMessage('Invalid category'),
    
    query('level')
      .optional()
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Invalid level'),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be non-negative'),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be non-negative'),
    
    query('rating')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be between 0 and 5'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search term must be between 1 and 100 characters'),
    
    query('sortBy')
      .optional()
      .isIn(['newest', 'oldest', 'popular', 'rating', 'price-low', 'price-high'])
      .withMessage('Invalid sort option'),
    
    handleValidationErrors
  ]
};

// Parameter validation rules
const paramValidation = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
    
    handleValidationErrors
  ],

  courseId: [
    param('courseId')
      .isMongoId()
      .withMessage('Invalid course ID format'),
    
    handleValidationErrors
  ],

  userId: [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID format'),
    
    handleValidationErrors
  ]
};

// Progress validation
const progressValidation = {
  updateProgress: [
    body('sectionId')
      .isMongoId()
      .withMessage('Invalid section ID format'),
    
    body('lessonId')
      .isMongoId()
      .withMessage('Invalid lesson ID format'),
    
    body('watchTime')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Watch time must be non-negative'),
    
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    
    handleValidationErrors
  ],

  addNote: [
    body('timestamp')
      .isInt({ min: 0 })
      .withMessage('Timestamp must be non-negative'),
    
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Note content must be between 1 and 1000 characters'),
    
    handleValidationErrors
  ],

  addBookmark: [
    body('timestamp')
      .isInt({ min: 0 })
      .withMessage('Timestamp must be non-negative'),
    
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bookmark note cannot exceed 500 characters'),
    
    handleValidationErrors
  ]
};

// Custom validators
const customValidators = {
  // Check if passwords match
  passwordsMatch: (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  },

  // Check if email is unique (to be used with database check)
  isEmailUnique: async (email) => {
    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    return true;
  },

  // Check if course title is unique for the instructor
  isCourseTitleUnique: async (title, { req }) => {
    const Course = require('../models/Course');
    const existingCourse = await Course.findOne({ 
      title, 
      instructor: req.user._id 
    });
    if (existingCourse) {
      throw new Error('You already have a course with this title');
    }
    return true;
  }
};

module.exports = {
  userValidation,
  courseValidation,
  queryValidation,
  paramValidation,
  progressValidation,
  customValidators,
  handleValidationErrors
};

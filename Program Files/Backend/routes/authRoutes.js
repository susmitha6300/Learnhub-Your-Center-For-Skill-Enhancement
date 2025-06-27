const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser,
  getEnrolledCourses
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { userValidation } = require('../utils/validators');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', userValidation.register, registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', userValidation.login, loginUser);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, logoutUser);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, userValidation.updateProfile, updateUserProfile);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, userValidation.changePassword, changePassword);

// @desc    Get enrolled courses
// @route   GET /api/auth/enrolled-courses
// @access  Private
router.get('/enrolled-courses', protect, getEnrolledCourses);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllCourses,
  updateCourseStatus,
  getUserManagement,
  updateUserStatus,
  getEnrollmentAnalytics,
  getRevenueAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { paramValidation, queryValidation } = require('../utils/validators');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', protect, requireAdmin, getPlatformStats);

// @desc    Get all courses for admin review
// @route   GET /api/admin/courses
// @access  Private (Admin only)
router.get('/courses', protect, requireAdmin, queryValidation.pagination, getAllCourses);

// @desc    Approve/Reject course
// @route   PUT /api/admin/courses/:id/status
// @access  Private (Admin only)
router.put('/courses/:id/status', protect, requireAdmin, paramValidation.mongoId, updateCourseStatus);

// @desc    Get user management data
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, requireAdmin, queryValidation.pagination, getUserManagement);

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', protect, requireAdmin, paramValidation.userId, updateUserStatus);

// @desc    Get enrollment analytics
// @route   GET /api/admin/analytics/enrollments
// @access  Private (Admin only)
router.get('/analytics/enrollments', protect, requireAdmin, getEnrollmentAnalytics);

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private (Admin only)
router.get('/analytics/revenue', protect, requireAdmin, getRevenueAnalytics);

module.exports = router;

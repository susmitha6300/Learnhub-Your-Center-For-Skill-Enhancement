const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getUserProgress,
  getUserCertificates,
  uploadAvatar
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin, checkOwnership } = require('../middleware/roleMiddleware');
const { uploadMiddleware, handleUploadError } = require('../middleware/uploadMiddleware');
const { paramValidation, queryValidation } = require('../utils/validators');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, requireAdmin, queryValidation.pagination, getUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or own profile)
router.get('/:id', protect, paramValidation.userId, checkOwnership(), getUserById);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', protect, requireAdmin, paramValidation.userId, updateUser);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, requireAdmin, paramValidation.userId, deleteUser);

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private (Admin or own profile)
router.get('/:id/stats', protect, paramValidation.userId, checkOwnership(), getUserStats);

// @desc    Get user learning progress
// @route   GET /api/users/:id/progress
// @access  Private (Admin or own profile)
router.get('/:id/progress', protect, paramValidation.userId, checkOwnership(), getUserProgress);

// @desc    Get user certificates
// @route   GET /api/users/:id/certificates
// @access  Private (Admin or own profile)
router.get('/:id/certificates', protect, paramValidation.userId, checkOwnership(), getUserCertificates);

// @desc    Upload user avatar
// @route   POST /api/users/upload/avatar
// @access  Private
router.post('/upload/avatar', protect, uploadMiddleware.avatar, handleUploadError, uploadAvatar);

module.exports = router;

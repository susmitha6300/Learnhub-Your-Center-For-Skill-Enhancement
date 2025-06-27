const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  updateProgress,
  addReview,
  getTeacherCourses
} = require('../controllers/courseController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { requireTeacher, checkCourseOwnership } = require('../middleware/roleMiddleware');
const { courseValidation, queryValidation, paramValidation } = require('../utils/validators');

// @desc    Get all courses with filters
// @route   GET /api/courses
// @access  Public
router.get('/', queryValidation.courseFilters, queryValidation.pagination, getCourses);

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public (but shows enrollment status if authenticated)
router.get('/:id', paramValidation.mongoId, optionalAuth, getCourseById);

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher only)
router.post('/', protect, requireTeacher, courseValidation.create, createCourse);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher/Admin only)
router.put('/:id', protect, paramValidation.mongoId, checkCourseOwnership, courseValidation.update, updateCourse);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher/Admin only)
router.delete('/:id', protect, paramValidation.mongoId, checkCourseOwnership, deleteCourse);

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, paramValidation.mongoId, enrollInCourse);

// @desc    Update learning progress
// @route   PUT /api/courses/:id/progress
// @access  Private
router.put('/:id/progress', protect, paramValidation.mongoId, updateProgress);

// @desc    Add review to course
// @route   POST /api/courses/:id/review
// @access  Private
router.post('/:id/review', protect, paramValidation.mongoId, courseValidation.addReview, addReview);

// @desc    Get teacher's courses
// @route   GET /api/courses/teacher/my-courses
// @access  Private (Teacher only)
router.get('/teacher/my-courses', protect, requireTeacher, queryValidation.pagination, getTeacherCourses);

module.exports = router;

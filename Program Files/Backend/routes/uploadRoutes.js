const express = require('express');
const router = express.Router();
const {
  uploadSingle,
  uploadMultiple,
  uploadCourseFiles,
  deleteUploadedFile,
  getFileInfo,
  listFiles,
  cleanupOrphanedFiles
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin, requireTeacher } = require('../middleware/roleMiddleware');
const { uploadMiddleware, handleUploadError, cleanupFiles } = require('../middleware/uploadMiddleware');

// @desc    Upload single file
// @route   POST /api/upload/single/:fieldName
// @access  Private
router.post('/single/:fieldName', protect, (req, res, next) => {
  uploadMiddleware.single(req.params.fieldName)(req, res, next);
}, handleUploadError, cleanupFiles, uploadSingle);

// @desc    Upload multiple files
// @route   POST /api/upload/multiple/:fieldName
// @access  Private
router.post('/multiple/:fieldName', protect, (req, res, next) => {
  uploadMiddleware.multiple(req.params.fieldName, 5)(req, res, next);
}, handleUploadError, cleanupFiles, uploadMultiple);

// @desc    Upload course files (image, video, documents)
// @route   POST /api/upload/course-files
// @access  Private (Teacher only)
router.post('/course-files', protect, requireTeacher, uploadMiddleware.courseFiles, handleUploadError, cleanupFiles, uploadCourseFiles);

// @desc    Upload course image
// @route   POST /api/upload/course-image
// @access  Private (Teacher only)
router.post('/course-image', protect, requireTeacher, uploadMiddleware.courseImage, handleUploadError, cleanupFiles, uploadSingle);

// @desc    Upload course video
// @route   POST /api/upload/course-video
// @access  Private (Teacher only)
router.post('/course-video', protect, requireTeacher, uploadMiddleware.courseVideo, handleUploadError, cleanupFiles, uploadSingle);

// @desc    Upload course documents
// @route   POST /api/upload/course-documents
// @access  Private (Teacher only)
router.post('/course-documents', protect, requireTeacher, uploadMiddleware.courseDocuments, handleUploadError, cleanupFiles, uploadMultiple);

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:folder/:filename
// @access  Private
router.delete('/:folder/:filename', protect, deleteUploadedFile);

// @desc    Delete uploaded file (no folder)
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', protect, deleteUploadedFile);

// @desc    Get file information
// @route   GET /api/upload/info/:folder/:filename
// @access  Private
router.get('/info/:folder/:filename', protect, getFileInfo);

// @desc    Get file information (no folder)
// @route   GET /api/upload/info/:filename
// @access  Private
router.get('/info/:filename', protect, getFileInfo);

// @desc    List files in directory
// @route   GET /api/upload/list/:folder
// @access  Private
router.get('/list/:folder', protect, listFiles);

// @desc    Clean up orphaned files
// @route   POST /api/upload/cleanup
// @access  Private (Admin only)
router.post('/cleanup', protect, requireAdmin, cleanupOrphanedFiles);

module.exports = router;

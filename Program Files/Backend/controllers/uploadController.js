const { asyncHandler } = require('../middleware/errorMiddleware');

const path = require('path');
const fs = require('fs');

// Upload single file
const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;

  res.json({
    status: 'success',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      path: req.file.path
    }
  });
});

// Upload multiple files
const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const files = req.files.map(file => {
    const fileUrl = `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: fileUrl,
      path: file.path
    };
  });

  res.json({
    status: 'success',
    data: {
      files,
      count: files.length
    }
  });
});

// Upload course materials (mixed files)
const uploadCourseFiles = asyncHandler(async (req, res) => {
  const uploadedFiles = {};

  // Handle course image
  if (req.files.courseImage && req.files.courseImage[0]) {
    const file = req.files.courseImage[0];
    uploadedFiles.courseImage = {
      filename: file.filename,
      url: `/uploads/courses/${file.filename}`,
      size: file.size
    };
  }

  // Handle course video
  if (req.files.courseVideo && req.files.courseVideo[0]) {
    const file = req.files.courseVideo[0];
    uploadedFiles.courseVideo = {
      filename: file.filename,
      url: `/uploads/videos/${file.filename}`,
      size: file.size,
      duration: null // TODO: Extract video duration
    };
  }

  // Handle documents
  if (req.files.documents && req.files.documents.length > 0) {
    uploadedFiles.documents = req.files.documents.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/documents/${file.filename}`,
      size: file.size,
      type: path.extname(file.originalname).toLowerCase()
    }));
  }

  if (Object.keys(uploadedFiles).length === 0) {
    res.status(400);
    throw new Error('No valid files uploaded');
  }

  res.json({
    status: 'success',
    data: uploadedFiles
  });
});

// Delete uploaded file
const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { filename, folder } = req.params;
  
  if (!filename) {
    res.status(400);
    throw new Error('Filename is required');
  }

  const allowedFolders = ['avatars', 'courses', 'videos', 'documents', 'certificates'];
  if (folder && !allowedFolders.includes(folder)) {
    res.status(400);
    throw new Error('Invalid folder specified');
  }

  const filePath = folder 
    ? path.join(process.env.UPLOAD_PATH || './uploads', folder, filename)
    : path.join(process.env.UPLOAD_PATH || './uploads', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        status: 'success',
        message: 'File deleted successfully'
      });
    } else {
      res.status(404);
      throw new Error('File not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Failed to delete file');
  }
});

// Get file info
const getFileInfo = asyncHandler(async (req, res) => {
  const { filename, folder } = req.params;
  
  const filePath = folder 
    ? path.join(process.env.UPLOAD_PATH || './uploads', folder, filename)
    : path.join(process.env.UPLOAD_PATH || './uploads', filename);

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileUrl = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
      
      res.json({
        status: 'success',
        data: {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: fileUrl,
          exists: true
        }
      });
    } else {
      res.status(404);
      throw new Error('File not found');
    }
  } catch (_error) {
    res.status(500);
    throw new Error('Failed to get file info');
  }
});

// List files in directory
const listFiles = asyncHandler(async (req, res) => {
  const { folder } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const allowedFolders = ['avatars', 'courses', 'videos', 'documents', 'certificates'];
  if (!allowedFolders.includes(folder)) {
    res.status(400);
    throw new Error('Invalid folder specified');
  }

  const dirPath = path.join(process.env.UPLOAD_PATH || './uploads', folder);
  
  try {
    if (!fs.existsSync(dirPath)) {
      return res.json({
        status: 'success',
        data: {
          files: [],
          pagination: {
            total: 0,
            page: Number(page),
            limit: Number(limit),
            totalPages: 0
          }
        }
      });
    }

    const files = fs.readdirSync(dirPath);
    const fileStats = files.map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${folder}/${filename}`,
        isDirectory: stats.isDirectory()
      };
    }).filter(file => !file.isDirectory);

    // Pagination
    const total = fileStats.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const paginatedFiles = fileStats.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        files: paginatedFiles,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (_error) {
    res.status(500);
    throw new Error('Failed to list files');
  }
});

// Clean up orphaned files (Admin only)
const cleanupOrphanedFiles = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const Course = require('../models/Course');
  
  const uploadPath = process.env.UPLOAD_PATH || './uploads';
  let deletedFiles = [];
  let errors = [];

  try {
    // Clean up avatar files
    const avatarPath = path.join(uploadPath, 'avatars');
    if (fs.existsSync(avatarPath)) {
      const avatarFiles = fs.readdirSync(avatarPath);
      const usedAvatars = await User.find({ avatar: { $ne: null } }).select('avatar');
      const usedAvatarFilenames = usedAvatars.map(user => path.basename(user.avatar));

      for (const file of avatarFiles) {
        if (!usedAvatarFilenames.includes(file)) {
          try {
            fs.unlinkSync(path.join(avatarPath, file));
            deletedFiles.push(`avatars/${file}`);
          } catch (error) { /* eslint-disable-line no-unused-vars */
            errors.push(`Failed to delete avatars/${file}: ${error.message}`);
          }
        }
      }
    }

    // Clean up course image files
    const coursePath = path.join(uploadPath, 'courses');
    if (fs.existsSync(coursePath)) {
      const courseFiles = fs.readdirSync(coursePath);
      const usedImages = await Course.find({ image: { $ne: null } }).select('image');
      const usedImageFilenames = usedImages.map(course => path.basename(course.image));

      for (const file of courseFiles) {
        if (!usedImageFilenames.includes(file)) {
          try {
            fs.unlinkSync(path.join(coursePath, file));
            deletedFiles.push(`courses/${file}`);
          } catch (err) {
            errors.push(`Failed to delete courses/${file}: ${err.message}`);
          }
        }
      }
    }

    res.json({
      status: 'success',
      data: {
        deletedFiles,
        deletedCount: deletedFiles.length,
        errors,
        errorCount: errors.length
      }
    });
  } catch (err) {
    res.status(500);
    throw new Error('Failed to cleanup orphaned files');
  }
});

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadCourseFiles,
  deleteUploadedFile,
  getFileInfo,
  listFiles,
  cleanupOrphanedFiles
};

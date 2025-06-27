const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Create subdirectories based on file type
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(uploadPath, 'avatars');
    } else if (file.fieldname === 'courseImage') {
      uploadPath = path.join(uploadPath, 'courses');
    } else if (file.fieldname === 'courseVideo') {
      uploadPath = path.join(uploadPath, 'videos');
    } else if (file.fieldname === 'documents') {
      uploadPath = path.join(uploadPath, 'documents');
    }
    
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    avatar: /jpeg|jpg|png|gif/,
    courseImage: /jpeg|jpg|png|gif/,
    courseVideo: /mp4|avi|mov|wmv|mkv/,
    documents: /pdf|doc|docx|txt|ppt|pptx/
  };

  const allowedMimeTypes = {
    avatar: /image\/(jpeg|jpg|png|gif)/,
    courseImage: /image\/(jpeg|jpg|png|gif)/,
    courseVideo: /video\/(mp4|avi|mov|wmv|mkv)/,
    documents: /application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)|text\/plain/
  };

  const fieldName = file.fieldname;
  const extname = allowedTypes[fieldName]?.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes[fieldName]?.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldName}. Please upload a valid file.`));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Upload middleware configurations
const uploadMiddleware = {
  // Single file uploads
  avatar: upload.single('avatar'),
  courseImage: upload.single('courseImage'),
  courseVideo: upload.single('courseVideo'),
  
  // Multiple file uploads
  courseDocuments: upload.array('documents', 5),
  
  // Mixed uploads
  courseFiles: upload.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'courseVideo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  
  // Generic single upload
  single: (fieldName) => upload.single(fieldName),
  
  // Generic multiple upload
  multiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount)
};

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next(err);
};

// Utility function to delete uploaded files
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Cleanup middleware for failed uploads
const cleanupFiles = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If response is an error and files were uploaded, clean them up
    if (res.statusCode >= 400 && req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach(file => deleteFile(file.path));
      } else if (typeof req.files === 'object') {
        Object.values(req.files).forEach(fileArray => {
          if (Array.isArray(fileArray)) {
            fileArray.forEach(file => deleteFile(file.path));
          } else {
            deleteFile(fileArray.path);
          }
        });
      }
    }
    
    if (res.statusCode >= 400 && req.file) {
      deleteFile(req.file.path);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  uploadMiddleware,
  handleUploadError,
  cleanupFiles,
  deleteFile
};

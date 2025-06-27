const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment is required']
  },
  certificateId: {
    type: String,
    unique: true,
    required: [true, 'Certificate ID is required']
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    required: [true, 'Completion date is required']
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass'],
    default: 'Pass'
  },
  finalScore: {
    type: Number,
    min: [0, 'Final score cannot be negative'],
    max: [100, 'Final score cannot be more than 100'],
    default: null
  },
  studyDuration: {
    type: Number, // in days
    required: [true, 'Study duration is required'],
    min: [1, 'Study duration must be at least 1 day']
  },
  certificateUrl: {
    type: String,
    default: null // Will be generated when PDF is created
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  verificationCode: {
    type: String,
    unique: true,
    required: [true, 'Verification code is required']
  },
  metadata: {
    instructorName: {
      type: String,
      required: [true, 'Instructor name is required']
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required']
    },
    courseDuration: {
      type: String,
      required: [true, 'Course duration is required']
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required']
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date is required']
    }
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: [0, 'Download count cannot be negative']
  },
  lastDownloadedAt: {
    type: Date,
    default: null
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  revokeReason: {
    type: String,
    maxlength: [500, 'Revoke reason cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ issuedAt: -1 });

// Pre-save middleware to generate certificate ID and verification code
certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate unique certificate ID
    if (!this.certificateId) {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      this.certificateId = `CERT-${timestamp}-${randomStr}`.toUpperCase();
    }

    // Generate verification code
    if (!this.verificationCode) {
      const randomCode = Math.random().toString(36).substring(2, 12);
      this.verificationCode = randomCode.toUpperCase();
    }
  }
  next();
});

// Method to increment download count
certificateSchema.methods.recordDownload = function() {
  this.downloadCount += 1;
  this.lastDownloadedAt = new Date();
  return this.save();
};

// Method to revoke certificate
certificateSchema.methods.revoke = function(revokedBy, reason) {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedBy = revokedBy;
  this.revokeReason = reason;
  return this.save();
};

// Method to restore certificate
certificateSchema.methods.restore = function() {
  this.isRevoked = false;
  this.revokedAt = null;
  this.revokedBy = null;
  this.revokeReason = null;
  return this.save();
};

// Virtual for certificate validity
certificateSchema.virtual('isValid').get(function() {
  return this.isVerified && !this.isRevoked;
});

// Virtual for formatted issue date
certificateSchema.virtual('formattedIssueDate').get(function() {
  return this.issuedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to verify certificate
certificateSchema.statics.verifyCertificate = function(certificateId, verificationCode) {
  return this.findOne({
    certificateId: certificateId.toUpperCase(),
    verificationCode: verificationCode.toUpperCase(),
    isVerified: true,
    isRevoked: false
  }).populate('student course');
};

// Ensure virtuals are included in JSON
certificateSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Certificate', certificateSchema);

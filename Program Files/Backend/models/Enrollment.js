const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot be more than 100']
  },
  completedLessons: [{
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  currentSection: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed' // For free courses
  },
  paymentId: {
    type: String,
    default: null
  },
  amountPaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique enrollment per student-course pair
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Index for better query performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

// Method to mark lesson as completed
enrollmentSchema.methods.completeLesson = function(sectionId, lessonId) {
  // Check if lesson is already completed
  const existingCompletion = this.completedLessons.find(
    completion => 
      completion.sectionId.toString() === sectionId.toString() && 
      completion.lessonId.toString() === lessonId.toString()
  );

  if (!existingCompletion) {
    this.completedLessons.push({
      sectionId,
      lessonId,
      completedAt: new Date()
    });
  }

  this.lastAccessedAt = new Date();
  this.currentSection = sectionId;
  this.currentLesson = lessonId;

  return this.save();
};

// Method to calculate and update progress
enrollmentSchema.methods.updateProgress = async function() {
  await this.populate('course');
  
  if (!this.course) {
    return this;
  }

  // Count total lessons in the course
  let totalLessons = 0;
  this.course.sections.forEach(section => {
    totalLessons += section.lessons.length;
  });

  if (totalLessons === 0) {
    this.progress = 0;
    return this.save();
  }

  // Calculate progress percentage
  const completedCount = this.completedLessons.length;
  this.progress = Math.round((completedCount / totalLessons) * 100);

  // Mark as completed if 100% progress
  if (this.progress === 100 && !this.completedAt) {
    this.completedAt = new Date();
  }

  return this.save();
};

// Method to check if course is completed
enrollmentSchema.methods.isCompleted = function() {
  return this.progress === 100 && this.completedAt !== null;
};

// Virtual for days since enrollment
enrollmentSchema.virtual('daysSinceEnrollment').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.enrolledAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for completion time in days
enrollmentSchema.virtual('completionTimeInDays').get(function() {
  if (!this.completedAt) return null;
  
  const diffTime = Math.abs(this.completedAt - this.enrolledAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are

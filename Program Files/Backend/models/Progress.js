const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment is required']
  },
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
  section: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Section is required']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Lesson is required']
  },
  watchTime: {
    type: Number, // in seconds
    default: 0,
    min: [0, 'Watch time cannot be negative']
  },
  totalDuration: {
    type: Number, // in seconds
    required: [true, 'Total duration is required'],
    min: [1, 'Total duration must be at least 1 second']
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Completion percentage cannot be negative'],
    max: [100, 'Completion percentage cannot be more than 100']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  bookmarks: [{
    timestamp: {
      type: Number, // in seconds
      required: true
    },
    note: {
      type: String,
      maxlength: [500, 'Bookmark note cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    timestamp: {
      type: Number, // in seconds
      required: true
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      maxlength: [1000, 'Note content cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quiz_attempts: [{
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot be more than 100']
    },
    answers: [{
      questionId: String,
      selectedAnswer: String,
      isCorrect: Boolean
    }]
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique progress per student-course-lesson
progressSchema.index({ student: 1, course: 1, lesson: 1 }, { unique: true });

// Indexes for better query performance
progressSchema.index({ student: 1, course: 1 });
progressSchema.index({ enrollment: 1 });
progressSchema.index({ lastWatchedAt: -1 });

// Method to update watch time and completion
progressSchema.methods.updateWatchTime = function(newWatchTime) {
  this.watchTime = Math.max(this.watchTime, newWatchTime);
  this.completionPercentage = Math.min(
    Math.round((this.watchTime / this.totalDuration) * 100),
    100
  );
  
  // Mark as completed if watched 90% or more
  if (this.completionPercentage >= 90 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  this.lastWatchedAt = new Date();
  return this.save();
};

// Method to add bookmark
progressSchema.methods.addBookmark = function(timestamp, note = '') {
  // Check if bookmark already exists at this timestamp
  const existingBookmark = this.bookmarks.find(
    bookmark => Math.abs(bookmark.timestamp - timestamp) < 5 // Within 5 seconds
  );

  if (!existingBookmark) {
    this.bookmarks.push({
      timestamp,
      note,
      createdAt: new Date()
    });
    return this.save();
  }

  return this;
};

// Method to add or update note
progressSchema.methods.addNote = function(timestamp, content) {
  const existingNoteIndex = this.notes.findIndex(
    note => Math.abs(note.timestamp - timestamp) < 5 // Within 5 seconds
  );

  if (existingNoteIndex !== -1) {
    // Update existing note
    this.notes[existingNoteIndex].content = content;
    this.notes[existingNoteIndex].updatedAt = new Date();
  } else {
    // Add new note
    this.notes.push({
      timestamp,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return this.save();
};

// Method to record quiz attempt
progressSchema.methods.recordQuizAttempt = function(score, answers) {
  this.quiz_attempts.push({
    attemptedAt: new Date(),
    score,
    answers
  });

  return this.save();
};

// Virtual for best quiz score
progressSchema.virtual('bestQuizScore').get(function() {
  if (this.quiz_attempts.length === 0) return null;
  
  return Math.max(...this.quiz_attempts.map(attempt => attempt.score));
});

// Virtual for total study time (in minutes)
progressSchema.virtual('studyTimeMinutes').get(function() {
  return Math.round(this.watchTime / 60);
});

// Ensure virtuals are included in JSON
progressSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Progress', progressSchema);

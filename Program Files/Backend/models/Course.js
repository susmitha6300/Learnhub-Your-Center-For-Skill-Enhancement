const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  videoUrl: {
    type: String,
    match: [/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.?&/=]*)$/, 'Please use a valid URL with HTTP or HTTPS']
  },
  duration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute']
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'image', 'video']
    }
  }],
  isPreview: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const reviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Design',
      'Business',
      'Marketing',
      'Photography'
    ]
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: null
  },
  sections: [sectionSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot be more than 200 characters']
  }],
  whatYouWillLearn: [{
    type: String,
    maxlength: [200, 'Learning outcome cannot be more than 200 characters']
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ instructor: 1 });

// Calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return this.save();
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = Math.round((sum / this.reviews.length) * 10) / 10; // Round to 1 decimal
  return this.save();
};

// Calculate total duration
courseSchema.methods.calculateTotalDuration = function() {
  let totalDuration = 0;
  this.sections.forEach(section => {
    section.lessons.forEach(lesson => {
      totalDuration += lesson.duration || 0;
    });
  });
  this.totalDuration = totalDuration;
  return this.save();
};

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for review count
courseSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);

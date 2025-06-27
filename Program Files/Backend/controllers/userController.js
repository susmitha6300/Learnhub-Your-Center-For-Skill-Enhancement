const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Get all users (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password -refreshTokens')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshTokens')
    .populate('enrolledCourses', 'title instructor price')
    .populate('createdCourses', 'title price enrolledStudents');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ status: 'success', data: user });
});

// Update user (Admin only)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role, isActive, isVerified } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;

  const updatedUser = await user.save();

  res.json({ 
    status: 'success', 
    data: updatedUser.toJSON() 
  });
});

// Delete user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deleting admin users
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin users');
  }

  // Handle user deletion based on role
  if (user.role === 'teacher') {
    // Check if teacher has courses with enrollments
    const coursesWithEnrollments = await Course.find({
      instructor: user._id,
      enrolledStudents: { $exists: true, $not: { $size: 0 } }
    });

    if (coursesWithEnrollments.length > 0) {
      res.status(400);
      throw new Error('Cannot delete teacher with active course enrollments');
    }

    // Delete teacher's courses
    await Course.deleteMany({ instructor: user._id });
  }

  if (user.role === 'student') {
    // Remove student from course enrollments
    await Enrollment.deleteMany({ student: user._id });
    await Course.updateMany(
      { enrolledStudents: user._id },
      { $pull: { enrolledStudents: user._id } }
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ 
    status: 'success', 
    message: 'User deleted successfully' 
  });
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let stats = {};

  if (user.role === 'student') {
    const enrollments = await Enrollment.find({ student: userId });
    const completedCourses = enrollments.filter(e => e.isCompleted()).length;
    const certificates = await Certificate.countDocuments({ student: userId });

    stats = {
      totalEnrollments: enrollments.length,
      completedCourses,
      inProgressCourses: enrollments.length - completedCourses,
      certificates,
      averageProgress: enrollments.length > 0 
        ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length 
        : 0
    };
  } else if (user.role === 'teacher') {
    const courses = await Course.find({ instructor: userId });
    const totalStudents = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0);
    const totalRevenue = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      {
        $match: {
          'courseData.instructor': userId,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' }
        }
      }
    ]);

    stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.isPublished).length,
      totalStudents,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRating: courses.length > 0 
        ? courses.reduce((acc, c) => acc + c.rating, 0) / courses.length 
        : 0
    };
  }

  res.json({ status: 'success', data: stats });
});

// Get user's learning progress
const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const enrollments = await Enrollment.find({ student: userId })
    .populate('course', 'title instructor image category level')
    .populate('course.instructor', 'name')
    .sort({ lastAccessedAt: -1 });

  const progressData = enrollments.map(enrollment => ({
    course: enrollment.course,
    progress: enrollment.progress,
    enrolledAt: enrollment.enrolledAt,
    lastAccessedAt: enrollment.lastAccessedAt,
    completedAt: enrollment.completedAt,
    isCompleted: enrollment.isCompleted()
  }));

  res.json({ status: 'success', data: progressData });
});

// Get user's certificates
const getUserCertificates = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const certificates = await Certificate.find({ student: userId })
    .populate('course', 'title instructor')
    .populate('course.instructor', 'name')
    .sort({ issuedAt: -1 });

  res.json({ status: 'success', data: certificates });
});

// Upload user avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user avatar
  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();

  res.json({ 
    status: 'success', 
    data: { 
      avatar: user.avatar 
    } 
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getUserProgress,
  getUserCertificates,
  uploadAvatar
};

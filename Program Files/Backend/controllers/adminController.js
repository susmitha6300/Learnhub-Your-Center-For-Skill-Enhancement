const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const { asyncHandler } = require('../middleware/errorMiddleware');

// Get platform statistics
const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const pendingCourses = await Course.countDocuments({ isPublished: false });
  const totalEnrollments = await Enrollment.countDocuments();
  const completedEnrollments = await Enrollment.countDocuments({ completedAt: { $ne: null } });

  // Revenue calculation
  const revenueData = await Enrollment.aggregate([
    {
      $match: { paymentStatus: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amountPaid' },
        count: { $sum: 1 }
      }
    }
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Monthly growth data
  const monthlyStats = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        newUsers: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 }
    },
    {
      $limit: 12
    }
  ]);

  // Top courses by enrollment
  const topCourses = await Course.aggregate([
    {
      $addFields: {
        enrollmentCount: { $size: '$enrolledStudents' }
      }
    },
    {
      $sort: { enrollmentCount: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'users',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructorData'
      }
    },
    {
      $project: {
        title: 1,
        enrollmentCount: 1,
        rating: 1,
        price: 1,
        instructor: { $arrayElemAt: ['$instructorData.name', 0] }
      }
    }
  ]);

  res.json({
    status: 'success',
    data: {
      overview: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalEnrollments,
        completedEnrollments,
        totalRevenue,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments * 100).toFixed(2) : 0
      },
      monthlyStats,
      topCourses
    }
  });
});

// Get all courses for admin review
const getAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, category, instructor } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  
  if (status === 'pending') {
    query.isApproved = false;
  } else if (status === 'approved') {
    query.isApproved = true;
  }
  
  if (category) query.category = category;
  if (instructor) query.instructor = instructor;

  const courses = await Course.find(query)
    .populate('instructor', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Course.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      courses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Approve/Reject course
const updateCourseStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved, rejectionReason } = req.body;

  const course = await Course.findById(id).populate('instructor', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  course.isApproved = isApproved;
  
  if (isApproved) {
    course.approvedAt = new Date();
    course.approvedBy = req.user._id;
    course.isPublished = true; // Auto-publish approved courses
  } else {
    course.rejectionReason = rejectionReason;
  }

  await course.save();

  // TODO: Send email notification to instructor
  // sendCourseStatusEmail(course.instructor.email, course.title, isApproved, rejectionReason);

  res.json({ 
    status: 'success', 
    message: `Course ${isApproved ? 'approved' : 'rejected'} successfully`,
    data: course 
  });
});

// Get user management data
const getUserManagement = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, status, search } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  
  if (role) query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;
  
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

  // Get additional stats for each user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      let additionalData = {};
      
      if (user.role === 'student') {
        const enrollmentCount = await Enrollment.countDocuments({ student: user._id });
        const completedCount = await Enrollment.countDocuments({ 
          student: user._id, 
          completedAt: { $ne: null } 
        });
        additionalData = { enrollmentCount, completedCount };
      } else if (user.role === 'teacher') {
        const courseCount = await Course.countDocuments({ instructor: user._id });
        const studentCount = await Course.aggregate([
          { $match: { instructor: user._id } },
          { $group: { _id: null, total: { $sum: { $size: '$enrolledStudents' } } } }
        ]);
        additionalData = { 
          courseCount, 
          studentCount: studentCount[0]?.total || 0 
        };
      }
      
      return {
        ...user.toJSON(),
        ...additionalData
      };
    })
  );

  res.json({
    status: 'success',
    data: {
      users: usersWithStats,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Update user status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive, role } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow modifying admin users
  if (user.role === 'admin' && req.user._id.toString() !== id) {
    res.status(403);
    throw new Error('Cannot modify admin users');
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (role && role !== 'admin') user.role = role;

  await user.save();

  res.json({ 
    status: 'success', 
    message: 'User updated successfully',
    data: user.toJSON() 
  });
});

// Get enrollment analytics
const getEnrollmentAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  // Daily enrollment data
  const dailyEnrollments = await Enrollment.aggregate([
    {
      $match: { enrolledAt: dateFilter }
    },
    {
      $group: {
        _id: {
          year: { $year: '$enrolledAt' },
          month: { $month: '$enrolledAt' },
          day: { $dayOfMonth: '$enrolledAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$amountPaid' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Category-wise enrollments
  const categoryEnrollments = await Enrollment.aggregate([
    {
      $match: { enrolledAt: dateFilter }
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'courseData'
      }
    },
    {
      $unwind: '$courseData'
    },
    {
      $group: {
        _id: '$courseData.category',
        count: { $sum: 1 },
        revenue: { $sum: '$amountPaid' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.json({
    status: 'success',
    data: {
      dailyEnrollments,
      categoryEnrollments
    }
  });
});

// Get revenue analytics
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  const revenueData = await Enrollment.aggregate([
    {
      $match: { 
        enrolledAt: dateFilter,
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$enrolledAt' },
          month: { $month: '$enrolledAt' },
          day: { $dayOfMonth: '$enrolledAt' }
        },
        revenue: { $sum: '$amountPaid' },
        transactions: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Top earning courses
  const topEarningCourses = await Enrollment.aggregate([
    {
      $match: { 
        enrolledAt: dateFilter,
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: '$course',
        revenue: { $sum: '$amountPaid' },
        enrollments: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'courseData'
      }
    },
    {
      $unwind: '$courseData'
    },
    {
      $project: {
        title: '$courseData.title',
        revenue: 1,
        enrollments: 1
      }
    },
    {
      $sort: { revenue: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.json({
    status: 'success',
    data: {
      revenueData,
      topEarningCourses
    }
  });
});

module.exports = {
  getPlatformStats,
  getAllCourses,
  updateCourseStatus,
  getUserManagement,
  updateUserStatus,
  getEnrollmentAnalytics,
  getRevenueAnalytics
};

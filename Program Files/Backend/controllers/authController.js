const User = require('../models/User');
const { generateTokenPair } = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { sendWelcomeEmail } = require('../utils/sendEmail');


// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({ name, email, password, role });

  if (user) {
    // Send welcome email (async, no await)
    sendWelcomeEmail(user.email, user.name, `${process.env.CLIENT_URL}/verify-email`);

    const tokens = generateTokenPair(user);

    res.status(201).json({
      status: 'success',
      data: tokens
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokens = generateTokenPair(user);
    res.json({
      status: 'success',
      data: tokens
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshTokens')
    .populate('enrolledCourses', 'title instructor price')
    .populate('createdCourses', 'title price enrolledStudents');
    
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ status: 'success', data: user });
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, bio, website, location, avatar } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (website !== undefined) user.website = website;
  if (location !== undefined) user.location = location;
  if (avatar !== undefined) user.avatar = avatar;

  const updatedUser = await user.save();

  res.json({ 
    status: 'success', 
    data: updatedUser.toJSON()
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ 
    status: 'success', 
    message: 'Password updated successfully' 
  });
});

// Logout user (invalidate refresh token)
const logoutUser = asyncHandler(async (req, res) => {
  // For JWT, logout is handled client side by deleting tokens
  res.json({ status: 'success', message: 'Logged out successfully' });
});

// Get enrolled courses
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const Enrollment = require('../models/Enrollment');
  
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course', 'title description instructor image price level category rating')
    .populate('course.instructor', 'name')
    .sort({ enrolledAt: -1 });

  res.json({ 
    status: 'success', 
    data: enrollments 
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser,
  getEnrolledCourses
};

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'olp-backend',
    audience: 'olp-frontend'
  });
};

// Generate JWT refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'olp-backend',
    audience: 'olp-frontend'
  });
};

// Generate both tokens
const generateTokenPair = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: process.env.JWT_EXPIRE || '15m',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  };
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'olp-backend',
      audience: 'olp-frontend'
    });
  } catch (_error) { /* eslint-disable-line no-unused-vars */
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'olp-backend',
      audience: 'olp-frontend'
    });
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

// Generate random token for email verification, password reset, etc.
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate numeric OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Hash token for storage
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate secure password reset token
const generatePasswordResetToken = () => {
  const resetToken = generateRandomToken();
  const hashedToken = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return {
    token: resetToken,
    hashedToken,
    expiresAt
  };
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  const verificationToken = generateRandomToken();
  const hashedToken = hashToken(verificationToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    token: verificationToken,
    hashedToken,
    expiresAt
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  generateRandomToken,
  generateOTP,
  hashToken,
  generatePasswordResetToken,
  generateEmailVerificationToken
};

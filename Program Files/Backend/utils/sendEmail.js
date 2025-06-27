const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"LearnHub" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  welcome: (name, verificationUrl) => ({
    subject: 'Welcome to LearnHub! Please verify your email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LearnHub!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for joining LearnHub! We're excited to have you as part of our learning community.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with LearnHub, please ignore this email.</p>
            <p>Happy learning!<br>The LearnHub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to LearnHub! Please verify your email by visiting: ${verificationUrl}`
  }),

  // Password reset email
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your LearnHub Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your LearnHub password.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <div class="warning">
              <strong>Important:</strong> This password reset link will expire in 10 minutes for security reasons.
            </div>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security reasons, we recommend using a strong password that includes:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>A mix of uppercase and lowercase letters</li>
              <li>Numbers and special characters</li>
            </ul>
            <p>Best regards,<br>The LearnHub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Reset your LearnHub password by visiting: ${resetUrl}`
  }),

  // Course enrollment confirmation
  courseEnrollment: (studentName, courseTitle, instructorName) => ({
    subject: `Welcome to "${courseTitle}"!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .course-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Enrollment Successful!</h1>
          </div>
          <div class="content">
            <h2>Hi ${studentName},</h2>
            <p>Congratulations! You've successfully enrolled in:</p>
            <div class="course-info">
              <h3>${courseTitle}</h3>
              <p><strong>Instructor:</strong> ${instructorName}</p>
            </div>
            <p>You can now start learning at your own pace. Access your course materials, track your progress, and earn your certificate upon completion.</p>
            <a href="${process.env.CLIENT_URL}/my-courses" class="button">Start Learning</a>
            <p>Tips for successful learning:</p>
            <ul>
              <li>Set aside dedicated time for learning</li>
              <li>Take notes and practice regularly</li>
              <li>Engage with the course materials</li>
              <li>Don't hesitate to revisit difficult concepts</li>
            </ul>
            <p>Happy learning!<br>The LearnHub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `You've successfully enrolled in "${courseTitle}" by ${instructorName}. Start learning at ${process.env.CLIENT_URL}/my-courses`
  }),

  // Course completion and certificate
  courseCompletion: (studentName, courseTitle, certificateUrl) => ({
    subject: `🏆 Congratulations! You've completed "${courseTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .achievement { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #48bb78; }
          .button { display: inline-block; background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Course Completed!</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${studentName}!</h2>
            <div class="achievement">
              <h3>🎓 You've successfully completed</h3>
              <h2 style="color: #48bb78;">${courseTitle}</h2>
              <p>Your dedication and hard work have paid off!</p>
            </div>
            <p>Your certificate of completion is now ready for download:</p>
            <a href="${certificateUrl}" class="button">Download Certificate</a>
            <p>What's next?</p>
            <ul>
              <li>Share your achievement on social media</li>
              <li>Add your certificate to your LinkedIn profile</li>
              <li>Explore more courses to continue learning</li>
              <li>Leave a review to help other learners</li>
            </ul>
            <p>Thank you for choosing LearnHub for your learning journey!</p>
            <p>Keep learning and growing!<br>The LearnHub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations! You've completed "${courseTitle}". Download your certificate: ${certificateUrl}`
  })
};

// Convenience functions for sending specific emails
const sendWelcomeEmail = async (email, name, verificationUrl) => {
  const template = emailTemplates.welcome(name, verificationUrl);
  return await sendEmail({ email, ...template });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const template = emailTemplates.passwordReset(name, resetUrl);
  return await sendEmail({ email, ...template });
};

const sendCourseEnrollmentEmail = async (email, studentName, courseTitle, instructorName) => {
  const template = emailTemplates.courseEnrollment(studentName, courseTitle, instructorName);
  return await sendEmail({ email, ...template });
};

const sendCourseCompletionEmail = async (email, studentName, courseTitle, certificateUrl) => {
  const template = emailTemplates.courseCompletion(studentName, courseTitle, certificateUrl);
  return await sendEmail({ email, ...template });
};

module.exports = {
  sendEmail,
  emailTemplates,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCourseEnrollmentEmail,
  sendCourseCompletionEmail
};

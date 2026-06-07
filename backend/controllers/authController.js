const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const buildUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  phone: user.phone,
  avatar: user.avatar,
  resumeUrl: user.resumeUrl,
  token,
});

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, company, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const allowedRoles = ['student', 'recruiter'];
  const userRole = allowedRoles.includes(role) ? role : 'student';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    company: company || '',
    phone: phone || '',
  });

  res.status(201).json(buildUserResponse(user, generateToken(user._id)));
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account deactivated');
  }

  res.json(buildUserResponse(user, generateToken(user._id)));
});

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.company = req.body.company || user.company;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json(buildUserResponse(updated, generateToken(updated._id)));
});

// @desc    Upload student/recruiter profile photo
// @route   POST /api/auth/avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!['student', 'recruiter'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Only students and recruiters can upload profile photos');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const uploaded = await uploadToCloudinary(req.file.buffer, {
    folder: `smarthire/avatars/${user.role}`,
    resource_type: 'image',
  });

  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId).catch((err) => {
      console.error('Old avatar cleanup failed:', err.message);
    });
  }

  user.avatar = uploaded.secure_url;
  user.avatarPublicId = uploaded.public_id;
  const updated = await user.save();

  res.json({
    avatar: updated.avatar,
    message: 'Profile photo uploaded',
  });
});

module.exports = { registerUser, loginUser, getMe, updateProfile, uploadAvatar };

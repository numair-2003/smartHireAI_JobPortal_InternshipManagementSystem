const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const allowedRoles = ['student', 'recruiter', 'admin'];

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Update user role/status (admin)
// @route   PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.role) {
    if (!allowedRoles.includes(req.body.role)) {
      res.status(400);
      throw new Error('Invalid user role');
    }
    user.role = req.body.role;
  }

  if (typeof req.body.isActive === 'boolean') {
    if (user._id.toString() === req.user._id.toString() && req.body.isActive === false) {
      res.status(400);
      throw new Error('You cannot deactivate your own admin account');
    }
    user.isActive = req.body.isActive;
  }

  const updated = await user.save();
  res.json(updated);
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc    Dashboard stats (admin)
// @route   GET /api/users/stats
const getStats = asyncHandler(async (req, res) => {
  const Job = require('../models/Job');
  const Application = require('../models/Application');

  const [users, jobs, applications, students, recruiters, admins, activeUsers, activeJobs, statusCounts] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isActive: true }),
    Job.countDocuments({ isActive: true }),
    Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const applicationsByStatus = statusCounts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.json({
    users,
    jobs,
    applications,
    students,
    recruiters,
    admins,
    activeUsers,
    activeJobs,
    applicationsByStatus,
  });
});

module.exports = { getUsers, updateUser, deleteUser, getStats };

const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');
const sendEmail = require('../utils/sendEmail');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { reviewResume } = require('../services/aiService');

const allowedStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];

// @desc    Apply to job
// @route   POST /api/applications
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeText } = req.body;
  const job = await Job.findById(jobId);

  if (!job || !job.isActive) {
    res.status(404);
    throw new Error('Job not found');
  }

  const existing = await Application.findOne({ job: jobId, student: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('Already applied to this job');
  }

  let resumeUrl = req.user.resumeUrl;

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, {
      folder: 'smarthire/resumes',
      resource_type: 'raw',
    });
    resumeUrl = uploaded.secure_url;
    await User.findByIdAndUpdate(req.user._id, {
      resumeUrl: uploaded.secure_url,
      resumePublicId: uploaded.public_id,
    });
  }

  if (!resumeUrl) {
    res.status(400);
    throw new Error('Please upload a resume');
  }

  let aiReview = null;
  if (resumeText) {
    aiReview = await reviewResume({
      resumeText,
      jobTitle: job.title,
      jobSkills: job.skills,
    });
  }

  const application = await Application.create({
    job: jobId,
    student: req.user._id,
    resumeUrl,
    coverLetter: coverLetter || '',
    aiReview,
  });

  const populated = await Application.findById(application._id)
    .populate('job', 'title company')
    .populate('student', 'name email');

  const recruiterId = job.postedBy;
  const notification = await createNotification({
    userId: recruiterId,
    title: 'New Application',
    message: `${req.user.name} applied for ${job.title}`,
    type: 'application',
    link: `/recruiter/applications/${job._id}`,
  });

  const io = req.app.get('io');
  io?.to(recruiterId.toString()).emit('notification', notification);

  res.status(201).json(populated);
});

// @desc    Student applications
// @route   GET /api/applications/my
const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ student: req.user._id })
    .populate('job')
    .sort({ createdAt: -1 });
  res.json(apps);
});

// @desc    Applications for recruiter job
// @route   GET /api/applications/job/:jobId
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const apps = await Application.find({ job: req.params.jobId })
    .populate('student', 'name email phone resumeUrl')
    .sort({ createdAt: -1 });

  res.json(apps);
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid application status');
  }

  const application = await Application.findById(req.params.id).populate('job student');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const job = await Job.findById(application.job._id);
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  application.status = status;
  await application.save();

  const notification = await createNotification({
    userId: application.student._id,
    title: 'Application Update',
    message: `Your application for "${application.job.title}" is now ${status}`,
    type: 'status',
    link: '/student',
  });

  const io = req.app.get('io');
  io?.to(application.student._id.toString()).emit('notification', notification);

  try {
    await sendEmail({
      to: application.student.email,
      subject: `Application ${status} - ${application.job.title}`,
      html: `<p>Hi ${application.student.name},</p>
        <p>Your application for <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>- SmartHire AI</p>`,
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }

  res.json(application);
});

// @desc    Upload resume to profile
// @route   POST /api/applications/resume
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const uploaded = await uploadToCloudinary(req.file.buffer, {
    folder: 'smarthire/resumes',
    resource_type: 'raw',
  });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resumeUrl: uploaded.secure_url, resumePublicId: uploaded.public_id },
    { new: true }
  );

  res.json({ resumeUrl: user.resumeUrl, message: 'Resume uploaded' });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  uploadResume,
};

const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');
const sendEmail = require('../utils/sendEmail');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { reviewResume } = require('../services/aiService');

const allowedStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];

const allowedResumeExtensions = new Set(['.pdf', '.doc', '.docx']);

const buildResumePublicId = (file) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const safeExt = allowedResumeExtensions.has(ext) ? ext : '';
  return `resume-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
};

const uploadResumeFile = (file) =>
  uploadToCloudinary(file.buffer, {
    folder: 'smarthire/resumes',
    public_id: buildResumePublicId(file),
    resource_type: 'raw',
    overwrite: false,
  });

const getResumeFileName = (source) => {
  if (!source) return '';

  try {
    const parsed = source.startsWith('http') ? new URL(source).pathname : source;
    const fileName = decodeURIComponent(parsed.split(/[\\/]/).pop() || '');
    return allowedResumeExtensions.has(path.extname(fileName).toLowerCase()) ? fileName : '';
  } catch {
    const fileName = source.split(/[\\/]/).pop() || '';
    return allowedResumeExtensions.has(path.extname(fileName).toLowerCase()) ? fileName : '';
  }
};

const getContentType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.doc') return 'application/msword';
  if (ext === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
};

const findLocalDemoResume = (fileName) => {
  if (!fileName) return '';

  const resumeDirs = [
    path.join(__dirname, '..', 'demo-assets', 'resumes'),
    path.join(__dirname, '..', '..', 'demo-assets', 'resumes'),
  ];

  return resumeDirs
    .map((dir) => path.join(dir, fileName))
    .find((filePath) => fs.existsSync(filePath)) || '';
};

const isCloudinaryUrl = (url) => {
  try {
    return new URL(url).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
};

const sendResumeFile = async ({ res, resumeUrl, resumePublicId }) => {
  if (!resumeUrl) {
    res.status(404);
    throw new Error('Resume not found');
  }

  const fileName = getResumeFileName(resumePublicId) || getResumeFileName(resumeUrl) || 'resume.pdf';
  const safeFileName = fileName.replace(/["\r\n]/g, '');
  const localDemoResume = findLocalDemoResume(fileName);

  if (localDemoResume) {
    return res.sendFile(localDemoResume, {
      headers: {
        'Content-Type': getContentType(fileName),
        'Content-Disposition': `inline; filename="${safeFileName}"`,
      },
    });
  }

  if (!isCloudinaryUrl(resumeUrl)) {
    res.status(400);
    throw new Error('Resume URL is not supported');
  }

  const cloudinaryResponse = await fetch(resumeUrl);
  if (!cloudinaryResponse.ok) {
    res.status(cloudinaryResponse.status === 401 ? 409 : cloudinaryResponse.status);
    throw new Error(
      cloudinaryResponse.status === 401
        ? 'Cloudinary is blocking PDF/Word resume delivery. Enable PDF/ZIP delivery in Cloudinary Security settings.'
        : 'Resume file could not be loaded from Cloudinary'
    );
  }

  const buffer = Buffer.from(await cloudinaryResponse.arrayBuffer());
  res.setHeader('Content-Type', cloudinaryResponse.headers.get('content-type') || getContentType(fileName));
  res.setHeader('Content-Disposition', `inline; filename="${safeFileName}"`);
  return res.send(buffer);
};

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
    const uploaded = await uploadResumeFile(req.file);
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

  const uploaded = await uploadResumeFile(req.file);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resumeUrl: uploaded.secure_url, resumePublicId: uploaded.public_id },
    { new: true }
  );

  res.json({ resumeUrl: user.resumeUrl, message: 'Resume uploaded' });
});

// @desc    View current student's resume through the API
// @route   GET /api/applications/resume/current
const getCurrentResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('resumeUrl resumePublicId');
  await sendResumeFile({
    res,
    resumeUrl: user?.resumeUrl,
    resumePublicId: user?.resumePublicId,
  });
});

// @desc    View an application resume through the API
// @route   GET /api/applications/:id/resume
const getApplicationResume = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job', 'postedBy')
    .populate('student', 'resumeUrl resumePublicId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const isStudentOwner =
    req.user.role === 'student' &&
    application.student?._id?.toString() === req.user._id.toString();
  const isRecruiterOwner =
    req.user.role === 'recruiter' &&
    application.job?.postedBy?.toString() === req.user._id.toString();

  if (!isStudentOwner && !isRecruiterOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this resume');
  }

  await sendResumeFile({
    res,
    resumeUrl: application.resumeUrl || application.student?.resumeUrl,
    resumePublicId: application.student?.resumePublicId,
  });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  uploadResume,
  getCurrentResume,
  getApplicationResume,
};

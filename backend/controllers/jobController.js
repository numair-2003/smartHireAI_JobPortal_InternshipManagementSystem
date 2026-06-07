const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeJobPayload = (payload) => {
  const normalized = { ...payload };

  if (payload.skills !== undefined) normalized.skills = normalizeList(payload.skills);
  if (payload.requirements !== undefined) normalized.requirements = normalizeList(payload.requirements);
  if (payload.applicationDeadline === '') normalized.applicationDeadline = undefined;

  return normalized;
};

// @desc    Get all active jobs
// @route   GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { type, search, location } = req.query;
  const filter = { isActive: true };

  if (type) filter.type = type;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];
  }

  const jobs = await Job.find(filter)
    .populate('postedBy', 'name email company')
    .sort({ createdAt: -1 });

  res.json(jobs);
});

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json(job);
});

// @desc    Create job
// @route   POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const payload = normalizeJobPayload(req.body);
  const job = await Job.create({
    ...payload,
    postedBy: req.user._id,
    company: payload.company || req.user.company,
  });
  res.status(201).json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  job = await Job.findByIdAndUpdate(req.params.id, normalizeJobPayload(req.body), {
    new: true,
    runValidators: true,
  });
  res.json(job);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  await job.deleteOne();
  res.json({ message: 'Job removed' });
});

// @desc    Recruiter's jobs
// @route   GET /api/jobs/my/listings
const getMyJobs = asyncHandler(async (req, res) => {
  const Application = require('../models/Application');
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((job) => job._id) } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
  ]);
  const countMap = counts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});

  res.json(jobs.map((job) => ({
    ...job,
    applicationCount: countMap[job._id.toString()] || 0,
  })));
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };

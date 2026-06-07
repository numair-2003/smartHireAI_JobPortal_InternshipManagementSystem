const asyncHandler = require('express-async-handler');
const { reviewResume, generateJobDescription } = require('../services/aiService');

// @desc    AI resume review
// @route   POST /api/ai/resume-review
const resumeReview = asyncHandler(async (req, res) => {
  const { resumeText, jobTitle, jobSkills } = req.body;

  if (!resumeText || !jobTitle) {
    res.status(400);
    throw new Error('resumeText and jobTitle are required');
  }

  const result = await reviewResume({ resumeText, jobTitle, jobSkills });
  res.json(result);
});

// @desc    AI job description generator
// @route   POST /api/ai/job-description
const jobDescription = asyncHandler(async (req, res) => {
  const { title, skills, type, location, company } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Job title is required');
  }

  const result = await generateJobDescription({
    title,
    skills: skills || '',
    type: type || 'full-time',
    location: location || 'Remote',
    company: company || req.user?.company || 'Company',
  });

  res.json(result);
});

module.exports = { resumeReview, jobDescription };

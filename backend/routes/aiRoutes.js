const express = require('express');
const { resumeReview, jobDescription } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.post('/resume-review', protect, resumeReview);
router.post('/job-description', protect, authorize('recruiter', 'admin'), jobDescription);

module.exports = router;

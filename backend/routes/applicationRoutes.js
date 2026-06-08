const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  uploadResume,
  getCurrentResume,
  getApplicationResume,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { uploadDocument } = require('../middleware/upload');

const router = express.Router();

router.post('/resume', protect, authorize('student'), uploadDocument.single('resume'), uploadResume);
router.get('/resume/current', protect, authorize('student'), getCurrentResume);
router.post('/', protect, authorize('student'), uploadDocument.single('resume'), applyToJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.get('/:id/resume', protect, authorize('student', 'recruiter', 'admin'), getApplicationResume);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;

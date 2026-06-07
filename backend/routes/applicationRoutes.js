const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  uploadResume,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { uploadDocument } = require('../middleware/upload');

const router = express.Router();

router.post('/resume', protect, authorize('student'), uploadDocument.single('resume'), uploadResume);
router.post('/', protect, authorize('student'), uploadDocument.single('resume'), applyToJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;

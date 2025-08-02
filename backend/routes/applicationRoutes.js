const express = require('express');
const router = express.Router();
const { protect, isEmployer } = require('../middleware/authMiddleware.js');
const {
  applyToJob,
  getApplicationsForCandidate,
  getApplicationsForEmployerJob,
} = require('../controllers/applicationController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/applications/job/:id/apply
// @desc    Apply to a job
// @access  Private (Candidate)
router.post('/job/:id/apply', protect, upload.single('resume'), applyToJob);

// @route   GET /api/applications/my-applications
// @desc    Get all applications for the logged-in candidate
// @access  Private (Candidate)
router.get('/my-applications', protect, getApplicationsForCandidate);

// @route   GET /api/applications/job/:id/applications
// @desc    Get all applications for a specific job posting
// @access  Private (Employer)
router.get('/job/:id/applications', protect, isEmployer, getApplicationsForEmployerJob);

module.exports = router;
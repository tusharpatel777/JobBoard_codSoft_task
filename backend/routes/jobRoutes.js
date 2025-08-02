const express = require('express');
const { createJob, getAllJobs, getJobById, getJobsByEmployer } = require('../controllers/jobController.js');
const { protect, isEmployer } = require('../middleware/authMiddleware.js');
const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employer)
router.post('/', protect, isEmployer, createJob);

// @route   GET /api/jobs
// @desc    Get all job postings
// @access  Public
router.get('/', getAllJobs);

// @route   GET /api/jobs/my-jobs
// @desc    Get all jobs posted by the logged-in employer
// @access  Private (Employer)
router.get('/my-jobs', protect, isEmployer, getJobsByEmployer);

// @route   GET /api/jobs/:id
// @desc    Get a single job by its ID
// @access  Public
router.get('/:id', getJobById);

module.exports = router;
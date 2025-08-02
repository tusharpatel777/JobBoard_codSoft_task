const Application = require('../models/applicationModel.js');
const Job = require('../models/jobModel.js');

const applyToJob = async (req, res) => {
  const { id: jobId } = req.params;

  // Check if user is a candidate
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Only candidates can apply for jobs.' });
  }

  // Check if resume was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required.' });
  }

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Check if the candidate has already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    const newApplication = new Application({
      job: jobId,
      candidate: req.user.id,
      resume: req.file.path, 
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ message: 'Server error while applying to job.' });
  }
};

const getApplicationsForCandidate = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

const getApplicationsForEmployerJob = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    
    const job = await Job.findById(jobId);
    if (!job || job.employer.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Job not found or you are not authorized.' });
    }
    
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching job applications.' });
  }
};

module.exports = {
  applyToJob,
  getApplicationsForCandidate,
  getApplicationsForEmployerJob,
};
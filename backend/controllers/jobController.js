const Job = require('../models/jobModel.js');
const Application = require('../models/applicationModel.js');

const createJob = async (req, res) => {
  const { title, description, company, location, salary } = req.body;

  if (!title || !description || !company || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      employer: req.user.id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating job' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('employer', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching job details' });
  }
};

const getJobsByEmployer = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching employer jobs' });
    }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByEmployer,
};
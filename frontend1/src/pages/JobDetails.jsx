import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { fetchJobById, applyToJob } from '../api';
import {
  CurrencyDollarIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/solid';

function JobDetails({ user }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        setLoading(true);
        const { data } = await fetchJobById(id);
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
        toast.error("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };
    getJobDetails();
  }, [id]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Please select a resume file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);
    setIsApplying(true);
    try {
      await applyToJob(id, formData);
      toast.success('Application submitted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <p className="text-center text-slate-400 text-lg animate-pulse py-10">Loading job details...</p>;
  if (!job) return <p className="text-center text-red-400 text-lg py-10">Job not found.</p>;

  return (
    <motion.div
      className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
     
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
        {job.title}
      </h1>
      
      
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300">
        <div className="flex items-center gap-2"><BuildingOffice2Icon className="h-5 w-5 text-slate-500" />{job.company}</div>
        <div className="flex items-center gap-2"><MapPinIcon className="h-5 w-5 text-slate-500" />{job.location}</div>
        <div className="flex items-center gap-2"><CurrencyDollarIcon className="h-5 w-5 text-slate-500" />{job.salary ? `$${job.salary.toLocaleString()} / year` : 'Competitive'}</div>
      </div>

      
      <div className="mt-8 border-t border-slate-800 pt-6">
        <h2 className="text-2xl font-bold text-slate-100">Full Job Description</h2>
        <div className="mt-4 prose prose-invert prose-p:text-slate-300 prose-strong:text-slate-100 max-w-none">
          {job.description}
        </div>
      </div>
      
      
      <div className="mt-8 border-t border-slate-800 pt-6">
        <h2 className="text-2xl font-bold text-slate-100">About the Employer</h2>
        <div className="mt-4 flex items-center gap-2 text-slate-300">
          <UserCircleIcon className="h-5 w-5 text-slate-500"/> Posted by: {job.employer.name} ({job.employer.email})
        </div>
      </div>

      
      {user && user.role === 'candidate' && (
        <div className="mt-10 border-t-2 border-cyan-500 pt-8 bg-slate-800/50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-slate-100">Apply Now</h2>
          <form onSubmit={handleApply} className="mt-6 space-y-6">
            <div>
              <label htmlFor="resume-upload" className="block text-sm font-medium text-slate-300 mb-2">Upload Your Resume</label>
              <div className="relative">
                <input
                  type="file"
                  id="resume-upload"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" // Hidden input
                />
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 group hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                  <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
                  <span>{resume ? resume.name : 'Choose a file to upload'}</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isApplying}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-400/50
                         hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}

      {user && user.role === 'employer' && (
        <div className="mt-10 text-center bg-yellow-400/10 text-yellow-300 p-4 rounded-lg ring-1 ring-inset ring-yellow-400/20">
          You are logged in as an employer. <Link to="/login" className="underline font-bold text-yellow-200">Log in as a candidate</Link> to apply.
        </div>
      )}

      {!user && (
        <div className="mt-10 text-center bg-fuchsia-500/10 text-fuchsia-300 p-4 rounded-lg ring-1 ring-inset ring-fuchsia-500/20">
          <Link to="/login" className="font-bold underline">Log in</Link> or <Link to="/register" className="font-bold underline">register</Link> to apply for this job.
        </div>
      )}
    </motion.div>
  );
}

export default JobDetails;

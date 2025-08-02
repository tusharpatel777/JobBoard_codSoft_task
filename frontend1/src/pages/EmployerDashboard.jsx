import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchJobsByEmployer, fetchApplicationsForJob, createJob } from '../api';
import { PlusIcon, BriefcaseIcon, UsersIcon, PaperClipIcon } from '@heroicons/react/24/solid';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

function EmployerDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', salary: '' });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadEmployerData = async () => {
      try {
        setLoading(true);
        const { data: jobData } = await fetchJobsByEmployer();
        setJobs(jobData);
        if (jobData.length > 0) {
          const appPromises = jobData.map(job => fetchApplicationsForJob(job._id));
          const appResults = await Promise.all(appPromises);
          const appsByJob = appResults.reduce((acc, result, index) => {
            acc[jobData[index]._id] = result.data;
            return acc;
          }, {});
          setApplications(appsByJob);
        }
      } catch (error) { toast.error('Failed to load dashboard data.'); } finally { setLoading(false); }
    };
    loadEmployerData();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: newJob } = await createJob(formData);
      setJobs([newJob, ...jobs]);
      setApplications(prev => ({ ...prev, [newJob._id]: [] }));
      setFormData({ title: '', description: '', company: '', location: '', salary: '' });
      setShowForm(false);
      toast.success('Job posted successfully!');
    } catch (error) { toast.error('Failed to post job.'); }
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
     
      <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="mt-1 text-slate-400">Manage your job postings and view applications.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300">
          <PlusIcon className="h-5 w-5" /> {showForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      
      <AnimatePresence>
        {showForm && (
          <motion.div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Create New Job Posting</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input name="title" value={formData.title} onChange={onChange} placeholder="Job Title" required className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" />
              <textarea name="description" value={formData.description} onChange={onChange} placeholder="Job Description" required rows="4" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"></textarea>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="company" value={formData.company} onChange={onChange} placeholder="Company Name" required className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" />
                <input name="location" value={formData.location} onChange={onChange} placeholder="Location" required className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" />
                <input name="salary" type="number" value={formData.salary} onChange={onChange} placeholder="Salary (e.g., 90000)" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all">Submit Job</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-800">
        <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
          <BriefcaseIcon className="h-8 w-8 text-cyan-400" />
          Your Job Postings
        </h2>
        {loading ? (<p className="text-center text-slate-400 animate-pulse py-8">Loading your jobs...</p>) : (
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {jobs.length > 0 ? jobs.map(job => (
              <motion.div key={job._id} className="bg-slate-800/60 p-5 rounded-lg border border-slate-700" variants={itemVariants}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">{job.title}</h3>
                    <p className="text-sm text-slate-400">{job.location}</p>
                  </div>
                  <span className="text-sm font-bold text-green-400">{applications[job._id]?.length || 0} Applications</span>
                </div>
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5"/>Applicants</h4>
                  {applications[job._id]?.length > 0 ? (
                    <ul className="space-y-2">
                      {applications[job._id].map(app => (
                        <li key={app._id} className="text-sm flex items-center justify-between p-2 rounded-md hover:bg-slate-700/50 transition-colors">
                          <span className="text-slate-200">{app.candidate.name} ({app.candidate.email})</span>
                          <a href={`${API_URL}/${app.resume}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"><PaperClipIcon className="h-4 w-4" /> Resume</a>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500 italic">No applications yet for this job.</p>}
                </div>
              </motion.div>
            )) : (<div className="text-center py-10"><p className="text-slate-400 text-lg">You have not posted any jobs yet.</p></div>)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default EmployerDashboard;
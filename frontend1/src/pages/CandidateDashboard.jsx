import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchApplicationsByCandidate } from '../api'; 
import { DocumentTextIcon, CalendarDaysIcon, BuildingOffice2Icon, ChartBarIcon } from '@heroicons/react/24/outline';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Controls the delay between each row animating in
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

function CandidateDashboard({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const { data } = await fetchApplicationsByCandidate();
        setApplications(data);
      } catch (error) {
        toast.error('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  
  const getStatusPill = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20';
      case 'reviewed':
        return 'bg-yellow-400/10 text-yellow-300 ring-1 ring-inset ring-yellow-400/20';
      case 'rejected':
        return 'bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/20';
      default:
        return 'bg-slate-400/10 text-slate-300 ring-1 ring-inset ring-slate-400/20';
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <div className="p-8 rounded-xl shadow-lg bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white">
        <h1 className="text-4xl font-extrabold text-slate-100">
          Your Dashboard
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-200">
          Welcome back, {user.name}! Here's a summary of your job applications.
        </p>
      </div>

      
      <motion.div
        className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          ✨ My Applications
        </h2>

        {loading ? (
          <p className="text-center text-slate-400 animate-pulse py-8">Loading your applications...</p>
        ) : (
          <div className="overflow-x-auto">
            {applications.length > 0 ? (
              <motion.table
                className="min-w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <thead className="border-b-2 border-slate-700">
                  <tr>
                    {['Job Title', 'Company', 'Date Applied', 'Status', 'Resume'].map((col) => (
                      <th key={col} className="px-6 py-4 text-left text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants}>
                  {applications.map((app) => (
                    <motion.tr
                      key={app._id}
                      className="border-b border-slate-800 hover:bg-slate-700/50 transition-colors duration-200"
                      variants={itemVariants}
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-base font-semibold text-slate-100">
                        <Link to={`/job/${app.job._id}`} className="hover:text-cyan-400 transition-colors">
                          {app.job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-300">{app.job.company}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full capitalize ${getStatusPill(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-cyan-400 hover:text-cyan-300">
                        <a href={`${API_URL}/${app.resume}`} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">
                          View Resume
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </motion.table>
            ) : (
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-slate-400 text-lg">You haven’t applied to any jobs yet.</p>
                <Link to="/jobs" className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-cyan-400/50 transition-shadow">
                  Find Your First Job
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default CandidateDashboard;
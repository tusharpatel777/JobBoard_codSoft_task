import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { fetchJobs } from '../api'; 
import JobCard from '../components/JobCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
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

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const { data } = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          Find Your Next Opportunity
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
          Use the search bar below to filter through thousands of job openings from top-tier companies around the world.
        </p>
        <div className="relative max-w-2xl mx-auto">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-200 placeholder-slate-400 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                       transition-all duration-300"
          />
        </div>
      </div>

      
      {loading ? (
        <div className="text-center text-lg text-slate-400 py-10 animate-pulse">Loading amazing jobs...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div key={job._id} variants={itemVariants}>
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-12">
              <h3 className="text-2xl font-bold text-slate-200">No Jobs Found</h3>
              <p className="text-slate-400 mt-2">Try adjusting your search terms to find your perfect role.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Jobs;
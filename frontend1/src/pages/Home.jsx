import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
      
        const { data } = await fetchJobs();
        setFeaturedJobs(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  return (
    <motion.div
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      <div className="text-center py-16 px-4 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-60"></div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          Your Career, Supercharged.
        </motion.h1>

        <motion.p
          className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
        >
          Discover thousands of job openings from innovative companies and find the role that's right for you.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
        >
          <Link
            to="/jobs"
            className="mt-8 inline-block bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-3 rounded-lg 
                       text-base font-bold shadow-lg hover:shadow-cyan-400/50
                       hover:scale-105 transition-all duration-300"
          >
            Browse All Jobs
          </Link>
        </motion.div>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-100">
          ✨ Featured Listings
        </h2>

        {loading ? (
          <p className="text-center text-lg text-slate-400 animate-pulse">Loading featured jobs...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <motion.div key={job._id} variants={itemVariants}>
                  <JobCard job={job} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-12">
                <h3 className="text-2xl font-bold text-slate-200">No Jobs Available</h3>
                <p className="text-slate-400 mt-2">Please check back later for new opportunities.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Home;
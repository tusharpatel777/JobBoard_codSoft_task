
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar({ user, onLogout }) {
  
  
  const activeLinkStyle = "bg-slate-700/50 text-cyan-400 font-semibold px-4 py-2 rounded-lg";
  const inactiveLinkStyle = "text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg font-medium";

  return (
   
    <motion.nav
      className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">

         
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              JobRadar
            </Link>
          </div>

          
          <div className="hidden sm:block sm:ml-6">
            <div className="flex items-center space-x-4">
              <NavLink 
                to="/jobs" 
                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
              >
                All Jobs
              </NavLink>
              
             
              {user && user.role === 'employer' && (
                <NavLink to="/employer-dashboard" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>
                  Dashboard
                </NavLink>
              )}
              {user && user.role === 'candidate' && (
                <NavLink to="/candidate-dashboard" className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}>
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>

        
          <div className="flex items-center">
            {user ? (
              <button 
                onClick={onLogout} 
                className="font-medium text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink 
                  to="/login" 
                  className="font-medium text-slate-200 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
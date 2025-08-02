import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
   
    <footer className="mt-auto bg-transparent border-t border-slate-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.p 
          className="text-sm text-slate-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          © {new Date().getFullYear()} 
          

          <span className="font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            JobRadar
          </span>
          . all rights reserved.
        </motion.p>
        
      </div>
    </footer>
  );
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOffice2Icon, MapPinIcon } from '@heroicons/react/24/solid';

function JobCard({ job }) {
  return (
   
    <div className="bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col 
                   hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10
                   transition-all duration-300 border border-slate-800">


      <div className="flex-grow">
        
        
        <h3 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {job.title}
        </h3>

       
        <div className="flex items-center mt-3 text-slate-300">
          <BuildingOffice2Icon className="h-5 w-5 text-slate-500 mr-2" />
          <span className="text-base font-medium">{job.company}</span>
        </div>

      
        <div className="flex items-center mt-1 text-slate-400">
          <MapPinIcon className="h-5 w-5 text-slate-500 mr-2" />
          <span className="text-sm">{job.location}</span>
        </div>

  
        <p className="mt-4 text-slate-400 text-sm leading-relaxed">
          {job.description.length > 120
            ? `${job.description.substring(0, 120)}...`
            : job.description}
        </p>
      </div>

  
      <div className="mt-5 flex justify-between items-center pt-4 border-t border-slate-800">
        
        
        <span className="text-lg font-bold text-green-400">
          {job.salary ? `$${job.salary.toLocaleString()}` : 'Competitive'}
        </span>

       
        <Link
          to={`/job/${job._id}`}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2.5 rounded-lg 
                     text-sm font-semibold shadow-lg hover:shadow-cyan-400/50
                     hover:from-blue-600 hover:to-cyan-500 hover:scale-105
                     transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';


import { register } from '../api';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

function Register({ setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '', role: 'candidate' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { name, email, password, password2, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register({ name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Registration successful!');
      if (data.role === 'employer') { navigate('/employer-dashboard'); } else { navigate('/candidate-dashboard'); }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <h2 className="text-center text-4xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mb-8">
          Create Your Account
        </h2>
        <form className="space-y-5" onSubmit={onSubmit}>
       
          <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input name="name" type="text" value={name} onChange={onChange} required className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" placeholder="Full Name" /></div>
         
          <div className="relative"><EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input name="email" type="email" value={email} onChange={onChange} required className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" placeholder="Email address" /></div>
         
          <div className="relative"><LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input name="password" type="password" value={password} onChange={onChange} required className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" placeholder="Password" /></div>
          
          <div className="relative"><LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><input name="password2" type="password" value={password2} onChange={onChange} required className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" placeholder="Confirm Password" /></div>

        
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">I am a:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${role === 'candidate' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'} border-2`}><input type="radio" className="sr-only" name="role" value="candidate" checked={role === 'candidate'} onChange={onChange} />Candidate</label>
              <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${role === 'employer' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'} border-2`}><input type="radio" className="sr-only" name="role" value="employer" checked={role === 'employer'} onChange={onChange} />Employer</label>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
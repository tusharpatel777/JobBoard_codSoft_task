import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// AUTH
export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);

// JOBS
export const fetchJobs = () => API.get('/jobs');
export const fetchJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (jobData) => API.post('/jobs', jobData);
export const fetchJobsByEmployer = () => API.get('/jobs/my-jobs');

// APPLICATIONS
export const applyToJob = (jobId, formData) => {
  return API.post(`/applications/job/${jobId}/apply`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const fetchApplicationsByCandidate = () => API.get('/applications/my-applications');
export const fetchApplicationsForJob = (jobId) => API.get(`/applications/job/${jobId}/applications`);
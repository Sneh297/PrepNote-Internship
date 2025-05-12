import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) {
    window.location.href = '/test';
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axiosInstance.post('auth/admin/register', formData);
      setSuccess(res.data.message || 'Registered successfully');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Admin Register</h2>

        {error && <p className='text-red-500 mb-4 text-sm'>{error}</p>}
        {success && <p className='text-green-500 mb-4 text-sm'>{success}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

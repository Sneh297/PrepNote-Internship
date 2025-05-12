import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Import the Axios instance

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) {
    window.location.href = '/manage-test'; // Redirect to a protected route
    return;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use axiosInstance for API call
      const response = await axiosInstance.post('auth/admin/login', {
        username,
        password,
      }); // Base URL already set
      localStorage.setItem('token', response.data.data.token);

      window.location.href = '/manage-test'; // Redirect to a protected route
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-bold text-center mb-6'>Admin Login</h2>

        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-gray-700'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-semibold text-gray-700'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 bg-blue-500 text-white font-semibold rounded-lg focus:outline-none ${
              loading ? 'opacity-50' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

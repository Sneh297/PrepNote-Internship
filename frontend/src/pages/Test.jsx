import React from 'react';

const Test = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md text-center'>
        <h1 className='text-2xl font-bold mb-4'>Test Page</h1>
        <button
          onClick={handleLogout}
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Test;

// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {' '}
    {/* Wrap your App with BrowserRouter */}
    <App />
  </BrowserRouter>
);

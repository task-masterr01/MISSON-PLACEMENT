import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditApplication from './pages/EditApplication';
import AddApplication from './pages/addApplication';
import Auth from './pages/Auth';
import './App.css';

const App = () => {
  // Initialize token from localStorage if it exists
  const [token, setToken] = useState(localStorage.getItem('token'));
  const user = JSON.parse(localStorage.getItem('user')); // Get user info if needed

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">Job Tracker</Link>
          
          <div className="space-x-4 flex items-center">
            {token ? (
              <>
                <Link to="/" className="hover:text-blue-300">Dashboard</Link>
                <Link to="/add" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">+ New</Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 ml-4 border border-gray-600 px-3 py-1 rounded">
                  Logout
                </button>
              </>
            ) : (
              <span className="text-gray-400">Please login to continue</span>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto p-4 mt-8">
        <Routes>
          {/* If there is no token, force them to the Auth page. If there is, show the real routes. */}
          {!token ? (
            <>
              <Route path="/auth" element={<Auth setToken={setToken} />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddApplication />} />
              <Route path="/edit/:id" element={<EditApplication />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
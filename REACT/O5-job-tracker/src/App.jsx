import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditApplication from './pages/EditApplication';
import './App.css';
import AddApplication from './pages/addApplication';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">Job Tracker</Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-300">Dashboard</Link>
            <Link to="/add" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">+ New Application</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 mt-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddApplication />} />
          <Route path="/edit/:id" element={<EditApplication />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddApplication = () => {
  // 1. Controlled Inputs (React owns this data)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    notes: '',
    link: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Used to redirect user after saving

  // Handle changes in inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Handle Form Submit (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload!
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // We are sending JSON
        },
        body: JSON.stringify(formData) // Convert state object to JSON string
      });

      if (response.ok) {
        navigate('/'); // Redirect back to dashboard on success
      } else {
        alert("Failed to add application");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Add New Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
          <input 
            type="text" 
            name="company" 
            required 
            value={formData.company} 
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Role Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
          <input 
            type="text" 
            name="role" 
            required 
            value={formData.role} 
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
          <textarea 
            name="notes" 
            rows="3" 
            value={formData.notes} 
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Application'}
        </button>
      </form>
    </div>
  );
};

export default AddApplication;
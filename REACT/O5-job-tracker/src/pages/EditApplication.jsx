import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditApplication = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g., /edit/3)
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    status: 'Applied',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch the existing application data on load
  useEffect(() => {
    // We fetch ALL applications and find the right one (simple way)
    // In a massive app, you'd make a GET /api/applications/:id route on the backend instead.
    fetch('http://localhost:5001/api/applications')
      .then(res => res.json())
      .then(data => {
        // Use Number(id) because URL params are always strings, but DB IDs are numbers
        const app = data.find(item => item.id === Number(id)); 
        if (app) {
          setFormData({
            status: app.status || 'Applied',
            notes: app.notes || ''
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Submit the UPDATE (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:5001/api/applications/${id}`, {
        method: 'PUT', // <-- PUT means Update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/'); // Go back to Dashboard
      } else {
        alert("Failed to update application");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Update Application Status</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">New Status</label>
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Update Notes</label>
          <textarea 
            name="notes" 
            rows="4" 
            value={formData.notes} 
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="e.g., Interview scheduled for Tuesday at 2 PM"
          ></textarea>
        </div>

        <div className="flex space-x-3 pt-4">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;
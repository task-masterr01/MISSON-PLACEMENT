import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditApplication = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g., /edit/3)
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    status: 'Applied',
    notes: ''
  });

  // NEW: State to hold the interviews
  const [interviews, setInterviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

    // NEW: State for the "Add Interview" form
  const [newInterview, setNewInterview] = useState({
    round_type: 'Initial HR Screening',
    interview_date: '',
    feedback: ''
  });
  const [addingInterview, setAddingInterview] = useState(false);

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

      fetch(`http://localhost:5001/api/applications/${id}/interviews`)
      .then(res => res.json())
      .then(data => {
        setInterviews(data);
        setLoading(false); // Stop loading after interviews arrive
      })
      .catch(err => {
        console.error("Error fetching interviews", err);
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

    const handleInterviewChange = (e) => {
    setNewInterview({
      ...newInterview,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInterview = async (e) => {
    e.preventDefault();
    setAddingInterview(true);

    try {
      const response = await fetch(`http://localhost:5001/api/applications/${id}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInterview)
      });

      if (response.ok) {
        const addedInterview = await response.json();
        // Add the new interview to the UI immediately
        setInterviews([...interviews, addedInterview]);
        // Reset the form
        setNewInterview({ round_type: 'Initial HR Screening', interview_date: '', feedback: '' });
      } else {
        alert("Failed to add interview");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setAddingInterview(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div  className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Update  Status</h2>
      
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
     {/* RIGHT COLUMN: The Interviews List */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Interview Rounds</h2>
        
        {interviews.length === 0 ? (
          <p className="text-gray-400">No interviews recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-gray-700 p-4 rounded border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-400">{interview.round_type}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(interview.interview_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{interview.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>

              {/* ADD INTERVIEW FORM */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">Add New Round</h3>
          <form onSubmit={handleAddInterview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Round Type</label>
              <select 
                name="round_type" 
                value={newInterview.round_type} 
                onChange={handleInterviewChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Initial HR Screening">Initial HR Screening</option>
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="Manager Round">Manager Round</option>
                <option value="HR Final">HR Final</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input 
                type="date" 
                name="interview_date" 
                required 
                value={newInterview.interview_date} 
                onChange={handleInterviewChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Feedback / Notes</label>
              <textarea 
                name="feedback" 
                rows="2" 
                value={newInterview.feedback} 
                onChange={handleInterviewChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={addingInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {addingInterview ? 'Adding...' : 'Add Interview'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default EditApplication;
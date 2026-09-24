import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5001/api/applications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false); // <--- THIS WAS MISSING
      })
      .catch(err => {
        console.error(err);
        setLoading(false); // Turn off loading even if there's an error
      });
  }, []);

  // 2. Handle Delete (DELETE request)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

     const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:5001/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Attach it here too
        }
      });
      // Filter it out of the UI without needing to refresh the page
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  // 3. Status Badge Color Helper
  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-600';
      case 'Interview': return 'bg-yellow-500';
      case 'Rejected': return 'bg-red-600';
      case 'Offer': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) return <div className="text-center mt-10">Loading applications...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Applications</h1>
      
      {applications.length === 0 ? (
        <p className="text-gray-400">No applications yet. Go apply somewhere!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white">{app.company}</h2>
                  <span className={`px-2 py-1 text-xs font-semibold rounded text-white ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-gray-400 font-medium mb-1">{app.role}</p>
                <p className="text-xs text-gray-500 mb-4">Applied: {new Date(app.date_applied).toLocaleDateString()}</p>
                
                {app.notes && (
                  <p className="text-sm text-gray-300 bg-gray-700 p-2 rounded mb-4">
                    📝 {app.notes}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-4 border-t border-gray-700 pt-4">
                <Link 
                  to={`/edit/${app.id}`} 
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(app.id)}
                  className="text-sm text-red-500 hover:text-red-400 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
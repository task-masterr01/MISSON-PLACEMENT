import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setToken }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage so it survives page reloads
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update App state
        setToken(data.token);
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required={!isLogin}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input 
            type="email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input 
            type="password" name="password" value={formData.password} onChange={handleChange} required
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-400 text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }} 
          className="text-blue-400 hover:underline"
        >
          {isLogin ? 'Sign up here' : 'Login here'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
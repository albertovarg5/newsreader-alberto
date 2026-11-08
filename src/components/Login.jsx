import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Demo authentication (see AuthContext); a real app would call a backend
    try {
      login(username, password);
      // Redirect to saved articles after successful login
      navigate('/saved');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to NewsReader</h2>
        <p className="login-subtitle">Access your personalized news experience</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary login-button">
            Login
          </button>
        </form>

        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts (for testing):</p>
          <p>alice / alice123 (regular)</p>
          <p>bob / bob123 (regular)</p>
          <p>admin / admin123 (admin)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

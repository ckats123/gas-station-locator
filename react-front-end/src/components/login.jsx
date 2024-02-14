import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../styles/login.scss";

const Login = () => {
  const navigate = useNavigate();  // Use the useNavigate hook

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/login', formData);

      if (response.status === 200) {
        // Login successful, redirect to home page
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem("isLoggedIn", "true");
        console.log('Login successful');
        navigate('/Home');  // Redirect to the home page
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login-container'>
          <div className="form-container">
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          onChange={handleEmailChange}
          required
          value={formData.email}
        />

        <label>Password</label>
        <input
          type="password"
          onChange={handlePasswordChange}
          required
          value={formData.password}
        />

        <button type="submit">
          Login
        </button>
      </form>

      <small>
        Need an account? <Link to="/Register">Register here</Link>
      </small>
    </div>
    </div>

  );
};

export default Login;

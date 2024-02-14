import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Paper } from "@mui/material";

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
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={20} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <img src="gasstation.png" alt="Gas Station Locator" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <h2>Login Form</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              onChange={handleEmailChange}
              required
              variant="outlined"
              color="secondary"
              type="email"
              sx={{ mb: 3 }}
              fullWidth
              value={formData.email}
            />

            <TextField
              label="Password"
              onChange={handlePasswordChange}
              required
              variant="outlined"
              color="secondary"
              type="password"
              value={formData.password}
              fullWidth
              sx={{ mb: 3 }}
            />

            <Button variant="outlined" color="secondary" type="submit">
              Login
            </Button>
          </form>
          <small>
            Need an account? <Link to="/Register">Register here</Link>
          </small>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;

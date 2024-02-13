import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Stack } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();  // Use the useNavigate hook

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/register', formData);

      if (response.status === 201) {
        // Registration successful, log in the user and navigate to the home page
        console.log('User registered successfully');
        // Perform login (if needed)
        // ...

        // Navigate to the home page
        navigate('/Home');
      } else {
        // Handle registration error
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <React.Fragment>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            fullWidth
            required
          />
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Last Name"
            name="lastname"
            onChange={handleChange}
            value={formData.lastname}
            fullWidth
            required
          />
        </Stack>
        <TextField
          type="text"
          variant="outlined"
          color="secondary"
          label="Username"
          name="username"
          onChange={handleChange}
          value={formData.username}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <TextField
          type="email"
          variant="outlined"
          color="secondary"
          label="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          variant="outlined"
          color="secondary"
          label="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
          fullWidth
          sx={{ mb: 4 }}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Register
        </Button>
      </form>
      <p>
      Already have an account? <Link to="/login">Login here</Link>
      </p>
    </React.Fragment>
  );
};

export default Register;

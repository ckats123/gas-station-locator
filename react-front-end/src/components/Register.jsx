import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../styles/Register.scss";
const Register = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

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
    <div className="register-container">
     
      <form onSubmit={handleSubmit}>
      <h2>Register</h2>
        <div className="form-group">
          <input
            type="text"
            className="input-field"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Last Name"
            name="lastname"
            onChange={handleChange}
            value={formData.lastname}
            required
          />
        </div>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button className="submit-button" type="submit">
          Register
        </button>
      
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      </form>
    </div>
  );
};

export default Register;

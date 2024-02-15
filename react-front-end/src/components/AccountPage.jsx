// AccountPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPage.scss'; // Import the SCSS file

const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:8080/api/account/${userId}`)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const handleClose = () => {
    // Navigate back to the home page
    navigate('/Home');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Clear password fields and error when closing the modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      const userId = localStorage.getItem('userId');

      // Check if the current password matches the password in the database
      const response = await axios.post(`http://localhost:8080/api/account/${userId}/checkpassword`, {
        currentPassword,
      });

      if (response.status === 200 && response.data.isValid) {
        // Current password is valid, proceed with changing the password
        const changePasswordResponse = await axios.put(`http://localhost:8080/api/account/${userId}/changepassword`, {
          newPassword,
        });

        if (changePasswordResponse.status === 200) {
          setError(null);
          console.log('Password changed successfully');
          // Close the modal after successful password change
          handleCloseModal();
          // Additional logic after successful password change
        } else {
          setError('Failed to change password');
        }
      } else {
        setError('Current password is incorrect');
      }
    } catch (error) {
      setError('Error changing password');
      console.error('Error changing password:', error);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="AccountPage">
      <h2>Account Information</h2>
      <div className="info-box">
        <label>Name:</label>
        <div>{userData.name}</div>
      </div>
      <div className="info-box">
        <label>Lastname:</label>
        <div>{userData.lastname}</div>
      </div>
      <div className="info-box">
        <label>Username:</label>
        <div>{userData.username}</div>
      </div>
      <div className="info-box">
        <label>Email:</label>
        <div>{userData.email}</div>
      </div>

      <div className="button-container">
        <div className="close-button-box">
          <button onClick={handleClose}>Close</button>
        </div>
      <div className="password-change-box">
          <button onClick={handleOpenModal}>Change Password</button>
        </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Change Password</h2>
            <div>
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleChangePassword}>Save Changes</button>
          </div>
        </div>
      )}
    
      </div>
      
    </div>
    
  );
};

export default AccountPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './profile.css';
import pfp from '../components/assets/pfp.jpeg';

const Profile = () => {
  const { email } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    contact: '',
    profilePic: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No token found, please log in");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/profile/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserDetails(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        alert("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found, please log in");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/profile/${email}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserDetails(response.data);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (!userDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={pfp}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          <h1>{userDetails.firstname} {userDetails.lastname}</h1>
        </div>
        
        <div className="profile-info">
          {editMode ? (
            <>
              <div className="info-group">
                <label className="info-label">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="info-group">
                <label className="info-label">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="info-group">
                <label className="info-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="edit-input"
                  disabled
                />
              </div>
              <div className="info-group">
                <label className="info-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="info-group">
                <label className="info-label">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-group">
                <span className="info-label">First Name</span>
                <span className="info-value">{userDetails.firstname}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Last Name</span>
                <span className="info-value">{userDetails.lastname}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email</span>
                <span className="info-value">{userDetails.email}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Age</span>
                <span className="info-value">{userDetails.age}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Contact</span>
                <span className="info-value">{userDetails.contact}</span>
              </div>
            </>
          )}
        </div>

        <div className="button-group">
          {editMode ? (
            <>
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-button" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
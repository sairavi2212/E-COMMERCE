import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './pendingdeliveries.css';
import EachOrder from '../components/eachorder/each_order';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';

const PendingDeliveries = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [otpInput, setOtpInput] = useState({});

  useEffect(() => {
    const fetchPendingDeliveries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your pending deliveries");
        return;
      }
      let user_id;
      try {
        const decoded = jwt_decode(token);
        user_id = decoded.userId;
      } catch (error) {
        console.error("Failed to decode token:", error);
        alert("Failed to decode token");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:4000/pendingdeliveries/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingDeliveries(response.data);
      } catch (err) {
        console.error("Error fetching pending deliveries:", err);
        alert("Failed to fetch pending deliveries");
      }
    };
    fetchPendingDeliveries();
  }, []);

  const handleOtpChange = (orderId, value) => {
    setOtpInput({ ...otpInput, [orderId]: value });
  };

  const handleVerifyOtp = async (orderId) => {
    const otp = otpInput[orderId];
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:4000/verifyotp`, { orderId, otp });
      if (response.data.valid) {
        alert("OTP verified successfully");
        setPendingDeliveries(pendingDeliveries.filter(order => order._id !== orderId));
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("Failed to verify OTP");
    }
  };

  return (
    <div className="pending-deliveries-container">
      <h1 className="page-title">Pending Deliveries</h1>
      {pendingDeliveries.length === 0 ? (
        <p className="no-deliveries-message">No pending deliveries</p>
      ) : (
        <div className="deliveries-grid">
          {pendingDeliveries.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-image-container">
                <img src={order.product_id.image} alt={order.product_id.name} className="order-image" />
              </div>
              <div className="order-details">
                <h3 className="product-name">{order.product_id.name}</h3>
                <div className="order-info">
                  <p className="info-item">Quantity: {order.quantity}</p>
                  <p className="info-item">Price: ${order.price}</p>
                  <p className="info-item">Buyer: {order.buyer_id.firstname} {order.buyer_id.lastname}</p>
                </div>
                <div className="otp-section">
                  <input
                    type="text"
                    className="otp-input"
                    placeholder="Enter OTP"
                    value={otpInput[order._id] || ''}
                    onChange={(e) => handleOtpChange(order._id, e.target.value)}
                  />
                  <button 
                    className="verify-button"
                    onClick={() => handleVerifyOtp(order._id)}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
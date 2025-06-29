import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './pendingorders.css';
import EachOrder from '../components/eachorder/each_order';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your pending orders");
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
        const response = await axios.get(`http://localhost:4000/pendingorders/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const pendingOrders = response.data;
        console.log(pendingOrders);
        setPendingOrders(pendingOrders);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
        alert("Failed to fetch pending orders");
      }
    };

    fetchPendingOrders();
  }, []);

  return (
    <div className="pending-deliveries-container">
      <h1 className="page-title">Pending Orders</h1>
      {pendingOrders.length === 0 ? (
        <p className="no-deliveries-message">No pending orders</p>
      ) : (
        <div className="deliveries-grid">
          {pendingOrders.map(order => (
            <EachOrder
              key={order._id}
              product={{
                ...order.product_id,
                count: order.quantity,
                price: order.price,
                sellerName: `${order.seller_id.firstname} ${order.seller_id.lastname}`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import OrderCard from '../components/eachorder/each_order';
import bcrypt from 'bcryptjs';

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
        const decoded = jwtDecode(token);
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

        const ordersWithOtp = await Promise.all(pendingOrders.map(async order => {
          console.log(order._id);
          const otp = localStorage.getItem(order._id);
          console.log(otp);
          if (otp) {
            const isOtpValid = await bcrypt.compare(otp, order.otp);
            return { ...order, otp: isOtpValid ? otp : 'Invalid OTP' };
          }
          return order;
        }));
        
        console.log(ordersWithOtp);
        setPendingOrders(ordersWithOtp);
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
            <OrderCard
              key={order._id}
              product={{
                ...order.product_id,
                count: order.quantity,
                price: order.price,
                otp: order.otp,
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
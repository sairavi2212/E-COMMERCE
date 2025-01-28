import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './completeddeliveries.css';

const CompletedDeliveries = () => {
  const [completedDeliveries, setCompletedDeliveries] = useState([]);

  useEffect(() => {
    const fetchCompletedDeliveries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your completed deliveries");
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
        const response = await axios.get(`http://localhost:4000/completeddeliveries/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompletedDeliveries(response.data);
      } catch (err) {
        console.error("Error fetching completed deliveries:", err);
        alert("Failed to fetch completed deliveries");
      }
    };

    fetchCompletedDeliveries();
  }, []);

  return (
    <div className="completed-deliveries-container">
      <h1 className="center">Completed Deliveries</h1>
      {completedDeliveries.length === 0 ? (
        <p className='center redtext'>No completed deliveries</p>
      ) : (
        <div className="deliveries-grid">
          {completedDeliveries.map(order => (
            <div key={order._id} className="order-card">
              <img src={order.product_id.image} alt={order.product_id.name} className="product-image" />
              <h3 className="order-title">{order.product_id.name}</h3>
              <p className="order-detail">Quantity: {order.quantity}</p>
              <p className="order-detail">Price: ${order.price}</p>
              <p className="order-detail">Buyer: {order.buyer_id.firstname} {order.buyer_id.lastname}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
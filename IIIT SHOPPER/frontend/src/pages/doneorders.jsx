import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './doneorders.css';

const DoneOrders = () => {
  const [doneOrders, setDoneOrders] = useState([]);

  useEffect(() => {
    const fetchDoneOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your completed orders");
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
        const response = await axios.get(`http://localhost:4000/doneorders/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDoneOrders(response.data);
      } catch (err) {
        console.error("Error fetching completed orders:", err);
        alert("Failed to fetch completed orders");
      }
    };

    fetchDoneOrders();
  }, []);

  return (
    <div className="done-orders-container">
      <h1 className="center title">Completed Orders</h1>
      {doneOrders.length === 0 ? (
        <p className="center red-text">No completed orders</p>
      ) : (
        <div className="orders-grid">
          {doneOrders.map(order => (
            <div className="order-card" key={order._id}>
              <img src={order.product_id.image} alt={order.product_id.name} className="product-image" />
              <h3 className="product-name">{order.product_id.name}</h3>
              <p className="order-detail">Quantity: {order.quantity}</p>
              <p className="order-detail">Price: ${order.price}</p>
              <p className="order-detail">
                Seller: {order.seller_id.firstname} {order.seller_id.lastname}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoneOrders;
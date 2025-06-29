import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './view_cart.css';
import jwt_decode from 'jwt-decode';
import BasicCard from '../components/eachprod/each_prod';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your cart");
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
        const response = await axios.get(`http://localhost:4000/viewcart/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response.data);
        console.log(response.data);
        const total = response.data.reduce((acc, item) => acc + item.product.price * item.product.count, 0);
        setTotalCost(total);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        alert("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, []);

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to proceed with the purchase");
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

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const otp = generateOTP();

    try {
      const response = await axios.post(`http://localhost:4000/buy/${user_id}`, { otp }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { orderIds } = response.data;
      orderIds.forEach(orderId => {
        localStorage.setItem(orderId, otp);
      });
      alert("Order placed successfully");
      setCartItems([]);
      setTotalCost(0);
    } catch (err) {
      console.error("Error processing purchase:", err);
      alert("Failed to process purchase");
    }
  };

  return (

    <div className="view-cart">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.map(item => {
          console.log(item.product);
          return <BasicCard key={item._id} product={item.product} />
        })}
      </div>
      <div className="total-cost">
        <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
      </div>
      <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ViewCart;



// from cart click on buy now then  --> done
// cart becomes empty -> done
// all these orders go to pending orders of buyer with hashed otp being stored in db
// all those orders go to db with status pending -> done
// then seller should take otp from db and enter it in the otp field
// then the status of order in db changes to processed
// from buyer side it should be gone from pending orders and go to processed orders
// for seller it should be selled products
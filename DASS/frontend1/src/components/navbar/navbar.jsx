import React, { useState, useEffect } from 'react';
import logo from '../assets/bag.png';
import cart_icon from '../assets/cart.png';
import './navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import user_icon from '../assets/user.png';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to toggle dropdown visibility

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchCartCount(token);
    }
  }, []);

  const fetchCartCount = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const user_id = decoded.userId;
      const response = await axios.get(`http://localhost:4000/cartcount/${user_id}`);
      setCartCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const getEmail = () => {
    const token = localStorage.getItem('token');
    try {
      const decoded = jwtDecode(token);
      return decoded.email.split('@')[0];
    } catch (error) {
      console.error("Failed to decode token:", error);
      return "";
    }
  };

  const getId = () => {
    const token = localStorage.getItem('token');
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    setIsLoggedIn(false); // Set login status to false
    navigate("/"); // Redirect to home page or login page
  };

  const handleCartClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const user_id = decoded.userId;
        navigate(`/viewcart/${user_id}`);
      } catch (error) {
        console.error("Failed to decode token:", error);
        alert("Failed to decode token");
      }
    } else {
      alert("Please log in to view your cart");
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>SHOPPER</p>
      </div>
      
      <nav className="nav-menu">
        <NavLink 
          className={(e) => (e.isActive ? "red" : "")} 
          to="/" 
          onClick={() => setMenu("shop")}
        >
          <li>Shop {menu === "shop" ? <h /> : <></>}</li>
        </NavLink>
        <NavLink 
          className={(e) => (e.isActive ? "red" : "")} 
          to="/sell" 
          onClick={() => setMenu("sell")}
        >
          <li>Sell {menu === "sell" ? <h /> : <></>}</li>
        </NavLink>
      </nav>
      
      <div className="nav-login-cart">
        {!isLoggedIn ? (
          <NavLink 
            className={(e) => (e.isActive ? "red" : "")} 
            to="/login"
          >
            <button>Login</button>
          </NavLink>
        ) : (
          <>
            <div className="profile-dropdown" onClick={toggleDropdown}>
              <img src={user_icon} className='userpic' alt="user" />
              {dropdownVisible && (
                <div className="dropdown-content">
                  <NavLink to={`/profile/${getEmail()}`}>My Profile</NavLink>
                  <NavLink to={`/myorders/${getId()}`}>My Completed Orders</NavLink>
                  <NavLink to={`/pendingorders/${getId()}`}>My Pending Orders</NavLink>
                  <NavLink to={`/pendingdeliveries/${getId()}`}>My Pending Deliveries</NavLink>
                  <NavLink to={`/completeddeliveries/${getId()}`}>My Completed Deliveries</NavLink>
                </div>
              )}
            </div>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
          <img src={cart_icon} alt="cart" />
        </div>
        <div className="nav-cart-count">{cartCount}</div>
      </div>
    </div>
  );
};

export default Navbar;
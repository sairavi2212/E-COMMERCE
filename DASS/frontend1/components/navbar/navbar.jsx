import React, { useState ,  useEffect} from 'react';
import logo from '../assets/bag.png';
import cart_icon from '../assets/cart.png';
import './navbar.css';
import { NavLink , useNavigate} from 'react-router-dom';
import user_icon from '../assets/user.png';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();
  console.log(useParams());
  const {email}=useParams();
  console.log(email);
  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  const getEmail = () => {
    const token = localStorage.getItem('token');
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return decoded.email.split('@')[0];
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
          to="/mens" 
          onClick={() => setMenu("mens")}
        >
          <li>Men {menu === "mens" ? <h /> : <></>}</li>
        </NavLink>
        <NavLink 
          className={(e) => (e.isActive ? "red" : "")} 
          to="/womens" 
          onClick={() => setMenu("womens")}
        >
          <li>Women {menu === "womens" ? <h /> : <></>}</li>
        </NavLink>
        <NavLink 
          className={(e) => (e.isActive ? "red" : "")} 
          to="/kids" 
          onClick={() => setMenu("kids")}
        >
          <li>Kids {menu === "kids" ? <h /> : <></>}</li>
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
          <NavLink to={`/profile/${getEmail()}`}>
            <img src={user_icon} className='userpic'/>
          </NavLink>
          <button onClick={handleLogout}>Logout</button>
          </>
        )}
        <NavLink 
          className={(e) => (e.isActive ? "red" : "")} 
          to="/cart"
        >
          <img src={cart_icon} alt="cart" />
        </NavLink>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  );
  
};

export default Navbar;
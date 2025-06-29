import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './prod_details.css';
import jwt_decode from 'jwt-decode';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error('Product ID is missing');
        }

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`http://localhost:4000/products/${id}`, { headers });
        setProduct(response.data);

        if (token) {
          const decoded = jwt_decode(token);
          setIsSeller(decoded.userId === response.data.seller_id);
        }

      } catch (err) {
        console.error('Detailed error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to add items to the cart");
      return;
    }

    if (isSeller) {
      alert("You are the seller");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/addtocart/${product._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Item added to cart");
    } catch (err) {
      console.error("Error adding item to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-card">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="price-section">
            <span className="label">Price:</span>
            <span className="price">${product.price}</span>
          </div>
          
          <div className="seller-section">
            <span className="label">Seller:</span>
            <span className="seller-name">{product.sellerName}</span>
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <button 
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isSeller}
          >
            {isSeller ? 'You are the seller' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
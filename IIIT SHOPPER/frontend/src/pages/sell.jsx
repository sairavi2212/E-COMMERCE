import React, { useState } from 'react';
import axios from 'axios';
import './sell.css';


const Sell = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to sell your product');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/sell', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product listed for sale successfully');
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        image: '',
      });
    } catch (err) {
      console.error('Error listing product for sale:', err);
      alert('Failed to list product for sale');
    }
  };

  const token = localStorage.getItem('token');

  return (
    <div className="sell-page">
      <h1>Sell Your Product</h1>
      {token ? (
        <form onSubmit={handleSubmit} className="sell-form">
          <div className="form-group">
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image URL:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">List Product for Sale</button>
        </form>
      ) : (
        <p className='login-message'>Please log in first to sell your product.</p>
      )}
    </div>
  );
};

export default Sell;
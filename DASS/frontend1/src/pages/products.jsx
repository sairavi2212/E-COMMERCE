import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicCard from '../components/eachprod/each_prod'; // Import the BasicCard component
import './products.css'; // Import the CSS file for styling
import {jwtDecode} from 'jwt-decode';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('http://localhost:4000/products', { headers });

        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products

        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
        if(token){
          const decoded = jwtDecode(token);
          setUserId(decoded.userId);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterProducts(e.target.value, selectedCategories);
    console.log(e.target.value);
  };

  const handleCategoryChange = (category) => {
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedSelectedCategories);
    filterProducts(searchQuery, updatedSelectedCategories);
  };

  const filterProducts = (query, categories) => {
    const filtered = products.filter(product =>
      product.category.toLowerCase().includes(query.toLowerCase()) &&
      (categories.length === 0 || categories.includes(product.category))
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="products-page">
      <div className="filter-container">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>
        <div className="categories-container">
          {categories.map(category => (
            <label key={category} className="category-label">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <BasicCard key={product._id} product={product} userId={userId} className="product-card" />
        ))}
      </div>
    </div>
  );
};

export default Products;
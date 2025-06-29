# E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that offers comprehensive shopping, selling, and order management features.

## Features

### User Management
- Secure user authentication with JWT tokens
- Registration with reCAPTCHA verification to prevent bots
- User profile management and editing
- Role-based access control (buyers and sellers)

### Product Management
- Product browsing with dynamic category filtering
- Search functionality by product name and category
- Detailed product view with seller information
- Seller dashboard for product listing

### Shopping Experience
- Interactive shopping cart management
- Add/remove items and adjust quantities
- Secure checkout process
- Order history tracking

### Order Processing
- Order tracking for both buyers and sellers
- OTP-based delivery verification system
- Status updates (pending, processed, delivered)
- Separate views for pending and completed orders/deliveries

### User Interface
- Responsive design for all device sizes
- Material UI components for modern look and feel
- Intuitive navigation and user flow
- Interactive chatbot powered by Google's Generative AI

## Tech Stack

### Frontend
- React.js 19.0.0 with React Router for navigation
- Material UI & MUI Joy for UI components
- Axios for API requests
- JWT for secure authentication
- React Google reCAPTCHA for security

### Backend
- Node.js with Express.js
- MongoDB with Mongoose for database operations
- JWT for authentication and authorization
- bcryptjs for password hashing
- Google Generative AI for chatbot functionality

## Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- npm (v6.0.0 or higher)
- Google reCAPTCHA API keys (for user registration)
- Google Generative AI API key (for chatbot)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with the following contents:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   GOOGLE_API_KEY=your_google_generative_ai_api_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:4000 with hot-reloading enabled

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Usage Guide

### For Buyers
1. Register a new account or login with existing credentials
2. Browse products, filter by category, or search for specific items
3. Click on products to view details and add to cart
4. View and manage your cart contents
5. Proceed to checkout to place an order
6. Track your pending orders through the "My Pending Orders" section
7. View your order history in the "My Completed Orders" section

### For Sellers
1. Navigate to the "Sell" page to list your products
2. Fill in product details including name, category, description, price, and image URL
3. View incoming orders in the "My Pending Deliveries" section
4. Verify deliveries using the OTP provided by buyers
5. Track completed sales in the "My Completed Deliveries" section

### Using the Chatbot
- Click the chat icon in the bottom-right corner to open the chatbot
- Ask questions about products, ordering process, or request assistance
- The AI-powered chatbot will provide relevant information and help

## Project Structure

### Frontend Structure
- `frontend/src/components/` 
  - `assets/`: Images and static resources
  - `eachprod/`: Product card components
  - `eachorder/`: Order card components
  - `navbar/`: Navigation components
- `frontend/src/pages/`: Application pages
  - User authentication pages (login_sign)
  - Product browsing and details
  - Cart and checkout
  - Order management
  - User profile
  - Chatbot interface

### Backend Structure
- `backend/models/`: MongoDB schemas
  - User model
  - Product model
  - Cart model
  - Order model
- `backend/server.js`: Main server file with API routes
  - Authentication endpoints
  - Product management endpoints
  - Cart and order processing
  - Chatbot integration

## License

This project is licensed under the MIT License.

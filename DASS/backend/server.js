import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import UserModel from './models/users.js';
import ProductModel from './models/products.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import CartModel from './models/cart.js';
import OrderModel from './models/orders.js';
import { GoogleGenerativeAI } from '@google/generative-ai';


const app = express();

app.use(express.json());
const API_KEY="AIzaSyB-6pJ26ukEmu4A_l7xHaAsdK8TgiEmlnA";

const port = process.env.PORT || 4000;
const JWT_SECRET = 'secret';
const RECAPTCHA_SECRET_KEY = '6Le27cEqAAAAAMK_To73lV_vZmFSmPK844muI4AS'; // Replace with your reCAPTCHA secret key
const genAI = new GoogleGenerativeAI(API_KEY);


app.use(cors());

mongoose.connect("mongodb+srv://asairavichandra:vITooS8c8jVf2xq3@users.wjrhq.mongodb.net/?retryWrites=true&w=majority&appName=Users")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));
  

  
const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`);
    return response.data.success;
  } catch (error) {
    console.error("Failed to verify reCAPTCHA:", error);
    return false;
  }
};




app.post('/signup', async (req, res) => {
  const { firstname, lastname, email, age, contact, password, recaptchaToken } = req.body;
  const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!isRecaptchaValid) {
    return res.status(400).json({ error: "Invalid reCAPTCHA" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ firstname, lastname, email, age, contact, password: hashedPassword });
    const token = jwt.sign({ userId: user._id , email:user.email}, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "User created successfully", user ,token: token});
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body;
  const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!isRecaptchaValid) {
    return res.status(400).json({ error: "Invalid reCAPTCHA" });
  }

  try { 
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id , email:user.email}, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login successful", user , token: token});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});


app.get('/profile/:email', async (req, res) => {
  try {
    let { email } = req.params;
    // append @gmail.com
    email = email + "@gmail.com";
    const user = await UserModel.findOne({ email });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: err.message });
  }
});



app.put('/profile/:email', async (req, res) => {
  try {
    const email = req.params.email.includes("@") ? req.params.email : `${req.params.email}@gmail.com`;
    const { firstname, lastname, age, contact } = req.body;


    const user = await UserModel.findOneAndUpdate(
      { email },
      { firstname, lastname, age, contact },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user details:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/products', async (req, res) => {
  try {
    let user_id = null;
    let productCountMap = {};

    if (req.headers.authorization && req.headers.authorization !== '') {
      const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header
      const decoded = jwt.verify(token, JWT_SECRET);
      user_id = decoded.userId;

      // Fetch the cart items for the user
      const cartItems = await CartModel.find({ user_id });

      // Create a map of product IDs to their counts in the cart
      productCountMap = cartItems.reduce((acc, item) => {
        acc[item.product_id] = item.count;
        return acc;
      }, {});
    }

    const products = await ProductModel.find();

    // Fetch seller information for each product
    const productsWithSellerName = await Promise.all(products.map(async product => {
      const seller = await UserModel.findById(product.seller_id, 'firstname lastname');
      const count = productCountMap[product._id] || 0;
      return {
        ...product.toObject(),
        count,
        sellerName: `${seller.firstname} ${seller.lastname}`
      };
    }));

    res.json(productsWithSellerName);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header
    const decoded = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.userId;

    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch the cart item for the user and product
    const cartItem = await CartModel.findOne({ user_id, product_id: req.params.id });
    const count = cartItem ? cartItem.count : 0;


    // Fetch the seller information
    const seller = await UserModel.findById(product.seller_id, 'firstname lastname');
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const productWithDetails = {
      ...product.toObject(),
      count,
      sellerName: `${seller.firstname} ${seller.lastname}`
    };
    res.json(productWithDetails);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/addtocart/:id', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user_id = decoded.userId;
  const product_id = req.params.id;  
  try {
    const existingCartItem = await CartModel.findOne({ user_id, product_id });
    if (existingCartItem) {
      existingCartItem.count += 1;
      await existingCartItem.save();
      return res.json({ message: "Item count updated in cart", cartItem: existingCartItem });
    }

    const cartItem = await CartModel.create({ user_id, product_id, count: 1 });
    res.json({ message: "Item added to cart", cartItem });
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/decreasecount/:id', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user_id = decoded.userId;
  const product_id = req.params.id;

  try {
    const cartItem = await CartModel.findOne({ user_id, product_id });
    if (cartItem && cartItem.count > 0) {
      cartItem.count -= 1;
      await cartItem.save();
      if(cartItem.count==0){
        await CartModel.deleteOne({ user_id, product_id });
      }
      return res.json({ message: "Item count decreased in cart", cartItem });
    } else {
      return res.status(400).json({ message: "Item not found in cart or count is already zero" });
    }
  } catch (err) {
    console.error("Error decreasing item count in cart:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/cartcount/:user_id', async (req, res) => {
  try {
    const result = await CartModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(req.params.user_id) } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);
    const myprod=await CartModel.find({user_id:req.params.user_id});
    let count=0;
    for(let i=0;i<myprod.length;i++)
    {
      count+=myprod[i].count;
    }
    res.json({ count });
  } catch (err) {
    console.error("Error fetching cart count:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/viewcart/:user_id', async (req, res) => {
  try {
    const cartItems = await CartModel.find({ user_id: req.params.user_id });
    const productIds = cartItems.map(item => item.product_id);    
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Fetch seller information for each product
    const productsWithSellerName = await Promise.all(products.map(async product => {
      const seller = await UserModel.findById(product.seller_id, 'firstname lastname');
      return {
        ...product.toObject(),
        sellerName: `${seller.firstname} ${seller.lastname}`
      };
    }));

    const cartItemsWithProductDetails = cartItems.map(item => {
      const product = productsWithSellerName.find(p => p._id.toString() === item.product_id.toString());
      return {
        ...item.toObject(),
        product: { ...product, count: item.count } // Include the count in the product details
      };
    });
    console.log(cartItemsWithProductDetails);
    res.json(cartItemsWithProductDetails);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/sell', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const seller_id = decoded.userId; 


  const { name, category, description, price, image } = req.body;
  try {
    const product = await ProductModel.create({
      name,
      category,
      description,
      price,
      image,
      seller_id, // Use seller_id to match the ProductModel
    });

    res.json({ message: "Product listed for sale successfully", product });
  } catch (err) {
    console.error("Error listing product for sale:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/buy/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { otp } = req.body;

  try {
    const cartItems = await CartModel.find({ user_id });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = cartItems.map(item => item.product_id);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    const hashedOTP = await bcrypt.hash(otp, 10);
    const orders = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.product_id);
      return {
        buyer_id: user_id,
        seller_id: product.seller_id,
        product_id: item.product_id,
        quantity: item.count,
        price: product.price,
        otp: hashedOTP,
        status: 'pending'
      };
    });
    const insertedOrders = await OrderModel.insertMany(orders);
    await CartModel.deleteMany({ user_id });
    res.json({ message: "Order placed successfully", orderIds: insertedOrders.map(order => order._id) });
  } catch (err) {
    console.error("Error processing purchase:", err);
    res.status(500).json({ error: err.message });
  }
});


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.get('/pendingorders/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const pendingOrders = await OrderModel.find({ buyer_id: new mongoose.Types.ObjectId(user_id), status: 'pending' })
      .populate('product_id')
      .populate('seller_id', 'firstname lastname');
    res.json(pendingOrders);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/pendingdeliveries/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const pendingDeliveries = await OrderModel.find({ seller_id: user_id, status: 'pending' })
      .populate('product_id')
      .populate('buyer_id', 'firstname lastname');
    res.json(pendingDeliveries);
  } catch (err) {
    console.error("Error fetching pending deliveries:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/completeddeliveries/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const completedDeliveries = await OrderModel.find({ seller_id: user_id, status: 'delivered' })
      .populate('product_id')
      .populate('buyer_id', 'firstname lastname');
    res.json(completedDeliveries);
  } catch (err) {
    console.error("Error fetching completed deliveries:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/verifyotp', async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOtpValid = await bcrypt.compare(otp, order.otp);
    if (isOtpValid) {
      order.status = 'delivered';
      await order.save();
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/doneorders/:user_id', async (req, res) => {
  try {
    const doneOrders = await OrderModel.find({ buyer_id: req.params.user_id, status: 'delivered' })
      .populate('product_id')
      .populate('seller_id', 'firstname lastname');
    res.json(doneOrders);
  } catch (err) {
    console.error("Error fetching completed orders:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Generated text:", text);
    res.json({ result: text });
  } catch (err) {
    console.error("Error generating text:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





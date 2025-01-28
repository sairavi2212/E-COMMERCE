import './App.css';
import { BrowserRouter , Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Products from './pages/products';
import Shopcategory from './pages/shopcategory';
import Product from './pages/products';
import Login from './pages/login_sign';
import Profile from './pages/profile';
import ProductDetails from './pages/prod_details';
import Navbar from './components/navbar/navbar';
import ViewCart from './pages/view_cart';
import Sell from './pages/sell';
import DoneOrders from './pages/doneorders';
import PendingOrders from './pages/pendingorders';
import PendingDeliveries from './pages/pendingdeliveries';
import CompletedDeliveries from './pages/completeddeliveries';
import Chatbot from './pages/chatbot';

function App() {
  const router=createBrowserRouter([
    {
      path: '/',
      element:<><Navbar /> <Products /></>,
    },
    {
      path: '/sell',
      element: <><Navbar/><Sell/></>,
    },
    {
      path : '/product',
      element: <><Navbar/><Product/></>,
    },
    {
      path : '/login',
      element: <Login/>,
    },
    {
      path : '/profile/:email',
      element: <><Navbar/><Profile/></>
    },
    {
      path : '/product/:id',
      element : <><Navbar/><ProductDetails/></>
    },
    {
      path: '/viewcart/:id',
      element: <><Navbar/><ViewCart/></>
    },
    {
      path: '/myorders/:id',
      element: <><Navbar/><DoneOrders/></>
    }
    ,
    {
      path: '/pendingorders/:id',
      element: <><Navbar/><PendingOrders/></>
    }
    ,{
      path: '/doneorders/:id',
      element: <><Navbar/><DoneOrders/></>
    },
    {
      path: '/pendingdeliveries/:id',
      element: <><Navbar/><PendingDeliveries/></>
    },
    {
      path: '/completeddeliveries/:id',
      element: <><Navbar/><CompletedDeliveries/></>
    }
  ]);


  
  return (
    <div >
      <RouterProvider router={router}/>
      <Chatbot/>
    </div>
  );
}

export default App;
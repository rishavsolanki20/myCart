import React, { useState } from 'react';
import list from '../Data/list';
import axios from 'axios'; // Import axios for making HTTP requests
import Cart from './Cart';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from Reach Router

// Component to display each item
const Item = ({ item, addToCart }) => {
  const handleAddToCart = () => {
    // Call addToCart function with the item object
    addToCart(item);
  };

  return (
    <div className="item">
      <h3>{item.title}</h3>
      <p>{item.author}</p>
      <p>Price: ${item.price}</p>
      {/* Button to add item to cart */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const navigate = useNavigate(); // Get the navigate function from Reach Router
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showOrderDetails, setShowOrderDetails] = useState(false); // State to control displaying order details

  // Function to add item to cart
  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].amount += 1;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...item, amount: 1 }]);
    }
  };

  // Function to handle checkout
  const handleCheckout = () => {
    // Send a request to backend to add items to cart
    axios.get('http://localhost:8080/checkout', {
      items: cartItems.map(item => ({ name: item.title, status: 'pending' }))
    })
    .then((response) => {
      // Navigate to the cart page
      navigate('/cart');
    })
    .catch((error) => {
      console.error('Failed to add items to cart:', error);
    });
  };

  return (
    <div className="dashboard">
      <h2>Book List</h2>
      <div className="item-list">
        {/* Map over the list and render each item */}
        {list.map(item => (
          <Item key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      <div className="cart">
        <h3>Cart</h3>
        <ul>
          {/* Display selected items in the cart */}
          {cartItems.map(item => (
            <li key={item.id}>
              {item.title} - ${item.price} - Quantity: {item.amount}
            </li>
          ))}
        </ul>
        {/* Button to checkout */}
        <button onClick={handleCheckout}>Checkout</button>
        {/* Display total price */}
        <p>Total Price: ${totalPrice}</p>
      </div>
      {/* Conditionally render OrderDetails component */}
      {showOrderDetails && <Cart cartItems={cartItems} />}
    </div>
  );
};

export default Dashboard;

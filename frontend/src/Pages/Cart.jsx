import React from 'react';

const Cart = ({ cartItems }) => {
  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <ul>
        {/* Display order details */}
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} - Quantity: {item.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;

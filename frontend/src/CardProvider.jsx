// CartProvider.jsx
import React, { useState } from 'react';
import AppBar from './Components/AppBar';
import Dashboard from './Pages/Dashboard';
import Cart from './Pages/Cart';
import CartContext from './Context/CartContext';

const CartProvider = () => {
    const [show, setShow] = useState(true);
    const [cart , setCart] = useState([]);
    const [warning, setWarning] = useState(false);

    const handleRemove = (id) => {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
    };

    const handleChange = (item, d) =>{
      const updatedCart = cart.map((cartItem) => {
        if (cartItem.id === item.id) {
          const updatedItem = { ...cartItem, amount: cartItem.amount + d };
          if (updatedItem.amount < 1) return cartItem; // Ensure amount doesn't go below 1
          return updatedItem;
        }
        return cartItem;
      });
      setCart(updatedCart);
    };

    const handleClick = (item) => {
      const isPresent = cart.some((product) => product.id === item.id);
      if (isPresent){
        setWarning(true);
        setTimeout(() => {
          setWarning(false);
        }, 2000);
        return;
      }
      setCart([...cart, item]);
    };

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <AppBar size={cart.length} setShow={setShow} />
      {show ? <Dashboard handleClick={handleClick} /> : <Cart />}
      {warning && <div className='warning'>Item is already added to your cart</div>}
    </CartContext.Provider>
  );
};

export default CartProvider;

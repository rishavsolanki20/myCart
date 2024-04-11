// CartContext.js
import { createContext, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export default CartContext;

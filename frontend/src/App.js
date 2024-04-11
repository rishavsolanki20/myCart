import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Cart from "./Pages/Cart";
import { useState } from "react";
import AppBar from "./Components/AppBar";
// import EmployeeDetailView from "./Pages/EmployeeDetailView";


const App = () => {
  const [show, setShow] = useState(true);
  const [cart, setCart] = useState([]);
  const [warning, setWarning] = useState(false);

  const handleClick = (item) => {
      let isPresent = false;
      cart.forEach((product) => {
          if (item.id === product.id)
              isPresent = true;
      })
      if (isPresent) {
          setWarning(true);
          setTimeout(() => {
              setWarning(false);
          }, 2000);
          return;
      }
      setCart([...cart, item]);
  }

  const handleChange = (item, d) => {
      let ind = -1;
      cart.forEach((data, index) => {
          if (data.id === item.id)
              ind = index;
      });
      const tempArr = cart;
      tempArr[ind].amount += d;

      if (tempArr[ind].amount === 0)
          tempArr[ind].amount = 1;
      setCart([...tempArr])
  }

  return (
      <BrowserRouter>
          <AppBar size={cart.length} setShow={setShow} />
          <Routes>
              <Route path="/" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard handleClick={handleClick} />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} handleChange={handleChange} />} />
          </Routes>
          {
              warning && <div className='warning'>Item is already added to your cart</div>
          }
      </BrowserRouter>
  )
}

export default App;
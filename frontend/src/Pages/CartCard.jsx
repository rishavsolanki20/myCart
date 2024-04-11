// import React from 'react';

// const CartCard = ({ item, handleClick }) => {
//   const { id, title, author, price, img } = item;

//   const addToCart = () => {
//     // Call handleClick with the item as an argument
//     handleClick(item);
//     console.log("hie")
//   };

//   return (
//     <div className="card">
//       <img src={img} alt={title} className="card-img" />
//       <div className="card-details">
//         <h3 className="card-title">{title}</h3>
//         <p className="card-author">{author}</p>
//         <p className="card-price">Rs - {price}</p>
//         <button className="card-btn" onClick={addToCart}>Add to Cart</button>
//       </div>
//     </div>
//   );
// };

// export default CartCard;



import React from 'react';

const CardItem = ({  title, author, price, addToCart }) => {
    return (
        <div className="card">
            <div className="card-details">
                <h3 className="card-title">{title}</h3>
                <p className="card-author">{author}</p>
                <p className="card-price">Rs - {price}</p>
                <button className="card-btn" onClick={() => addToCart({ title, author, price })}>Add to Cart</button>
            </div>
        </div>
    );
};

export default CardItem;


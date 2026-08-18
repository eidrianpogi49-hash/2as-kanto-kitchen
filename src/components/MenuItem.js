import React from 'react';
import './MenuItem.css';

function MenuItem({ item, onAddToCart }) {
  return (
    <div className="menu-item">
      <div className="item-header">
        <h3>{item.name}</h3>
        <span className="price">₱{item.price}</span>
      </div>
      <button
        className="add-btn"
        onClick={() => onAddToCart(item)}
      >
        + Add to Order
      </button>
    </div>
  );
}

export default MenuItem;

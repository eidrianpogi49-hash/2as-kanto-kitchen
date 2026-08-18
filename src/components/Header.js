import React from 'react';
import './Header.css';

function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🍽️ 2 A's Kanto Kitchen</h1>
          <p>Brgy Mabini, Gumaca, Quezon</p>
        </div>
        <button className="cart-btn" onClick={onCartClick}>
          🛒 Cart ({cartCount})
        </button>
      </div>
      <div className="info">
        <p>⏰ After Lunch - 10:00 PM</p>
      </div>
    </header>
  );
}

export default Header;

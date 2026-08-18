import React from 'react';
import MenuItem from './MenuItem';
import './MenuSection.css';

function MenuSection({ category, onAddToCart }) {
  return (
    <section className="menu-section">
      <div className="section-header">
        <h2>{category.name}</h2>
        <div className="accent"></div>
      </div>
      <div className="items-grid">
        {category.items.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;

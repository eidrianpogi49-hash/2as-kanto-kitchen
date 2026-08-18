import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import Admin from './components/Admin';
import { menuCategories } from './data/menu';

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Check URL for admin access
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  if (showAdmin) {
    return <Admin />;
  }

  return (
    <div className="App">
      <Header cartCount={cart.length} onCartClick={() => setShowCart(!showCart)} />
      
      <main className="main-content">
        {showCart ? (
          <Cart
            items={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        ) : (
          <div className="menu-container">
            {menuCategories.map(category => (
              <MenuSection
                key={category.id}
                category={category}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Admin link (hidden) */}
      <div style={{ position: 'fixed', bottom: 10, right: 10, fontSize: '10px', color: '#ccc' }}>
        <button 
          onClick={() => setShowAdmin(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ccc',
            textDecoration: 'underline'
          }}
        >
          admin
        </button>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './Cart.css';

function Cart({ items, onRemove, onUpdateQuantity }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: '',
    phone: '',
    instructions: ''
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = () => {
    if (!orderData.customerName || !orderData.phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    const orderSummary = `
🍜 NEW ORDER - 2 A's Kanto Kitchen

👤 Customer: ${orderData.customerName}
📞 Phone: ${orderData.phone}

📋 ORDER ITEMS:
${items.map(item => `${item.name} x${item.quantity} = ₱${item.price * item.quantity}`).join('\n')}

💰 TOTAL: ₱${total}

📝 Special Instructions: ${orderData.instructions || 'None'}

⏰ For Pickup
    `;

    // Copy to clipboard
    navigator.clipboard.writeText(orderSummary);
    alert('Order copied! Please send to: https://www.facebook.com/profile.php?id=61573684155493');
  };

  return (
    <div className="cart-container">
      <h2>🛒 Your Order</h2>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Start adding items to your order!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="price">₱{item.price} each</p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="subtotal">
                  <p>₱{item.price * item.quantity}</p>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₱{total}</span>
            </div>
            <div className="total-row">
              <span>Total:</span>
              <span>₱{total}</span>
            </div>
          </div>

          {!showOrderForm ? (
            <button className="checkout-btn" onClick={() => setShowOrderForm(true)}>
              💳 Proceed to Checkout
            </button>
          ) : (
            <div className="order-form">
              <h3>Complete Your Order</h3>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={orderData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  placeholder="09XX XXXX XXX"
                />
              </div>
              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  name="instructions"
                  value={orderData.instructions}
                  onChange={handleInputChange}
                  placeholder="Any special requests? (optional)"
                  rows="3"
                />
              </div>
              <button className="submit-order-btn" onClick={handleSubmitOrder}>
                ✅ Confirm & Send Order
              </button>
              <button className="back-btn" onClick={() => setShowOrderForm(false)}>
                ← Back to Cart
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;

import React, { useState } from 'react';
import axios from 'axios';
import './Cart.css';

function Cart({ items, onRemove, onUpdateQuantity, onClearCart }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: '',
    phone: '',
    instructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!orderData.customerName || !orderData.phone) {
      setSubmitMessage('Please fill in your name and phone number');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const orderPayload = {
        customerName: orderData.customerName,
        customerPhone: orderData.phone,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        specialInstructions: orderData.instructions || 'None',
        total: total
      };

      // Try to send to backend
      try {
        const response = await axios.post('/api/orders', orderPayload);
        
        if (response.data.success) {
          setOrderSuccess(true);
          setSubmitMessage(`✅ Order Received!\n\nOrder ID: ${response.data.orderId}\n\nWe will notify you shortly at ${orderData.phone}`);
          
          // Clear after 3 seconds
          setTimeout(() => {
            setOrderData({
              customerName: '',
              phone: '',
              instructions: ''
            });
            setShowOrderForm(false);
            if (onClearCart) onClearCart();
            setOrderSuccess(false);
            setSubmitMessage('');
          }, 3000);
        }
      } catch (apiError) {
        // If backend is not available, fall back to clipboard
        console.warn('Backend not available, using clipboard fallback');
        
        const orderSummary = `
🍜 NEW ORDER - 2 A's Kanto Kitchen

👤 Customer: ${orderData.customerName}
📞 Phone: ${orderData.phone}

📋 ORDER ITEMS:
${items.map(item => `• ${item.name} x${item.quantity} = ₱${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 TOTAL: ₱${total.toFixed(2)}

📝 Special Instructions: ${orderData.instructions || 'None'}

⏰ For Pickup
        `.trim();

        navigator.clipboard.writeText(orderSummary);
        setOrderSuccess(true);
        setSubmitMessage(`✅ Order Copied!\n\nSend this to our Facebook page:\nhttps://www.facebook.com/share/1JgZ6VDrqU/\n\nOr message us at: ${orderData.phone}`);
        
        setTimeout(() => {
          setOrderData({
            customerName: '',
            phone: '',
            instructions: ''
          });
          setShowOrderForm(false);
          if (onClearCart) onClearCart();
          setOrderSuccess(false);
          setSubmitMessage('');
        }, 3000);
      }
    } catch (error) {
      setSubmitMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
              <form onSubmit={handleSubmitOrder}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={orderData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
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
                    required
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

                {submitMessage && (
                  <div className={`message ${orderSuccess ? 'success' : 'error'}`}>
                    {submitMessage.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-order-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Processing...' : '✅ Confirm & Send Order'}
                </button>
                <button 
                  type="button"
                  className="back-btn" 
                  onClick={() => {
                    setShowOrderForm(false);
                    setSubmitMessage('');
                  }}
                >
                  ← Back to Cart
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;

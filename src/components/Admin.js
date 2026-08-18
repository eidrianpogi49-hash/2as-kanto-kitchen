import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const STATUSES = ['Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
      fetchOrders();
    } else {
      setMessage('❌ Incorrect password');
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/orders?password=admin123`);
      setOrders(response.data);
      setMessage('');
    } catch (error) {
      setMessage('❌ Error loading orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status, password: 'admin123' }
      );
      
      if (response.data.success) {
        setMessage(`✅ Order updated to ${status}`);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      setMessage('❌ Error updating order: ' + error.message);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await axios.delete(
          `${API_URL}/api/orders/${orderId}`,
          { data: { password: 'admin123' } }
        );
        
        if (response.data.success) {
          setMessage('✅ Order deleted');
          fetchOrders();
          setSelectedOrder(null);
        }
      } catch (error) {
        setMessage('❌ Error deleting order: ' + error.message);
      }
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h1>🔐 Admin Dashboard</h1>
          <p>2 A's Kanto Kitchen</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
            <button type="submit">Login</button>
          </form>

          {message && <div className="error-message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>📊 Order Management Dashboard</h1>
        <div className="header-info">
          <p>Total Orders: <strong>{orders.length}</strong></p>
          <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
          <button onClick={() => setIsAuthenticated(false)} className="logout-btn">Logout</button>
        </div>
      </header>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet</p>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className={`order-card status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="order-header">
                <h3>{order.id}</h3>
                <span className={`status-badge ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <p><strong>👤 Name:</strong> {order.customerName}</p>
                <p><strong>📞 Phone:</strong> {order.customerPhone}</p>
                <p><strong>⏰ Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="order-items">
                <strong>📋 Items:</strong>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {order.specialInstructions && order.specialInstructions !== 'None' && (
                <div className="special-instructions">
                  <strong>📝 Special Instructions:</strong>
                  <p>{order.specialInstructions}</p>
                </div>
              )}

              <div className="order-total">
                <strong>💰 Total: ₱{order.total.toFixed(2)}</strong>
              </div>

              <div className="order-actions">
                <button 
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                  className="expand-btn"
                >
                  {selectedOrder === order.id ? '▼ Hide Actions' : '▶ Show Actions'}
                </button>
              </div>

              {selectedOrder === order.id && (
                <div className="order-status-update">
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Change Status...</option>
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => {
                      if (newStatus) {
                        updateOrderStatus(order.id, newStatus);
                        setNewStatus('');
                      }
                    }}
                    className="update-btn"
                  >
                    ✓ Update Status
                  </button>

                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="delete-btn"
                  >
                    🗑️ Delete Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;

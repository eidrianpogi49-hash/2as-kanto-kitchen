const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase initialization
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

// Configuration
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const OWNER_EMAIL = 'eidrianpogi49@gmail.com';
const OWNER_WHATSAPP = '+63 9605379940';
const OWNER_PHONE = '09605379940';

// Send Email Notification
async function sendEmailNotification(order) {
  try {
    // Using nodemailer or SendGrid - configure in environment
    // For now, we'll log it
    console.log('Email would be sent to:', OWNER_EMAIL);
    console.log('Order:', order);
  } catch (error) {
    console.error('Email error:', error);
  }
}

// Send WhatsApp Notification using Twilio
async function sendWhatsAppNotification(order) {
  try {
    const message = `🔔 *New Order from 2 A's Kanto Kitchen*\n\n📝 *Order ID:* ${order.id}\n👤 *Customer:* ${order.customerName}\n📞 *Phone:* ${order.customerPhone}\n\n*Items:*\n${order.items.map(item => `• ${item.name} x${item.quantity} - ₱${item.price * item.quantity}`).join('\n')}\n\n💰 *Total:* ₱${order.total}\n📝 *Special Instructions:* ${order.specialInstructions || 'None'}\n\n⏰ *Time:* ${new Date(order.createdAt).toLocaleString()}`;
    
    // Twilio integration
    if (process.env.TWILIO_ACCOUNT_SID) {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          From: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
          To: `whatsapp:${OWNER_PHONE}`,
          Body: message
        }),
        {
          auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: process.env.TWILIO_AUTH_TOKEN
          }
        }
      );
      console.log('WhatsApp sent:', response.data);
    }
  } catch (error) {
    console.error('WhatsApp error:', error);
  }
}

// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, items, specialInstructions } = req.body;

    // Validate
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      customerName,
      customerPhone,
      items,
      specialInstructions: specialInstructions || '',
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };

    // Save to Firestore
    await db.collection('orders').doc(order.id).set(order);

    // Send notifications
    await sendEmailNotification(order);
    await sendWhatsAppNotification(order);

    res.json({
      success: true,
      message: 'Order received! We will notify you shortly.',
      orderId: order.id
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const password = req.query.password;
    
    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const snapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    snapshot.forEach(doc => {
      orders.push(doc.data());
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const doc = await db.collection('orders').doc(orderId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (Admin)
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, password } = req.body;

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Valid statuses
    const validStatuses = ['Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('orders').doc(orderId).update({
      status,
      updatedAt: new Date().toISOString()
    });

    // Notify customer (optional)
    const order = await db.collection('orders').doc(orderId).get();
    if (order.exists) {
      const orderData = order.data();
      console.log(`Order ${orderId} status updated to ${status}`);
      // You could send SMS/WhatsApp to customer here
    }

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order (Admin)
app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { password } = req.body;

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.collection('orders').doc(orderId).delete();
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '2 A\'s Kanto Kitchen API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

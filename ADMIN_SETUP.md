# 2 A's Kanto Kitchen - Order Management System

Welcome to the admin dashboard setup guide!

## 🎯 What You Have

✅ **Frontend Website** - Customers can browse menu and place orders
✅ **Backend API** - Receives and stores orders
✅ **Admin Dashboard** - You can view all orders in real-time
✅ **Automatic Notifications** - Email & WhatsApp alerts

---

## 🔐 Admin Access

### Default Password
```
admin123
```

### How to Access Admin Dashboard
1. Go to: `https://your-website-url/admin`
2. Or click the small "admin" link at bottom-right of customer page
3. Enter the password: `admin123`

---

## 📋 Admin Dashboard Features

### View Orders
- See all customer orders in real-time
- Order ID, customer name, phone number
- Items ordered with quantities and prices
- Special instructions
- Order timestamp

### Update Order Status
1. Click "Show Actions" on any order card
2. Select a new status from dropdown:
   - **Pending** (New order just received)
   - **Preparing** (You're preparing the food)
   - **Ready for Pickup** (Ready to give to customer)
   - **Completed** (Customer picked up)
   - **Cancelled** (Order cancelled)
3. Click "Update Status" to save

### Delete Orders
- Click "Show Actions" on an order
- Click "Delete Order" to remove it
- Confirmation will be requested

### Auto-Refresh
- Orders automatically refresh every 10 seconds
- Click "Refresh" button to update manually

---

## 🚀 Setup Instructions

### Step 1: Set Backend Environment Variables

You need to set up Firebase to store orders. Here's how:

1. Go to: https://console.firebase.google.com
2. Create a new project (if you don't have one)
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the JSON data

Now create a `.env` file in your Railway project with:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_DATABASE_URL=your_database_url
ADMIN_PASSWORD=admin123
```

### Step 2: Deploy Backend to Railway

Since your current setup is frontend-only, you'll need to:

**Option A: Simple Setup (Uses Clipboard for Now)**
- Current system works with clipboard/Facebook messenger
- Orders are saved but require manual Facebook forwarding
- This is what you have now ✅

**Option B: Full Backend Setup (Recommended)**
- Deploy Express server alongside frontend
- Orders go directly to you with notifications
- Requires additional Railway setup

---

## 📊 Order Flow

```
Customer visits website
    ↓
Browses menu & adds items
    ↓
Clicks "Proceed to Checkout"
    ↓
Fills name & phone
    ↓
Clicks "Confirm & Send Order"
    ↓
Order sent to backend (if available)
OR copied to clipboard (fallback)
    ↓
YOU see order in admin dashboard
    ↓
Update status: Pending → Preparing → Ready
    ↓
Customer comes to pick up
```

---

## 🔧 Troubleshooting

### Order not appearing in dashboard?
1. Check admin password is correct (admin123)
2. Make sure backend server is running
3. Click "Refresh" button
4. Check browser console for errors (Press F12)

### Can't access admin page?
- Make sure URL is: `https://your-site.com/admin`
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

### WhatsApp/Email notifications not working?
- Requires Firebase setup (see Step 1 above)
- Twilio account for WhatsApp (optional)
- Check .env variables are correct

---

## 💡 Tips

1. **Change Admin Password**
   - Edit `ADMIN_PASSWORD` in `.env`
   - Make it something only you know

2. **Test Admin Dashboard**
   - Place a test order from customer side
   - Check it appears in admin dashboard
   - Try updating status

3. **Mobile Access**
   - Admin dashboard works on phone too
   - Bookmark the admin URL for quick access

4. **Backup Orders**
   - Orders are stored in Firebase database
   - They're automatically backed up
   - No data loss even if site goes down

---

## 📞 Support

For issues:
1. Check the error message in admin dashboard
2. Refresh the page
3. Clear browser cache
4. Try logging out and back in

---

## 🎉 You're All Set!

Your order management system is ready!

- ✅ Customers can order online
- ✅ You get orders automatically
- ✅ See real-time dashboard
- ✅ Update order status
- ✅ Receive notifications

**Website URL:** https://2as-kanto-kitchen-production.up.railway.app
**Admin URL:** https://2as-kanto-kitchen-production.up.railway.app/admin
**Admin Password:** admin123

Happy selling! 🍜🎉

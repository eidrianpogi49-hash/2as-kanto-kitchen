# 2 A's Kanto Kitchen - Online Ordering Website

A simple, fast, and easy-to-use website for **2 A's Kanto Kitchen** in Brgy Mabini, Gumaca, Quezon Province.

Customers can:
- 🍽️ Browse the menu
- 🛒 Add items to cart
- 📋 Place pickup orders
- 📞 Contact the restaurant

## Features

✅ Beautiful, mobile-friendly design
✅ Full menu with prices (Kanto Sizzlers, Silog Meals, Kanto Meals, Snacks)
✅ Shopping cart system
✅ Order form with customer details
✅ Runs completely on your laptop - no server needed to start

## Quick Start (5 minutes)

### Requirements
- Node.js installed: https://nodejs.org/

### Setup & Run

```bash
# 1. Clone this repository
git clone https://github.com/eidrianpogi49-hash/2as-kanto-kitchen.git
cd 2as-kanto-kitchen

# 2. Install dependencies
npm install

# 3. Start the website
npm start

# 4. Open browser
# Go to: http://localhost:3000
```

That's it! Your website is now running locally.

## Project Structure

```
.
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── styles/            # CSS files
│   ├── data/              # Menu data
│   └── App.js             # Main app
├── public/                # Static files
├── package.json           # Project config
└── README.md              # This file
```

## Customizing

### Update Restaurant Info
Edit `src/data/restaurantInfo.js`:
```js
export const restaurantInfo = {
  name: "2 A's Kanto Kitchen",
  address: "Brgy Mabini, Gumaca, Quezon Province",
  hours: "After lunch - 10:00 PM",
  phone: "YOUR_PHONE_NUMBER",
  facebook: "YOUR_FACEBOOK_URL"
};
```

### Update Menu
Edit `src/data/menu.js` - add/remove/update dishes and prices

### Change Colors
Edit `src/styles/App.css` - change colors from gold (#FFA500) and black to anything you like

## Going Live (When Ready)

When you're ready to let customers order online, you can:
1. Deploy to **Railway.app** (₱10-50/month)
2. Deploy to **Render.com** (free tier available)
3. Use **ngrok** to share with friends (free, temporary)

## Need Help?

- Update menu in `src/data/menu.js`
- Change restaurant info in `src/data/restaurantInfo.js`
- Customize colors in `src/styles/App.css`

Enjoy! 🍜

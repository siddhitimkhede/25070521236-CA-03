# ROSSELE SKIN
> **"Your skin, your softest ritual."**
> Premium Minimalist Skincare E-Commerce Platform | Full-Stack FLEXI Academic Project

![ROSSELE SKIN Banner](https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80)

---

## 1. Project Overview

**ROSSELE SKIN** is a full-stack luxury skincare e-commerce web application inspired by contemporary editorial beauty houses (such as Rhode). Built with an original brand identity, warm ivory and blush-pink visual aesthetics, and clean typography, it delivers a high-end customer journey coupled with robust full-stack engineering.

Unlike static prototypes, this application features **genuine three-tier integration**:
`React Frontend (Vite) ⇄ Express REST APIs (Node.js) ⇄ MongoDB Database (Mongoose)`

Any modification made via the administrator dashboard (e.g. creating/editing products, updating stock, modifying order dispatch statuses) immediately persists in MongoDB and dynamically updates the client shopping experience in real-time.

---

## 2. Key Features

### 🌸 Customer & Brand Experience
- **Editorial Homepage:**
  - Announcement bar with complimentary delivery thresholds.
  - Sticky glassmorphic navbar with smooth blur on scroll.
  - Hero campaign with typography hierarchy and call-to-actions.
  - Dynamic **Bestsellers ("The daily essentials")** section fetched from MongoDB.
  - Brand Philosophy section (*"Less noise. More ritual."*).
  - The 3-Step Routine: **01. Cleanse, 02. Hydrate, 03. Nourish**.
  - Demonstration customer testimonials & live product reviews.
  - Instant newsletter signup with duplicate validation stored in MongoDB.
- **Product Catalogue & Shop:**
  - Dynamic product catalog powered by MongoDB.
  - Category filters (*All, Cleansers, Serums, Moisturizers, Lip Care*).
  - Instant live keyword search modal and sorting (Price low/high, alphabetical A-Z, top-rated).
  - Reliable image fallbacks with custom luxury SVG cosmetic renderings in case of network lag.
- **Dedicated Product Detail Pages:**
  - High-res image gallery with thumbnail switcher.
  - Realistic cosmetic descriptions without medical or clinical false claims.
  - Expandable accordions for Benefits, Full Ingredients decks, and Directions for Use.
  - Stock availability pill (*"In Stock"*, *"Low Stock - Only X Left"*, *"Sold Out"*).
  - Interactive **Customer Review Submission Modal** that saves directly to MongoDB and recalculates product ratings.
- **Interactive Shopping Bag (Cart Drawer):**
  - Slide-out drawer with free shipping progress bar (*"Add ₹X for complimentary delivery"*).
  - Live quantity modification, item removal, and subtotal calculation.
- **Demonstration Checkout Flow:**
  - Shipping address and customer info collection.
  - Server-side stock check and price validation (prevents client-side price tampering).
  - Multiple demonstration payment methods (*Demo Luxury Card, Demo UPI, Cash on Delivery*).
  - Generates unique order receipt codes (`RSL-XXXX-XXXX`), decrements MongoDB product inventory, and launches celebratory confetti.
- **User Authentication & Profile:**
  - Secure bcrypt password hashing and JSON Web Tokens (JWT).
  - Profile view with authenticated order history and status tracking.
  - **One-click demo login buttons** for both customer and administrator to facilitate effortless professor grading.

### 🛡️ Administrator Management Portal (Role: `admin`)
- **Live MongoDB Analytics:** Real-time metrics calculated via MongoDB aggregations:
  - Recorded Revenue (₹)
  - Total Order Count
  - Total Registered Clients
  - Active Formulations Count
  - Low-Stock Inventory Alerts (items with $\le 10$ units)
- **Product Management (CRUD):**
  - Add new formulations with image URLs, volume, stock, categories, and ingredients.
  - Edit existing product names, pricing, and quantities.
  - Delete products with automatic cleanup of associated reviews.
- **Order Management:**
  - View full customer shipping addresses, ordered items, and order values.
  - Real-time status dropdown updater (*Pending ➔ Confirmed ➔ Shipped ➔ Delivered ➔ Cancelled*).
- **Contact Inquiries:** View customer inquiries submitted through the contact page.

---

## 3. Technology Stack

### Frontend
- **React.js 18** (Vite build tool)
- **React Router v6**
- **Tailwind CSS** (Configured with custom luxury palette: Blush `#F3D9D8`, Ivory `#FAF7F2`, Porcelain Cream `#F4EEE7`, Dusty Rose `#D9AAA8`, Deep Cocoa `#493633`, Warm Taupe `#A89589`)
- **Google Fonts** (*Cormorant Garamond* serif & *Plus Jakarta Sans*)
- **Lucide React** (Minimalist iconography)
- **Canvas-Confetti** (Order celebration animation)

### Backend
- **Node.js** (v20+) & **Express.js**
- **MongoDB** & **Mongoose ODM**
- **bcryptjs** (Password hashing)
- **jsonwebtoken (JWT)** (Secure token authentication)
- **helmet** (Security HTTP headers)
- **cors** (Cross-origin resource sharing)
- **express-rate-limit** (API protection)

### Database
- **MongoDB Community Server** (Local port `27017`)
- **MongoDB Compass** (GUI inspection tool)

---

## 4. Folder Structure

```
25070521236_CA3/
├── client/                     # React Frontend
│   ├── public/
│   │   └── favicon.svg         # Rossele monogram favicon
│   ├── src/
│   │   ├── assets/             # Brand graphics
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Sticky navbar with announcement bar
│   │   │   ├── Footer.jsx      # Luxury editorial footer & newsletter
│   │   │   ├── ProductCard.jsx # Editorial product card with INR pricing
│   │   │   ├── CartDrawer.jsx  # Slide-over bag drawer & free shipping tracker
│   │   │   ├── SearchModal.jsx # Instant live search overlay
│   │   │   ├── ImageFallback.jsx # SVG cosmetic bottle fallback
│   │   │   └── ProductSkeleton.jsx
│   │   ├── context/            # Auth, Cart, and Toast Contexts
│   │   ├── pages/              # Route pages (Home, Shop, Detail, Checkout, Admin, etc.)
│   │   ├── services/
│   │   │   └── api.js          # REST API service client
│   │   ├── App.jsx             # Routes & layout structure
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind & typography styling
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js      # Custom luxury palette configuration
│   └── vite.config.js          # Vite config with /api proxy to port 5000
│
├── server/                     # Node.js / Express Backend
│   ├── scripts/
│   │   ├── seedProducts.js     # MongoDB seed script
│   │   └── testApi.js          # Automated backend integration tests
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose connection
│   │   ├── controllers/        # Business logic (auth, product, order, review, etc.)
│   │   ├── middleware/         # Auth, admin, and error handlers
│   │   ├── models/             # Mongoose schemas (User, Product, Order, Review, etc.)
│   │   ├── routes/             # Express API route endpoints
│   │   ├── utils/              # Token generators & helpers
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entrypoint (Port 5000)
│   ├── .env                    # Environment variables
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Prerequisites

Before running the application, ensure the following are installed on your machine:
- **Node.js** (v18.0.0 or later)
- **npm** (comes with Node.js)
- **MongoDB Community Server** running locally on default port `27017`
- **MongoDB Compass** (optional, recommended for inspecting database records)

---

## 6. Installation & Setup

### Step 1: Open the Project Directory
```powershell
cd c:\Users\gaura\Desktop\25070521236_CA3
```

### Step 2: Install Backend Dependencies
```powershell
cd server
npm.cmd install
```

### Step 3: Install Frontend Dependencies
```powershell
cd ../client
npm.cmd install
```

---

## 7. Database Configuration & Seeding

The backend `.env` is already configured with your local MongoDB Community Server connection string:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/rossele_skin
JWT_SECRET=rossele_skin_luxury_super_secret_jwt_key_2026_flexi
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Run the Idempotent Database Seed Script
To populate the database with demonstration formulations, accounts, and reviews:
```powershell
cd c:\Users\gaura\Desktop\25070521236_CA3\server
node scripts/seedProducts.js
```

### Default Seeded Demonstration Credentials
| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@rosseleskin.com` | `Admin@Rossele2026` |
| **Customer** | `elena@rosseleskin.com` | `Customer@2026` |

*(Note: The login page includes convenient one-click quick-fill buttons for both demo accounts!)*

---

## 8. Running the Application

To run the application, start both the backend server and frontend development server in separate terminals:

### Terminal 1: Start Backend (Port 5000)
```powershell
cd c:\Users\gaura\Desktop\25070521236_CA3\server
npm.cmd run dev
```
*Backend runs at: `http://localhost:5000`*

### Terminal 2: Start Frontend (Port 5173)
```powershell
cd c:\Users\gaura\Desktop\25070521236_CA3\client
npm.cmd run dev
```
*Frontend runs at: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser to view ROSSELE SKIN.

---

## 9. Automated Testing & Verification

An automated verification test script is provided in `server/scripts/testApi.js`. It runs 8 end-to-end integration tests:
1. Health check endpoint (`GET /`)
2. Customer login & JWT issuance
3. Admin login & role verification
4. Product retrieval from MongoDB
5. Category filtering (`category=Serums`)
6. Product detail & reviews retrieval
7. Order creation, stock verification & price calculation
8. Admin dashboard stats calculation from MongoDB aggregations

To execute the automated test suite:
```powershell
cd c:\Users\gaura\Desktop\25070521236_CA3\server
npm.cmd test
```

---

## 10. Inspecting with MongoDB Compass

To visually verify the database in **MongoDB Compass**:
1. Open MongoDB Compass.
2. In the connection string field, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the databases list on the left, select **`rossele_skin`**.
5. You will see the collections:
   - `users` — Administrator and registered customers (with bcrypt hashes).
   - `products` — Skincare products, stock quantities, and prices in INR.
   - `orders` — Real orders with customer information, item snapshots, and delivery statuses.
   - `reviews` — Verified customer product reviews and ratings.
   - `newslettersubscribers` — Newsletter subscriptions.
   - `contactmessages` — Inquiries submitted via the Contact form.

---

## 11. REST API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer | Public |
| `POST` | `/api/auth/login` | Login user & return JWT | Public |
| `GET` | `/api/auth/me` | Get current logged in user | Private |
| `PUT` | `/api/auth/profile` | Update user name/password | Private |
| `GET` | `/api/products` | Get products with search, category & sort | Public |
| `GET` | `/api/products/:idOrSlug` | Get single product with reviews | Public |
| `POST` | `/api/products` | Create new formulation | Admin Only |
| `PUT` | `/api/products/:id` | Update formulation or stock | Admin Only |
| `DELETE` | `/api/products/:id` | Delete formulation | Admin Only |
| `POST` | `/api/orders` | Place order (verifies stock & price on server) | Public/Auth |
| `GET` | `/api/orders/my-orders` | Get user order history | Private |
| `GET` | `/api/orders` | Get all orders with status filter | Admin Only |
| `PUT` | `/api/orders/:id/status` | Update order dispatch status | Admin Only |
| `GET` | `/api/reviews/:productId`| Get product reviews | Public |
| `POST` | `/api/reviews/:productId`| Submit review (recalculates product rating) | Public/Auth |
| `POST` | `/api/newsletter` | Subscribe email (prevents duplicates) | Public |
| `POST` | `/api/contact` | Submit inquiry form | Public |
| `GET` | `/api/admin/stats` | Aggregated revenue, orders, low-stock data | Admin Only |
| `GET` | `/api/admin/users` | List registered customers & order metrics | Admin Only |

---

## 12. University Project Compliance Notes
- **Authentic Persistence:** Prices, stock, orders, and reviews are stored and recalculated by MongoDB, not simulated with frontend-only state.
- **Server-Side Price Validation:** The backend never trusts client-submitted prices; it matches each item against the database price record.
- **Stock Decrementing:** Placing an order decrements the stock quantity in MongoDB. Low stock triggers alerts on the admin dashboard.
- **Demonstration Mode:** The checkout clearly indicates academic demonstration mode; no real financial transactions take place.

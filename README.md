#  Mini Laundry Order Management System

A sleek, simple mini laundry order management applicatiob

---

## Setup Instructions

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance.

### 1. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<your_user>:<your_password>@cluster...
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=30d
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The backend now runs on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
   *The frontend now runs on http://localhost:5173*

---

## 🔹 Features Implemented

Here is exactly what works perfectly in the application:

**User Authentication:** 
- JWT-based authentication allows secure User Registration and Login.
- Passwords are encrypted using bcrypt hashing before saving to MongoDB.

**Create New Orders:**
- Users can create laundry orders, logging Customer Name, Phone Number (validated 10-digit), Garment Type, and Quantity.
- **Dynamic Calculation:** The total bill is auto-calculated based on a hardcoded preset price list (e.g., Shirt = ₹30).
- **Auto ID & Delivery:** Generates a unique 6-character Order ID (`ORD-<timestamp>-<hash>`) and automatically calculates the Estimated Delivery Date (+2 days).

**View & Filter Orders:**
- Orders are displayed beautifully via a clean data table.
- Filter orders instantly by Status (Received, Processing, etc.) and Garment Type.
- Search instantly by Customer Name or Phone Number.

**Status Management:**
- Order statuses seamlessly flow through `RECEIVED`  `PROCESSING`  `READY`  `DELIVERED`.
- Simple inline dropdown to immediately update an order's status securely via REST endpoints.

 **Analytics Dashboard:**
- Displays Total Order count, Total Revenue sum, and graphical progress bars showing orders currently distributed between status lanes.

---

## AI Usage Report

Building this efficiently relied heavily on an AI-first workflow.

**Tools Used:** Google Gemini Pro natively within Google's IDE agentic extension (Antigravity).

**Sample Prompts Used:**
> "Initialize a full-stack React + Express app for a Mini Laundry Order system without over-engineering."
> "Write me an auth controller using bcrypt and JWT, and secure an order modification endpoint."
> "Design a dark-text, highly clean minimal CSS layout matching modern glassmorphic aesthetics that doesn't rely on Tailwind."

**What AI got wrong:**
- The AI initially attempted to scaffold a complex TypeScript environment when only basic JavaScript was desired to maximize speed.
- It wrote generic REST messages (e.g. `Server Error`) that weren't robust enough for frontend client interactions.
- It attempted to map the backend dashboard route (`/dashboard`) underneath the catch-all dynamic parameter router (`/:id`), causing all dashboard pings to throw 404 CastErrors.

**What was improved manually/through logic correction:**
- Reordered the Express router systematically so explicit routes intercept requests before wildcard parameter routes.
- Adjusted validation layers natively inside Mongoose schemas combined with Regexes (like Indian phone formats), removing the need for heavy external validation dependencies.
- Completely removed the Vite-TypeScript build pipeline via overriding `package.json` configurations.

---

##  Tradeoffs

Given the aggressive timeframe, specific tradeoffs were made in favor of execution speed, clarity, and pure reliability.

**What was skipped:**
- **Redux / State Management Libs:** Skipped in favor of simple native React Contexts (`AuthContext`), eliminating steep boilerplate.
- **Tailwind / CSS-in-JS:** Avoided. Relying on vanilla global CSS enabled incredibly rapid styling overrides without building configuration overhead.
- **Multi-tenant / Roles:** Standard users run everything for simplicity. We did not build a complex "Admin" vs "Customer" access barrier system.

**What I'd improve with more time:**
1. Setup automatic Email/SMS notifications via Twilio or Resend when an order changes from `PROCESSING` to `READY`.
2. Introduce a full reporting table exporter allowing shop owners to dump revenue metrics into `.xlsx` formats.
3. Migrate API interactions on the frontend from vanilla `useEffect` to `React Query (TanStack)` for automatic background data refetching and better caching.

---

##  API Demo & Collection

For easy testing, you can hit the API via the UI (Frontend), or load the provided Postman collection.

**A complete, working Postman API Collection** (`Mini_Laundry_Postman_Collection.json`) has been included in the root directory. 

Import that instantly into Postman to see fully pre-configured requests ranging from Registration to Admin Dashboard tracking!

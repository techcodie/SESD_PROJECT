# PropEstate - Real Estate Booking System

A full-stack modern web application for listing and booking real estate properties. Built using an Express.js/TypeScript backend with a vanilla Javascript, beautifully-styled glassmorphic frontend.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   > The backend starts up on `http://localhost:3000` (or `http://127.0.0.1:3000`).
3. **Launch the Frontend UI:**
   Simply open `frontend/index.html` in your web browser, or use an extension like VS Code Live Server!

## 🔐 Authentication & Mock Data

Since the system leverages an in-memory database mock repository for development, there is no password requirement. Simply use the authorized emails below to log in:

### Users (Login Window)
- **Customer:** `alice@example.com` (Can browse properties and request bookings)
- **Customer:** `franklin@example.com`
- **Owner/Agent:** `bob@example.com` (Can add new property listings)
- **Admin:** `admin@propestate.com` (Can verify listings, but primarily accesses the Dashboard)

### Admin Portal Unlock
To enter the **Admin Dashboard** (using the top-left dropdown selector where it says 'User Portal'), you will need the secure PIN:
**PIN:** `1234`

Admin actions feature accepting/rejecting bookings across the entire site, and globally verifying any pending properties.

## ✏️ Modifying Mock Data

Because there is currently no persistent database hooked up, all baseline property listings, active bookings, and mock users exist natively in memory on server-boot.

You can freely add, remove, or modify this data by visiting the Repositories:
- `src/repositories/UserRepository.ts` — Mock Users
- `src/repositories/PropertyRepository.ts` — Mock Real Estate Listings
- `src/repositories/BookingRepository.ts` — Mock System Bookings

Whenever you save changes to these TypeScript files, ensure you restart the backend node process (`npm run dev`) to spawn the updated database objects.

## 🎨 UI Images

The frontend relies on dynamic, deterministic generation of beautiful Unsplash images based on the unique Property IDs. Therefore, if you append a new listing with a stable ID in `PropertyRepository.ts`, an image will automatically be attached to it in the graphical interface!

Enjoy exploring PropEstate!

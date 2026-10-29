# FoodieHub

FoodieHub is a campus canteen pre-ordering app with separate student and canteen-admin experiences. The frontend is React + Vite with React Router, Axios, Context API, and Tailwind CSS; the API is Express + MongoDB/Mongoose with JWT authentication and local image uploads.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB connection string

## Configure and run

1. Configure `backend/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Replace the development JWT secret and admin password before use. `backend/.env.example` shows the required values.
2. Install and start the API:

   ```sh
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

   The seed command creates the admin account, or updates its password and role if that email already exists. The development defaults in `backend/.env` are for local setup only.
3. In a separate terminal, install and start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL (normally `http://localhost:5173`). Log in as the configured admin or register a student account.

Vite proxies API and image requests to `http://localhost:5000` in development. Set `VITE_API_URL` and `VITE_SERVER_URL` in `frontend/.env` when deploying the frontend separately; configure the API's `CLIENT_URL` to the deployed frontend origin.

## Features

- Students can register, browse and filter the menu, manage a cart, place orders, and see order history and status.
- Admins can add, edit, and remove menu items, upload images, and advance orders from **Placed** to **Preparing** to **Ready**.
- The server checks availability and calculates prices from current menu data. Preparation time is the longest item's prep time plus two minutes per additional ordered unit.
- Admin routes and student routes are role-protected on both the API and frontend.

Uploaded images are served from `backend/uploads/`; the folder is kept in source control while its uploaded contents are ignored.

# Restaurant Management System (RMS) Backend

An all-in-one secure and robust REST API architecture built using Node.js, Express.js, and MongoDB.

## Features Added
- **Core Operations**: Menu display, Table Reservation, Order Placement.
- **Automation**: Real-time auto-inventory deduction & dynamic table status update.
- **Security & Hardening**: Implemented JWT Authentication, Data Input Validation, and Dotenv environment security.

## How to Run Locally

1. Install Dependencies:
   ```bash
   npm install
   ```
2. Setup Environment Variables: Create a `.env` file in the root and add your `PORT`, `MONGO_URI`, and `JWT_SECRET`.
3. Seed the Database:
   ```bash
   node seed.js
   ```
4. Start Server:
   ```bash
   npx nodemon server.js
   ```

## Postman API Testing Flow
1. **Login**: `POST /api/admin/login` with body `{"username": "admin", "password": "password123"}` to receive a secure token.
2. **View Protected Reports**: `GET /api/admin/reports` (Pass the token in the Headers tab as `Authorization: Bearer <your_token>`).

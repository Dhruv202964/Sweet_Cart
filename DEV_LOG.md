🚀 Sweet_Cart Development Log
Team: 404 ERROR

Project: Professional E-commerce & Inventory Ecosystem

Tech Stack: React.js, Node.js, Express, PostgreSQL

📅 Day 1: Project Initiation & Backend Foundation
Date: 2026-02-11

Status: ✅ Complete

🏆 Key Achievements
Repository Setup:

Created Sweet_Cart repo on GitHub.

Established folder structure: server (Root) and client (React).

Added collaborators.

Database Architecture (PostgreSQL):

Created database: sweet_cart_db.

Tables Created: users (Roles: Admin, Customer, Rider), categories, products.

Data Injection: Inserted mock data (Kaju Katli, Bhakarwadi) to verify relationships.

Backend Development (Node.js + Express):

Initialized server.js with dotenv configuration.

Built config/db.js for PostgreSQL connection.

API Created: GET /api/products (Tested & Verified).

Frontend Initialization:

Initialized React app (Vite) inside /client folder.

📅 Day 2: Authentication Security & User Roles
Date: 2026-02-12

Status: ✅ Complete

🏆 Key Achievements
Security Implementation:

Integrated bcryptjs for password hashing.

Integrated jsonwebtoken (JWT) for secure session management.

Auth API Development:

Registration: Endpoint to hash passwords and save new users.

Login: Endpoint to verify credentials and issue JWT tokens.

Verification: Created "Super Owner" account and tested login successfully.

📅 Day 3: Logistics Backend & Admin Panel Kickoff
Date: 2026-02-13

Status: ✅ Complete

🏆 Key Achievements
Rider Logistics API (Backend):

Database Expansion: Created orders and deliveries tables.

Rider Endpoints:

GET /api/rider/my-deliveries/:id (Fetch assigned tasks).

PUT /api/rider/update-status (Mark orders as Delivered).

Logic Test: Verified orders move from 'Pending' -> 'Out for Delivery' -> 'Delivered'.

Admin Panel Setup (Frontend):

Initialized admin project using Vite + React.

Theme Setup: Defined "Purshottam" color palette (Saffron, Royal Red, Cream).

Login Screen: Built responsive Login UI and connected it to Backend Auth API.

Dashboard Skeleton: Created the main landing page with summary stats.

📅 Day 4: Inventory, Order Management & Offline Stability
Date: 2026-02-14

Status: ✅ Complete

🛠️ Critical Fixes
Offline CSS Architecture: - Fixed a critical issue where Tailwind CSS failed to load during presentations without internet.

Solution: Configured PostCSS and installed local dependencies to make the project 100% offline-capable (Presentation Proof).

🏆 Key Achievements
Inventory Management (Admin):

Products Page: Built a categorized table (Sweets vs. Farsan vs. Seasonal) fetching live data.

Add Product Feature: Created a Modal popup form to add new items (e.g., Rasgulla) directly to the database.

UX Improvement: Implemented "Fixed Sidebar" layout for better navigation.

Order Management System:

Backend API: Created GET /api/orders to fetch all customer orders with status and rider info.

Frontend UI: Built the Orders Table displaying Order ID, Customer Name, Total Amount, and Color-coded Status Badges.

📝 Next Steps (Day 5)
[ ] Order Details: Implement popup to see specific items inside an order.

[ ] Rider Assignment: Add functionality to assign a specific Rider to an Order from the Admin Panel.

[ ] User Shop: Begin building the Customer-facing frontend (client folder).
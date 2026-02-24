# Sweet_Cart: Development Log

> **Team:** 404 ERROR
> **Project:** Professional E-commerce & Inventory Ecosystem
> **Tech Stack:** React.js (Vite), Node.js, Express.js, PostgreSQL, Tailwind CSS

---

## Day 1: Project Initiation & Backend Foundation
**Date:** 2026-02-11 | **Status:** `Complete` | **Phase:** Architecture Setup

### 🎯 Objective
Establish the repository, initialize the PERN stack environment, and design the relational database schema.

### ⚙️ Technical Implementation
* **Repository:** Initialized Git repository `Sweet_Cart` and structured a monorepo with `/client` and `/server` directories.
* **Backend:** Configured Node.js backend with `express`, `cors`, and `dotenv` for environment variable management.
* **Database:** Engineered the PostgreSQL database (`sweet_cart_db`) via `pg` pool connections. Designed the core relational tables (`users`, `categories`, `products`) with strict Primary/Foreign Key constraints.
* **Data Injection:** Wrote raw SQL `INSERT` commands to inject foundational mock data (Kaju Katli, Bhakarwadi) to test relational mapping.

### ✅ Milestones
* Server successfully running on Port 5000.
* Tested and verified the first endpoint: `GET /api/products` returning clean JSON.

---

## Day 2: Authentication Security & User Roles
**Date:** 2026-02-12 | **Status:** `Complete` | **Phase:** Security & RBAC Foundation

### 🎯 Objective
Implement secure, encrypted authentication and define system roles.

### ⚙️ Technical Implementation
* **Cryptography:** Integrated `bcryptjs` to ensure zero plain-text passwords are saved in the database.
* **Session Management:** Implemented stateless sessions using `jsonwebtoken` (JWT). Tokens encode the `user_id` and `role` to validate requests across the app.
* **Controllers:** Built `authController.js` handling registration and login logic. Added error handling for existing users and invalid credentials to prevent server crashes.

### ✅ Milestones
* Passwords successfully hashing in PostgreSQL.
* "Super Owner" administrative account created and verified.
* JWTs securely issued upon login.

---

## Day 3: Logistics Backend & Admin Panel Kickoff
**Date:** 2026-02-13 | **Status:** `Complete` | **Phase:** Frontend Bootstrapping & Delivery Logic

### 🎯 Objective
Build the admin interface skeleton and map out the order delivery lifecycle.

### ⚙️ Technical Implementation
* **Frontend Setup:** Initialized the React (Vite) Admin application. Configured the "Purshottam" color palette (Royal Red, Saffron, Cream) via `tailwind.config.js`.
* **Database Expansion:** Expanded schema to include `orders` and `deliveries` tables.
* **Logistics API:** Built backend endpoints `GET /api/rider/my-deliveries/:id` and `PUT /api/rider/update-status`.

### ✅ Milestones
* Responsive Admin Login UI completed and linked to the backend Auth API.
* Verified the backend logic flow: Orders transitioning from `Pending` -> `Out for Delivery` -> `Delivered`.

---

## Day 4: Inventory, Order Management & Offline Stability
**Date:** 2026-02-14 | **Status:** `Complete` | **Phase:** UI/UX & Presentation Proofing

### 🎯 Objective
Guarantee the app works offline for faculty presentations and build core management tables.

### 🛠️ Critical Fixes
* **Offline CSS Architecture:** Tailwind CSS relied on external CDNs. Configured local PostCSS and installed all Tailwind dependencies locally to achieve 100% "Presentation Proof" status.

### ⚙️ Technical Implementation
* **Inventory UI:** Built the Products Table with dynamic category mapping (Sweets, Farsan, Seasonal).
* **Data Entry:** Engineered the "Add Product" React Modal to insert data directly into PostgreSQL.
* **Order Management:** Developed the UI with color-coded status badges (Red: Pending, Green: Delivered).

### ✅ Milestones
* Admin Sidebar navigation locked in.
* `GET /api/orders` successfully populating the frontend data tables.

---

## Day 5: Real-Time Dashboard & Advanced Analytics
**Date:** 2026-02-15 | **Status:** `Complete` | **Phase:** Data Aggregation

### 🎯 Objective
Replace static dashboard placeholders with live, real-time database metrics.

### 🛠️ Critical Fixes
* **Database Schema:** Fixed fatal crash (`relation "order_items" does not exist`) by constructing the missing table via SQL shell.
* **Backend Routing:** Resolved a `TypeError` by restoring a missing controller export in `orderRoutes.js`.
* **Data Integrity:** Refactored SQL joins to fetch `u.email` instead of non-existent `u.name`.

### ⚙️ Technical Implementation
* **Aggregations:** Wrote dynamic SQL queries using `SUM(total_amount)` for Revenue and `COUNT(*)` for Pending Orders.
* **Granular Data:** Built `OrderDetailsModal.jsx` to fetch and render specific item data (Name, Price, Qty) for assigned order IDs.

### ✅ Milestones
* Dashboard cards officially pulling live business metrics from PostgreSQL.

---

## Day 6: The "Analytics Pivot" & Documentation
**Date:** 2026-02-16 | **Status:** `Complete` | **Phase:** Strategic Shift & Visualization

### 🎯 Objective
Pivot development based on faculty feedback to prioritize data analytics over rider tracking.

### ⚙️ Technical Implementation
* **Data Visualization:** Integrated `Chart.js` and `react-chartjs-2` into the Admin portal. Built `SalesChart.jsx` mapped to the brand's color palette.
* **Complex SQL:** Engineered aggregations utilizing `GROUP BY delivery_area` to calculate revenue distribution mathematically on the server.
* **Documentation:** Generated core academic documents (`PROJECT_STATUS.md`, `TEAM_TASKS.md`, `REPORT_FACULTY.md`, `DB_DOCS.md`).

### ✅ Milestones
* Visual sales analytics successfully rendering on the dashboard.

---

## Day 7: RBAC Security, HR Systems & UI Optimization
**Date:** 2026-02-17 | **Status:** `Complete` | **Phase:** Enterprise Features & Constraint Resolution

### 🎯 Objective
Lock down application security layers and build staff onboarding features.

### 🛠️ Critical Fixes
* **Constraints:** Fixed a `users_role_check` violation in PostgreSQL blocking new roles. Executed `ALTER TABLE` to allow 'manager' and 'staff'.
* **Validation:** Resolved a `full_name` NOT NULL violation by updating forms and backend controllers.

### ⚙️ Technical Implementation
* **Dynamic Rendering:** Sidebar menus and sensitive data charts now hide/show based on the JWT role payload.
* **HR Module:** Built Staff Management interface allowing the Admin to securely generate credentials for employees.
* **CRM:** Created a "Messages" inbox populated with realistic test inquiries for presentation purposes.

### ✅ Milestones
* Multi-tier security (Owner > Manager > Staff) strictly enforced.
* UI layouts slimmed (`w-56` sidebar) for better data table visibility.

---

## Day 8: Advanced Inventory Ecosystem & Data Precision
**Date:** 2026-02-18 | **Status:** `Complete` | **Phase:** Complex CRUD Operations

### 🎯 Objective
Overhaul the inventory system to handle physical file uploads and precise unit measurements.

### 🛠️ Critical Fixes
* **Connection Stability:** Fixed persistent product upload crashes by segregating `productRoutes.js` and integrating `multer`.
* **Zombie Data:** Implemented `ON DELETE CASCADE` in SQL to fix UI ghosting where deleted products remained on screen.

### ⚙️ Technical Implementation
* **File Handling:** Added image update support using `COALESCE` SQL command to safely retain existing images if no new file is uploaded during an edit.
* **Unit System:** Upgraded database to support a `unit` column (KG, G, PCS) with a unified React input group.
* **Smart Stock API:** Allowed admins to reduce specific stock quantities rather than deleting the entire product entity.

### ✅ Milestones
* Automated `/uploads` directory creation to prevent deployment crashes.
* Inventory system is fully CRUD capable with professional UI modals.

---

## Day 9: Client-Side API Architecture & Analytics Polish
**Date:** 2026-02-24 | **Status:** `Complete` | **Phase:** Storefront Backend Readiness

### 🎯 Objective
Finalize Admin analytics and build the API foundation for the customer-facing React storefront.

### 🛠️ Critical Fixes
* **Node Crash:** Resolved a server crash in `orderRoutes.js` by restoring the missing `updateOrderStatus` method.
* **SQL Patches:** Executed emergency fixes to add missing `delivery_city`, `delivery_area`, and `delivery_address` columns to prevent charting errors.
* **Route Hierarchy:** Reordered `productRoutes.js` to ensure `/public` endpoints sit safely above `/:id` parameters.

### ⚙️ Technical Implementation
* **Checkout Engine:** Engineered a highly secure, transactional `placeOrder` API using SQL `BEGIN` and `COMMIT`. It processes orders, loops through cart arrays, and auto-decrements live stock quantities.
* **Storefront APIs:** Built `registerCustomer`, `loginCustomer`, and `getPublicProducts` (filtered by `stock_quantity > 0`).
* **Live Analytics:** Upgraded the Admin Sales Chart with an interactive City Switcher (Surat, Ahmedabad, Vadodara). Connected "Total Revenue" and "Pending Deliveries" UI cards to live endpoints.
* **Modularization:** Extracted all Auth routing into a dedicated `authRoutes.js` module.

### ✅ Milestones
* Backend architecture is officially ready for the frontend team to connect the customer shopping cart.
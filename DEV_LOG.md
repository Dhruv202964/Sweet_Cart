# 🚀 Sweet_Cart Development Log

**Team:** 404 ERROR

**Project:** Professional E-commerce & Inventory Ecosystem

**Tech Stack:** React.js, Node.js, Express, PostgreSQL

---

### 📅 Day 1: Project Initiation & Backend Foundation

**Date:** 2026-02-11

**Status:** ✅ Complete

**🏆 Key Achievements**

* **Repository Setup:**
* Created `Sweet_Cart` repo on GitHub.
* Established folder structure: `server` (Root) and `client` (React).
* Added collaborators.


* **Database Architecture (PostgreSQL):**
* Created database: `sweet_cart_db`.
* Tables Created: `users` (Roles: Admin, Customer, Rider), `categories`, `products`.
* Data Injection: Inserted mock data (Kaju Katli, Bhakarwadi) to verify relationships.


* **Backend Development (Node.js + Express):**
* Initialized `server.js` with `dotenv` configuration.
* Built `config/db.js` for PostgreSQL connection.
* API Created: `GET /api/products` (Tested & Verified).


* **Frontend Initialization:**
* Initialized React app (Vite) inside `/client` folder.



---

### 📅 Day 2: Authentication Security & User Roles

**Date:** 2026-02-12

**Status:** ✅ Complete

**🏆 Key Achievements**

* **Security Implementation:**
* Integrated `bcryptjs` for password hashing.
* Integrated `jsonwebtoken` (JWT) for secure session management.


* **Auth API Development:**
* **Registration:** Endpoint to hash passwords and save new users.
* **Login:** Endpoint to verify credentials and issue JWT tokens.
* **Verification:** Created "Super Owner" account and tested login successfully.



---

### 📅 Day 3: Logistics Backend & Admin Panel Kickoff

**Date:** 2026-02-13

**Status:** ✅ Complete

**🏆 Key Achievements**

* **Rider Logistics API (Backend):**
* **Database Expansion:** Created `orders` and `deliveries` tables.
* **Rider Endpoints:**
* `GET /api/rider/my-deliveries/:id` (Fetch assigned tasks).
* `PUT /api/rider/update-status` (Mark orders as Delivered).


* **Logic Test:** Verified orders move from 'Pending' -> 'Out for Delivery' -> 'Delivered'.


* **Admin Panel Setup (Frontend):**
* Initialized `admin` project using Vite + React.
* **Theme Setup:** Defined "Purshottam" color palette (Saffron, Royal Red, Cream).
* **Login Screen:** Built responsive Login UI and connected it to Backend Auth API.
* **Dashboard Skeleton:** Created the main landing page with summary stats.



---

### 📅 Day 4: Inventory, Order Management & Offline Stability

**Date:** 2026-02-14

**Status:** ✅ Complete

**🛠️ Critical Fixes**

* **Offline CSS Architecture:** Fixed a critical issue where Tailwind CSS failed to load during presentations without internet.
* *Solution:* Configured PostCSS and installed local dependencies to make the project 100% offline-capable (Presentation Proof).



**🏆 Key Achievements**

* **Inventory Management (Admin):**
* **Products Page:** Built a categorized table (Sweets vs. Farsan vs. Seasonal) fetching live data.
* **Add Product Feature:** Created a Modal popup form to add new items (e.g., Rasgulla) directly to the database.
* **UX Improvement:** Implemented "Fixed Sidebar" layout for better navigation.


* **Order Management System:**
* **Backend API:** Created `GET /api/orders` to fetch all customer orders with status and rider info.
* **Frontend UI:** Built the Orders Table displaying Order ID, Customer Name, Total Amount, and Color-coded Status Badges.



---

### 📅 Day 5: Real-Time Dashboard & Advanced Analytics

**Date:** 2026-02-15

**Status:** ✅ Complete

**🛠️ Critical Fixes (The "Crash" Loop)**

* **Database Schema:** Fixed a critical missing table error (`relation "order_items" does not exist`) by manually creating the table in PostgreSQL via SQL Shell.
* **Backend Routing:** Resolved a `TypeError` in `orderRoutes.js` where the controller function was missing.
* **Data Integrity:** Switched customer display from `u.name` (non-existent) to `u.email` to ensure data loads correctly.

**🏆 Key Achievements**

* **Advanced Order Analytics:**
* **Backend:** Updated SQL queries to `COUNT()` items inside each order dynamically.
* **Frontend:** Added an "Items" column to the Orders Table so the Admin knows the package size instantly (e.g., "2 Items").


* **Interactive Details Modal:**
* Built `OrderDetailsModal.jsx` to fetch and display specific sweets (Name, Price, Qty) inside a popup.
* Connected Backend `GET /api/orders/:id` to serve this data.


* **Live Dashboard Stats:**
* **Backend:** Created `getDashboardStats` API to calculate Total Revenue (SUM) and Pending Orders (COUNT) directly from the live database.
* **Frontend:** Connected the Dashboard cards to the API. It now reflects actual business metrics (e.g., ₹550 Revenue) instead of static placeholders.



---

### 📅 Day 6: The "Analytics Pivot" & Documentation

**Date:** 2026-02-16

**Status:** ✅ Complete

**🏆 Key Achievements**

* **Strategic Pivot:**
* Paused "Rider App" development based on Faculty Feedback.
* Shifted focus to **Data Analytics** and **Customer Engagement**.


* **Backend Analytics Engine:**
* **Complex SQL:** Wrote aggregation query (`GROUP BY delivery_address`) to calculate revenue per area in Surat.
* **New API:** Implemented `GET /api/orders/analytics` endpoint.


* **Visual Dashboard (The Graph):**
* **Integration:** Installed `chart.js` and `react-chartjs-2`.
* **Component:** Built `SalesChart.jsx` – A dynamic Bar Chart utilizing a multi-color palette (Red, Blue, Yellow) to visualize sales performance by location.


* **Project Management & Documentation:**
* Generated 4 core documents for team and faculty:
1. `PROJECT_STATUS.md` (Team Handoff).
2. `TEAM_TASKS.md` (Role Division).
3. `REPORT_FACULTY.md` (Academic Submission).
4. `DB_DOCS.md` (Technical Schema).





**⚠️ Known Issues (To Be Fixed Day 7)**

* **Inventory System Instability:**
* The "Add Product" feature is currently failing.
* *Root Cause:* Database schema mismatch (`category` text vs `category_id` integer) and missing `image_url` column handling.
* *Action Plan:* Schedule database patch and backend validation update for next session.



📅 Day 7: RBAC Security, HR Systems & UI Optimization
Date: 2026-02-17
Status: ✅ Complete

🛠️ Critical Fixes & Database Patches

Constraint Resolution: Fixed a users_role_check violation that blocked new roles.

Solution: Updated PostgreSQL constraints to allow 'manager' and 'staff' identifiers.

Schema Alignment: Resolved a full_name NOT NULL violation.

Solution: Updated the staff creation form and backend controller to capture and store employee names.

Auth Logic Correction: Fixed a mapping error where the backend expected password_hash but the controller sent password.

UI Layout Repair: Fixed a "cramped" dashboard issue where the sidebar was obstructing data tables.

Solution: Slimmed the Sidebar to w-56 and adjusted main content margins.

🏆 Key Achievements

Role-Based Access Control (RBAC):

Implemented a multi-tier security system: Admin (Owner), Manager (Operational), and Staff (Restricted).

Logic Magic: Modified Sidebar.jsx and Login.jsx to dynamically hide/show modules based on the logged-in user's role.

Staff Management (HR) Module:

Built a professional employee onboarding interface.

Functionality: Admin can now grant secure login credentials to new team members with predefined roles.

Customer Inbox (CRM Module):

Created the "Messages" module to view inquiries.

Data Injection: Populated the system with realistic test messages regarding bulk wedding orders and feedback.

Routing System Cleanup:

Resolved "Ghost Redirection" for the Riders section.

Built a "Module Under Construction" placeholder to maintain professional navigation for the Manager role.

📝 Next Steps (Day 8)

[ ] Financial Data Privacy: Implement logic to hide "Total Revenue" and "Sales Charts" from the Manager role.

[ ] Delete Permissions: Restrict the "Delete" functionality across Orders and Staff lists for non-admin users.

[ ] Client Storefront: Transition to the /client folder to begin the customer-facing shopping experience.
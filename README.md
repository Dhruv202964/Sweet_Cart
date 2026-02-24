🚀 Sweet_Cart: Comprehensive Development Log
Team: 404 ERROR (E-Commerce & Inventory Ecosystem)
Tech Stack: React.js (Vite), Node.js, Express.js, PostgreSQL, Tailwind CSS

📅 Day 1: Project Initiation & Backend Foundation
Date: 2026-02-11 | Phase: Architecture Setup
🎯 Objective: Establish the repository, initialize the PERN stack environment, and design the relational database schema.

⚙️ Technical Implementation:

Initialized Git repository Sweet_Cart and structured a monorepo with /client and /server directories.

Configured Node.js backend with express, cors, and dotenv for environment variable management.

Engineered the PostgreSQL database (sweet_cart_db) via pg pool connections.

Designed the core relational tables: users, categories, and products, establishing Primary Key and Foreign Key constraints.

🛠️ Database Injection:

Wrote raw SQL INSERT commands to inject foundational mock data (e.g., Kaju Katli, Bhakarwadi) to test relational mapping between categories and items.

✅ Milestones:

Server successfully running on Port 5000.

Tested and verified the first endpoint: GET /api/products returning clean JSON.

📅 Day 2: Authentication Security & User Roles
Date: 2026-02-12 | Phase: Security & RBAC Foundation
🎯 Objective: Implement secure, encrypted authentication and define system roles.

⚙️ Technical Implementation:

Integrated bcryptjs to ensure zero plain-text passwords are saved in the database.

Implemented stateless session management using jsonwebtoken (JWT). Tokens encode the user_id and role to validate requests across the app.

Built the authController.js handling register and login logic.

🛠️ Debugging & Security:

Created the "Super Owner" administrative account.

Added error handling for "User already exists" and "Invalid credentials" to prevent server crashes on bad login attempts.

✅ Milestones:

Passwords successfully hashing in PostgreSQL.

JWTs securely issued and verified upon login.

📅 Day 3: Logistics Backend & Admin Panel Kickoff
Date: 2026-02-13 | Phase: Frontend Bootstrapping & Delivery Logic
🎯 Objective: Build the admin interface skeleton and map out the order delivery lifecycle.

⚙️ Technical Implementation:

Initialized the React (Vite) Admin application.

Configured the UI theme using a custom "Purshottam" color palette (Royal Red, Saffron, Cream) via tailwind.config.js.

Expanded database schema to include orders and deliveries tables.

Built backend logistics endpoints: GET /api/rider/my-deliveries/:id and PUT /api/rider/update-status.

✅ Milestones:

Responsive Admin Login UI completed and successfully linked to the backend Auth API.

Verified the backend logic flow: Orders transitioning from Pending → Out for Delivery → Delivered.

📅 Day 4: Inventory, Order Management & Offline Stability
Date: 2026-02-14 | Phase: UI/UX & Presentation Proofing
🎯 Objective: Guarantee the app works without Wi-Fi for faculty presentations and build the core management tables.

🛠️ Critical Fix (Offline Stability):

Issue: Tailwind CSS relied on external CDNs, which would fail if college Wi-Fi dropped.

Solution: Configured local PostCSS and installed all Tailwind dependencies locally. Removed Google Fonts and replaced them with system-safe fonts to achieve 100% "Presentation Proof" status.

⚙️ Technical Implementation:

Built the Inventory Products Table with dynamic category mapping (Sweets, Farsan, Seasonal).

Engineered the "Add Product" React Modal to insert data directly into PostgreSQL.

Developed the Order Management UI with color-coded status badges (Red for Pending, Green for Delivered).

✅ Milestones:

Admin Sidebar navigation locked in.

GET /api/orders successfully populating the frontend data tables.

📅 Day 5: Real-Time Dashboard & Advanced Analytics
Date: 2026-02-15 | Phase: Data Aggregation
🎯 Objective: Replace static dashboard placeholders with live, real-time database metrics.

🛠️ Debugging & Fixes (The "Crash Loop"):

Issue 1: Fatal crash due to relation "order_items" does not exist. Fixed by writing manual SQL shell commands to construct the missing relational table.

Issue 2: TypeError in backend routing. Traced and fixed a missing controller export in orderRoutes.js.

Issue 3: Frontend crashing due to calling u.name. Refactored SQL join to fetch u.email instead to ensure data integrity.

⚙️ Technical Implementation:

Wrote dynamic SQL queries using aggregate functions: SUM(total_amount) for Total Revenue and COUNT(*) for Pending Orders.

Built OrderDetailsModal.jsx to fetch and render granular item data (Name, Price, Qty) for specific order IDs.

✅ Milestones:

Dashboard cards officially pulling live business metrics from PostgreSQL.

Order details seamlessly fetching relational data across three tables.

📅 Day 6: The "Analytics Pivot" & Documentation
Date: 2026-02-16 | Phase: Strategic Shift & Visualization
🎯 Objective: Pivot development based on faculty feedback to prioritize data analytics over rider tracking.

⚙️ Technical Implementation:

Integrated Chart.js and react-chartjs-2 into the React Admin portal.

Engineered complex SQL aggregations utilizing GROUP BY delivery_area to calculate revenue distribution mathematically on the server.

Built SalesChart.jsx, mapping the JSON response to a dynamic Bar Chart styled with the brand's color palette.

📝 Project Management:

Generated core academic and team documentation: PROJECT_STATUS.md, TEAM_TASKS.md, REPORT_FACULTY.md, and DB_DOCS.md to streamline the workload for the frontend team.

✅ Milestones:

Visual sales analytics successfully rendering on the dashboard.

📅 Day 7: RBAC Security, HR Systems & UI Optimization
Date: 2026-02-17 | Phase: Enterprise Features & Constraint Resolution
🎯 Objective: Lock down application security layers and build staff onboarding features.

🛠️ Critical Fixes (Database Patches):

Issue: PostgreSQL rejected new staff roles due to a users_role_check constraint.

Solution: Executed ALTER TABLE commands to expand allowed roles to include 'manager' and 'staff'.

Resolved full_name NOT NULL violations by updating the frontend forms and backend controllers to ensure data validation.

⚙️ Technical Implementation:

Implemented dynamic React rendering: Sidebar menus and sensitive data charts now hide or show based on the JWT role payload.

Built the HR/Staff Management Module allowing the Owner to securely generate credentials for employees.

Created a CRM "Messages" inbox for customer inquiries.

✅ Milestones:

Multi-tier security (Owner > Manager > Staff) strictly enforced.

UI layouts slimmed and optimized for better data table visibility.

📅 Day 8: Advanced Inventory Ecosystem & Data Precision
Date: 2026-02-18 | Phase: Complex CRUD Operations
🎯 Objective: Overhaul the inventory system to handle physical file uploads and precise unit measurements.

🛠️ Critical Fixes:

Connection Crisis: Fixed "Could not connect" errors by segregating product routes and utilizing multer for multipart/form-data parsing.

Zombie Data: Fixed UI ghosting where deleted products remained on screen. Solved by implementing ON DELETE CASCADE in SQL and strict state synchronization in React.

⚙️ Technical Implementation:

Added full Image Update support using the COALESCE SQL command to safely retain existing image URLs if no new file is uploaded during an edit.

Upgraded the database to support a unit column (KG, G, PCS).

Built a "Smart Stock" API: Allows admins to reduce specific stock quantities rather than deleting the entire product entity.

✅ Milestones:

Automated /uploads directory creation prevents deployment crashes.

Inventory system is fully CRUD capable with professional UI modals.

📅 Day 9: Client-Side API Architecture & Analytics Polish
Date: 2026-02-24 | Phase: Storefront Backend Readiness
🎯 Objective: Finalize Admin analytics and build the API foundation for the customer-facing React storefront.

🛠️ Critical Fixes:

Resolved backend crash in orderRoutes.js by restoring the missing updateOrderStatus controller.

Executed emergency SQL patches to add missing delivery_city, delivery_area, and delivery_address columns to prevent charting errors.

Fixed Express routing hierarchy bugs by moving /public routes above /:id parameters.

⚙️ Technical Implementation:

The Checkout Engine: Engineered a highly secure, transactional placeOrder API. Utilizing SQL BEGIN and COMMIT, it safely processes main orders, loops through cart arrays to save individual items, and automatically decrements live stock quantities.

Storefront APIs: Built registerCustomer, loginCustomer, and getPublicProducts (filtered by stock_quantity > 0).

Analytics Update: Upgraded the Admin Sales Chart with a responsive City Switcher (Surat, Ahmedabad, Vadodara) that filters data interactively.

✅ Milestones:

Modularized server.js for cleaner traffic routing.

Backend architecture is officially ready for the frontend team to connect the customer shopping cart.
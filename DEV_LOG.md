Sweet_Cart: Development Log
Team: 404 ERROR
Project: Professional E-commerce & Inventory Ecosystem
Tech Stack: React.js (Vite), Node.js, Express.js, PostgreSQL, Tailwind CSS

Day 1: Project Initiation & Backend Foundation
Date: 2026-02-11 | Status: Complete | Phase: Architecture Setup

🎯 Objective
Establish the repository, initialize the PERN stack environment, and design the relational database schema.

⚙️ Technical Implementation
Repository: Initialized Git repository Sweet_Cart and structured a monorepo with /client and /server directories.
Backend: Configured Node.js backend with express, cors, and dotenv for environment variable management.
Database: Engineered the PostgreSQL database (sweet_cart_db) via pg pool connections. Designed the core relational tables (users, categories, products) with strict Primary/Foreign Key constraints.
Data Injection: Wrote raw SQL INSERT commands to inject foundational mock data (Kaju Katli, Bhakarwadi) to test relational mapping.

✅ Milestones
Server successfully running on Port 5000.
Tested and verified the first endpoint: GET /api/products returning clean JSON.

Day 2: Authentication Security & User Roles
Date: 2026-02-12 | Status: Complete | Phase: Security & RBAC Foundation

🎯 Objective
Implement secure, encrypted authentication and define system roles.

⚙️ Technical Implementation
Cryptography: Integrated bcryptjs to ensure zero plain-text passwords are saved in the database.
Session Management: Implemented stateless sessions using jsonwebtoken (JWT). Tokens encode the user_id and role to validate requests across the app.
Controllers: Built authController.js handling registration and login logic. Added error handling for existing users and invalid credentials to prevent server crashes.

✅ Milestones
Passwords successfully hashing in PostgreSQL.
"Super Owner" administrative account created and verified.
JWTs securely issued upon login.

Day 3: Logistics Backend & Admin Panel Kickoff
Date: 2026-02-13 | Status: Complete | Phase: Frontend Bootstrapping & Delivery Logic

🎯 Objective
Build the admin interface skeleton and map out the order delivery lifecycle.

⚙️ Technical Implementation
Frontend Setup: Initialized the React (Vite) Admin application. Configured the "Purshottam" color palette (Royal Red, Saffron, Cream) via tailwind.config.js.
Database Expansion: Expanded schema to include orders and deliveries tables.
Logistics API: Built backend endpoints GET /api/rider/my-deliveries/:id and PUT /api/rider/update-status.

✅ Milestones
Responsive Admin Login UI completed and linked to the backend Auth API.
Verified the backend logic flow: Orders transitioning from Pending -> Out for Delivery -> Delivered.

Day 4: Inventory, Order Management & Offline Stability
Date: 2026-02-14 | Status: Complete | Phase: UI/UX & Presentation Proofing

🎯 Objective
Guarantee the app works offline for faculty presentations and build core management tables.

🛠️ Critical Fixes
Offline CSS Architecture: Tailwind CSS relied on external CDNs. Configured local PostCSS and installed all Tailwind dependencies locally to achieve 100% "Presentation Proof" status.

⚙️ Technical Implementation
Inventory UI: Built the Products Table with dynamic category mapping (Sweets, Farsan, Seasonal).
Data Entry: Engineered the "Add Product" React Modal to insert data directly into PostgreSQL.
Order Management: Developed the UI with color-coded status badges (Red: Pending, Green: Delivered).

✅ Milestones
Admin Sidebar navigation locked in.
GET /api/orders successfully populating the frontend data tables.

Day 5: Real-Time Dashboard & Advanced Analytics
Date: 2026-02-15 | Status: Complete | Phase: Data Aggregation

🎯 Objective
Replace static dashboard placeholders with live, real-time database metrics.

🛠️ Critical Fixes
Database Schema: Fixed fatal crash (relation "order_items" does not exist) by constructing the missing table via SQL shell.
Backend Routing: Resolved a TypeError by restoring a missing controller export in orderRoutes.js.
Data Integrity: Refactored SQL joins to fetch u.email instead of non-existent u.name.

⚙️ Technical Implementation
Aggregations: Wrote dynamic SQL queries using SUM(total_amount) for Revenue and COUNT(*) for Pending Orders.
Granular Data: Built OrderDetailsModal.jsx to fetch and render specific item data (Name, Price, Qty) for assigned order IDs.

✅ Milestones
Dashboard cards officially pulling live business metrics from PostgreSQL.

Day 6: The "Analytics Pivot" & Documentation
Date: 2026-02-16 | Status: Complete | Phase: Strategic Shift & Visualization

🎯 Objective
Pivot development based on faculty feedback to prioritize data analytics over rider tracking.

⚙️ Technical Implementation
Data Visualization: Integrated Chart.js and react-chartjs-2 into the Admin portal. Built SalesChart.jsx mapped to the brand's color palette.
Complex SQL: Engineered aggregations utilizing GROUP BY delivery_area to calculate revenue distribution mathematically on the server.
Documentation: Generated core academic documents (PROJECT_STATUS.md, TEAM_TASKS.md, REPORT_FACULTY.md, DB_DOCS.md).

✅ Milestones
Visual sales analytics successfully rendering on the dashboard.

Day 7: RBAC Security, HR Systems & UI Optimization
Date: 2026-02-17 | Status: Complete | Phase: Enterprise Features & Constraint Resolution

🎯 Objective
Lock down application security layers and build staff onboarding features.

🛠️ Critical Fixes
Constraints: Fixed a users_role_check violation in PostgreSQL blocking new roles. Executed ALTER TABLE to allow 'manager' and 'staff'.
Validation: Resolved a full_name NOT NULL violation by updating forms and backend controllers.

⚙️ Technical Implementation
Dynamic Rendering: Sidebar menus and sensitive data charts now hide/show based on the JWT role payload.
HR Module: Built Staff Management interface allowing the Admin to securely generate credentials for employees.
CRM: Created a "Messages" inbox populated with realistic test inquiries for presentation purposes.

✅ Milestones
Multi-tier security (Owner > Manager > Staff) strictly enforced.
UI layouts slimmed (w-56 sidebar) for better data table visibility.

Day 8: Advanced Inventory Ecosystem & Data Precision
Date: 2026-02-18 | Status: Complete | Phase: Complex CRUD Operations

🎯 Objective
Overhaul the inventory system to handle physical file uploads and precise unit measurements.

🛠️ Critical Fixes
Connection Stability: Fixed persistent product upload crashes by segregating productRoutes.js and integrating multer.
Zombie Data: Implemented ON DELETE CASCADE in SQL to fix UI ghosting where deleted products remained on screen.

⚙️ Technical Implementation
File Handling: Added image update support using COALESCE SQL command to safely retain existing images if no new file is uploaded during an edit.
Unit System: Upgraded database to support a unit column (KG, G, PCS) with a unified React input group.
Smart Stock API: Allowed admins to reduce specific stock quantities rather than deleting the entire product entity.

✅ Milestones
Automated /uploads directory creation to prevent deployment crashes.
Inventory system is fully CRUD capable with professional UI modals.

Day 9: Client-Side API Architecture & Analytics Polish
Date: 2026-02-24 | Status: Complete | Phase: Storefront Backend Readiness

🎯 Objective
Finalize Admin analytics and build the API foundation for the customer-facing React storefront.

🛠️ Critical Fixes
Node Crash: Resolved a server crash in orderRoutes.js by restoring the missing updateOrderStatus method.
SQL Patches: Executed emergency fixes to add missing delivery_city, delivery_area, and delivery_address columns to prevent charting errors.
Route Hierarchy: Reordered productRoutes.js to ensure /public endpoints sit safely above /:id parameters.

⚙️ Technical Implementation
Checkout Engine: Engineered a highly secure, transactional placeOrder API using SQL BEGIN and COMMIT. It processes orders, loops through cart arrays, and auto-decrements live stock quantities.
Storefront APIs: Built registerCustomer, loginCustomer, and getPublicProducts (filtered by stock_quantity > 0).
Live Analytics: Upgraded the Admin Sales Chart with an interactive City Switcher (Surat, Ahmedabad, Vadodara). Connected "Total Revenue" and "Pending Deliveries" UI cards to live endpoints.
Modularization: Extracted all Auth routing into a dedicated authRoutes.js module.

✅ Milestones
Backend architecture is officially ready for the frontend team to connect the customer shopping cart.

Day 10: Pre-Presentation Overhaul & Data Integrity
Date: 2026-02-26 | Status: Complete | Phase: Presentation Prep & Admin Streamlining

🎯 Objective
Simplify admin architecture, implement frontend data filtering, and seed realistic database relationships for the final faculty presentation.

🛠️ Critical Fixes
Auto-Increment Trap: Resolved foreign key violations during data injection by executing a hard data wipe (TRUNCATE TABLE ... RESTART IDENTITY CASCADE) and utilizing dynamic SQL subqueries to safely link order_items to products and users.
API Disconnects: Fixed the "Guest User" and "NaN" UI bugs by updating orderController.js to properly LEFT JOIN the users table for full_name and the products table for item details.
Category Mismatch: Synchronized the React frontend and PostgreSQL database by executing an UPDATE query renaming the 'Namkeen' category to 'Farsan'.

⚙️ Technical Implementation
RBAC Deprecation: Stripped complex Role-Based Access Control (RBAC), safely removing Staff.jsx and ManagerHome.jsx. Transitioned to a streamlined, Admin-only ProtectedRoute in App.jsx to eliminate routing bugs.
UI/UX Filtering: Engineered interactive, state-driven filter buttons in Orders.jsx (City-based filtering) and Products.jsx (Category-based filtering) to demonstrate array manipulation capabilities.
Data Seeding: Injected a comprehensive, realistic Surat-based dataset including categories (Sweets, Farsan, Dairy), 15 authentic products (e.g., Premium Pista Ghari, Nylon Khaman), 4 users, and 7 multi-city orders.
Dashboard API Upgrade: Overhauled the getDashboardStats endpoint to aggregate precise presentation metrics: Total Revenue, Total Orders, Pending Deliveries, and Cancellations.

✅ Milestones
Admin dashboard is 100% bug-free, visually polished, and loaded with realistic presentation data.
Frontend UI state management is perfectly synced with backend SQL queries, allowing immediate transition to User UI development.

Day 11: Enterprise Dashboard & Analytics Polish
Date: 2026-02-26 | Status: Complete | Phase: Final Admin Optimization

🎯 Objective
Elevate the admin dashboard with real-time chronological analytics (Daily/Monthly) and unbreakable API fetching before the final faculty presentation.

🛠️ Critical Fixes
API Resilience: Replaced monolithic Promise.all() fetches with isolated try/catch blocks in Dashboard.jsx. This prevents singular endpoint failures (e.g., a 404 on /stats) from crashing the entire dashboard UI.
Route Alignment: Fixed the status update HTTP PUT request URL mismatch (/:id/status vs /update-status) in orderRoutes.js, instantly restoring the admin's ability to transition orders from Pending to Delivered.
UX/UI Restoration: Reverted an overly compressed table layout in Orders.jsx back to the original, premium, spacious design (incorporating p-5 padding and large typography) to ensure maximum readability for the presentation.

⚙️ Technical Implementation
Chronological SQL Aggregations: Upgraded orderController.js using complex PostgreSQL functions like EXTRACT(MONTH FROM created_at) and CURRENT_DATE to dynamically calculate "This Month's Profit", "Today's Profit", and "Delivered Today".
Dynamic Data Visualization: Upgraded the Chart.js implementation to support interactive dual-layer filtering. Clicking a specific city dynamically re-renders the chart to break down revenue by local delivery areas (e.g., Adajan vs. Vesu). Increased canvas height (h-80) for visual impact.
6-Card Metric Grid: Expanded the dashboard UI to a responsive 6-card layout tracking comprehensive enterprise metrics, including a dedicated and filtered 'Cancellations' tracking system.
Schema Documentation: Finalized and generated the complete, unified PostgreSQL Relational Database Schema (users, categories, products, orders, order_items) for the documentation team.

✅ Milestones
Admin ecosystem is 100% feature-complete with production-grade, time-sensitive analytics.
Backend is completely stable and locked in.
Team is officially cleared to begin development on the User/Customer Storefront UI.

Day 12: Premium Customer Storefront & Routing Architecture
Date: 2026-02-27 | Status: Complete | Phase: Frontend Client UI

🎯 Objective
Build the premium customer-facing e-commerce storefront, implement page routing, and enrich database product details for the final presentation.

🛠️ Critical Fixes
Tailwind Integration: Resolved Vite/Tailwind configuration conflicts by clearing default CSS, manually creating tailwind.config.js and postcss.config.js, and ensuring compatibility with Tailwind v3.
React Router Stability: Fixed the "White Screen of Death" by implementing optional chaining (?.) to safely handle null database fields during search filtering, and properly registering all routes in App.jsx.

⚙️ Technical Implementation
Routing Architecture: Integrated react-router-dom to manage seamless navigation between the Customer Storefront (/), Full Menu (/menu), and Admin Dashboard (/admin).
Premium UI Design: Developed Home.jsx utilizing a luxury "Purshottam" amber and gold color palette. Built a "Sneak Peek" system to display exactly 4 items per category for a clean, modern homepage layout.
Sectioned Menu Page: Engineered Menu.jsx to dynamically render distinct, scrollable category sections (Sweets, Farsan, Dairy) rather than hiding items behind filter tabs.
Database Enrichment: Executed SQL scripts to inject rich, professional descriptions for 18 authentic Surati products. Mapped local .jpg assets (via public/uploads) to the PostgreSQL image_url column with object-cover CSS for uniform sizing.

✅ Milestones
Frontend storefront is live, beautifully styled, and successfully fetching and rendering real data from PostgreSQL.
Product images and descriptions are fully integrated, making the user-facing application 100% presentation-ready.

Day 13: Cloud Migration & Global State Management
Date: 2026-03-05 | Status: Complete | Phase: Cloud Deployment & Cart Logic

🎯 Objective
Migrate the local PostgreSQL database to a live cloud environment and engineer a global state management system for the shopping cart.

🛠️ Critical Fixes
Cloud Security: Resolved Neon cloud connection rejections by enforcing `sslmode=require` in the Node.js connection pool.
Database Restoration: Bypassed ownership conflict errors during pgAdmin restore by stripping local owner privileges, successfully migrating all data to `neondb`.
UI Component Conflicts: Fixed double-stacking header issues by purging local navbars from individual page components and centralizing routing layout in `App.jsx`.

⚙️ Technical Implementation
Cloud Database: Successfully migrated the `sweet_cart_db` schema and data to Neon.tech. Re-configured backend environment variables to interface with the live AWS-hosted endpoint.
Global State (Context API): Engineered `CartContext.jsx` to serve as the global state memory, handling array additions, instant quantity subtractions, total price calculations, and global search string memory without prop-drilling.
Interactive Toggles: Upgraded static "Add to Cart" buttons into dynamic `[ - 1 + ]` interactive components across all product grids and the cart sidebar, mirroring industry-standard UX (e.g., Swiggy/Zomato).
Global Search Wiring: Connected the global `Navbar` input field to the Context API, allowing real-time, cross-page product filtering on the Menu page.

✅ Milestones
Database is officially live on the internet.
Frontend state is perfectly synchronized with the UI, allowing fluid product selection and real-time cart subtotal tracking.

Day 14: Premium UI, Dynamic Routing & Image Galleries
Date: 2026-03-06 | Status: Complete | Phase: Enterprise Polish

🎯 Objective
Build a premium product details page, implement image gallery sliders, and anchor the application with a global footer.

🛠️ Critical Fixes
Type Mismatches: Resolved React Router "White Screen of Death" by strictly casting PostgreSQL IDs to Strings during array `.find()` lookups.
Performance Optimization: Restricted the `setInterval` auto-slider component exclusively to the Home page's 4-item "Sneak Peek" to prevent browser memory leaks and lag on the extensive Full Menu page.

⚙️ Technical Implementation
Database Expansion: Executed ALTER TABLE commands in Neon to add `ingredients` (TEXT) and `gallery_images` (TEXT ARRAY) to support rich product galleries.
Dynamic Routing: Configured `<Route path="/product/:id">` and wrapped `Home` and `Menu` product cards in React Router `<Link>` components for seamless navigation.
Premium Product UI: Engineered `ProductDetails.jsx` with a split-screen layout, manual image carousel (left/right chevrons), cart integration, and dynamic ingredient rendering.
Auto-Slider Engine: Built a custom React `useEffect` hook to cycle through product images every 2.5 seconds for the Home page grid.
Global Footer: Designed a responsive, 4-column enterprise footer (`Footer.jsx`) including brand story, contact info, and "Coming Soon" expansion markers, injected globally via `App.jsx`.

✅ Milestones
Products now have dedicated, shareable URL endpoints.
Application UI mirrors top-tier enterprise e-commerce platforms.

Day 15: Enterprise Authentication, Dynamic Checkout & Advanced State Management
Date: 2026-03-07 | Status: Complete | Phase: Checkout Engine & Security Polish

🎯 Objective
Finalize the checkout UI, implement user registration/authentication, engineer global authentication state, and upgrade the admin inventory system to handle multi-image uploads.

🛠️ Critical Fixes
Context API Race Conditions: Resolved a fatal "White Screen of Death" by implementing optional chaining (?.) and null-safety nets when CartContext attempts to read from AuthContext during initial render.
Chart.js Caching Crash: Squashed a `useRef` rendering error in the Admin Dashboard by forcing a Vite cache clear (`--force`) and realigning package dependencies.
The "F5 Wipeout" & "Ghost Cart": Eliminated volatile state loss by anchoring the shopping cart to `localStorage` and `sessionStorage`. Implemented route-based conditional rendering in `Navbar.jsx` to dynamically hide the cart on checkout and auth pages.

⚙️ Technical Implementation
Multi-File Architecture: Upgraded `multer` configuration in `productRoutes.js` to utilize `upload.fields`, enabling the backend to map multiple gallery images to PostgreSQL array columns alongside custom product ingredients.
Dynamic Checkout UI: Engineered `Checkout.jsx` featuring cascading State-to-City dropdown logic, strict regex pattern validation (10-digit mobile lock), and dynamic form pre-filling based on global auth state.
Global Authentication: Built `AuthContext.jsx` to manage user sessions globally. Designed and wired premium `Login.jsx` and `Register.jsx` interfaces directly to the backend PostgreSQL database.
User-Specific Carts: Refactored `CartContext.jsx` to generate unique browser storage keys based on the logged-in user's email (`sweetcart_cart_[email]`), preventing cart crossover between guests and registered users.
Smart Navbar Navigation: Integrated Lucide React icons to build an interactive User Profile dropdown. Engineered the UI to dynamically grant exclusive "Admin Dashboard" access links based strictly on JWT role payloads.

✅ Milestones
Users can successfully register, log in, and maintain persistent, individualized shopping carts.
Admin panel fully supports multi-image gallery uploads and rich text ingredient tracking.
Frontend application state is now 100% stable, context-aware, and crash-resistant.

Day 16: Universal Tracking Ecosystem & Premium UX
Date: 2026-03-08 | Status: Complete | Phase: Customer Journey Polish

🎯 Objective
Eradicate native browser alerts, upgrade the checkout UI, and build a universal, standalone Track Order ecosystem for both Auth and Guest users.

🛠️ Critical Fixes
Schema Mismatch: Patched the `orders` table to handle extensive shipping details via `ALTER TABLE` commands and reset the `order_id` sequence to start at 10000 for enterprise-grade invoicing.
Crash Prevention: Nullified white screen crashes on the Admin Dashboard via optional chaining `?.` when rendering charts with empty order datasets.
Guest Database Constraints: Resolved the inability of Guest Users to track orders by engineering the backend to fallback and search using their checkout `email` if a `customer_id` is null.

⚙️ Technical Implementation
Digital Receipts: Engineered `TrackOrder.jsx` featuring conditional search (Email OR ID), loading animations (Lucide Truck), and a complete "Digital Receipt" UI displaying nested order items and precise delivery locations.
Complex Aggregations: Upgraded `orderController.js` with `json_agg` logic to bundle relational product names, prices, and quantities directly into the primary order JSON payload.
Alert Deprecation: Systematically purged all native `alert()` popups across `Checkout.jsx`, `Register.jsx`, and `Login.jsx`. Replaced them with full-screen, branded Success State UIs powered by conditional rendering.
Smart Routing: Overhauled `Navbar.jsx` user dropdown to natively expose "Track Order" and "Login" options to unauthenticated guest users.

✅ Milestones
Checkout and Auth flows are completely popup-free and enterprise-grade.
Guest users can now independently verify their order status.
# 🚀 Sweet_Cart Development Log

**Team:** 404 ERROR  
**Project:** Professional E-commerce & Inventory Ecosystem  
**Tech Stack:** React.js, Node.js, Express, PostgreSQL  

---

## 📅 Day 1: Project Initiation & Backend Foundation
**Date:** [Current Date]  
**Status:** ✅ Complete

### 🏆 Key Achievements
1.  **Repository Setup:**
    - Created `Sweet_Cart` repo on GitHub.
    - Established folder structure: `server` (Root) and `client` (React).
    - Added collaborators (Designer & Documentation lead).

2.  **Database Architecture (PostgreSQL):**
    - Created database: `sweet_cart_db`.
    - **Tables Created:**
        - `users` (Roles: Admin, Customer, Rider)
        - `categories` (Sweets, Namkeen, etc.)
        - `products` (Linked to categories via Foreign Key)
    - **Data Injection:** Inserted mock data (Kaju Katli, Bhakarwadi) to test relationships.

3.  **Backend Development (Node.js + Express):**
    - Initialized project with `npm init`.
    - Configured `dotenv` for security (Database credentials).
    - Built `config/db.js` to connect Node.js to PostgreSQL.
    - Created the Main Server (`server.js`).

4.  **API Development:**
    - **Route Created:** `GET /api/products`
    - **Status:** Tested and verified. Returns JSON data from the database correctly.

5.  **Frontend Initialization:**
    - Created React app using Vite inside `/client` folder.
    - Pushed base boilerplate to GitHub for the design team.

---

### 📝 Next Steps (Day 2)
- [ ] Implement **User Registration** logic (bcrypt encryption).
- [ ] Implement **User Login** logic (JWT Token generation).
- [ ] Create the first **Admin Account** via API.
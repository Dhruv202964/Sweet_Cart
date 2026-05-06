<h1 align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg" alt="SweetCart" width="40" height="40">
  <br>
  SweetCart Enterprise Ecosystem
</h1>

<p align="center">
  <strong>A high-performance, full-stack e-commerce platform and centralized management system for premium sweets and snacks.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📖 Overview

SweetCart is a comprehensive, enterprise-grade e-commerce architecture engineered from the ground up to handle dynamic product catalogs, secure user authentication, and complex order state management. Delivered in a rapid 33-day development sprint, the platform consists of two unified interfaces: a highly optimized **Customer Storefront** and a secure, real-time **Admin CMS Dashboard**.

> **Note to Recruiters:** This project demonstrates advanced relational database modeling, atomic SQL transactions, secure JWT payload handling, and custom middleware integration.

---

## ✨ Enterprise Features

### 🛍️ The Customer Storefront
*   **Dynamic State Management:** Real-time cart calculations and localized state synchronization.
*   **Audio-QR Gifting Engine:** A unique feature allowing users to attach Base64-encoded audio messages to their orders, generated as physical QR codes for the recipient.
*   **Categorized Catalog:** Advanced filtering for traditional sweets, namkeen, and a dedicated 'Healthy Signatures' (Sugar-Free) routing logic.
*   **Secure Authentication:** Protected user accounts with encrypted password resets (OTP) and beautifully styled, inline-CSS automated email delivery.

### 🛡️ The Admin Dashboard (Secure CMS)
*   **Dynamic Hero Slider CMS:** Admins can dynamically toggle active homepage promotions without touching the codebase.
*   **Automated Inventory Intelligence:** Server-side logic to automatically lock out-of-stock items and dynamically compute all-time "Best Sellers" via aggregate SQL queries.
*   **Integrated CRM:** A centralized inbox for customer inquiries routed directly from the storefront.

---

## 🏗️ Technical Architecture

### Tech Stack
*   **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (Relational schema with foreign key constraints)
*   **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs
*   **Utilities:** Multer (File Handling), Nodemailer (Automated Emails), node-cron (Background Tasks)

### Database Integrity & Transactions
To handle heavy payloads (like the Base64 Audio-QR data) safely, the checkout pipeline utilizes **Atomic Database Transactions** (`BEGIN` and `ROLLBACK`). This ensures that if a network failure occurs during checkout, no orphan data is left in the system, maintaining strict ACID compliance.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+ recommended)
*   PostgreSQL running locally or via a cloud provider

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Dhruv202964/Sweet_Cart.git](https://github.com/Dhruv202964/Sweet_Cart.git)
   cd Sweet_Cart

2. **Install dependencies for both client and server:**

    cd client && npm install
    cd ../server && npm install

3. **Environment Setup:**

   Create a .env file in the server directory with the following variables:

   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secure_secret
   EMAIL_USER=your_smtp_email
   EMAIL_PASS=your_smtp_password

4. **Initialize the Database:**
   Execute the schema queries located in server/database/schema.sql within your PostgreSQL instance.

5. **Spin up the application:**

   # Terminal 1 (Backend)
     cd server
     npm run dev

  # Terminal 2 (Frontend)
     cd client
     npm run dev


👨‍💻 Team 404 ERROR
This architecture was engineered by Team 404 ERROR:

Dhruv Thakar - Lead Full-Stack Developer & Database Architect

Sneha - UI/UX & Documentation Lead

Bhargavi - QA & Presentation Lead

Powered by infinite coffee, late-night debugging, and React hooks.

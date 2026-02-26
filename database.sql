-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - FINAL PRE-PRESENTATION
-- # Team: 404 ERROR | Date: Feb 26, 2026
-- ############################################################

-- 1. USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'admin', 'rider')) DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. PRODUCTS TABLE (Updated with Unit & Stock)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'kg', -- Added unit support (kg, g, pcs)
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE (Updated for Analytics)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_area VARCHAR(100), -- For Area-wise Chart
    delivery_city VARCHAR(100) DEFAULT 'Surat', -- For City-wise Chart
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDER ITEMS TABLE (Required for accurate Order Details)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

-- 6. CONTACT MESSAGES TABLE (CRM)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ############################################################
-- # REALISTIC SURAT-BASED DATA INJECTION
-- ############################################################

-- Categories
INSERT INTO categories (name) VALUES ('Sweets'), ('Farsan'), ('Dairy');

-- Admin & Users
INSERT INTO users (full_name, email, password_hash, role) VALUES 
('Admin', 'admin@sweetcart.com', 'admin123', 'admin'),
('Rahul Sharma', 'rahul.s@gmail.com', 'pass123', 'customer'),
('Priya Patel', 'priya.p@gmail.com', 'pass123', 'customer');

-- Products
INSERT INTO products (category_id, name, price, stock_quantity, unit) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg'),
(2, 'Nylon Khaman', 120.00, 20, 'kg'),
(3, 'Fresh Paneer', 450.00, 15, 'kg');

-- Sample Orders for Dashboard
INSERT INTO orders (customer_id, total_amount, status, delivery_address, delivery_area, delivery_city) VALUES 
(2, 850.00, 'Delivered', '12, Shyam Nagar', 'Adajan', 'Surat'),
(3, 1250.00, 'Pending', '45, SG Highway', 'Bodakdev', 'Ahmedabad'),
(2, 600.00, 'Cancelled', '12, Shyam Nagar', 'Adajan', 'Surat');
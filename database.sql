-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - PRODUCTION NEON CLOUD
-- # Team: 4O4 ERROR | Updated: March 31, 2026 (Phase 8)
-- ############################################################

-- 0. SYSTEM LOCALIZATION
-- Enforces Indian Standard Time (IST) globally across the cloud server
ALTER DATABASE "neondb" SET timezone TO 'Asia/Kolkata';

-- 1. USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. PRODUCTS TABLE
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    ingredients TEXT, 
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    unit VARCHAR(10) DEFAULT 'kg', 
    image_url TEXT,
    gallery_images TEXT[], 
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE 
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    guest_email VARCHAR(255), 
    guest_phone VARCHAR(15),  
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_area VARCHAR(100), 
    delivery_city VARCHAR(100) DEFAULT 'Surat', 
    delivery_state VARCHAR(100) DEFAULT 'Gujarat', -- Added for National Expansion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reset Order ID Sequence for Enterprise Invoicing
ALTER SEQUENCE orders_order_id_seq RESTART WITH 10000;

-- 5. ORDER ITEMS TABLE
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

-- 6. CONTACT MESSAGES TABLE (CRM)
-- Updated Day 20: Subject line support for professional Gmail integration
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    email VARCHAR(255),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ############################################################
-- # DATA SEEDING (Sweets, Farsan, Dairy)
-- ############################################################

INSERT INTO categories (name) VALUES ('Sweets'), ('Farsan'), ('Dairy');

INSERT INTO users (full_name, email, password_hash, role, phone) VALUES 
('Admin', 'admin@sweetcart.com', 'admin123', 'admin', '9876543210');

-- Example Product with Ingredients
INSERT INTO products (category_id, name, price, stock_quantity, unit, ingredients, gallery_images) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg', 'Pure Ghee, Pistachios, Sugar, Mawa', ARRAY['pista_1.jpg', 'pista_2.jpg']);
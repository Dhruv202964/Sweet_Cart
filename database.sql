-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - LOCAL POSTGRESQL ENVIRONMENT
-- # Team: 404 ERROR | Updated: April 2026 (Final Address Ecosystem)
-- ############################################################

-- 0. SYSTEM LOCALIZATION
-- Enforces Indian Standard Time (IST) on your local PostgreSQL server
-- (Make sure your local database is actually named 'sweet_cart'!)
ALTER DATABASE sweet_cart SET timezone TO 'Asia/Kolkata';

-- 1. USERS TABLE (RBAC Removed for streamlined access)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 SAVED ADDRESSES TABLE (The new, upgraded Address Book ecosystem)
CREATE TABLE saved_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    address_type VARCHAR(10) CHECK (address_type IN ('Home', 'Work', 'Other')),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    flat_house TEXT NOT NULL,
    area_street TEXT NOT NULL,
    landmark TEXT,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
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
    is_bestseller BOOLEAN DEFAULT FALSE, -- ✨ Added for Homepage Bestsellers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE (Upgraded with full Checkout & Ghost Order support)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(255), -- ✨ Matched to React Checkout form
    email VARCHAR(255),         -- ✨ Matched to React Checkout form
    phone VARCHAR(20),          -- ✨ Matched to React Checkout form
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Cancelled by User', 'Cancelled by Admin')),
    payment_status VARCHAR(50) DEFAULT 'Pending Payment', -- ✨ Added for Ghost Order system
    delivery_address TEXT NOT NULL,
    flat_house TEXT,            -- ✨ Matched to React Checkout form
    landmark TEXT,              -- ✨ Matched to React Checkout form
    delivery_area VARCHAR(100), 
    delivery_city VARCHAR(100) DEFAULT 'Surat', 
    state VARCHAR(100) DEFAULT 'Gujarat', -- ✨ Matched to React Checkout form
    pincode VARCHAR(20),        -- ✨ Matched to React Checkout form
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
-- Subject line support for professional Gmail integration
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

-- Admin User Seeding
INSERT INTO users (full_name, email, password_hash, phone) VALUES 
('Admin', 'admin@sweetcart.com', 'admin123', '9876543210');

-- Example Product with Ingredients and Bestseller flag enabled
INSERT INTO products (category_id, name, price, stock_quantity, unit, ingredients, gallery_images, is_bestseller) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg', 'Pure Ghee, Pistachios, Sugar, Mawa', ARRAY['pista_1.jpg', 'pista_2.jpg'], TRUE);
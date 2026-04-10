-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - LOCAL POSTGRESQL ENVIRONMENT
-- # Team: 404 ERROR | Updated: April 2026 (Final Address, OTP & Custom Box Ecosystem)
-- ############################################################

-- 0. SYSTEM LOCALIZATION
-- Enforces Indian Standard Time (IST) on your local PostgreSQL server
-- (Make sure your local database is actually named 'sweet_cart'!)
ALTER DATABASE sweet_cart SET timezone TO 'Asia/Kolkata';

-- 1. USERS TABLE (Upgraded with OTP Email Engine & Role safety)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'customer', 
    reset_otp VARCHAR(10),               
    reset_otp_expiry TIMESTAMP,          
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
    is_bestseller BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE (Upgraded with full Checkout & Ghost Order support)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(255), 
    email VARCHAR(255),         
    phone VARCHAR(20),          
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Cancelled by User', 'Cancelled by Admin')),
    payment_status VARCHAR(50) DEFAULT 'Pending Payment', 
    delivery_address TEXT NOT NULL,
    flat_house TEXT,            
    landmark TEXT,              
    delivery_area VARCHAR(100), 
    delivery_city VARCHAR(100) DEFAULT 'Surat', 
    state VARCHAR(100) DEFAULT 'Gujarat', 
    pincode VARCHAR(20),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reset Order ID Sequence for Enterprise Invoicing
ALTER SEQUENCE orders_order_id_seq RESTART WITH 10000;

-- 5. ORDER ITEMS TABLE (🚀 UPGRADED FOR 250G/500G & CUSTOM BOXES)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    weight_selected VARCHAR(20) DEFAULT '1KG',     -- ✨ NEW: Captures 250G/500G/1KG selection
    is_custom_box BOOLEAN DEFAULT FALSE,           -- ✨ NEW: Flags if this item is a custom gift box
    custom_box_selections TEXT                     -- ✨ NEW: Stores the JSON/String of sweets inside the box
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

-- Admin User Seeding (Password: admin123)
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES 
('Admin', 'admin@sweetcart.com', '$2a$10$X...', '9876543210', 'admin'); 
-- NOTE: Make sure your actual bcrypt hash for 'admin123' goes here if you are hardcoding it!

-- Example Product with Ingredients and Bestseller flag enabled
INSERT INTO products (category_id, name, price, stock_quantity, unit, ingredients, gallery_images, is_bestseller) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg', 'Pure Ghee, Pistachios, Sugar, Mawa', ARRAY['pista_1.jpg', 'pista_2.jpg'], TRUE);
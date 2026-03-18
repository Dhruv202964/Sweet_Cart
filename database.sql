-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - PRODUCTION NEON CLOUD
-- # Team: 4O4 ERROR | Updated: March 2026 (Phase 6)
-- ############################################################

-- 1. USERS TABLE (Updated Day 17: Phone precision & Day 10: RBAC removal)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE (Renamed Namkeen -> Farsan on Day 10)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. PRODUCTS TABLE (Updated Day 14: Ingredients & Gallery Arrays)
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
    gallery_images TEXT[], -- Supports multer multi-image array uploads
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE (Updated Day 16: Guest Tracking & Sequence Reset)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    guest_email VARCHAR(255), -- Fallback for Guest Order Tracking
    guest_phone VARCHAR(15),  -- Fallback for Guest Order Tracking
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_area VARCHAR(100), 
    delivery_city VARCHAR(100) DEFAULT 'Surat', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Day 16: Reset Order ID Sequence for Enterprise Invoicing (Starts at 10000)
ALTER SEQUENCE orders_order_id_seq RESTART WITH 10000;

-- 5. ORDER ITEMS TABLE (Day 8: Cascade Deletes implemented)
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
    email VARCHAR(255),
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
INSERT INTO users (full_name, email, password_hash, role, phone) VALUES 
('Admin', 'admin@sweetcart.com', 'admin123', 'admin', '9876543210'),
('Rahul Sharma', 'rahul.s@gmail.com', 'pass123', 'customer', '9876543211'),
('Priya Patel', 'priya.p@gmail.com', 'pass123', 'customer', '9876543212');

-- Products (Updated with ingredients and array syntax)
INSERT INTO products (category_id, name, price, stock_quantity, unit, ingredients, gallery_images) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg', 'Pure Ghee, Pistachios, Sugar, Mawa', ARRAY['pista_1.jpg', 'pista_2.jpg']),
(2, 'Nylon Khaman', 120.00, 20, 'kg', 'Besan, Sugar, Lemon, Mustard Seeds', ARRAY['khaman_1.jpg']),
(3, 'Fresh Paneer', 450.00, 15, 'kg', 'Pure Cow Milk, Vinegar', ARRAY['paneer_1.jpg']);

-- Sample Orders for Dashboard (Now starts at 10000 due to sequence)
INSERT INTO orders (customer_id, guest_email, guest_phone, total_amount, status, delivery_address, delivery_area, delivery_city) VALUES 
(2, 'rahul.s@gmail.com', '9876543211', 850.00, 'Delivered', '12, Shyam Nagar', 'Adajan', 'Surat'),
(3, 'priya.p@gmail.com', '9876543212', 1250.00, 'Pending', '45, SG Highway', 'Bodakdev', 'Ahmedabad'),
(NULL, 'guest@test.com', '9123456780', 600.00, 'Cancelled', '7, VIP Road', 'Vesu', 'Surat'); -- Demonstrating Guest Order
-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - UPDATED FEB 18, 2026
-- # Team: 4O4 ERROR
-- ############################################################

-- 1. USERS TABLE (Includes RBAC: admin, manager, staff, rider, customer)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Updated role constraint to allow Manager and Staff
    role VARCHAR(20) CHECK (role IN ('customer', 'admin', 'rider', 'manager', 'staff')) DEFAULT 'customer',
    position VARCHAR(100), -- Used for Staff titles (e.g., 'Inventory Manager')
    phone VARCHAR(20),
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
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, packed, out for delivery, delivered
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. DELIVERIES TABLE
CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    rider_id INT REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);

-- 6. CONTACT MESSAGES TABLE (CRM Module)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ############################################################
-- # SAMPLE DATA INJECTION
-- ############################################################

-- Initial Categories
INSERT INTO categories (name, description) VALUES 
('Sweets', 'Delicious traditional Indian sweets'),
('Namkeen', 'Savory snacks and farsan'),
('Seasonal Specials', 'Limited time festive items');

-- Sample Admin (Note: Use hashed password 'admin123' in production)
INSERT INTO users (full_name, email, password_hash, role, phone) VALUES 
('Admin User', 'admin@sweetcart.com', 'admin123', 'admin', '9876543210');

-- Sample Manager (Rahul Chulbula)
INSERT INTO users (full_name, email, password_hash, role, position, phone) VALUES 
('Rahul Chulbula', 'rahul@sweetcart.com', 'manager123', 'manager', 'Manager', '9988776655');

-- Sample Customer Messages
INSERT INTO contact_messages (customer_name, email, subject, message) VALUES 
('Sneha Patel', 'sneha.p@gmail.com', 'Bulk Order', 'Inquiry for 25kg Kaju Katli for March wedding.'),
('Amit Shah', 'amit88@outlook.com', 'Feedback', 'The Bhakarwadi was excellent!');
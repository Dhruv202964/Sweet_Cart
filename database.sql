-- ############################################################
-- # SWEET_CART DATABASE SCHEMA - LOCAL POSTGRESQL ENVIRONMENT
-- # Team: 404 ERROR 
-- # Updated: April 25, 2026 (Day 33: Brand Identity & Healthy Signatures)
-- ############################################################

-- 0. SYSTEM LOCALIZATION
-- Enforces Indian Standard Time (IST) on your local PostgreSQL server
ALTER DATABASE sweet_cart SET timezone TO 'Asia/Kolkata';

-- 1. USERS TABLE (Upgraded with OTP Email Engine & Role Security)
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

-- 1.5 SAVED ADDRESSES TABLE (The Enterprise Address Book Ecosystem)
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

-- 3. PRODUCTS TABLE (Upgraded for Multi-Image Galleries & Rich Ingredients)
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

-- 4. ORDERS TABLE (Upgraded with full Checkout Validation & Ghost Order Protection)
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
    audio_message TEXT,         -- 🎙️ NEW: Base64 audio for VIP QR Voice Gift
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reset Order ID Sequence (Starts at #10000)
ALTER SEQUENCE orders_order_id_seq RESTART WITH 10000;

-- 5. ORDER ITEMS TABLE (🚀 UPGRADED FOR 250G/500G & VIP CUSTOM BOXES)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    weight_selected VARCHAR(20) DEFAULT '1KG',     -- Captures 250G/500G/1KG
    is_custom_box BOOLEAN DEFAULT FALSE,           -- Flags if VIP custom gift box
    custom_box_selections TEXT                     -- Kitchen packing list
);

-- 6. CONTACT MESSAGES TABLE (CRM Inbox Integration)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    email VARCHAR(255),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. HERO SLIDERS TABLE (🖼️ Dynamic Storefront CMS)
CREATE TABLE hero_sliders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    cta_text VARCHAR(100) DEFAULT 'Shop Now',
    cta_link VARCHAR(255) DEFAULT '/menu',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. DAILY STATS TABLE (📈 The Analytics Engine)
CREATE TABLE daily_stats (
    stat_date DATE PRIMARY KEY,
    total_visitors INT DEFAULT 0
);

-- ############################################################
-- # SYSTEM SEEDING DATA (Core Dependencies)
-- ############################################################

-- Initial Categories (Including specialized Niche Category)
INSERT INTO categories (name) VALUES ('Sweets'), ('Farsan'), ('Dairy'), ('Sugar-Free');

-- Default Admin Account (Password is hashed 'admin123')
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES 
('Admin', 'admin@sweetcart.com', '$2a$10$X...', '9876543210', 'admin'); 

-- 🌿 MISSION C: INJECT HEALTH-CENTRIC SIGNATURE DATA (12 PRODUCTS)
INSERT INTO products (name, description, price, stock_quantity, unit, category_id, is_bestseller, ingredients)
VALUES 
('Sugar-Free Pista Ghari', 'The authentic Surat legacy, completely guilt-free.', 850.00, 50, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), true, 'Premium Pistachios, Pure Ghee, Stevia Extract, and Cardamom.'),
('Sugar-Free Kaju Katli', 'Classic diamond fudge with zero sugar spike.', 900.00, 100, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), true, 'Premium Cashews, Erythritol, Rose Water, and Edible Silver Foil.'),
('Sugar-Free Khajur Pak', 'Naturally sweetened entirely with premium dry fruits.', 1200.00, 40, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Arabian Dates, Almonds, Walnuts, Nutmeg, and Ghee.'),
('Sugar-Free Anjeer Roll', 'Rich fig rolls packed with crunch.', 1100.00, 60, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), true, 'Dried Figs (Anjeer), Roasted Cashews, Poppy Seeds, and Almonds.'),
('Sugar-Free Malai Peda', 'Soft, milky, and perfectly sweetened without the sugar.', 650.00, 80, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Fresh Milk Mawa, Stevia, Saffron strands, and Pistachio dust.'),
('Sugar-Free Baked Shakarpara', 'The ultimate tea-time snack, baked not fried!', 400.00, 120, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Whole Wheat Flour, Zero-Calorie Sweetener, Cow Ghee, and Cardamom.'),
('Sugar-Free Badam Barfi', 'Pure almond goodness.', 1050.00, 45, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), true, 'California Almonds, Stevia Sweetener, Clarified Butter, and Saffron.'),
('Sugar-Free Moong Dal Halwa', 'Rich, warm, and comforting.', 700.00, 30, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Yellow Moong Dal, Pure Desi Ghee, Almond Milk, and Erythritol.'),
('Sugar-Free Diet Chivda', 'Savory, crunchy, and diabetic-friendly.', 350.00, 150, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Roasted Poha, Peanuts, Curry Leaves, Turmeric, and Pink Salt.'),
('Sugar-Free Mysore Pak', 'Melt-in-your-mouth texture from the South.', 800.00, 55, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), true, 'Roasted Gram Flour, Generous Ghee, and Natural Stevia Blend.'),
('Sugar-Free Pista Roll', 'Vibrant and nutty.', 1150.00, 40, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Pure Mawa, Crushed Pistachios, Cashew Base, and Zero-Calorie Sweetener.'),
('Sugar-Free Dry Fruit Kachori', 'A mini savory-sweet bite.', 550.00, 90, 'KG', (SELECT category_id FROM categories WHERE name = 'Sugar-Free'), false, 'Whole Wheat Shell, Raisins, Cashews, Spices, and Stevia dust.');

-- Sample Bestseller Product
INSERT INTO products (category_id, name, price, stock_quantity, unit, ingredients, gallery_images, is_bestseller) VALUES 
(1, 'Premium Pista Ghari', 850.00, 50, 'kg', 'Pure Ghee, Pistachios, Sugar, Mawa', ARRAY['pista_1.jpg', 'pista_2.jpg'], TRUE);

-- Initial Fallback Hero Slider
INSERT INTO hero_sliders (title, subtitle, image_url, cta_text, cta_link, is_active) VALUES 
('Royal Surat Sweets', 'PREMIUM QUALITY 100% PURE', 'https://images.unsplash.com/photo-1633933358116-a27b902fad35?q=80&w=1920&auto=format&fit=crop', 'Explore Collection', '/menu', TRUE);
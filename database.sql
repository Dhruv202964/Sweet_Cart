-- This file is just for reference. 
-- You need to run these commands in your SQL Shell or pgAdmin.

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'admin', 'rider')) DEFAULT 'customer',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- You can add more tables like products, orders, etc. as needed.
-- Categories table:

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Products table:

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


-- Adding categories:

INSERT INTO categories (name, description) VALUES 
('Sweets', 'Delicious traditional Indian sweets'),
('Namkeen', 'Savory snacks and farsan');

-- Adding sample products:

INSERT INTO products (category_id, name, description, price, stock_quantity, image_url) VALUES 
(1, 'Kaju Katli', 'Premium cashew fudge', 800.00, 50, 'https://example.com/kaju.jpg'),
(2, 'Bhakarwadi', 'Spicy crunchy rolls', 250.00, 100, 'https://example.com/bhakar.jpg');

-- Adding admien user:

INSERT INTO users (full_name, email, password_hash, role, phone) VALUES 
('Admin User', 'admin@sweetcart.com', 'admin123', 'admin', '9876543210');

-- Created orders table:

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Created deliveries table:

CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    rider_id INT REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);
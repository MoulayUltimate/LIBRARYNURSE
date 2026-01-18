-- Products Table
CREATE TABLE IF NOT EXISTS Products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    download_link TEXT,
    category TEXT,
    collections JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id TEXT PRIMARY KEY,
    stripe_payment_intent_id TEXT UNIQUE,
    customer_email TEXT,
    amount REAL NOT NULL,
    status TEXT NOT NULL, -- 'succeeded', 'processing', 'failed', 'pending'
    items JSON, -- Store items as a JSON string for simplicity
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table (Page Views)
CREATE TABLE IF NOT EXISTS Analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    event_type TEXT DEFAULT 'page_view', -- 'page_view', 'add_to_cart', 'checkout_start'
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Carts Table (for Abandoned Checkouts)
CREATE TABLE IF NOT EXISTS Carts (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    email TEXT,
    items JSON,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table (Contact Form)
CREATE TABLE IF NOT EXISTS Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

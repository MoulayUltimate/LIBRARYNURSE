DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
    id TEXT PRIMARY KEY,
    stripe_payment_intent_id TEXT UNIQUE,
    customer_email TEXT,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    items JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

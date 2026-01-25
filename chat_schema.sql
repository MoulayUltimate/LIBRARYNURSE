-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS ChatSessions (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'closed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS ChatMessages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    sender TEXT, -- 'customer', 'admin'
    message TEXT,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster message retrieval by session
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON ChatMessages(session_id);

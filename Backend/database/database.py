import sqlite3

DB_NAME = "itineraries.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Existing itineraries table
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS itineraries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        destination TEXT,
        start_date TEXT,
        end_date TEXT,
        preferences TEXT,
        itinerary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """
    )

    # NEW: Chat messages table
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itinerary_id INTEGER,
        role TEXT NOT NULL,  -- 'user' or 'assistant'
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
    )
    """
    )

    # Index for faster chat history queries
    cursor.execute(
        """
    CREATE INDEX IF NOT EXISTS idx_chat_itinerary 
    ON chat_messages(itinerary_id)
    """
    )

    conn.commit()
    conn.close()

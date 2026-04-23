import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'bond.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    partner_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    topic TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mood INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// User operations
export const User = {
  create: async (email, password, name, partnerName) => {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (id, email, password, name, partner_name) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, email, hashedPassword, name, partnerName);
    return { id, email, name, partnerName };
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT id, email, name, partner_name, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  },

  verifyPassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }
};

// Session operations
export const Session = {
  create: (userId, title, topic) => {
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO sessions (id, user_id, title, topic) VALUES (?, ?, ?, ?)');
    stmt.run(id, userId, title, topic);
    return { id, userId, title, topic, status: 'active' };
  },

  findByUserId: (userId) => {
    const stmt = db.prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
    return stmt.get(id);
  },

  update: (id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const stmt = db.prepare(`UPDATE sessions SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return Session.findById(id);
  }
};

// Message operations
export const Message = {
  create: (sessionId, role, content) => {
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)');
    stmt.run(id, sessionId, role, content);
    return { id, sessionId, role, content };
  },

  findBySessionId: (sessionId) => {
    const stmt = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC');
    return stmt.all(sessionId);
  }
};

// Goal operations
export const Goal = {
  create: (userId, title, description) => {
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO goals (id, user_id, title, description) VALUES (?, ?, ?, ?)');
    stmt.run(id, userId, title, description);
    return { id, userId, title, description, status: 'active', streak: 0 };
  },

  findByUserId: (userId) => {
    const stmt = db.prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  incrementStreak: (id) => {
    const stmt = db.prepare('UPDATE goals SET streak = streak + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
    return Goal.findById(id);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM goals WHERE id = ?');
    return stmt.get(id);
  },

  complete: (id) => {
    const stmt = db.prepare('UPDATE goals SET status = "completed", completed_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
    return Goal.findById(id);
  }
};

// Checkin operations
export const Checkin = {
  create: (userId, mood, notes) => {
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO checkins (id, user_id, mood, notes) VALUES (?, ?, ?, ?)');
    stmt.run(id, userId, mood, notes);
    return { id, userId, mood, notes };
  },

  findByUserId: (userId, limit = 30) => {
    const stmt = db.prepare('SELECT * FROM checkins WHERE user_id = ? ORDER BY created_at DESC LIMIT ?');
    return stmt.all(userId, limit);
  }
};

export default db;

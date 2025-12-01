const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database.db');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        console.log('Connected to SQLite database');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  async createTables() {
    const queries = [
      // Links table
      `CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        date_added TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      
      // Click analytics table
      `CREATE TABLE IF NOT EXISTS click_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_id INTEGER NOT NULL,
        clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (link_id) REFERENCES links(id)
      )`,
      
      // Page views table
      `CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page TEXT NOT NULL,
        session_id TEXT NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        screen_width INTEGER,
        screen_height INTEGER,
        country TEXT,
        region TEXT,
        city TEXT,
        timezone TEXT,
        latitude REAL,
        longitude REAL,
        viewed_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      
      // Sessions table
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        start_time TEXT NOT NULL DEFAULT (datetime('now')),
        last_activity TEXT NOT NULL DEFAULT (datetime('now')),
        referrer TEXT,
        user_agent TEXT,
        screen_size TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        timezone TEXT,
        coordinates TEXT
      )`,
      
      // Admins table
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    ];

    for (const query of queries) {
      await this.run(query);
    }

    // Create default admin user if it doesn't exist
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'daniel2025';
    
    const existingAdmin = await this.get('SELECT * FROM admins WHERE username = ?', [adminUsername]);
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await this.run(
        'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
        [adminUsername, passwordHash, 'admin']
      );
      console.log('Default admin user created');
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const db = new Database();
module.exports = db;




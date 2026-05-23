import Database from 'better-sqlite3';
import path from 'path';

// DB_PATH env var lets Docker mount a persistent volume directory.
// Falls back to the project root (next to package.json) for local dev.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../todos.db');

// better-sqlite3 is synchronous — one connection is enough for this app
const db = new Database(DB_PATH);

// Enable WAL mode for better performance on writes
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    text      TEXT    NOT NULL,
    category  TEXT    NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;

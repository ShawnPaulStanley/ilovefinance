import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

function initializeSqlite(): DatabaseSync {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isVercel) {
    // Vercel serverless environment: file system is read-only except /tmp
    try {
      const vercelDbPath = path.join('/tmp', 'ilovefinance.db');
      console.log(`[Database] Initializing SQLite for Vercel serverless runtime at: ${vercelDbPath}`);
      const instance = new DatabaseSync(vercelDbPath);
      instance.exec('PRAGMA foreign_keys = ON;');
      return instance;
    } catch (err) {
      console.warn('[Database] /tmp SQLite initialization failed on Vercel, falling back to in-memory SQLite:', err);
      const instance = new DatabaseSync(':memory:');
      instance.exec('PRAGMA foreign_keys = ON;');
      return instance;
    }
  }

  // Local / standard Node.js server environment
  try {
    const DB_DIR = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    const DB_PATH = path.join(DB_DIR, 'ilovefinance.db');
    const instance = new DatabaseSync(DB_PATH);
    instance.exec('PRAGMA journal_mode = WAL;');
    instance.exec('PRAGMA foreign_keys = ON;');
    console.log(`[Database] SQLite connected at ${DB_PATH}`);
    return instance;
  } catch (err) {
    console.warn('[Database] Local persistent database connection failed, falling back to in-memory SQLite:', err);
    const instance = new DatabaseSync(':memory:');
    instance.exec('PRAGMA foreign_keys = ON;');
    return instance;
  }
}

export const db = initializeSqlite();

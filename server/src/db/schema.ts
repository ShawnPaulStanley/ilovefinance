import { db } from './connection.js';

export function initializeDatabase() {
  db.exec(`
    -- 1. Portfolios Table
    CREATE TABLE IF NOT EXISTS portfolios (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- 2. Stocks Reference & Metadata Table
    CREATE TABLE IF NOT EXISTS stocks (
      symbol TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      exchange TEXT NOT NULL,
      sector TEXT NOT NULL,
      industry TEXT DEFAULT '',
      market_cap REAL DEFAULT 0,
      pe_ratio REAL DEFAULT 0,
      dividend_yield REAL DEFAULT 0,
      fifty_two_week_high REAL DEFAULT 0,
      fifty_two_week_low REAL DEFAULT 0,
      current_price REAL NOT NULL,
      prev_close REAL NOT NULL,
      day_change REAL DEFAULT 0,
      day_change_percent REAL DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      last_updated TEXT DEFAULT (datetime('now'))
    );

    -- 3. Transactions Table (BUY, SELL, DIVIDEND)
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      stock_symbol TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL', 'DIVIDEND')),
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      total_amount REAL NOT NULL,
      transaction_date TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
      FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
    );

    -- 4. Holdings Table (Computed per portfolio & stock)
    CREATE TABLE IF NOT EXISTS holdings (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      stock_symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      avg_buy_price REAL NOT NULL,
      total_invested REAL NOT NULL,
      realized_pl REAL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
      FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol),
      UNIQUE(portfolio_id, stock_symbol)
    );

    -- 5. Dividends Table
    CREATE TABLE IF NOT EXISTS dividends (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      stock_symbol TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
      FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
    );

    -- 6. Watchlist Table
    CREATE TABLE IF NOT EXISTS watchlist (
      id TEXT PRIMARY KEY,
      stock_symbol TEXT NOT NULL UNIQUE,
      target_price REAL DEFAULT 0,
      notes TEXT DEFAULT '',
      added_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE
    );

    -- 7. Historical Prices Table
    CREATE TABLE IF NOT EXISTS historical_prices (
      symbol TEXT NOT NULL,
      date TEXT NOT NULL,
      open REAL NOT NULL,
      high REAL NOT NULL,
      low REAL NOT NULL,
      close REAL NOT NULL,
      volume REAL DEFAULT 0,
      PRIMARY KEY (symbol, date)
    );

    -- 8. Price Cache Table for Market Data
    CREATE TABLE IF NOT EXISTS price_cache (
      symbol TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      cached_at INTEGER NOT NULL
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_transactions_portfolio ON transactions(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(stock_symbol);
    CREATE INDEX IF NOT EXISTS idx_holdings_portfolio ON holdings(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_dividends_portfolio ON dividends(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_historical_symbol ON historical_prices(symbol);
  `);

  console.log('[Database] Schema verified and initialized.');
}

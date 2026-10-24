-- ilovefinance Relational Database Schema
-- Compatible with SQLite (default) and PostgreSQL

-- 1. Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_default INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stocks Reference & Metadata Table
CREATE TABLE IF NOT EXISTS stocks (
  symbol TEXT PRIMARY KEY,           -- e.g. 'RELIANCE.NS', 'TCS.NS', 'INFY.NS'
  name TEXT NOT NULL,                -- e.g. 'Reliance Industries Limited'
  short_name TEXT NOT NULL,          -- e.g. 'Reliance'
  exchange TEXT NOT NULL,            -- 'NSE' or 'BSE'
  sector TEXT NOT NULL,              -- e.g. 'Energy', 'Information Technology', 'Financials'
  industry TEXT,
  market_cap REAL,
  pe_ratio REAL,
  dividend_yield REAL,
  fifty_two_week_high REAL,
  fifty_two_week_low REAL,
  current_price REAL NOT NULL,
  prev_close REAL NOT NULL,
  day_change REAL,
  day_change_percent REAL,
  currency TEXT DEFAULT 'INR',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table (BUY, SELL, DIVIDEND)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL,
  stock_symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL', 'DIVIDEND')),
  quantity REAL NOT NULL,            -- Number of shares (for DIVIDEND, can be 0 or eligible shares)
  price REAL NOT NULL,               -- Price per share or dividend per share
  total_amount REAL NOT NULL,        -- quantity * price (or total dividend payout)
  transaction_date TEXT NOT NULL,    -- YYYY-MM-DD format
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
);

-- 4. Active Holdings Cache Table (Derived from transactions)
CREATE TABLE IF NOT EXISTS holdings (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL,
  stock_symbol TEXT NOT NULL,
  quantity REAL NOT NULL,
  avg_buy_price REAL NOT NULL,
  total_invested REAL NOT NULL,
  realized_pl REAL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol),
  UNIQUE(portfolio_id, stock_symbol)
);

-- 5. Dividends Record Table
CREATE TABLE IF NOT EXISTS dividends (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL,
  stock_symbol TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
);

-- 6. Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,
  stock_symbol TEXT NOT NULL UNIQUE,
  target_price REAL,
  notes TEXT DEFAULT '',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  volume REAL,
  PRIMARY KEY (symbol, date)
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_holdings_portfolio ON holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_dividends_portfolio ON dividends(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_historical_symbol ON historical_prices(symbol);

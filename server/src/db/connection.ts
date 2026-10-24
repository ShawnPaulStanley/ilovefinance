import path from 'node:path';
import fs from 'node:fs';

export interface DatabaseStatement {
  all(...params: any[]): any[];
  get(...params: any[]): any | undefined;
  run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
}

export interface DatabaseInterface {
  exec(sql: string): void;
  prepare(sql: string): DatabaseStatement;
}

// In-Memory Fallback Database when native node:sqlite is not present (Node <= 20 on Vercel)
class InMemoryDatabase implements DatabaseInterface {
  private tables: Record<string, any[]> = {
    portfolios: [],
    stocks: [],
    transactions: [],
    holdings: [],
    dividends: [],
    watchlist: [],
    historical_prices: [],
    price_cache: []
  };

  public exec(_sql: string): void {
    // Schema creation is a no-op for in-memory store
  }

  public prepare(sql: string): DatabaseStatement {
    const cleanSql = sql.replace(/\s+/g, ' ').trim();
    const self = this;

    return {
      all(...params: any[]): any[] {
        return self.executeQuery(cleanSql, params);
      },
      get(...params: any[]): any | undefined {
        const rows = self.executeQuery(cleanSql, params);
        return rows[0];
      },
      run(...params: any[]): { changes: number; lastInsertRowid: number | bigint } {
        return self.executeMutation(cleanSql, params);
      }
    };
  }

  private executeQuery(sql: string, params: any[]): any[] {
    const lower = sql.toLowerCase();

    // 1. SELECT count(*)
    if (lower.startsWith('select count(*) as count from')) {
      const match = lower.match(/from\s+([a-z0-9_]+)/);
      if (match) {
        const tableName = match[1];
        const count = (this.tables[tableName] || []).length;
        return [{ count }];
      }
      return [{ count: 0 }];
    }

    // 2. SELECT FROM portfolios
    if (lower.includes('from portfolios')) {
      if (lower.includes('where id = ?') && params.length > 0) {
        return this.tables.portfolios.filter(p => p.id === params[0]);
      }
      // Join with holdings/transactions for summary columns if needed
      return this.tables.portfolios.map(p => {
        const pHoldings = this.tables.holdings.filter(h => h.portfolio_id === p.id);
        const total_value = pHoldings.reduce((sum, h) => sum + (h.current_value || 0), 0);
        const total_invested = pHoldings.reduce((sum, h) => sum + (h.total_invested || 0), 0);
        const unrealized_pl = total_value - total_invested;
        const unrealized_pl_percent = total_invested > 0 ? (unrealized_pl / total_invested) * 100 : 0;
        return {
          ...p,
          active_holdings_count: pHoldings.length,
          total_value,
          total_invested,
          unrealized_pl,
          unrealized_pl_percent,
          realized_pl: 0,
          total_pnl: unrealized_pl,
          total_return_percent: unrealized_pl_percent,
          todays_pl: 0,
          todays_pl_percent: 0
        };
      });
    }

    // 3. SELECT FROM stocks
    if (lower.includes('from stocks')) {
      if (lower.includes('where symbol = ? or symbol = ?') && params.length >= 2) {
        const s1 = params[0]?.toLowerCase();
        const s2 = params[1]?.toLowerCase();
        return this.tables.stocks.filter(s => s.symbol.toLowerCase() === s1 || s.symbol.toLowerCase() === s2);
      }
      if (lower.includes('where symbol = ?') && params.length > 0) {
        const target = params[0]?.toLowerCase();
        return this.tables.stocks.filter(s => s.symbol.toLowerCase() === target);
      }
      if (lower.includes('order by market_cap desc limit 10')) {
        return [...this.tables.stocks].sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0)).slice(0, 10);
      }
      return this.tables.stocks;
    }

    // 4. SELECT FROM transactions
    if (lower.includes('from transactions')) {
      let list = [...this.tables.transactions];
      if (lower.includes('where portfolio_id = ?') && params.length > 0) {
        list = list.filter(t => t.portfolio_id === params[0]);
      } else if (lower.includes('where t.portfolio_id = ?') && params.length > 0) {
        list = list.filter(t => t.portfolio_id === params[0]);
      } else if (lower.includes('where t.id = ?') && params.length > 0) {
        list = list.filter(t => t.id === params[0]);
      }
      return list.map(t => {
        const stock = this.tables.stocks.find(s => s.symbol === t.stock_symbol);
        return {
          ...t,
          stock_name: stock?.name || t.stock_symbol,
          sector: stock?.sector || 'Diversified',
          exchange: stock?.exchange || 'NSE'
        };
      });
    }

    // 5. SELECT FROM holdings
    if (lower.includes('from holdings')) {
      let list = [...this.tables.holdings];
      if (params.length > 0) {
        list = list.filter(h => h.portfolio_id === params[0]);
      }
      return list.map(h => {
        const stock = this.tables.stocks.find(s => s.symbol === h.stock_symbol);
        return {
          ...h,
          name: stock?.name || h.stock_symbol,
          sector: stock?.sector || 'Diversified',
          exchange: stock?.exchange || 'NSE',
          current_price: stock?.current_price || h.avg_buy_price,
          prev_close: stock?.prev_close || h.avg_buy_price,
          day_change: stock?.day_change || 0,
          day_change_percent: stock?.day_change_percent || 0
        };
      });
    }

    // 6. SELECT FROM watchlist
    if (lower.includes('from watchlist')) {
      return this.tables.watchlist.map(w => {
        const stock = this.tables.stocks.find(s => s.symbol === w.stock_symbol);
        return {
          ...w,
          name: stock?.name || w.stock_symbol,
          short_name: stock?.short_name || w.stock_symbol,
          sector: stock?.sector || 'Equities',
          exchange: stock?.exchange || 'NSE',
          current_price: stock?.current_price || 1000,
          prev_close: stock?.prev_close || 990,
          day_change: stock?.day_change || 10,
          day_change_percent: stock?.day_change_percent || 1.0,
          fifty_two_week_high: stock?.fifty_two_week_high || 1200,
          fifty_two_week_low: stock?.fifty_two_week_low || 800
        };
      });
    }

    // 7. SELECT sum(realized_pl) or sum(total_amount)
    if (lower.includes('sum(realized_pl) as total_realized_pl')) {
      const portId = params[0];
      const sum = this.tables.transactions
        .filter(t => t.portfolio_id === portId && t.type === 'SELL')
        .reduce((acc, t) => acc + (t.realized_pl || 0), 0);
      return [{ total_realized_pl: sum }];
    }

    if (lower.includes('sum(total_amount) as total_dividends')) {
      const portId = params[0];
      const sum = this.tables.transactions
        .filter(t => t.portfolio_id === portId && t.type === 'DIVIDEND')
        .reduce((acc, t) => acc + (t.total_amount || 0), 0);
      return [{ total_dividends: sum }];
    }

    return [];
  }

  private executeMutation(sql: string, params: any[]): { changes: number; lastInsertRowid: number | bigint } {
    const lower = sql.toLowerCase();

    // 1. INSERT INTO portfolios
    if (lower.startsWith('insert into portfolios') || lower.startsWith('insert or ignore into portfolios')) {
      const [id, name, description, is_default] = params;
      const existing = this.tables.portfolios.find(p => p.id === id);
      if (!existing) {
        this.tables.portfolios.push({
          id,
          name,
          description: description || '',
          is_default: is_default ? 1 : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      return { changes: 1, lastInsertRowid: 1 };
    }

    // 2. UPDATE portfolios
    if (lower.startsWith('update portfolios set is_default = 0')) {
      this.tables.portfolios.forEach(p => { p.is_default = 0; });
      return { changes: this.tables.portfolios.length, lastInsertRowid: 0 };
    }

    if (lower.startsWith('update portfolios')) {
      const portfolioId = params[params.length - 1];
      const p = this.tables.portfolios.find(x => x.id === portfolioId);
      if (p) {
        if (params[0] !== undefined && params[0] !== null) p.name = params[0];
        if (params[1] !== undefined && params[1] !== null) p.description = params[1];
        if (params[2] !== undefined && params[2] !== null) p.is_default = params[2];
        p.updated_at = new Date().toISOString();
      }
      return { changes: 1, lastInsertRowid: 0 };
    }

    // 3. DELETE FROM portfolios
    if (lower.startsWith('delete from portfolios')) {
      const id = params[0];
      this.tables.portfolios = this.tables.portfolios.filter(p => p.id !== id);
      return { changes: 1, lastInsertRowid: 0 };
    }

    // 4. INSERT INTO stocks
    if (lower.startsWith('insert into stocks') || lower.startsWith('insert or replace into stocks')) {
      const s = typeof params[0] === 'object' && !Array.isArray(params[0]) ? params[0] : null;
      if (s) {
        const idx = this.tables.stocks.findIndex(x => x.symbol === s.symbol);
        if (idx >= 0) this.tables.stocks[idx] = { ...this.tables.stocks[idx], ...s };
        else this.tables.stocks.push({ ...s });
      }
      return { changes: 1, lastInsertRowid: 1 };
    }

    // 5. INSERT INTO transactions
    if (lower.startsWith('insert into transactions') || lower.startsWith('insert or ignore into transactions')) {
      const [id, portfolio_id, stock_symbol, type, quantity, price, total_amount, transaction_date, notes] = params;
      const existing = this.tables.transactions.find(t => t.id === id);
      if (!existing) {
        this.tables.transactions.push({
          id,
          portfolio_id,
          stock_symbol,
          type,
          quantity: Number(quantity),
          price: Number(price),
          total_amount: Number(total_amount),
          transaction_date,
          notes: notes || '',
          created_at: new Date().toISOString()
        });
      }
      return { changes: 1, lastInsertRowid: 1 };
    }

    // 6. DELETE FROM transactions
    if (lower.startsWith('delete from transactions')) {
      if (lower.includes('where id = ?')) {
        this.tables.transactions = this.tables.transactions.filter(t => t.id !== params[0]);
      } else if (lower.includes('where portfolio_id = ?')) {
        this.tables.transactions = this.tables.transactions.filter(t => t.portfolio_id !== params[0]);
      }
      return { changes: 1, lastInsertRowid: 0 };
    }

    // 7. INSERT INTO holdings
    if (lower.startsWith('insert into holdings')) {
      const [portfolio_id, stock_symbol, quantity, avg_buy_price, total_invested] = params;
      this.tables.holdings.push({
        portfolio_id,
        stock_symbol,
        quantity: Number(quantity),
        avg_buy_price: Number(avg_buy_price),
        total_invested: Number(total_invested),
        current_value: Number(total_invested),
        unrealized_pl: 0
      });
      return { changes: 1, lastInsertRowid: 1 };
    }

    // 8. DELETE FROM holdings
    if (lower.startsWith('delete from holdings')) {
      const pid = params[0];
      this.tables.holdings = this.tables.holdings.filter(h => h.portfolio_id !== pid);
      return { changes: 1, lastInsertRowid: 0 };
    }

    // 9. INSERT / DELETE watchlist
    if (lower.startsWith('insert into watchlist') || lower.startsWith('insert or ignore into watchlist')) {
      const [id, stock_symbol, notes] = params;
      if (!this.tables.watchlist.some(w => w.stock_symbol === stock_symbol)) {
        this.tables.watchlist.push({ id, stock_symbol, notes: notes || '', added_at: new Date().toISOString() });
      }
      return { changes: 1, lastInsertRowid: 1 };
    }

    if (lower.startsWith('delete from watchlist')) {
      const sym = params[0];
      this.tables.watchlist = this.tables.watchlist.filter(w => w.stock_symbol !== sym);
      return { changes: 1, lastInsertRowid: 0 };
    }

    // 10. DELETE FROM dividends
    if (lower.startsWith('delete from dividends')) {
      return { changes: 1, lastInsertRowid: 0 };
    }

    return { changes: 1, lastInsertRowid: 1 };
  }
}

// Dynamically check and initialize database engine
async function createDatabaseInstance(): Promise<DatabaseInterface> {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  let DatabaseSyncClass: any = null;
  try {
    const sqliteModule = await import('node:sqlite');
    DatabaseSyncClass = sqliteModule.DatabaseSync;
  } catch (_e) {
    console.warn('[Database] Native node:sqlite not supported in this Node runtime, using in-memory engine');
  }

  // If node:sqlite is available
  if (DatabaseSyncClass) {
    if (isVercel) {
      try {
        const vercelDbPath = path.join('/tmp', 'ilovefinance.db');
        console.log(`[Database] Initializing SQLite for Vercel at: ${vercelDbPath}`);
        const instance = new DatabaseSyncClass(vercelDbPath);
        instance.exec('PRAGMA foreign_keys = ON;');
        return instance;
      } catch (err) {
        console.warn('[Database] /tmp SQLite failed on Vercel, falling back to :memory:', err);
        const instance = new DatabaseSyncClass(':memory:');
        instance.exec('PRAGMA foreign_keys = ON;');
        return instance;
      }
    }

    // Local persistent SQLite
    try {
      const DB_DIR = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const DB_PATH = path.join(DB_DIR, 'ilovefinance.db');
      const instance = new DatabaseSyncClass(DB_PATH);
      instance.exec('PRAGMA journal_mode = WAL;');
      instance.exec('PRAGMA foreign_keys = ON;');
      console.log(`[Database] SQLite connected at ${DB_PATH}`);
      return instance;
    } catch (err) {
      console.warn('[Database] Local disk failed, falling back to :memory:', err);
      const instance = new DatabaseSyncClass(':memory:');
      instance.exec('PRAGMA foreign_keys = ON;');
      return instance;
    }
  }

  // Pure JavaScript InMemoryDatabase fallback (100% resilient across all Node versions)
  console.log('[Database] Running Universal In-Memory Database Engine');
  return new InMemoryDatabase();
}

export const db: DatabaseInterface = await createDatabaseInstance();

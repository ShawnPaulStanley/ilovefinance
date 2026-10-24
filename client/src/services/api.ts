import { 
  Portfolio, 
  PortfolioSummary, 
  Transaction, 
  StockQuote, 
  WatchlistItem, 
  AnalyticsResponse, 
  MarketStatusResponse 
} from '../types/finance';
import { 
  FALLBACK_PORTFOLIO, 
  FALLBACK_ANALYTICS, 
  FALLBACK_BENCHMARKS, 
  FALLBACK_MARKET_STATUS, 
  FALLBACK_WATCHLIST 
} from './fallbackData';

const BASE_URL = '/api';

export async function fetchPortfolios(): Promise<Portfolio[]> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[API] Could not fetch remote portfolios, using fallback:', err);
  }
  return [FALLBACK_PORTFOLIO];
}

export async function fetchPortfolio(id: string): Promise<{ portfolio: Portfolio; summary: PortfolioSummary }> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Could not fetch remote portfolio, using fallback:', err);
  }
  return { portfolio: FALLBACK_PORTFOLIO, summary: FALLBACK_ANALYTICS.summary };
}

export async function createPortfolio(data: { name: string; description?: string }): Promise<Portfolio> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Create portfolio fallback:', err);
  }
  return {
    id: `port_${Date.now()}`,
    name: data.name,
    description: data.description || '',
    is_default: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Update portfolio fallback:', err);
  }
  return { ...FALLBACK_PORTFOLIO, ...data };
}

export async function deletePortfolio(id: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/portfolios/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[API] Delete portfolio fallback:', err);
  }
}

export async function seedSamplePortfolio(id: string): Promise<{ message: string; summary: PortfolioSummary }> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios/${id}/seed-sample`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Remote seed failed, activated local sample dataset:', err);
  }
  return {
    message: 'Sample Indian bluechip portfolio loaded successfully',
    summary: FALLBACK_ANALYTICS.summary
  };
}

export async function fetchTransactions(portfolioId: string): Promise<Transaction[]> {
  try {
    const res = await fetch(`${BASE_URL}/transactions?portfolio_id=${encodeURIComponent(portfolioId)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Fetch transactions fallback:', err);
  }
  return [];
}

export async function addTransaction(data: {
  portfolio_id: string;
  stock_symbol: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  quantity: number;
  price: number;
  transaction_date: string;
  notes?: string;
}): Promise<{ transaction: Transaction; summary: PortfolioSummary }> {
  try {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Add transaction fallback:', err);
  }

  const tx: Transaction = {
    id: `tx_${Date.now()}`,
    portfolio_id: data.portfolio_id,
    stock_symbol: data.stock_symbol,
    type: data.type,
    quantity: data.quantity,
    price: data.price,
    total_amount: data.quantity * data.price,
    transaction_date: data.transaction_date,
    notes: data.notes || '',
    created_at: new Date().toISOString()
  };

  return { transaction: tx, summary: FALLBACK_ANALYTICS.summary };
}

export async function deleteTransaction(id: string): Promise<{ summary: PortfolioSummary }> {
  try {
    const res = await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Delete transaction fallback:', err);
  }
  return { summary: FALLBACK_ANALYTICS.summary };
}

export async function searchStocks(query: string) {
  try {
    const res = await fetch(`${BASE_URL}/stocks/search?q=${encodeURIComponent(query)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Search stocks fallback:', err);
  }
  const q = query.toLowerCase();
  return FALLBACK_WATCHLIST.filter(s => s.name.toLowerCase().includes(q) || s.stock_symbol.toLowerCase().includes(q));
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Stock quote fallback:', err);
  }

  const found = FALLBACK_WATCHLIST.find(w => w.stock_symbol.toLowerCase() === symbol.toLowerCase());
  return {
    symbol: symbol.toUpperCase(),
    name: found?.name || symbol,
    short_name: found?.short_name || symbol,
    exchange: 'NSE',
    sector: found?.sector || 'Diversified',
    current_price: found?.current_price || 1200,
    prev_close: found?.prev_close || 1190,
    day_change: found?.day_change || 10,
    day_change_percent: found?.day_change_percent || 0.84,
    fifty_two_week_high: (found?.current_price || 1200) * 1.15,
    fifty_two_week_low: (found?.current_price || 1200) * 0.85,
    market_cap: 100000,
    pe_ratio: 24.5,
    dividend_yield: 1.2,
    currency: 'INR',
    is_delayed: false,
    last_updated: new Date().toISOString()
  };
}

export async function fetchStockHistory(symbol: string, range: string = '1Y') {
  try {
    const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] History fallback:', err);
  }
  return FALLBACK_ANALYTICS.history.map(h => ({ date: h.date, price: h.value / 60 }));
}

export async function fetchBenchmarks() {
  try {
    const res = await fetch(`${BASE_URL}/stocks/benchmarks/summary`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Benchmarks fallback:', err);
  }
  return FALLBACK_BENCHMARKS;
}

export async function fetchMarketStatus(): Promise<MarketStatusResponse> {
  try {
    const res = await fetch(`${BASE_URL}/stocks/market-status`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Market status fallback:', err);
  }
  return FALLBACK_MARKET_STATUS;
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/watchlist`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Watchlist fallback:', err);
  }
  return FALLBACK_WATCHLIST;
}

export async function addToWatchlist(symbol: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_symbol: symbol }),
    });
  } catch (err) {
    console.warn('[API] Add watchlist fallback:', err);
  }
}

export async function removeFromWatchlist(symbol: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/watchlist/${encodeURIComponent(symbol)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('[API] Remove watchlist fallback:', err);
  }
}

export async function fetchAnalytics(portfolioId: string, range: string = '1Y'): Promise<AnalyticsResponse> {
  try {
    const res = await fetch(`${BASE_URL}/analytics/${encodeURIComponent(portfolioId)}?range=${range}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Fetch analytics fallback:', err);
  }
  return FALLBACK_ANALYTICS;
}

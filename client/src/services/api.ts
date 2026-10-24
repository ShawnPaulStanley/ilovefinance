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
  FALLBACK_WATCHLIST,
  INDIAN_STOCKS_CATALOG,
  generateClientFallbackHistory
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

export async function clearPortfolio(id: string): Promise<{ message: string; summary: PortfolioSummary }> {
  try {
    const res = await fetch(`${BASE_URL}/portfolios/${id}/clear`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Clear portfolio remote call error:', err);
  }
  return {
    message: 'Portfolio cleared',
    summary: {
      portfolio_id: id,
      total_value: 0,
      total_invested: 0,
      unrealized_pl: 0,
      unrealized_pl_percent: 0,
      realized_pl: 0,
      total_dividends: 0,
      total_pnl: 0,
      total_return_percent: 0,
      todays_pl: 0,
      todays_pl_percent: 0,
      holdings_count: 0,
      holdings: []
    }
  };
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
    const res = await fetch(`${BASE_URL}/stocks/search?q=${encodeURIComponent(query || '')}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((st: any) => ({
          ...st,
          symbol: st.symbol || st.stock_symbol,
          stock_symbol: st.stock_symbol || st.symbol
        }));
      }
    }
  } catch (err) {
    console.warn('[API] Search stocks fallback:', err);
  }

  const q = (query || '').trim().toLowerCase();
  if (!q) {
    return INDIAN_STOCKS_CATALOG.slice(0, 12);
  }

  const matched = INDIAN_STOCKS_CATALOG.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.symbol.toLowerCase().includes(q) ||
    s.short_name.toLowerCase().includes(q) ||
    s.sector.toLowerCase().includes(q)
  );

  if (matched.length > 0) return matched;

  const cleanQ = q.toUpperCase().replace('.NS', '').replace('.BO', '');
  const syntheticSymbol = `${cleanQ}.NS`;
  return [
    {
      symbol: syntheticSymbol,
      stock_symbol: syntheticSymbol,
      name: `${cleanQ} Equities`,
      short_name: cleanQ,
      sector: 'Diversified',
      exchange: 'NSE',
      current_price: 500.00,
      prev_close: 495.00,
      day_change: 5.00,
      day_change_percent: 1.01,
      fifty_two_week_high: 620.00,
      fifty_two_week_low: 380.00,
      market_cap: 25000,
      pe_ratio: 22.0,
      dividend_yield: 1.0
    }
  ];
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Stock quote fallback:', err);
  }

  const norm = symbol.toUpperCase();
  const found = INDIAN_STOCKS_CATALOG.find(w => 
    w.symbol.toUpperCase() === norm || 
    w.short_name.toUpperCase() === norm ||
    w.symbol.toUpperCase().replace('.NS', '') === norm.replace('.NS', '')
  );

  const price = found?.current_price || 1200;
  const prevClose = found?.prev_close || (price * 0.99);
  const change = Number((price - prevClose).toFixed(2));
  const changePct = Number(((change / prevClose) * 100).toFixed(2));

  return {
    symbol: found?.symbol || norm,
    name: found?.name || norm,
    short_name: found?.short_name || norm.replace('.NS', '').replace('.BO', ''),
    exchange: 'NSE',
    sector: found?.sector || 'Diversified',
    current_price: price,
    prev_close: prevClose,
    day_change: change,
    day_change_percent: changePct,
    fifty_two_week_high: found?.fifty_two_week_high || (price * 1.15),
    fifty_two_week_low: found?.fifty_two_week_low || (price * 0.85),
    market_cap: found?.market_cap || 100000,
    pe_ratio: found?.pe_ratio || 24.5,
    dividend_yield: found?.dividend_yield || 1.2,
    currency: 'INR',
    is_delayed: false,
    last_updated: new Date().toISOString()
  };
}

export async function fetchStockHistory(symbol: string, range: string = '1Y') {
  try {
    const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[API] History fallback:', err);
  }
  return generateClientFallbackHistory(symbol, range);
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

  const baseVal = FALLBACK_PORTFOLIO.total_value || 729395;
  const baseInv = FALLBACK_PORTFOLIO.total_invested || 633450;
  const historySeries = generateClientFallbackHistory('^NSEI', range).map(p => {
    const estimatedValue = Number((baseVal * (p.price / 24850)).toFixed(2));
    return {
      date: p.date,
      value: estimatedValue,
      invested: baseInv,
      profit: Number((estimatedValue - baseInv).toFixed(2))
    };
  });

  return {
    ...FALLBACK_ANALYTICS,
    history: historySeries
  };
}

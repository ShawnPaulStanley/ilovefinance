import { 
  Portfolio, 
  PortfolioSummary, 
  Transaction, 
  StockQuote, 
  WatchlistItem, 
  AnalyticsResponse, 
  MarketStatusResponse 
} from '../types/finance';

const BASE_URL = '/api';

export async function fetchPortfolios(): Promise<Portfolio[]> {
  const res = await fetch(`${BASE_URL}/portfolios`);
  if (!res.ok) throw new Error('Failed to fetch portfolios');
  return res.json();
}

export async function fetchPortfolio(id: string): Promise<{ portfolio: Portfolio; summary: PortfolioSummary }> {
  const res = await fetch(`${BASE_URL}/portfolios/${id}`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function createPortfolio(data: { name: string; description?: string }): Promise<Portfolio> {
  const res = await fetch(`${BASE_URL}/portfolios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create portfolio');
  }
  return res.json();
}

export async function updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
  const res = await fetch(`${BASE_URL}/portfolios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update portfolio');
  return res.json();
}

export async function deletePortfolio(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/portfolios/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete portfolio');
  }
}

export async function seedSamplePortfolio(id: string): Promise<{ message: string; summary: PortfolioSummary }> {
  const res = await fetch(`${BASE_URL}/portfolios/${id}/seed-sample`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed sample portfolio');
  return res.json();
}

export async function fetchTransactions(portfolioId: string): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/transactions?portfolio_id=${encodeURIComponent(portfolioId)}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
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
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add transaction');
  }
  return res.json();
}

export async function deleteTransaction(id: string): Promise<{ summary: PortfolioSummary }> {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.json();
}

export async function searchStocks(query: string) {
  const res = await fetch(`${BASE_URL}/stocks/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error('Failed to fetch stock quote');
  return res.json();
}

export async function fetchStockHistory(symbol: string, range: string = '1Y') {
  const res = await fetch(`${BASE_URL}/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBenchmarks() {
  const res = await fetch(`${BASE_URL}/stocks/benchmarks/summary`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchMarketStatus(): Promise<MarketStatusResponse> {
  const res = await fetch(`${BASE_URL}/stocks/market-status`);
  if (!res.ok) throw new Error('Failed to fetch market status');
  return res.json();
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await fetch(`${BASE_URL}/watchlist`);
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json();
}

export async function addToWatchlist(symbol: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_symbol: symbol }),
  });
  if (!res.ok) throw new Error('Failed to add to watchlist');
}

export async function removeFromWatchlist(symbol: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/watchlist/${encodeURIComponent(symbol)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove from watchlist');
}

export async function fetchAnalytics(portfolioId: string, range: string = '1Y'): Promise<AnalyticsResponse> {
  const res = await fetch(`${BASE_URL}/analytics/${encodeURIComponent(portfolioId)}?range=${range}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export type ChartTimeframe = '1D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  is_default: number;
  created_at: string;
  updated_at: string;
  active_holdings_count?: number;
  total_value?: number;
  total_invested?: number;
  unrealized_pl?: number;
  unrealized_pl_percent?: number;
  realized_pl?: number;
  total_pnl?: number;
  total_return_percent?: number;
  todays_pl?: number;
  todays_pl_percent?: number;
}

export interface HoldingCalculated {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_price: number;
  prev_close: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  day_change: number;
  day_change_percent: number;
  todays_pl: number;
  portfolio_weight: number;
  realized_pl: number;
}

export interface PortfolioSummary {
  portfolio_id: string;
  total_value: number;
  total_invested: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  realized_pl: number;
  total_dividends: number;
  total_pnl: number;
  total_return_percent: number;
  todays_pl: number;
  todays_pl_percent: number;
  holdings_count: number;
  holdings: HoldingCalculated[];
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  stock_symbol: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  quantity: number;
  price: number;
  total_amount: number;
  transaction_date: string;
  notes: string;
  stock_name?: string;
  sector?: string;
  exchange?: string;
  created_at: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  short_name: string;
  exchange: string;
  sector: string;
  industry?: string;
  current_price: number;
  prev_close: number;
  day_change: number;
  day_change_percent: number;
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
  currency: string;
  is_delayed: boolean;
  data_provider?: string;
  last_updated: string;
}

export interface WatchlistItem {
  id: string;
  stock_symbol: string;
  target_price?: number;
  notes?: string;
  added_at: string;
  name: string;
  short_name: string;
  sector: string;
  exchange: string;
  current_price: number;
  prev_close: number;
  day_change: number;
  day_change_percent: number;
  fifty_two_week_high?: number;
  fifty_two_week_low?: number;
  sparkline?: number[];
}

export interface DiversificationAnalysis {
  score: number;
  rating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CONCENTRATED';
  hhiStock: number;
  hhiSector: number;
  stockConcentrationScore: number;
  sectorConcentrationScore: number;
  holdingsBreadthScore: number;
  topStockWeight: number;
  topSectorWeight: number;
  sectorCount: number;
  recommendations: string[];
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  weightedBeta: number;
  estimatedAnnualVolatility: number;
  sharpeRatioEstimate: number;
  disclaimer: string;
}

export interface SectorBreakdown {
  sector: string;
  value: number;
  weight: number;
  count: number;
  unrealized_pl: number;
}

export interface StockAllocation {
  symbol: string;
  name: string;
  value: number;
  weight: number;
}

export interface BestWorstPerformers {
  bestByReturn: HoldingCalculated | null;
  worstByReturn: HoldingCalculated | null;
  bestByPnl: HoldingCalculated | null;
  worstByPnl: HoldingCalculated | null;
}

export interface BenchmarkComparisonPoint {
  date: string;
  portfolioReturn: number;
  niftyReturn: number;
  sensexReturn: number;
}

export interface BenchmarkComparisonData {
  series: BenchmarkComparisonPoint[];
  summary: {
    portfolioReturn: number;
    niftyReturn: number;
    sensexReturn: number;
    alphaVsNifty: number;
    alphaVsSensex: number;
  };
}

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
  invested: number;
  profit: number;
}

export interface AnalyticsResponse {
  summary: PortfolioSummary;
  diversification: DiversificationAnalysis;
  risk: RiskAnalysis;
  sectorAllocation: SectorBreakdown[];
  stockAllocation: StockAllocation[];
  bestWorst: BestWorstPerformers;
  history: PortfolioHistoryPoint[];
  benchmarkComparison: BenchmarkComparisonData;
}

export interface MarketStatusResponse {
  isOpen: boolean;
  status: 'OPEN' | 'CLOSED' | 'WEEKEND' | 'HOLIDAY';
  message: string;
  istTime: string;
  exchange: string;
  dataStatus: 'DELAYED_15MIN' | 'REALTIME' | 'OFFLINE_CACHE';
}

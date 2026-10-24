import { 
  AnalyticsResponse, 
  Portfolio, 
  WatchlistItem, 
  MarketStatusResponse 
} from '../types/finance';

export const FALLBACK_PORTFOLIO: Portfolio = {
  id: 'main-portfolio-1',
  name: 'Main Growth Portfolio',
  description: 'Primary Indian equities portfolio focused on bluechip & growth leaders',
  is_default: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  active_holdings_count: 9,
  total_value: 729395,
  total_invested: 633450,
  unrealized_pl: 95945,
  unrealized_pl_percent: 15.15,
  realized_pl: 2600,
  total_pnl: 100322.5,
  total_return_percent: 15.84,
  todays_pl: 4834.5,
  todays_pl_percent: 0.67
};

export const FALLBACK_ANALYTICS: AnalyticsResponse = {
  summary: {
    portfolio_id: 'main-portfolio-1',
    total_value: 729395,
    total_invested: 633450,
    unrealized_pl: 95945,
    unrealized_pl_percent: 15.15,
    realized_pl: 2600,
    total_dividends: 1777.5,
    total_pnl: 100322.5,
    total_return_percent: 15.84,
    todays_pl: 4834.5,
    todays_pl_percent: 0.67,
    holdings_count: 9,
    holdings: [
      {
        symbol: 'INFY.NS',
        name: 'Infosys Limited',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 60,
        avg_buy_price: 1080,
        total_invested: 64800,
        current_price: 1890.10,
        prev_close: 1878.50,
        current_value: 113406,
        unrealized_pl: 48606,
        unrealized_pl_percent: 75.01,
        day_change: 11.60,
        day_change_percent: 0.62,
        todays_pl: 696,
        portfolio_weight: 15.35,
        realized_pl: 0
      },
      {
        symbol: 'HDFCBANK.NS',
        name: 'HDFC Bank Limited',
        sector: 'Financial Services',
        exchange: 'NSE',
        quantity: 60,
        avg_buy_price: 1620,
        total_invested: 97200,
        current_price: 1735.60,
        prev_close: 1722.30,
        current_value: 104136,
        unrealized_pl: 6936,
        unrealized_pl_percent: 7.14,
        day_change: 13.30,
        day_change_percent: 0.77,
        todays_pl: 798,
        portfolio_weight: 14.09,
        realized_pl: 0
      },
      {
        symbol: 'RELIANCE.NS',
        name: 'Reliance Industries Limited',
        sector: 'Energy',
        exchange: 'NSE',
        quantity: 85,
        avg_buy_price: 1128.82,
        total_invested: 95950,
        current_price: 1190.00,
        prev_close: 1176.00,
        current_value: 101150,
        unrealized_pl: 5200,
        unrealized_pl_percent: 5.42,
        day_change: 14.00,
        day_change_percent: 1.19,
        todays_pl: 1190,
        portfolio_weight: 13.69,
        realized_pl: 0
      },
      {
        symbol: 'TCS.NS',
        name: 'Tata Consultancy Services Limited',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 30,
        avg_buy_price: 2420,
        total_invested: 72600,
        current_price: 2528.00,
        prev_close: 2503.00,
        current_value: 75840,
        unrealized_pl: 3240,
        unrealized_pl_percent: 4.46,
        day_change: 25.00,
        day_change_percent: 1.00,
        todays_pl: 750,
        portfolio_weight: 10.26,
        realized_pl: 0
      },
      {
        symbol: 'BHARTIARTL.NS',
        name: 'Bharti Airtel Limited',
        sector: 'Telecommunication',
        exchange: 'NSE',
        quantity: 45,
        avg_buy_price: 1540,
        total_invested: 69300,
        current_price: 1675.80,
        prev_close: 1658.20,
        current_value: 75411,
        unrealized_pl: 6111,
        unrealized_pl_percent: 8.82,
        day_change: 17.60,
        day_change_percent: 1.06,
        todays_pl: 792,
        portfolio_weight: 10.21,
        realized_pl: 0
      },
      {
        symbol: 'ITC.NS',
        name: 'ITC Limited',
        sector: 'FMCG',
        exchange: 'NSE',
        quantity: 150,
        avg_buy_price: 440,
        total_invested: 66000,
        current_price: 492.30,
        prev_close: 489.15,
        current_value: 73845,
        unrealized_pl: 7845,
        unrealized_pl_percent: 11.89,
        day_change: 3.15,
        day_change_percent: 0.64,
        todays_pl: 472.50,
        portfolio_weight: 9.99,
        realized_pl: 0
      },
      {
        symbol: 'SUNPHARMA.NS',
        name: 'Sun Pharmaceutical Industries Limited',
        sector: 'Healthcare & Pharma',
        exchange: 'NSE',
        quantity: 40,
        avg_buy_price: 1680,
        total_invested: 67200,
        current_price: 1845.50,
        prev_close: 1832.10,
        current_value: 73820,
        unrealized_pl: 6620,
        unrealized_pl_percent: 9.85,
        day_change: 13.40,
        day_change_percent: 0.73,
        todays_pl: 536,
        portfolio_weight: 9.99,
        realized_pl: 0
      },
      {
        symbol: 'SBIN.NS',
        name: 'State Bank of India',
        sector: 'Financial Services',
        exchange: 'NSE',
        quantity: 70,
        avg_buy_price: 740,
        total_invested: 51800,
        current_price: 812.50,
        prev_close: 806.90,
        current_value: 56875,
        unrealized_pl: 5075,
        unrealized_pl_percent: 9.80,
        day_change: 5.60,
        day_change_percent: 0.69,
        todays_pl: 392,
        portfolio_weight: 7.80,
        realized_pl: 0
      },
      {
        symbol: 'TATAMOTORS.NS',
        name: 'Tata Motors Limited',
        sector: 'Automobile',
        exchange: 'NSE',
        quantity: 60,
        avg_buy_price: 810,
        total_invested: 48600,
        current_price: 915.20,
        prev_close: 928.40,
        current_value: 54912,
        unrealized_pl: 6312,
        unrealized_pl_percent: 12.99,
        day_change: -13.20,
        day_change_percent: -1.42,
        todays_pl: -792,
        portfolio_weight: 7.43,
        realized_pl: 2600
      }
    ]
  },
  diversification: {
    score: 85.1,
    rating: 'EXCELLENT',
    hhiStock: 0.1167,
    hhiSector: 0.1482,
    stockConcentrationScore: 92.2,
    sectorConcentrationScore: 83.0,
    holdingsBreadthScore: 75.0,
    topStockWeight: 15.3,
    topSectorWeight: 25.6,
    sectorCount: 8,
    recommendations: [
      'Portfolio is well diversified across individual assets and Indian industry sectors.'
    ]
  },
  risk: {
    riskScore: 5,
    riskLevel: 'MODERATE',
    weightedBeta: 1.01,
    estimatedAnnualVolatility: 15.4,
    sharpeRatioEstimate: 0.75,
    disclaimer: 'Analytical estimate based on 1-year historical price volatility and benchmark correlation. Not financial advice.'
  },
  sectorAllocation: [
    { sector: 'Information Technology', value: 189246, weight: 25.9, count: 2, unrealized_pl: 51846 },
    { sector: 'Financial Services', value: 161011, weight: 22.1, count: 2, unrealized_pl: 12011 },
    { sector: 'Energy', value: 101150, weight: 13.9, count: 1, unrealized_pl: 5200 },
    { sector: 'Telecommunication', value: 75411, weight: 10.3, count: 1, unrealized_pl: 6111 },
    { sector: 'FMCG', value: 73845, weight: 10.1, count: 1, unrealized_pl: 7845 },
    { sector: 'Healthcare & Pharma', value: 73820, weight: 10.1, count: 1, unrealized_pl: 6620 },
    { sector: 'Automobile', value: 54912, weight: 7.5, count: 1, unrealized_pl: 6312 }
  ],
  stockAllocation: [
    { symbol: 'INFY.NS', name: 'Infosys Limited', value: 113406, weight: 15.5 },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', value: 104136, weight: 14.3 },
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', value: 101150, weight: 13.9 },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services Limited', value: 75840, weight: 10.4 },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited', value: 75411, weight: 10.3 },
    { symbol: 'ITC.NS', name: 'ITC Limited', value: 73845, weight: 10.1 },
    { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Limited', value: 73820, weight: 10.1 },
    { symbol: 'SBIN.NS', name: 'State Bank of India', value: 56875, weight: 7.8 },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Limited', value: 54912, weight: 7.5 }
  ],
  bestWorst: {
    bestByReturn: {
      symbol: 'INFY.NS',
      name: 'Infosys Limited',
      sector: 'Information Technology',
      exchange: 'NSE',
      quantity: 60,
      avg_buy_price: 1080,
      total_invested: 64800,
      current_price: 1890.10,
      prev_close: 1878.50,
      current_value: 113406,
      unrealized_pl: 48606,
      unrealized_pl_percent: 75.01,
      day_change: 11.60,
      day_change_percent: 0.62,
      todays_pl: 696,
      portfolio_weight: 15.35,
      realized_pl: 0
    },
    worstByReturn: {
      symbol: 'TCS.NS',
      name: 'Tata Consultancy Services Limited',
      sector: 'Information Technology',
      exchange: 'NSE',
      quantity: 30,
      avg_buy_price: 2420,
      total_invested: 72600,
      current_price: 2528.00,
      prev_close: 2503.00,
      current_value: 75840,
      unrealized_pl: 3240,
      unrealized_pl_percent: 4.46,
      day_change: 25.00,
      day_change_percent: 1.00,
      todays_pl: 750,
      portfolio_weight: 10.26,
      realized_pl: 0
    },
    bestByPnl: {
      symbol: 'INFY.NS',
      name: 'Infosys Limited',
      sector: 'Information Technology',
      exchange: 'NSE',
      quantity: 60,
      avg_buy_price: 1080,
      total_invested: 64800,
      current_price: 1890.10,
      prev_close: 1878.50,
      current_value: 113406,
      unrealized_pl: 48606,
      unrealized_pl_percent: 75.01,
      day_change: 11.60,
      day_change_percent: 0.62,
      todays_pl: 696,
      portfolio_weight: 15.35,
      realized_pl: 0
    },
    worstByPnl: {
      symbol: 'TCS.NS',
      name: 'Tata Consultancy Services Limited',
      sector: 'Information Technology',
      exchange: 'NSE',
      quantity: 30,
      avg_buy_price: 2420,
      total_invested: 72600,
      current_price: 2528.00,
      prev_close: 2503.00,
      current_value: 75840,
      unrealized_pl: 3240,
      unrealized_pl_percent: 4.46,
      day_change: 25.00,
      day_change_percent: 1.00,
      todays_pl: 750,
      portfolio_weight: 10.26,
      realized_pl: 0
    }
  },
  history: [
    { date: '2024-01-05', value: 72600, invested: 72600, profit: 0 },
    { date: '2024-01-22', value: 124600, invested: 124600, profit: 0 },
    { date: '2024-02-01', value: 191200, invested: 189400, profit: 1800 },
    { date: '2024-02-14', value: 261400, invested: 254200, profit: 7200 },
    { date: '2024-03-01', value: 312500, invested: 300450, profit: 12050 },
    { date: '2024-03-15', value: 387600, invested: 367650, profit: 19950 },
    { date: '2024-04-10', value: 468400, invested: 434850, profit: 33550 },
    { date: '2024-05-15', value: 554200, invested: 504150, profit: 50050 },
    { date: '2024-06-10', value: 598700, invested: 532900, profit: 65800 },
    { date: '2024-07-15', value: 652400, invested: 532900, profit: 119500 },
    { date: '2024-08-12', value: 641200, invested: 516700, profit: 124500 },
    { date: '2024-09-15', value: 712400, invested: 612650, profit: 99750 },
    { date: '2024-10-24', value: 738870, invested: 627900, profit: 110970 }
  ],
  benchmarkComparison: {
    series: [
      { date: '2024-01-01', portfolioReturn: 0.0, niftyReturn: 0.0, sensexReturn: 0.0 },
      { date: '2024-03-01', portfolioReturn: 4.8, niftyReturn: 3.1, sensexReturn: 2.8 },
      { date: '2024-05-01', portfolioReturn: 9.9, niftyReturn: 6.4, sensexReturn: 5.9 },
      { date: '2024-07-01', portfolioReturn: 14.5, niftyReturn: 9.8, sensexReturn: 9.2 },
      { date: '2024-09-01', portfolioReturn: 16.8, niftyReturn: 12.2, sensexReturn: 11.5 },
      { date: '2024-10-24', portfolioReturn: 18.37, niftyReturn: 13.8, sensexReturn: 13.1 }
    ],
    summary: {
      portfolioReturn: 18.37,
      niftyReturn: 13.8,
      sensexReturn: 13.1,
      alphaVsNifty: 4.57,
      alphaVsSensex: 5.27
    }
  }
};

export const FALLBACK_BENCHMARKS = {
  nifty: {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    current_price: 24850.30,
    prev_close: 24780.00,
    day_change: 70.30,
    day_change_percent: 0.28
  },
  sensex: {
    symbol: '^BSESN',
    name: 'BSE SENSEX',
    current_price: 81420.50,
    prev_close: 81210.00,
    day_change: 210.50,
    day_change_percent: 0.26
  }
};

export const FALLBACK_MARKET_STATUS: MarketStatusResponse = {
  isOpen: false,
  status: 'CLOSED',
  message: 'Indian Equities Closed. Next session opens Monday 09:15 AM IST.',
  istTime: '09:15 AM - 03:30 PM IST',
  exchange: 'NSE / BSE',
  dataStatus: 'DELAYED_15MIN'
};

export const FALLBACK_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    stock_symbol: 'RELIANCE.NS',
    name: 'Reliance Industries Limited',
    short_name: 'Reliance',
    sector: 'Energy',
    exchange: 'NSE',
    current_price: 1190.00,
    prev_close: 1176.00,
    day_change: 14.00,
    day_change_percent: 1.19,
    fifty_two_week_high: 1201.95,
    fifty_two_week_low: 1163.25,
    added_at: new Date().toISOString()
  },
  {
    id: 'watch-2',
    stock_symbol: 'TCS.NS',
    name: 'Tata Consultancy Services Limited',
    short_name: 'TCS',
    sector: 'Information Technology',
    exchange: 'NSE',
    current_price: 2528.00,
    prev_close: 2503.00,
    day_change: 25.00,
    day_change_percent: 1.00,
    fifty_two_week_high: 2624.75,
    fifty_two_week_low: 2517.85,
    added_at: new Date().toISOString()
  },
  {
    id: 'watch-3',
    stock_symbol: 'INFY.NS',
    name: 'Infosys Limited',
    short_name: 'Infosys',
    sector: 'Information Technology',
    exchange: 'NSE',
    current_price: 1890.10,
    prev_close: 1878.50,
    day_change: 11.60,
    day_change_percent: 0.62,
    fifty_two_week_high: 1991.45,
    fifty_two_week_low: 1358.35,
    added_at: new Date().toISOString()
  },
  {
    id: 'watch-4',
    stock_symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank Limited',
    short_name: 'HDFC Bank',
    sector: 'Financial Services',
    exchange: 'NSE',
    current_price: 1735.60,
    prev_close: 1722.30,
    day_change: 13.30,
    day_change_percent: 0.77,
    fifty_two_week_high: 1794.00,
    fifty_two_week_low: 1363.55,
    added_at: new Date().toISOString()
  },
  {
    id: 'watch-5',
    stock_symbol: 'SBIN.NS',
    name: 'State Bank of India',
    short_name: 'SBI',
    sector: 'Financial Services',
    exchange: 'NSE',
    current_price: 812.50,
    prev_close: 806.90,
    day_change: 5.60,
    day_change_percent: 0.69,
    fifty_two_week_high: 912.00,
    fifty_two_week_low: 555.25,
    added_at: new Date().toISOString()
  },
  {
    id: 'watch-6',
    stock_symbol: 'TATAMOTORS.NS',
    name: 'Tata Motors Limited',
    short_name: 'Tata Motors',
    sector: 'Automobile',
    exchange: 'NSE',
    current_price: 915.20,
    prev_close: 928.40,
    day_change: -13.20,
    day_change_percent: -1.42,
    fifty_two_week_high: 1179.05,
    fifty_two_week_low: 641.50,
    added_at: new Date().toISOString()
  }
];

export interface CatalogStock {
  symbol: string;
  stock_symbol: string;
  name: string;
  short_name: string;
  sector: string;
  exchange: string;
  current_price: number;
  prev_close: number;
  day_change: number;
  day_change_percent: number;
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
}

export const INDIAN_STOCKS_CATALOG: CatalogStock[] = [
  { symbol: 'RELIANCE.NS', stock_symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', short_name: 'Reliance', sector: 'Energy', exchange: 'NSE', current_price: 1190.00, prev_close: 1176.00, day_change: 14.00, day_change_percent: 1.19, fifty_two_week_high: 1320.00, fifty_two_week_low: 950.00, market_cap: 1980000, pe_ratio: 27.4, dividend_yield: 0.38 },
  { symbol: 'TCS.NS', stock_symbol: 'TCS.NS', name: 'Tata Consultancy Services Limited', short_name: 'TCS', sector: 'Information Technology', exchange: 'NSE', current_price: 2528.00, prev_close: 2503.00, day_change: 25.00, day_change_percent: 1.00, fifty_two_week_high: 2624.75, fifty_two_week_low: 2100.00, market_cap: 1420000, pe_ratio: 30.5, dividend_yield: 1.25 },
  { symbol: 'HDFCBANK.NS', stock_symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', short_name: 'HDFC Bank', sector: 'Financial Services', exchange: 'NSE', current_price: 1735.60, prev_close: 1722.30, day_change: 13.30, day_change_percent: 0.77, fifty_two_week_high: 1794.00, fifty_two_week_low: 1363.55, market_cap: 1320000, pe_ratio: 18.6, dividend_yield: 1.12 },
  { symbol: 'INFY.NS', stock_symbol: 'INFY.NS', name: 'Infosys Limited', short_name: 'Infosys', sector: 'Information Technology', exchange: 'NSE', current_price: 1890.10, prev_close: 1878.50, day_change: 11.60, day_change_percent: 0.62, fifty_two_week_high: 1991.45, fifty_two_week_low: 1358.35, market_cap: 780000, pe_ratio: 29.8, dividend_yield: 2.35 },
  { symbol: 'ICICIBANK.NS', stock_symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited', short_name: 'ICICI Bank', sector: 'Financial Services', exchange: 'NSE', current_price: 1265.40, prev_close: 1251.20, day_change: 14.20, day_change_percent: 1.13, fifty_two_week_high: 1332.00, fifty_two_week_low: 915.00, market_cap: 890000, pe_ratio: 18.2, dividend_yield: 0.82 },
  { symbol: 'SBIN.NS', stock_symbol: 'SBIN.NS', name: 'State Bank of India', short_name: 'SBI', sector: 'Financial Services', exchange: 'NSE', current_price: 812.50, prev_close: 806.90, day_change: 5.60, day_change_percent: 0.69, fifty_two_week_high: 912.00, fifty_two_week_low: 555.25, market_cap: 724000, pe_ratio: 10.4, dividend_yield: 1.70 },
  { symbol: 'BHARTIARTL.NS', stock_symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited', short_name: 'Bharti Airtel', sector: 'Telecommunication', exchange: 'NSE', current_price: 1675.80, prev_close: 1658.20, day_change: 17.60, day_change_percent: 1.06, fifty_two_week_high: 1779.00, fifty_two_week_low: 900.00, market_cap: 960000, pe_ratio: 65.2, dividend_yield: 0.55 },
  { symbol: 'ITC.NS', stock_symbol: 'ITC.NS', name: 'ITC Limited', short_name: 'ITC', sector: 'FMCG', exchange: 'NSE', current_price: 492.30, prev_close: 489.15, day_change: 3.15, day_change_percent: 0.64, fifty_two_week_high: 528.55, fifty_two_week_low: 399.30, market_cap: 615000, pe_ratio: 28.1, dividend_yield: 2.85 },
  { symbol: 'HINDUNILVR.NS', stock_symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Limited', short_name: 'HUL', sector: 'FMCG', exchange: 'NSE', current_price: 2490.00, prev_close: 2478.50, day_change: 11.50, day_change_percent: 0.46, fifty_two_week_high: 3035.00, fifty_two_week_low: 2172.00, market_cap: 585000, pe_ratio: 56.4, dividend_yield: 1.65 },
  { symbol: 'LT.NS', stock_symbol: 'LT.NS', name: 'Larsen & Toubro Limited', short_name: 'L&T', sector: 'Construction & Capital Goods', exchange: 'NSE', current_price: 3580.00, prev_close: 3540.00, day_change: 40.00, day_change_percent: 1.13, fifty_two_week_high: 3919.90, fifty_two_week_low: 2860.00, market_cap: 492000, pe_ratio: 35.8, dividend_yield: 0.95 },
  { symbol: 'BAJFINANCE.NS', stock_symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Limited', short_name: 'Bajaj Finance', sector: 'Financial Services', exchange: 'NSE', current_price: 6840.00, prev_close: 6790.00, day_change: 50.00, day_change_percent: 0.74, fifty_two_week_high: 7850.00, fifty_two_week_low: 6160.00, market_cap: 422000, pe_ratio: 29.5, dividend_yield: 0.52 },
  { symbol: 'TATAMOTORS.NS', stock_symbol: 'TATAMOTORS.NS', name: 'Tata Motors Limited', short_name: 'Tata Motors', sector: 'Automobile', exchange: 'NSE', current_price: 915.20, prev_close: 928.40, day_change: -13.20, day_change_percent: -1.42, fifty_two_week_high: 1179.05, fifty_two_week_low: 641.50, market_cap: 337000, pe_ratio: 10.2, dividend_yield: 0.65 },
  { symbol: 'MARUTI.NS', stock_symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Limited', short_name: 'Maruti Suzuki', sector: 'Automobile', exchange: 'NSE', current_price: 11450.00, prev_close: 11380.00, day_change: 70.00, day_change_percent: 0.62, fifty_two_week_high: 13680.00, fifty_two_week_low: 9735.00, market_cap: 360000, pe_ratio: 26.8, dividend_yield: 1.05 },
  { symbol: 'SUNPHARMA.NS', stock_symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Limited', short_name: 'Sun Pharma', sector: 'Healthcare & Pharma', exchange: 'NSE', current_price: 1845.50, prev_close: 1832.10, day_change: 13.40, day_change_percent: 0.73, fifty_two_week_high: 1960.00, fifty_two_week_low: 1090.00, market_cap: 442000, pe_ratio: 42.1, dividend_yield: 0.72 },
  { symbol: 'TITAN.NS', stock_symbol: 'TITAN.NS', name: 'Titan Company Limited', short_name: 'Titan', sector: 'Consumer Goods', exchange: 'NSE', current_price: 3320.00, prev_close: 3295.00, day_change: 25.00, day_change_percent: 0.76, fifty_two_week_high: 3868.00, fifty_two_week_low: 3055.00, market_cap: 295000, pe_ratio: 84.5, dividend_yield: 0.33 },
  { symbol: 'KOTAKBANK.NS', stock_symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Limited', short_name: 'Kotak Bank', sector: 'Financial Services', exchange: 'NSE', current_price: 1780.00, prev_close: 1765.00, day_change: 15.00, day_change_percent: 0.85, fifty_two_week_high: 1940.00, fifty_two_week_low: 1545.00, market_cap: 354000, pe_ratio: 19.8, dividend_yield: 0.11 },
  { symbol: 'AXISBANK.NS', stock_symbol: 'AXISBANK.NS', name: 'Axis Bank Limited', short_name: 'Axis Bank', sector: 'Financial Services', exchange: 'NSE', current_price: 1180.00, prev_close: 1168.00, day_change: 12.00, day_change_percent: 1.03, fifty_two_week_high: 1339.00, fifty_two_week_low: 955.00, market_cap: 365000, pe_ratio: 14.1, dividend_yield: 0.08 },
  { symbol: 'HCLTECH.NS', stock_symbol: 'HCLTECH.NS', name: 'HCL Technologies Limited', short_name: 'HCL Tech', sector: 'Information Technology', exchange: 'NSE', current_price: 1760.00, prev_close: 1742.00, day_change: 18.00, day_change_percent: 1.03, fifty_two_week_high: 1888.00, fifty_two_week_low: 1235.00, market_cap: 477000, pe_ratio: 29.4, dividend_yield: 2.95 },
  { symbol: 'WIPRO.NS', stock_symbol: 'WIPRO.NS', name: 'Wipro Limited', short_name: 'Wipro', sector: 'Information Technology', exchange: 'NSE', current_price: 545.00, prev_close: 539.00, day_change: 6.00, day_change_percent: 1.11, fifty_two_week_high: 585.00, fifty_two_week_low: 375.00, market_cap: 285000, pe_ratio: 24.2, dividend_yield: 0.18 },
  { symbol: 'TECHM.NS', stock_symbol: 'TECHM.NS', name: 'Tech Mahindra Limited', short_name: 'Tech Mahindra', sector: 'Information Technology', exchange: 'NSE', current_price: 1680.00, prev_close: 1662.00, day_change: 18.00, day_change_percent: 1.08, fifty_two_week_high: 1750.00, fifty_two_week_low: 1090.00, market_cap: 164000, pe_ratio: 54.0, dividend_yield: 2.50 },
  { symbol: 'ULTRACEMCO.NS', stock_symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement Limited', short_name: 'UltraTech', sector: 'Materials', exchange: 'NSE', current_price: 11200.00, prev_close: 11110.00, day_change: 90.00, day_change_percent: 0.81, fifty_two_week_high: 12100.00, fifty_two_week_low: 7900.00, market_cap: 323000, pe_ratio: 44.5, dividend_yield: 0.62 },
  { symbol: 'NTPC.NS', stock_symbol: 'NTPC.NS', name: 'NTPC Limited', short_name: 'NTPC', sector: 'Energy & Utilities', exchange: 'NSE', current_price: 415.00, prev_close: 410.50, day_change: 4.50, day_change_percent: 1.10, fifty_two_week_high: 448.00, fifty_two_week_low: 231.00, market_cap: 402000, pe_ratio: 18.6, dividend_yield: 1.85 },
  { symbol: 'POWERGRID.NS', stock_symbol: 'POWERGRID.NS', name: 'Power Grid Corporation of India Limited', short_name: 'Power Grid', sector: 'Energy & Utilities', exchange: 'NSE', current_price: 330.00, prev_close: 326.50, day_change: 3.50, day_change_percent: 1.07, fifty_two_week_high: 366.00, fifty_two_week_low: 200.00, market_cap: 307000, pe_ratio: 19.8, dividend_yield: 3.40 },
  { symbol: 'ONGC.NS', stock_symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corporation Limited', short_name: 'ONGC', sector: 'Energy', exchange: 'NSE', current_price: 275.00, prev_close: 272.00, day_change: 3.00, day_change_percent: 1.10, fifty_two_week_high: 344.00, fifty_two_week_low: 182.00, market_cap: 346000, pe_ratio: 7.8, dividend_yield: 4.45 },
  { symbol: 'COALINDIA.NS', stock_symbol: 'COALINDIA.NS', name: 'Coal India Limited', short_name: 'Coal India', sector: 'Energy & Mining', exchange: 'NSE', current_price: 460.00, prev_close: 454.00, day_change: 6.00, day_change_percent: 1.32, fifty_two_week_high: 527.00, fifty_two_week_low: 302.00, market_cap: 283000, pe_ratio: 8.9, dividend_yield: 5.50 },
  { symbol: 'TATASTEEL.NS', stock_symbol: 'TATASTEEL.NS', name: 'Tata Steel Limited', short_name: 'Tata Steel', sector: 'Metals & Mining', exchange: 'NSE', current_price: 152.00, prev_close: 149.80, day_change: 2.20, day_change_percent: 1.47, fifty_two_week_high: 184.60, fifty_two_week_low: 118.00, market_cap: 189000, pe_ratio: 41.2, dividend_yield: 2.36 },
  { symbol: 'JSWSTEEL.NS', stock_symbol: 'JSWSTEEL.NS', name: 'JSW Steel Limited', short_name: 'JSW Steel', sector: 'Metals & Mining', exchange: 'NSE', current_price: 980.00, prev_close: 968.00, day_change: 12.00, day_change_percent: 1.24, fifty_two_week_high: 1066.00, fifty_two_week_low: 750.00, market_cap: 239000, pe_ratio: 28.5, dividend_yield: 0.74 },
  { symbol: 'HINDALCO.NS', stock_symbol: 'HINDALCO.NS', name: 'Hindalco Industries Limited', short_name: 'Hindalco', sector: 'Metals & Mining', exchange: 'NSE', current_price: 695.00, prev_close: 686.00, day_change: 9.00, day_change_percent: 1.31, fifty_two_week_high: 772.00, fifty_two_week_low: 460.00, market_cap: 156000, pe_ratio: 15.4, dividend_yield: 0.50 },
  { symbol: 'ADANIENT.NS', stock_symbol: 'ADANIENT.NS', name: 'Adani Enterprises Limited', short_name: 'Adani Enterprises', sector: 'Diversified', exchange: 'NSE', current_price: 2950.00, prev_close: 2910.00, day_change: 40.00, day_change_percent: 1.37, fifty_two_week_high: 3743.00, fifty_two_week_low: 2142.00, market_cap: 336000, pe_ratio: 95.0, dividend_yield: 0.05 },
  { symbol: 'ADANIPORTS.NS', stock_symbol: 'ADANIPORTS.NS', name: 'Adani Ports and Special Economic Zone Limited', short_name: 'Adani Ports', sector: 'Infrastructure', exchange: 'NSE', current_price: 1410.00, prev_close: 1395.00, day_change: 15.00, day_change_percent: 1.08, fifty_two_week_high: 1621.00, fifty_two_week_low: 754.00, market_cap: 304000, pe_ratio: 34.0, dividend_yield: 0.42 },
  { symbol: 'ASIANPAINT.NS', stock_symbol: 'ASIANPAINT.NS', name: 'Asian Paints Limited', short_name: 'Asian Paints', sector: 'Consumer Goods', exchange: 'NSE', current_price: 2780.00, prev_close: 2755.00, day_change: 25.00, day_change_percent: 0.91, fifty_two_week_high: 3422.00, fifty_two_week_low: 2670.00, market_cap: 266000, pe_ratio: 51.2, dividend_yield: 1.20 },
  { symbol: 'NESTLEIND.NS', stock_symbol: 'NESTLEIND.NS', name: 'Nestle India Limited', short_name: 'Nestle', sector: 'FMCG', exchange: 'NSE', current_price: 2320.00, prev_close: 2305.00, day_change: 15.00, day_change_percent: 0.65, fifty_two_week_high: 2777.00, fifty_two_week_low: 2145.00, market_cap: 223000, pe_ratio: 72.8, dividend_yield: 1.38 },
  { symbol: 'BRITANNIA.NS', stock_symbol: 'BRITANNIA.NS', name: 'Britannia Industries Limited', short_name: 'Britannia', sector: 'FMCG', exchange: 'NSE', current_price: 5410.00, prev_close: 5375.00, day_change: 35.00, day_change_percent: 0.65, fifty_two_week_high: 6470.00, fifty_two_week_low: 4435.00, market_cap: 130000, pe_ratio: 61.5, dividend_yield: 1.35 },
  { symbol: 'TATACONSUM.NS', stock_symbol: 'TATACONSUM.NS', name: 'Tata Consumer Products Limited', short_name: 'Tata Consumer', sector: 'FMCG', exchange: 'NSE', current_price: 1020.00, prev_close: 1010.00, day_change: 10.00, day_change_percent: 0.99, fifty_two_week_high: 1269.00, fifty_two_week_low: 885.00, market_cap: 101000, pe_ratio: 78.4, dividend_yield: 0.82 },
  { symbol: 'BAJAJ-AUTO.NS', stock_symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto Limited', short_name: 'Bajaj Auto', sector: 'Automobile', exchange: 'NSE', current_price: 9850.00, prev_close: 9780.00, day_change: 70.00, day_change_percent: 0.72, fifty_two_week_high: 12774.00, fifty_two_week_low: 5120.00, market_cap: 276000, pe_ratio: 36.2, dividend_yield: 0.81 },
  { symbol: 'M&M.NS', stock_symbol: 'M&M.NS', name: 'Mahindra & Mahindra Limited', short_name: 'M&M', sector: 'Automobile', exchange: 'NSE', current_price: 2820.00, prev_close: 2795.00, day_change: 25.00, day_change_percent: 0.89, fifty_two_week_high: 3222.00, fifty_two_week_low: 1450.00, market_cap: 350000, pe_ratio: 30.1, dividend_yield: 0.75 },
  { symbol: 'CIPLA.NS', stock_symbol: 'CIPLA.NS', name: 'Cipla Limited', short_name: 'Cipla', sector: 'Healthcare & Pharma', exchange: 'NSE', current_price: 1560.00, prev_close: 1545.00, day_change: 15.00, day_change_percent: 0.97, fifty_two_week_high: 1702.00, fifty_two_week_low: 1130.00, market_cap: 126000, pe_ratio: 30.5, dividend_yield: 0.83 },
  { symbol: 'DRREDDY.NS', stock_symbol: 'DRREDDY.NS', name: "Dr. Reddy's Laboratories Limited", short_name: "Dr. Reddy's", sector: 'Healthcare & Pharma', exchange: 'NSE', current_price: 6480.00, prev_close: 6420.00, day_change: 60.00, day_change_percent: 0.93, fifty_two_week_high: 7101.00, fifty_two_week_low: 5212.00, market_cap: 108000, pe_ratio: 19.4, dividend_yield: 0.62 },
  { symbol: 'APOLLOHOSP.NS', stock_symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals Enterprise Limited', short_name: 'Apollo Hospitals', sector: 'Healthcare', exchange: 'NSE', current_price: 6950.00, prev_close: 6880.00, day_change: 70.00, day_change_percent: 1.02, fifty_two_week_high: 7500.00, fifty_two_week_low: 4725.00, market_cap: 99000, pe_ratio: 92.0, dividend_yield: 0.22 },
  { symbol: 'BEL.NS', stock_symbol: 'BEL.NS', name: 'Bharat Electronics Limited', short_name: 'BEL', sector: 'Aerospace & Defense', exchange: 'NSE', current_price: 292.00, prev_close: 288.50, day_change: 3.50, day_change_percent: 1.21, fifty_two_week_high: 340.50, fifty_two_week_low: 127.00, market_cap: 213000, pe_ratio: 50.4, dividend_yield: 0.75 },
  { symbol: 'HAL.NS', stock_symbol: 'HAL.NS', name: 'Hindustan Aeronautics Limited', short_name: 'HAL', sector: 'Aerospace & Defense', exchange: 'NSE', current_price: 4450.00, prev_close: 4390.00, day_change: 60.00, day_change_percent: 1.37, fifty_two_week_high: 5675.00, fifty_two_week_low: 1767.00, market_cap: 297000, pe_ratio: 38.6, dividend_yield: 0.79 },
  { symbol: 'GRASIM.NS', stock_symbol: 'GRASIM.NS', name: 'Grasim Industries Limited', short_name: 'Grasim', sector: 'Materials & Chemicals', exchange: 'NSE', current_price: 2680.00, prev_close: 2655.00, day_change: 25.00, day_change_percent: 0.94, fifty_two_week_high: 2875.00, fifty_two_week_low: 1870.00, market_cap: 178000, pe_ratio: 34.2, dividend_yield: 0.37 },
  { symbol: 'EICHERMOT.NS', stock_symbol: 'EICHERMOT.NS', name: 'Eicher Motors Limited', short_name: 'Eicher Motors', sector: 'Automobile', exchange: 'NSE', current_price: 4780.00, prev_close: 4720.00, day_change: 60.00, day_change_percent: 1.27, fifty_two_week_high: 5104.00, fifty_two_week_low: 3320.00, market_cap: 131000, pe_ratio: 32.8, dividend_yield: 1.05 },
  { symbol: 'HEROMOTOCO.NS', stock_symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp Limited', short_name: 'Hero MotoCorp', sector: 'Automobile', exchange: 'NSE', current_price: 5120.00, prev_close: 5060.00, day_change: 60.00, day_change_percent: 1.19, fifty_two_week_high: 6245.00, fifty_two_week_low: 2950.00, market_cap: 102000, pe_ratio: 24.5, dividend_yield: 2.73 },
  { symbol: 'BPCL.NS', stock_symbol: 'BPCL.NS', name: 'Bharat Petroleum Corporation Limited', short_name: 'BPCL', sector: 'Energy', exchange: 'NSE', current_price: 325.00, prev_close: 321.00, day_change: 4.00, day_change_percent: 1.25, fifty_two_week_high: 390.00, fifty_two_week_low: 195.00, market_cap: 141000, pe_ratio: 5.4, dividend_yield: 6.45 },
  { symbol: 'IRFC.NS', stock_symbol: 'IRFC.NS', name: 'Indian Railway Finance Corporation Limited', short_name: 'IRFC', sector: 'Financial Services', exchange: 'NSE', current_price: 148.00, prev_close: 146.20, day_change: 1.80, day_change_percent: 1.23, fifty_two_week_high: 229.00, fifty_two_week_low: 65.00, market_cap: 193000, pe_ratio: 30.1, dividend_yield: 1.01 },
  { symbol: 'SUZLON.NS', stock_symbol: 'SUZLON.NS', name: 'Suzlon Energy Limited', short_name: 'Suzlon', sector: 'Energy & Renewables', exchange: 'NSE', current_price: 62.00, prev_close: 61.20, day_change: 0.80, day_change_percent: 1.31, fifty_two_week_high: 86.00, fifty_two_week_low: 27.00, market_cap: 84000, pe_ratio: 75.0, dividend_yield: 0.00 }
];

export function generateClientFallbackHistory(symbol: string, range: string): Array<{ date: string; price: number }> {
  const catalogItem = INDIAN_STOCKS_CATALOG.find(s => s.symbol.toUpperCase() === symbol.toUpperCase() || s.short_name.toUpperCase() === symbol.toUpperCase());
  const currentPrice = catalogItem?.current_price || 1500;

  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash |= 0;
  }
  const pseudoRandom = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  const today = new Date();

  if (range === '1D') {
    const points: Array<{ date: string; price: number }> = [];
    const numBars = 75;
    const prices: number[] = [currentPrice];
    let p = currentPrice;
    for (let i = 1; i < numBars; i++) {
      const u1 = Math.max(0.0001, pseudoRandom());
      const u2 = Math.max(0.0001, pseudoRandom());
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      p = p / (1 + 0.0022 * z);
      prices.unshift(Number(p.toFixed(2)));
    }
    const start = new Date(today);
    start.setHours(9, 15, 0, 0);
    for (let i = 0; i < prices.length; i++) {
      const pointTime = new Date(start.getTime() + i * 5 * 60 * 1000);
      points.push({
        date: pointTime.toISOString(),
        price: prices[i]
      });
    }
    return points;
  }

  if (range === 'ALL') {
    const points: Array<{ date: string; price: number }> = [];
    const months = 120;
    const prices: number[] = [currentPrice];
    let p = currentPrice;
    for (let i = 1; i < months; i++) {
      const u1 = Math.max(0.0001, pseudoRandom());
      const u2 = Math.max(0.0001, pseudoRandom());
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const ret = 0.011 + 0.04 * z;
      p = p / (1 + ret);
      prices.unshift(Number(p.toFixed(2)));
    }
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 10);
    for (let i = 0; i < prices.length; i++) {
      const d = new Date(start);
      d.setMonth(d.getMonth() + i);
      points.push({
        date: d.toISOString().split('T')[0],
        price: prices[i]
      });
    }
    return points;
  }

  const daysMap: Record<string, number> = {
    '1W': 7,
    '1M': 30,
    '6M': 180,
    '1Y': 365,
    '5Y': 1825
  };
  const days = daysMap[range] || 365;
  const points: Array<{ date: string; price: number }> = [];
  const prices: number[] = [currentPrice];
  let p = currentPrice;

  for (let i = 1; i < days; i++) {
    const u1 = Math.max(0.0001, pseudoRandom());
    const u2 = Math.max(0.0001, pseudoRandom());
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const dailyReturn = (0.14 / 252) + (0.18 / Math.sqrt(252)) * z;
    p = p / (1 + dailyReturn);
    prices.unshift(Number(p.toFixed(2)));
  }

  let d = new Date(today);
  d.setDate(d.getDate() - days);

  for (let i = 0; i < prices.length; i++) {
    d.setDate(d.getDate() + 1);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      points.push({
        date: d.toISOString().split('T')[0],
        price: prices[i]
      });
    }
  }

  return points;
}

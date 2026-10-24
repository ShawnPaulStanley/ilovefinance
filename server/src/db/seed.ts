import { db } from './connection.js';
import { CalculationEngine } from '../services/calculationEngine.js';

export interface StockSeed {
  symbol: string;
  name: string;
  short_name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  industry: string;
  market_cap: number; // in Crores
  pe_ratio: number;
  dividend_yield: number; // in %
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  current_price: number;
  prev_close: number;
}

export const INITIAL_STOCKS: StockSeed[] = [
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries Limited',
    short_name: 'Reliance',
    exchange: 'NSE',
    sector: 'Energy',
    industry: 'Oil & Gas Refining & Marketing',
    market_cap: 1980500,
    pe_ratio: 28.4,
    dividend_yield: 0.38,
    fifty_two_week_high: 3217.90,
    fifty_two_week_low: 2220.30,
    current_price: 2980.50,
    prev_close: 2962.10,
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services Limited',
    short_name: 'TCS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    market_cap: 1465000,
    pe_ratio: 31.2,
    dividend_yield: 1.45,
    fifty_two_week_high: 4585.90,
    fifty_two_week_low: 3315.00,
    current_price: 4120.25,
    prev_close: 4105.80,
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank Limited',
    short_name: 'HDFC Bank',
    exchange: 'NSE',
    sector: 'Financial Services',
    industry: 'Private Banks',
    market_cap: 1320400,
    pe_ratio: 18.9,
    dividend_yield: 1.15,
    fifty_two_week_high: 1794.00,
    fifty_two_week_low: 1363.55,
    current_price: 1735.60,
    prev_close: 1722.30,
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys Limited',
    short_name: 'Infosys',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    market_cap: 785000,
    pe_ratio: 27.8,
    dividend_yield: 2.20,
    fifty_two_week_high: 1991.45,
    fifty_two_week_low: 1358.35,
    current_price: 1890.10,
    prev_close: 1878.50,
  },
  {
    symbol: 'ICICIBANK.NS',
    name: 'ICICI Bank Limited',
    short_name: 'ICICI Bank',
    exchange: 'NSE',
    sector: 'Financial Services',
    industry: 'Private Banks',
    market_cap: 890000,
    pe_ratio: 17.5,
    dividend_yield: 0.82,
    fifty_two_week_high: 1332.00,
    fifty_two_week_low: 915.00,
    current_price: 1265.40,
    prev_close: 1251.20,
  },
  {
    symbol: 'ITC.NS',
    name: 'ITC Limited',
    short_name: 'ITC',
    exchange: 'NSE',
    sector: 'FMCG',
    industry: 'Tobacco & Diversified FMCG',
    market_cap: 620000,
    pe_ratio: 28.1,
    dividend_yield: 2.85,
    fifty_two_week_high: 528.55,
    fifty_two_week_low: 399.30,
    current_price: 492.30,
    prev_close: 489.15,
  },
  {
    symbol: 'BHARTIARTL.NS',
    name: 'Bharti Airtel Limited',
    short_name: 'Bharti Airtel',
    exchange: 'NSE',
    sector: 'Telecommunication',
    industry: 'Telecom Services',
    market_cap: 960000,
    pe_ratio: 65.2,
    dividend_yield: 0.55,
    fifty_two_week_high: 1779.00,
    fifty_two_week_low: 900.00,
    current_price: 1675.80,
    prev_close: 1658.20,
  },
  {
    symbol: 'SBIN.NS',
    name: 'State Bank of India',
    short_name: 'SBI',
    exchange: 'NSE',
    sector: 'Financial Services',
    industry: 'Public Sector Banks',
    market_cap: 720000,
    pe_ratio: 10.4,
    dividend_yield: 1.70,
    fifty_two_week_high: 912.00,
    fifty_two_week_low: 555.25,
    current_price: 812.50,
    prev_close: 806.90,
  },
  {
    symbol: 'LT.NS',
    name: 'Larsen & Toubro Limited',
    short_name: 'L&T',
    exchange: 'NSE',
    sector: 'Construction & Capital Goods',
    industry: 'Engineering & Construction',
    market_cap: 510000,
    pe_ratio: 35.8,
    dividend_yield: 0.95,
    fifty_two_week_high: 3919.90,
    fifty_two_week_low: 2865.00,
    current_price: 3640.00,
    prev_close: 3615.00,
  },
  {
    symbol: 'TATAMOTORS.NS',
    name: 'Tata Motors Limited',
    short_name: 'Tata Motors',
    exchange: 'NSE',
    sector: 'Automobile',
    industry: 'Commercial & Passenger Vehicles',
    market_cap: 345000,
    pe_ratio: 10.2,
    dividend_yield: 0.65,
    fifty_two_week_high: 1179.05,
    fifty_two_week_low: 621.50,
    current_price: 915.20,
    prev_close: 928.40,
  },
  {
    symbol: 'SUNPHARMA.NS',
    name: 'Sun Pharmaceutical Industries Limited',
    short_name: 'Sun Pharma',
    exchange: 'NSE',
    sector: 'Healthcare & Pharma',
    industry: 'Pharmaceuticals',
    market_cap: 450000,
    pe_ratio: 38.6,
    dividend_yield: 0.72,
    fifty_two_week_high: 1960.35,
    fifty_two_week_low: 1098.00,
    current_price: 1845.50,
    prev_close: 1832.10,
  },
  {
    symbol: 'TITAN.NS',
    name: 'Titan Company Limited',
    short_name: 'Titan',
    exchange: 'NSE',
    sector: 'Consumer Durables',
    industry: 'Gems, Jewellery & Watches',
    market_cap: 310000,
    pe_ratio: 84.1,
    dividend_yield: 0.31,
    fifty_two_week_high: 3868.00,
    fifty_two_week_low: 3055.65,
    current_price: 3420.00,
    prev_close: 3395.00,
  },
  {
    symbol: 'BAJFINANCE.NS',
    name: 'Bajaj Finance Limited',
    short_name: 'Bajaj Finance',
    exchange: 'NSE',
    sector: 'Financial Services',
    industry: 'NBFC',
    market_cap: 430000,
    pe_ratio: 28.5,
    dividend_yield: 0.52,
    fifty_two_week_high: 8192.00,
    fifty_two_week_low: 6375.00,
    current_price: 6980.00,
    prev_close: 7040.00,
  },
  {
    symbol: 'MARUTI.NS',
    name: 'Maruti Suzuki India Limited',
    short_name: 'Maruti Suzuki',
    exchange: 'NSE',
    sector: 'Automobile',
    industry: 'Passenger Vehicles',
    market_cap: 370000,
    pe_ratio: 27.9,
    dividend_yield: 1.05,
    fifty_two_week_high: 13680.00,
    fifty_two_week_low: 9735.00,
    current_price: 11950.00,
    prev_close: 11840.00,
  },
  {
    symbol: 'HCLTECH.NS',
    name: 'HCL Technologies Limited',
    short_name: 'HCL Tech',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    market_cap: 495000,
    pe_ratio: 29.4,
    dividend_yield: 2.80,
    fifty_two_week_high: 1888.00,
    fifty_two_week_low: 1235.00,
    current_price: 1810.00,
    prev_close: 1795.50,
  },
  {
    symbol: 'ULTRACEMCO.NS',
    name: 'UltraTech Cement Limited',
    short_name: 'UltraTech Cement',
    exchange: 'NSE',
    sector: 'Materials & Cement',
    industry: 'Cement & Building Materials',
    market_cap: 320000,
    pe_ratio: 42.1,
    dividend_yield: 0.65,
    fifty_two_week_high: 12130.00,
    fifty_two_week_low: 7990.00,
    current_price: 11150.00,
    prev_close: 11080.00,
  },
  {
    symbol: 'NTPC.NS',
    name: 'NTPC Limited',
    short_name: 'NTPC',
    exchange: 'NSE',
    sector: 'Power / Utilities',
    industry: 'Electric Utilities',
    market_cap: 390000,
    pe_ratio: 17.8,
    dividend_yield: 2.15,
    fifty_two_week_high: 448.45,
    fifty_two_week_low: 231.00,
    current_price: 412.30,
    prev_close: 408.90,
  },
  {
    symbol: 'TATASTEEL.NS',
    name: 'Tata Steel Limited',
    short_name: 'Tata Steel',
    exchange: 'NSE',
    sector: 'Metals & Mining',
    industry: 'Iron & Steel',
    market_cap: 195000,
    pe_ratio: 46.2,
    dividend_yield: 2.30,
    fifty_two_week_high: 184.60,
    fifty_two_week_low: 118.00,
    current_price: 154.20,
    prev_close: 153.10,
  },
  {
    symbol: 'ZOMATO.NS',
    name: 'Zomato Limited',
    short_name: 'Zomato',
    exchange: 'NSE',
    sector: 'Consumer Services / Tech',
    industry: 'Online Food Delivery & Quick Commerce',
    market_cap: 230000,
    pe_ratio: 118.0,
    dividend_yield: 0.0,
    fifty_two_week_high: 298.20,
    fifty_two_week_low: 104.50,
    current_price: 265.40,
    prev_close: 260.10,
  },
  {
    symbol: 'BEL.NS',
    name: 'Bharat Electronics Limited',
    short_name: 'BEL',
    exchange: 'NSE',
    sector: 'Aerospace & Defence',
    industry: 'Defence Electronics',
    market_cap: 215000,
    pe_ratio: 49.3,
    dividend_yield: 0.75,
    fifty_two_week_high: 340.50,
    fifty_two_week_low: 127.00,
    current_price: 296.80,
    prev_close: 292.40,
  }
];

export function seedInitialData() {
  // Check if portfolios exist
  const existingPortfolios = db.prepare('SELECT count(*) as count FROM portfolios').get() as { count: number };
  if (existingPortfolios.count === 0) {
    const defaultPortfolioId = 'main-portfolio-1';
    db.prepare(`
      INSERT INTO portfolios (id, name, description, is_default)
      VALUES (?, ?, ?, 1)
    `).run(defaultPortfolioId, 'Main Growth Portfolio', 'Primary Indian equities portfolio focused on bluechip & growth leaders');
    console.log('[Database] Seeded default portfolio:', defaultPortfolioId);
  }

  // Seed / update stocks table
  const insertStock = db.prepare(`
    INSERT INTO stocks (
      symbol, name, short_name, exchange, sector, industry, market_cap,
      pe_ratio, dividend_yield, fifty_two_week_high, fifty_two_week_low,
      current_price, prev_close, day_change, day_change_percent, currency
    ) VALUES (
      @symbol, @name, @short_name, @exchange, @sector, @industry, @market_cap,
      @pe_ratio, @dividend_yield, @fifty_two_week_high, @fifty_two_week_low,
      @current_price, @prev_close, @day_change, @day_change_percent, 'INR'
    ) ON CONFLICT(symbol) DO UPDATE SET
      current_price = excluded.current_price,
      prev_close = excluded.prev_close,
      day_change = excluded.day_change,
      day_change_percent = excluded.day_change_percent
  `);

  for (const s of INITIAL_STOCKS) {
    const day_change = Number((s.current_price - s.prev_close).toFixed(2));
    const day_change_percent = Number(((day_change / s.prev_close) * 100).toFixed(2));
    insertStock.run({
      ...s,
      day_change,
      day_change_percent,
    });
  }

  // Seed initial watchlist if empty
  const watchlistCount = db.prepare('SELECT count(*) as count FROM watchlist').get() as { count: number };
  if (watchlistCount.count === 0) {
    const initialWatchlist = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ZOMATO.NS', 'TATAMOTORS.NS'];
    const insertWatch = db.prepare('INSERT OR IGNORE INTO watchlist (id, stock_symbol, notes) VALUES (?, ?, ?)');
    initialWatchlist.forEach((sym, idx) => {
      insertWatch.run(`watch-${idx + 1}`, sym, 'Core watchlist ticker');
    });
    console.log('[Database] Seeded default watchlist.');
  }

  console.log(`[Database] Seeded ${INITIAL_STOCKS.length} reference Indian stocks.`);

  // Seed sample portfolio transactions if transactions table is empty
  const txCount = db.prepare('SELECT count(*) as count FROM transactions').get() as { count: number };
  if (txCount.count === 0) {
    const defaultPortfolioId = 'main-portfolio-1';
    const sampleTransactions = [
      { id: 'tx_sample_1', portfolio_id: defaultPortfolioId, stock_symbol: 'RELIANCE.NS', type: 'BUY', quantity: 60, price: 1120.00, total_amount: 67200.00, transaction_date: '2024-03-15', notes: 'Initial bluechip investment in energy and retail giant' },
      { id: 'tx_sample_2', portfolio_id: defaultPortfolioId, stock_symbol: 'RELIANCE.NS', type: 'BUY', quantity: 25, price: 1150.00, total_amount: 28750.00, transaction_date: '2024-06-10', notes: 'Accumulated on dip' },
      { id: 'tx_sample_3', portfolio_id: defaultPortfolioId, stock_symbol: 'TCS.NS', type: 'BUY', quantity: 30, price: 2420.00, total_amount: 72600.00, transaction_date: '2024-01-05', notes: 'Core IT exposure' },
      { id: 'tx_sample_4', portfolio_id: defaultPortfolioId, stock_symbol: 'TCS.NS', type: 'DIVIDEND', quantity: 30, price: 28.00, total_amount: 840.00, transaction_date: '2024-04-18', notes: 'Interim dividend payout' },
      { id: 'tx_sample_5', portfolio_id: defaultPortfolioId, stock_symbol: 'HDFCBANK.NS', type: 'BUY', quantity: 80, price: 650.00, total_amount: 52000.00, transaction_date: '2024-01-22', notes: 'Private bank anchor' },
      { id: 'tx_sample_6', portfolio_id: defaultPortfolioId, stock_symbol: 'INFY.NS', type: 'BUY', quantity: 60, price: 1080.00, total_amount: 64800.00, transaction_date: '2024-02-14', notes: 'Infosys large-cap tech' },
      { id: 'tx_sample_7', portfolio_id: defaultPortfolioId, stock_symbol: 'ITC.NS', type: 'BUY', quantity: 150, price: 440.00, total_amount: 66000.00, transaction_date: '2023-09-01', notes: 'FMCG defensive & high dividend yield' },
      { id: 'tx_sample_8', portfolio_id: defaultPortfolioId, stock_symbol: 'ITC.NS', type: 'DIVIDEND', quantity: 150, price: 6.25, total_amount: 937.50, transaction_date: '2024-02-15', notes: 'Interim dividend' },
      { id: 'tx_sample_9', portfolio_id: defaultPortfolioId, stock_symbol: 'TATAMOTORS.NS', type: 'BUY', quantity: 80, price: 810.00, total_amount: 64800.00, transaction_date: '2024-02-01', notes: 'EV and commercial vehicle turnaround' },
      { id: 'tx_sample_10', portfolio_id: defaultPortfolioId, stock_symbol: 'TATAMOTORS.NS', type: 'SELL', quantity: 20, price: 940.00, total_amount: 18800.00, transaction_date: '2024-08-12', notes: 'Booked partial profit on rally' },
      { id: 'tx_sample_11', portfolio_id: defaultPortfolioId, stock_symbol: 'SUNPHARMA.NS', type: 'BUY', quantity: 40, price: 1680.00, total_amount: 67200.00, transaction_date: '2024-04-10', notes: 'Pharma healthcare growth' },
      { id: 'tx_sample_12', portfolio_id: defaultPortfolioId, stock_symbol: 'BHARTIARTL.NS', type: 'BUY', quantity: 45, price: 1540.00, total_amount: 69300.00, transaction_date: '2024-05-15', notes: 'Telecom leader' },
      { id: 'tx_sample_13', portfolio_id: defaultPortfolioId, stock_symbol: 'ZOMATO.NS', type: 'BUY', quantity: 250, price: 185.00, total_amount: 46250.00, transaction_date: '2024-03-01', notes: 'Consumer internet turnaround' },
    ];

    const insertTx = db.prepare(`
      INSERT OR IGNORE INTO transactions (
        id, portfolio_id, stock_symbol, type, quantity, price, total_amount, transaction_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const tx of sampleTransactions) {
      insertTx.run(
        tx.id, tx.portfolio_id, tx.stock_symbol, tx.type, tx.quantity,
        tx.price, tx.total_amount, tx.transaction_date, tx.notes
      );
    }

    CalculationEngine.recalculatePortfolio(defaultPortfolioId);
    console.log('[Database] Seeded 13 sample bluechip transactions and precomputed portfolio.');
  }
}

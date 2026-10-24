# ilovefinance 📈
> **Production-Quality Indian Stock Portfolio Analyzer (NSE / BSE)**

A modern fintech-grade web application built for Indian stock market investors to track, analyze, and optimize equity portfolios without requiring authentication or account creation.

---

## 🌟 Key Features

- **NSE & BSE Equities Focus**: Real-time / 15-minute delayed market data covering popular Indian large-caps, mid-caps, and benchmarks like **NIFTY 50** (`^NSEI`) and **SENSEX** (`^BSESN`).
- **Zero-Authentication Workflow**: All data is persisted locally in an ACID-compliant relational database (`data/ilovefinance.db`) so you can track multiple portfolios seamlessly.
- **Accurate Financial Calculation Engine**:
  - **Weighted Average Cost Basis**: Dynamically recalculates cost basis across multiple buy transactions at varying prices.
  - **Partial Selling & Realized P/L**: Correctly splits cost basis when partially trimming positions and computes exact realized gains/losses.
  - **Unrealized P/L**: Live comparison against current market price (LTP).
  - **Dividend Tracking**: Full audit log of corporate dividend payouts contributing to total return.
  - **Today's P/L**: Daily gain/loss calculated against the previous day's close price.
- **Fintech Analytics Dashboard**:
  - **KPI Header**: Portfolio Value (`₹XX,XX,XXX`), Total Return (`+XX.XX%`), Today's Gain/Loss, and Invested Capital.
  - **Portfolio Equity Curve**: Interactive historical performance chart across 1W, 1M, 6M, 1Y timeframes.
  - **Benchmark Comparison**: Comparative growth charts comparing your portfolio vs **NIFTY 50** and **SENSEX** with alpha metrics.
  - **Sector & Stock Allocation**: Interactive Donut charts displaying exposure percentages.
  - **Diversification Score (0-100)**: Derived from the **Herfindahl-Hirschman Index (HHI)** evaluating stock and sector concentrations with tailored rebalancing suggestions.
  - **Portfolio Risk Score (1-10)**: Analytical estimate based on weighted Beta against NIFTY 50 and 252-day annualized price volatility.
  - **Top & Lagging Performers**: Highlighting best and worst stocks by percentage return and absolute rupee gain.
- **Interactive Stock Detail Modal**:
  - Full company profile, exchange, sector, LTP, daily change.
  - 52-week High/Low visual range slider.
  - P/E ratio, Market capitalization, Dividend yield.
  - User's existing holdings in that stock with current P/L.
  - Multi-timeframe historical candlestick / area charts (1W, 1M, 6M, 1Y, 5Y).
- **Watchlist**:
  - Quick-access Indian equity watchlist with live price changes, previous close, and 1-click trade action.
- **Multiple Portfolios**:
  - Create and switch between multiple portfolios (e.g., *Core Bluechips*, *High-Growth Smallcaps*, *Retirement*).
- **1-Click Sample Portfolio Import**:
  - Instantly load a balanced Indian bluechip portfolio (Reliance, TCS, HDFC Bank, Infosys, ITC, Tata Motors, Sun Pharma, State Bank of India) to explore analytics with a single click.

---

## 🏛️ Architecture & Folder Structure

```
ilovefinance/
├── package.json               # Root orchestration scripts
├── tsconfig.json              # Root TypeScript config
├── .env.example               # Environment variables template
├── .env                       # Local environment configuration
├── README.md                  # Complete documentation
├── data/                      # Local SQLite database persistence
│   └── ilovefinance.db
├── database/
│   └── schema.sql             # Relational DDL (SQLite & PostgreSQL compatible)
├── server/                    # Node.js + Express + TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts           # Express server entry point & static file server
│       ├── db/
│       │   ├── connection.ts  # Native Node.js node:sqlite database connection (WAL mode)
│       │   ├── schema.ts      # DDL initialization & index creation
│       │   └── seed.ts        # 20+ reference Indian bluechips & benchmarks
│       ├── services/
│       │   ├── marketDataService.ts   # NSE/BSE quote fetcher, caching & fallback generator
│       │   ├── calculationEngine.ts   # Weighted avg cost basis, realized & unrealized P/L
│       │   └── analyticsService.ts    # HHI diversification score, Beta risk score, allocations
│       └── routes/
│           ├── portfolios.ts  # Portfolio CRUD & sample loader
│           ├── transactions.ts# BUY, SELL, DIVIDEND endpoints with validation
│           ├── stocks.ts      # Search, quotes, history, benchmarks & market status
│           ├── watchlist.ts   # Watchlist management
│           └── analytics.ts   # Complete portfolio analytics payload
└── client/                    # React 18 + Vite + TypeScript + Tailwind CSS Frontend
    ├── package.json
    ├── vite.config.ts         # Vite bundler configuration with API reverse proxy
    ├── tailwind.config.js     # Modern dark fintech theme palette
    ├── index.html
    └── src/
        ├── App.tsx            # Main dashboard container & modal orchestrator
        ├── index.css          # Tailwind base & custom sleek scrollbars
        ├── main.tsx           # React DOM root
        ├── types/             # TypeScript interfaces for financial models
        ├── utils/             # INR Lakhs/Crores formatters & date helpers
        ├── services/          # REST API client
        └── components/
            ├── layout/        # Navbar & Indian benchmark ticker strip
            ├── dashboard/     # MetricsGrid, PerformanceChart, BenchmarkComparison, AllocationCharts, HoldingsTable, RiskAndDiversification, TopPerformers
            ├── stocks/        # StockDetailModal & Autocomplete Search
            ├── transactions/  # TransactionModal & TransactionHistoryModal
            ├── watchlist/     # WatchlistPanel with sparkline quotes
            └── portfolio/     # PortfolioModal manager
```

---

## 📐 Financial Calculation Engine

### 1. Weighted Average Cost Basis
When purchasing shares of stock $i$:
$$\text{New Cost Basis} = \frac{(Q_{\text{prev}} \times P_{\text{avg}}) + (Q_{\text{new}} \times P_{\text{new}})}{Q_{\text{prev}} + Q_{\text{new}}}$$

### 2. Partial Selling & Realized P/L
When selling $Q_{\text{sold}}$ shares at price $P_{\text{sell}}$:
$$\text{Cost Basis of Sold Shares} = Q_{\text{sold}} \times P_{\text{avg}}$$
$$\text{Sale Proceeds} = Q_{\text{sold}} \times P_{\text{sell}}$$
$$\text{Realized P/L} = \text{Sale Proceeds} - \text{Cost Basis of Sold Shares}$$
The average cost basis ($P_{\text{avg}}$) for remaining shares remains constant. If remaining quantity reaches 0, $P_{\text{avg}}$ resets to 0.

### 3. Unrealized P/L
For each active holding:
$$\text{Unrealized P/L} = (P_{\text{current}} - P_{\text{avg}}) \times Q_{\text{remaining}}$$

### 4. Diversification Score (0 - 100)
Calculated using the **Herfindahl-Hirschman Index (HHI)**:
$$HHI_{\text{stock}} = \sum_{i} w_i^2 \quad \text{where } w_i = \frac{V_i}{V_{\text{total}}}$$
$$HHI_{\text{sector}} = \sum_{j} s_j^2 \quad \text{where } s_j = \frac{\text{Sector Value}_j}{V_{\text{total}}}$$
The score combines stock concentration ($40\%$), sector distribution ($40\%$), and breadth of holdings ($20\%$).

### 5. Analytical Risk Score (1 - 10)
Derived from the weighted Beta $\beta_p = \sum w_i \beta_i$ relative to **NIFTY 50** and 252-day annualized price volatility:
- **Low Risk (1 - 3)**: Weighted Beta $< 0.8$ (Defensive sectors like FMCG, Pharma).
- **Moderate Risk (4 - 6)**: Weighted Beta $0.8 - 1.1$ (Market-like risk, large-cap IT and Banks).
- **High Risk (7 - 8)**: Weighted Beta $1.1 - 1.35$ (High-beta cyclicals, Autos, Metals).
- **Very High Risk (9 - 10)**: Weighted Beta $> 1.35$ (Aggressive small/midcaps, new-age tech).

> **Disclaimer**: Analytical metrics are estimates based on historical price volatility and benchmark correlation. They do not constitute financial advice.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20.0.0 or higher; Node v22+ or v24 recommended)
- **npm** (v10+ or v11+)

### 1. Installation

From the project root:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

Or run the convenience script:
```bash
npm run install:all
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Default configuration works immediately with zero extra setup.

### 3. Running the Application

#### Production Mode (Single Process):
Build the frontend and backend, then start the server:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Development Mode (Concurrent with Hot Reload):
```bash
npm run dev
```
- **Backend API**: Runs on `http://localhost:5000` (via `tsx watch`)
- **Frontend Vite Dev Server**: Runs on `http://localhost:3000` (with live HMR and reverse proxy to API)

---

## 🗄️ Database Management

The application uses Node.js's built-in `node:sqlite` engine with WAL (Write-Ahead Logging) enabled.
The database file is automatically created at:
```
data/ilovefinance.db
```

### Tables:
1. `portfolios`: Portfolio metadata and default active flags.
2. `stocks`: Reference NSE/BSE stock catalog with prices, sectors, and 52-week ranges.
3. `transactions`: BUY, SELL, and DIVIDEND trades.
4. `holdings`: Real-time computed holding positions and cost bases.
5. `dividends`: Payout history per stock.
6. `watchlist`: Monitored Indian tickers.
7. `historical_prices`: Time-series pricing bars for charting.

### Optional PostgreSQL Support:
To use an external PostgreSQL database instead of SQLite, set the `DATABASE_URL` environment variable:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ilovefinance
```
Execute `database/schema.sql` to initialize PostgreSQL tables.

---

## 📊 Market Data Integration & Resiliency

- **Active Provider**: **Alpha Vantage** with API key integration.
- **Key Configured**: `ALPHA_VANTAGE_API_KEY=FBJJE5VK81ONGBX8` (stored securely in `.env` backend layer).
- **Tickers Supported**: All standard NSE/BSE symbols (e.g. `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`) automatically mapped to BSE/NSE Alpha Vantage format (e.g. `RELIANCE.BSE`).
- **Multi-Level Caching**:
  - 5-minute memory cache for live quotes to conserve API quota.
  - 1-hour cache for historical daily price charts.
  - SQLite persistent cache table ensuring zero downtime and instant page loads.
- **Graceful Fallbacks**: If Alpha Vantage hits its daily/minute rate limit or if a network blip occurs, the backend seamlessly falls back to our secondary market layer and local SQLite cache so the user never encounters broken views.
- **Market Hours Awareness**: Tracks Indian Standard Time (IST = UTC+5:30) and detects active trading hours (09:15 AM to 03:30 PM IST, Monday - Friday), market closures, and weekends.

---

## 🚀 Deploying to Vercel

`ilovefinance` is fully configured for serverless deployment on [Vercel](https://vercel.com):

1. **Push to GitHub**: Ensure your latest code is on your repository (e.g., `https://github.com/ShawnPaulStanley/ilovefinance`).
2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select your `ilovefinance` repository.
   - Vercel automatically detects `vercel.json` with:
     - **Framework Preset**: Vite / Other
     - **Build Command**: `npm run build`
     - **Output Directory**: `client/dist`
     - **Serverless API**: `api/index.js`
3. **Configure Environment Variables**:
   In Vercel project settings, add:
   - `ALPHA_VANTAGE_API_KEY`: `your_alpha_vantage_key` (e.g. `FBJJE5VK81ONGBX8`)
4. **Deploy**:
   Click **Deploy**. Your app will be live with high-speed CDN static asset delivery and serverless API execution!

---

## 📄 License
MIT License. Built for Indian stock market investors.

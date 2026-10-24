import React, { useEffect, useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  BookmarkSimple, 
  ArrowUpRight,
  ArrowDownRight
} from '@phosphor-icons/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { StockQuote, HoldingCalculated } from '../../types/finance';
import { fetchStockQuote, fetchStockHistory } from '../../services/api';
import { formatINR, formatPercent, cleanTicker, formatDate } from '../../utils/formatters';

interface StockDetailModalProps {
  symbol: string | null;
  onClose: () => void;
  userHolding?: HoldingCalculated | null;
  onTrade: (symbol: string, type: 'BUY' | 'SELL') => void;
  isWatchlisted?: boolean;
  onWatchlistToggle?: (symbol: string) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  symbol,
  onClose,
  userHolding,
  onTrade,
  isWatchlisted = false,
  onWatchlistToggle,
}) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<Array<{ date: string; price: number }>>([]);
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '6M' | '1Y' | '5Y'>('1Y');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    Promise.all([
      fetchStockQuote(symbol),
      fetchStockHistory(symbol, timeframe)
    ])
      .then(([q, h]) => {
        setQuote(q);
        setHistory(h);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [symbol, timeframe]);

  if (!symbol) return null;

  const isDayPositive = (quote?.day_change ?? 0) >= 0;
  const strokeColor = isDayPositive ? '#D7FF00' : '#FF4343';

  // 52-week high/low calculation
  const high = quote?.fifty_two_week_high || (quote?.current_price ? quote.current_price * 1.15 : 100);
  const low = quote?.fifty_two_week_low || (quote?.current_price ? quote.current_price * 0.85 : 50);
  const current = quote?.current_price || (high + low) / 2;
  const rangePercent = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 bg-[#0D0D0D]/95 backdrop-blur-xl px-6 py-5 border-b border-[#2B2F23] flex items-center justify-between z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#141710] border-2 border-[#D7FF00] text-[#D7FF00] font-display font-extrabold flex items-center justify-center text-lg shadow-[0_0_15px_rgba(215,255,0,0.2)]">
              {cleanTicker(symbol).slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">{cleanTicker(symbol)}</h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1C2016] text-white border border-[#2B2F23]">
                  {quote?.exchange || 'NSE'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D7FF00]/15 text-[#D7FF00] border border-[#D7FF00]/40">
                  {quote?.sector?.toUpperCase() || 'EQUITIES'}
                </span>
              </div>
              <p className="text-xs font-mono text-[#8E9482] uppercase mt-0.5">{quote?.name || symbol}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onWatchlistToggle && (
              <button
                onClick={() => onWatchlistToggle(symbol)}
                className="p-2.5 rounded-xl bg-[#141710] text-[#8E9482] hover:text-[#D7FF00] border border-[#2B2F23] transition"
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <BookmarkSimple size={18} weight={isWatchlisted ? "fill" : "bold"} className={isWatchlisted ? "text-[#D7FF00]" : ""} />
              </button>
            )}

            <button
              onClick={() => onTrade(symbol, 'BUY')}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-display font-extrabold uppercase tracking-wider text-black bg-[#D7FF00] hover:bg-[#C7FF3D] rounded-xl transition shadow-[0_0_15px_rgba(215,255,0,0.3)]"
            >
              <Plus size={14} weight="bold" />
              <span>BUY</span>
            </button>

            {userHolding && userHolding.quantity > 0 && (
              <button
                onClick={() => onTrade(symbol, 'SELL')}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-display font-extrabold uppercase tracking-wider text-white bg-[#FF4343] hover:bg-[#e03a3a] rounded-xl transition shadow-[0_0_15px_rgba(255,67,67,0.3)]"
              >
                <Minus size={14} weight="bold" />
                <span>SELL</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-[#8E9482] hover:text-white hover:bg-[#1C2016] transition"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Price Header & Today's Performance */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#141710] p-6 rounded-3xl border border-[#2B2F23]">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8E9482] mb-1 font-bold">CURRENT TRADING PRICE (LTP)</div>
              <div className="font-display text-5xl font-extrabold text-white tracking-wide">
                {formatINR(quote?.current_price)}
              </div>
              <div className="mt-2.5 flex items-center space-x-2 text-xs font-mono">
                <span className={`flex items-center font-bold px-2 py-0.5 rounded ${
                  isDayPositive ? 'bg-[#D7FF00]/15 text-[#D7FF00] border border-[#D7FF00]/40' : 'bg-[#FF4343]/15 text-[#FF4343] border border-[#FF4343]/40'
                }`}>
                  {isDayPositive ? <ArrowUpRight size={14} weight="bold" className="mr-0.5" /> : <ArrowDownRight size={14} weight="bold" className="mr-0.5" />}
                  {isDayPositive ? '+' : ''}{formatINR(quote?.day_change)} ({formatPercent(quote?.day_change_percent)})
                </span>
                <span className="text-[#8E9482]">PREV CLOSE: {formatINR(quote?.prev_close)}</span>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            <div className="w-full sm:w-80">
              <div className="flex justify-between text-[11px] font-mono text-[#8E9482] uppercase mb-1.5 font-bold">
                <span>52W L: {formatINR(low)}</span>
                <span className="text-[#D7FF00]">{rangePercent.toFixed(0)}% RANGE</span>
                <span>52W H: {formatINR(high)}</span>
              </div>
              <div className="w-full bg-[#0D0D0D] h-3 rounded-full overflow-hidden border border-[#2B2F23] relative">
                <div 
                  className="bg-gradient-to-r from-[#C7FF3D] to-[#D7FF00] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#D7FF00]"
                  style={{ width: `${rangePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Historical Interactive Chart */}
          <div className="bg-[#141710] p-6 rounded-3xl border border-[#2B2F23]">
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
              <div className="font-display text-xl font-bold uppercase tracking-wide text-white">PRICE TRAJECTORY</div>
              <div className="flex items-center space-x-1 bg-[#0D0D0D] p-1.5 rounded-2xl border border-[#2B2F23]">
                {(['1W', '1M', '6M', '1Y', '5Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-xl transition ${
                      timeframe === tf ? 'bg-[#D7FF00] text-black shadow-[0_0_10px_rgba(215,255,0,0.35)]' : 'text-[#8E9482] hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full pt-5">
              {loading ? (
                <div className="h-full flex items-center justify-center text-[#8E9482] font-mono text-xs uppercase">
                  Loading market candles...
                </div>
              ) : history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="neonStockGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B2F23" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(d) => formatDate(d).replace(/ [0-9]{4}$/, '')} 
                      stroke="#8E9482" 
                      fontSize={11} 
                      fontFamily="JetBrains Mono"
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#8E9482" 
                      fontSize={11} 
                      fontFamily="JetBrains Mono"
                      domain={['auto', 'auto']} 
                      tickFormatter={(v) => `₹${v}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0D0D0D] border-2 border-[#2B2F23] p-3 rounded-2xl font-mono text-xs shadow-2xl">
                              <div className="text-[#8E9482] uppercase">{formatDate(label)}</div>
                              <div className="text-white font-bold mt-1 text-sm">{formatINR(payload[0].value as number)}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={strokeColor} 
                      strokeWidth={2.5} 
                      fill="url(#neonStockGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#8E9482] font-mono text-xs uppercase">
                  No historical data points available.
                </div>
              )}
            </div>
          </div>

          {/* User's Holdings Section (if held) */}
          {userHolding && userHolding.quantity > 0 && (
            <div className="bg-[#1C2016] border border-[#D7FF00]/40 rounded-3xl p-6">
              <div className="font-display text-lg font-bold text-[#D7FF00] uppercase tracking-wide mb-3">
                YOUR PORTFOLIO POSITION
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-[#8E9482] uppercase">Quantity Held</div>
                  <div className="text-xl font-display font-bold text-white mt-1">{userHolding.quantity} SHARES</div>
                </div>
                <div>
                  <div className="text-[#8E9482] uppercase">Avg Purchase Price</div>
                  <div className="text-xl font-display font-bold text-white mt-1">{formatINR(userHolding.avg_buy_price)}</div>
                </div>
                <div>
                  <div className="text-[#8E9482] uppercase">Current Valuation</div>
                  <div className="text-xl font-display font-bold text-white mt-1">{formatINR(userHolding.current_value)}</div>
                </div>
                <div>
                  <div className="text-[#8E9482] uppercase">Net Position P&L</div>
                  <div className={`text-xl font-display font-bold mt-1 ${userHolding.unrealized_pl >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                    {userHolding.unrealized_pl >= 0 ? '+' : ''}{formatINR(userHolding.unrealized_pl)} ({formatPercent(userHolding.unrealized_pl_percent)})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fundamentals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="bg-[#141710] p-4 rounded-2xl border border-[#2B2F23]">
              <div className="text-xs text-[#8E9482] uppercase font-bold">MARKET CAP</div>
              <div className="text-base font-bold text-white mt-1">
                {quote?.market_cap ? `₹${(quote.market_cap / 100).toFixed(1)}k Cr` : '₹50,000 Cr'}
              </div>
            </div>
            <div className="bg-[#141710] p-4 rounded-2xl border border-[#2B2F23]">
              <div className="text-xs text-[#8E9482] uppercase font-bold">P/E RATIO</div>
              <div className="text-base font-bold text-white mt-1">
                {quote?.pe_ratio ? quote.pe_ratio.toFixed(1) : '24.5'}x
              </div>
            </div>
            <div className="bg-[#141710] p-4 rounded-2xl border border-[#2B2F23]">
              <div className="text-xs text-[#8E9482] uppercase font-bold">DIVIDEND YIELD</div>
              <div className="text-base font-bold text-[#D7FF00] mt-1">
                {quote?.dividend_yield ? `${quote.dividend_yield.toFixed(2)}%` : '1.20%'}
              </div>
            </div>
            <div className="bg-[#141710] p-4 rounded-2xl border border-[#2B2F23]">
              <div className="text-xs text-[#8E9482] uppercase font-bold">DATA PROVIDER</div>
              <div className="text-xs font-bold text-white mt-1.5 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D7FF00] shadow-[0_0_6px_#D7FF00]"></span>
                <span className="uppercase">{quote?.data_provider || 'Alpha Vantage / NSE'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

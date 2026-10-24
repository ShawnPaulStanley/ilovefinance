import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { PortfolioHistoryPoint } from '../../types/finance';
import { formatINR, formatDate } from '../../utils/formatters';

interface PerformanceChartProps {
  data: PortfolioHistoryPoint[];
  currentValue: number;
  totalInvested: number;
  onTimeframeChange: (range: '1W' | '1M' | '6M' | '1Y') => void;
  selectedRange: '1W' | '1M' | '6M' | '1Y';
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  currentValue,
  totalInvested,
  onTimeframeChange,
  selectedRange
}) => {
  const isNetGain = currentValue >= totalInvested;
  const strokeColor = isNetGain ? '#D7FF00' : '#FF4343';

  const timeframes: Array<'1W' | '1M' | '6M' | '1Y'> = ['1W', '1M', '6M', '1Y'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const inv = payload[0].payload.invested;
      const profit = val - inv;
      return (
        <div className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-2xl p-4 shadow-2xl backdrop-blur-md">
          <p className="text-xs text-[#8E9482] font-mono uppercase mb-2">{formatDate(label)}</p>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between space-x-6">
              <span className="text-[#8E9482] uppercase">Valuation:</span>
              <span className="text-white font-bold">{formatINR(val)}</span>
            </div>
            <div className="flex justify-between space-x-6">
              <span className="text-[#8E9482] uppercase">Cost Basis:</span>
              <span className="text-white">{formatINR(inv)}</span>
            </div>
            <div className="flex justify-between space-x-6 pt-1.5 border-t border-[#2B2F23]">
              <span className="text-[#8E9482] uppercase">Net Return:</span>
              <span className={`font-bold ${profit >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                {profit >= 0 ? '+' : ''}{formatINR(profit)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#141710] border border-[#2B2F23] rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#2B2F23] gap-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            PORTFOLIO PERFORMANCE
          </h3>
          <p className="text-xs font-mono uppercase tracking-wider text-[#8E9482] mt-0.5">
            EQUITY VALUATION TRAJECTORY
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 bg-[#0D0D0D] p-1.5 rounded-2xl border border-[#2B2F23] self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase rounded-xl transition ${
                selectedRange === tf
                  ? 'bg-[#D7FF00] text-black shadow-[0_0_15px_rgba(215,255,0,0.35)]'
                  : 'text-[#8E9482] hover:text-white hover:bg-[#1C2016]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-6">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="neonPortfolioGrad" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(v) => {
                  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
                  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
                  return `₹${v}`;
                }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#neonPortfolioGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[#8E9482] font-mono text-xs uppercase">
            No historical data available. Record trades to visualize performance.
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { BenchmarkComparisonData } from '../../types/finance';
import { formatPercent, formatDate } from '../../utils/formatters';

interface BenchmarkComparisonProps {
  data: BenchmarkComparisonData | null;
}

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ data }) => {
  if (!data || !data.series || data.series.length === 0) {
    return null;
  }

  const { summary, series } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-2xl p-4 shadow-2xl backdrop-blur-md">
          <p className="text-xs text-[#8E9482] font-mono uppercase mb-2">{formatDate(label)}</p>
          <div className="space-y-1.5 font-mono text-xs">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex justify-between space-x-6">
                <span style={{ color: entry.color }} className="font-bold uppercase">
                  {entry.name}:
                </span>
                <span className={`font-bold ${entry.value >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                  {formatPercent(entry.value)}
                </span>
              </div>
            ))}
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
            BENCHMARK COMPARISON
          </h3>
          <p className="text-xs font-mono uppercase tracking-wider text-[#8E9482] mt-0.5">
            RELATIVE RETURN VS NIFTY 50 & SENSEX
          </p>
        </div>

        {/* Comparative Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Portfolio */}
          <div className="px-3 py-1.5 rounded-xl bg-[#1C2016] border border-[#D7FF00]/40 text-xs font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D7FF00] shadow-[0_0_8px_#D7FF00]"></span>
            <span className="text-[#8E9482] uppercase font-bold">Portfolio:</span>
            <span className={`font-extrabold ${summary.portfolioReturn >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
              {formatPercent(summary.portfolioReturn)}
            </span>
          </div>

          {/* NIFTY 50 */}
          <div className="px-3 py-1.5 rounded-xl bg-[#1C2016] border border-[#2B2F23] text-xs font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-[#8E9482] uppercase font-bold">NIFTY 50:</span>
            <span className={`font-extrabold ${summary.niftyReturn >= 0 ? 'text-white' : 'text-[#FF4343]'}`}>
              {formatPercent(summary.niftyReturn)}
            </span>
          </div>

          {/* SENSEX */}
          <div className="px-3 py-1.5 rounded-xl bg-[#1C2016] border border-[#2B2F23] text-xs font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C7FF3D]"></span>
            <span className="text-[#8E9482] uppercase font-bold">SENSEX:</span>
            <span className={`font-extrabold ${summary.sensexReturn >= 0 ? 'text-[#C7FF3D]' : 'text-[#FF4343]'}`}>
              {formatPercent(summary.sensexReturn)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 12, fontSize: 11, fontFamily: 'JetBrains Mono' }} 
              formatter={(value) => <span className="text-white font-bold uppercase">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="portfolioReturn" 
              name="Portfolio" 
              stroke="#D7FF00" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: '#D7FF00' }}
            />
            <Line 
              type="monotone" 
              dataKey="niftyReturn" 
              name="NIFTY 50" 
              stroke="#FFFFFF" 
              strokeWidth={1.8} 
              strokeDasharray="4 4"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="sensexReturn" 
              name="SENSEX" 
              stroke="#C7FF3D" 
              strokeWidth={1.8} 
              strokeDasharray="2 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alpha Badge */}
      <div className="mt-3 pt-4 border-t border-[#2B2F23] flex items-center justify-between text-xs font-mono">
        <span className="text-[#8E9482] uppercase tracking-wider font-semibold">Alpha Generated (vs NIFTY 50):</span>
        <span className={`font-extrabold px-2.5 py-1 rounded-lg border ${
          summary.alphaVsNifty >= 0 
            ? 'bg-[#D7FF00]/15 text-[#D7FF00] border-[#D7FF00]/40 shadow-[0_0_10px_rgba(215,255,0,0.2)]' 
            : 'bg-[#FF4343]/15 text-[#FF4343] border-[#FF4343]/40'
        }`}>
          {summary.alphaVsNifty >= 0 ? '+' : ''}{summary.alphaVsNifty.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

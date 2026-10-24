import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { SectorBreakdown, StockAllocation } from '../../types/finance';
import { formatINR } from '../../utils/formatters';

interface AllocationChartsProps {
  sectors: SectorBreakdown[];
  stocks: StockAllocation[];
}

const HIGH_CONTRAST_COLORS = [
  '#D7FF00', // Neon Yellow-Green
  '#C7FF3D', // Lime Accent
  '#FFFFFF', // Pure White
  '#8E9482', // Olive Slate
  '#626B54', // Dark Olive
  '#434A37', // Deep Olive
  '#A3B38A', // Sage Lime
  '#D5DDC5', // Off-White
];

export const AllocationCharts: React.FC<AllocationChartsProps> = ({ sectors, stocks }) => {
  const [activeTab, setActiveTab] = useState<'sector' | 'stock'>('sector');

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-2xl p-3.5 shadow-2xl text-xs font-mono">
          <div className="font-display font-bold uppercase tracking-wider text-white text-sm mb-1">
            {data.sector || data.name || data.symbol}
          </div>
          <div className="flex justify-between space-x-6 text-[#8E9482]">
            <span className="uppercase">Value:</span>
            <span className="text-white font-bold">{formatINR(data.value)}</span>
          </div>
          <div className="flex justify-between space-x-6 text-[#8E9482]">
            <span className="uppercase">Weight:</span>
            <span className="text-[#D7FF00] font-bold">{data.weight.toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const currentData = activeTab === 'sector' ? sectors : stocks;

  return (
    <div className="bg-[#141710] border border-[#2B2F23] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            ALLOCATION
          </h3>
          <p className="text-xs font-mono uppercase tracking-wider text-[#8E9482] mt-0.5">
            EXPOSURE DISTRIBUTION
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-1 bg-[#0D0D0D] p-1.5 rounded-2xl border border-[#2B2F23]">
          <button
            onClick={() => setActiveTab('sector')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xl transition ${
              activeTab === 'sector'
                ? 'bg-[#D7FF00] text-black shadow-[0_0_12px_rgba(215,255,0,0.35)]'
                : 'text-[#8E9482] hover:text-white'
            }`}
          >
            SECTORS
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xl transition ${
              activeTab === 'stock'
                ? 'bg-[#D7FF00] text-black shadow-[0_0_12px_rgba(215,255,0,0.35)]'
                : 'text-[#8E9482] hover:text-white'
            }`}
          >
            STOCKS
          </button>
        </div>
      </div>

      {currentData && currentData.length > 0 ? (
        <div className="flex flex-col gap-4 pt-4">
          {/* Donut Chart */}
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {currentData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={HIGH_CONTRAST_COLORS[index % HIGH_CONTRAST_COLORS.length]} 
                      stroke="#0D0D0D"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono">
            {currentData.map((item: any, idx) => {
              const label = activeTab === 'sector' ? item.sector : (item.name || item.symbol);
              const color = HIGH_CONTRAST_COLORS[idx % HIGH_CONTRAST_COLORS.length];
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#0D0D0D] hover:bg-[#1C2016] border border-transparent hover:border-[#2B2F23] transition">
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-white font-semibold uppercase truncate text-[11px]" title={label}>{label}</span>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[#8E9482] text-[11px]">{formatINR(item.value)}</span>
                    <span className="text-[#D7FF00] font-bold w-12 text-right">{item.weight.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-56 flex items-center justify-center text-[#8E9482] font-mono text-xs uppercase">
          No allocation data available.
        </div>
      )}
    </div>
  );
};

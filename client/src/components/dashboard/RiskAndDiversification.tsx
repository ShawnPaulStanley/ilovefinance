import React from 'react';
import { 
  ShieldCheck, 
  Pulse, 
  Info,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react';
import { DiversificationAnalysis, RiskAnalysis } from '../../types/finance';

interface RiskAndDiversificationProps {
  diversification: DiversificationAnalysis | null;
  risk: RiskAnalysis | null;
}

export const RiskAndDiversification: React.FC<RiskAndDiversificationProps> = ({
  diversification,
  risk
}) => {
  if (!diversification || !risk) return null;

  // Diversification color mapping
  const getDivColor = (score: number) => {
    if (score >= 80) return { text: 'text-[#D7FF00]', bg: 'bg-[#D7FF00]', badge: 'bg-[#D7FF00]/15 text-[#D7FF00] border-[#D7FF00]/40' };
    if (score >= 60) return { text: 'text-[#C7FF3D]', bg: 'bg-[#C7FF3D]', badge: 'bg-[#C7FF3D]/15 text-[#C7FF3D] border-[#C7FF3D]/40' };
    if (score >= 40) return { text: 'text-[#FFB800]', bg: 'bg-[#FFB800]', badge: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40' };
    return { text: 'text-[#FF4343]', bg: 'bg-[#FF4343]', badge: 'bg-[#FF4343]/15 text-[#FF4343] border-[#FF4343]/40' };
  };

  const divTheme = getDivColor(diversification.score);

  // Risk color mapping
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return { text: 'text-[#D7FF00]', bg: 'bg-[#D7FF00]', label: 'CONSERVATIVE / LOW BETA' };
      case 'MODERATE':
        return { text: 'text-[#C7FF3D]', bg: 'bg-[#C7FF3D]', label: 'MARKET-LIKE VOLATILITY' };
      case 'HIGH':
        return { text: 'text-[#FFB800]', bg: 'bg-[#FFB800]', label: 'HIGH VOLATILITY / GROWTH' };
      default:
        return { text: 'text-[#FF4343]', bg: 'bg-[#FF4343]', label: 'VERY HIGH BETA / CYCLICAL' };
    }
  };

  const riskTheme = getRiskColor(risk.riskLevel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      
      {/* 1. Diversification Score Card */}
      <div className="bg-[#141710] border border-[#2B2F23] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck size={22} weight="bold" className="text-[#D7FF00]" />
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
                DIVERSIFICATION SCORE
              </h3>
            </div>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${divTheme.badge}`}>
              {diversification.rating.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className={`font-display text-6xl font-extrabold tracking-wide ${divTheme.text}`}>
                {diversification.score}
              </span>
              <span className="text-[#8E9482] font-mono text-sm uppercase ml-1">/ 100</span>
            </div>
            <div className="text-right text-xs font-mono text-[#8E9482] uppercase space-y-0.5">
              <div>Sectors: <span className="text-white font-bold">{diversification.sectorCount}</span></div>
              <div>Top Holding: <span className="text-white font-bold">{diversification.topStockWeight.toFixed(1)}%</span></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#0D0D0D] h-2.5 rounded-full mt-4 overflow-hidden border border-[#2B2F23]">
            <div 
              className={`h-full ${divTheme.bg} transition-all duration-500 shadow-[0_0_12px_rgba(215,255,0,0.5)]`}
              style={{ width: `${Math.min(100, Math.max(5, diversification.score))}%` }}
            />
          </div>

          {/* Recommendations List */}
          <div className="mt-5 space-y-2">
            {diversification.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs text-white bg-[#0D0D0D] p-3 rounded-2xl border border-[#2B2F23]">
                <CheckCircle size={16} weight="fill" className="text-[#D7FF00] shrink-0 mt-0.5" />
                <span className="font-sans leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-[#2B2F23] text-[11px] font-mono text-[#8E9482] uppercase">
          ESTIMATED VIA HERFINDAHL-HIRSCHMAN INDEX (HHI) FOR STOCK & SECTOR SPREAD
        </div>
      </div>

      {/* 2. Portfolio Risk Score Card */}
      <div className="bg-[#141710] border border-[#2B2F23] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
            <div className="flex items-center space-x-2.5">
              <Pulse size={22} weight="bold" className="text-[#C7FF3D]" />
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">
                PORTFOLIO RISK SCORE
              </h3>
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1C2016] text-white border border-[#2B2F23]">
              {risk.riskLevel} RISK
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className={`font-display text-6xl font-extrabold tracking-wide ${riskTheme.text}`}>
                {risk.riskScore}
              </span>
              <span className="text-[#8E9482] font-mono text-sm uppercase ml-1">/ 10</span>
              <div className="text-xs font-mono text-[#8E9482] uppercase mt-1">{riskTheme.label}</div>
            </div>

            <div className="space-y-1 text-right text-xs font-mono uppercase">
              <div className="text-[#8E9482]">
                Beta vs NIFTY: <span className="text-white font-bold">{risk.weightedBeta.toFixed(2)}</span>
              </div>
              <div className="text-[#8E9482]">
                Est. Volatility: <span className="text-white font-bold">{risk.estimatedAnnualVolatility.toFixed(1)}% p.a.</span>
              </div>
              <div className="text-[#8E9482]">
                Est. Sharpe: <span className="text-white font-bold">{risk.sharpeRatioEstimate.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 10-Step High-Contrast Meter Bar */}
          <div className="grid grid-cols-10 gap-1.5 mt-4">
            {Array.from({ length: 10 }).map((_, idx) => {
              const active = idx < risk.riskScore;
              let barColor = 'bg-[#1C2016]';
              if (active) {
                if (idx < 3) barColor = 'bg-[#D7FF00] shadow-[0_0_8px_#D7FF00]';
                else if (idx < 6) barColor = 'bg-[#C7FF3D] shadow-[0_0_8px_#C7FF3D]';
                else if (idx < 8) barColor = 'bg-[#FFB800]';
                else barColor = 'bg-[#FF4343]';
              }
              return (
                <div key={idx} className={`h-2.5 rounded-sm ${barColor}`} />
              );
            })}
          </div>

          {/* Analytical Disclaimer */}
          <div className="mt-5 bg-[#0D0D0D] border border-[#2B2F23] rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-[#8E9482]">
            <Info size={18} weight="bold" className="text-[#D7FF00] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-white uppercase font-mono mr-1">ANALYTICAL ESTIMATE:</span>
              {risk.disclaimer}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-[#2B2F23] text-[11px] font-mono text-[#8E9482] uppercase">
          CALCULATED FROM NIFTY 50 REGRESSION BETA & 252-DAY ANNUALIZED PRICE VOLATILITY
        </div>
      </div>

    </div>
  );
};

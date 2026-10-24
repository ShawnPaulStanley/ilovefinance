import React, { useState } from 'react';
import { X, Trash, FolderPlus, ArrowCounterClockwise } from '@phosphor-icons/react';
import { Portfolio } from '../../types/finance';
import { createPortfolio, deletePortfolio, clearPortfolio } from '../../services/api';
import { formatINR } from '../../utils/formatters';

interface PortfolioModalProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPortfolio: (id: string) => void;
  onPortfoliosChanged: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  portfolios,
  selectedPortfolioId,
  isOpen,
  onClose,
  onSelectPortfolio,
  onPortfoliosChanged,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const created = await createPortfolio({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      setIsCreating(false);
      onPortfoliosChanged();
      onSelectPortfolio(created.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create portfolio');
    }
  };

  const handleDelete = async (id: string) => {
    if (portfolios.length <= 1) {
      alert('You cannot delete your only portfolio.');
      return;
    }
    if (window.confirm('Delete this portfolio and all its trades?')) {
      try {
        await deletePortfolio(id);
        onPortfoliosChanged();
        if (selectedPortfolioId === id) {
          const remaining = portfolios.filter(p => p.id !== id);
          if (remaining[0]) onSelectPortfolio(remaining[0].id);
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete portfolio');
      }
    }
  };

  const handleClear = async (id: string) => {
    if (window.confirm('Reset this portfolio? All transactions and holdings will be cleared so you can add your own fresh stocks.')) {
      try {
        await clearPortfolio(id);
        onPortfoliosChanged();
      } catch (err: any) {
        alert(err.message || 'Failed to reset portfolio');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">MANAGE PORTFOLIOS</h2>
            <p className="text-xs font-mono uppercase text-[#8E9482] mt-0.5">ORGANIZE MULTIPLE INVESTMENT STRATEGIES</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#8E9482] hover:text-white transition">
            <X size={20} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-2xl bg-[#FF4343]/10 border border-[#FF4343]/30 text-xs font-mono text-[#FF4343]">
            {error}
          </div>
        )}

        {/* Portfolio List */}
        <div className="mt-5 space-y-3 max-h-64 overflow-y-auto font-mono">
          {portfolios.map((p) => {
            const isSelected = p.id === selectedPortfolioId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPortfolio(p.id)}
                className={`p-4 rounded-3xl border transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C2016] border-[#D7FF00]/50 shadow-[0_0_15px_rgba(215,255,0,0.15)] text-white'
                    : 'bg-[#141710] border-[#2B2F23] hover:border-[#D7FF00]/30 text-[#8E9482]'
                }`}
              >
                <div>
                  <div className="font-display text-xl font-bold uppercase tracking-wide flex items-center space-x-2 text-white">
                    <span>{p.name}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#D7FF00] text-black font-mono font-bold px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  {p.description && <div className="text-xs text-[#8E9482] uppercase mt-0.5">{p.description}</div>}
                  <div className="text-xs text-[#8E9482] uppercase mt-1.5">
                    VALUATION: <span className="text-white font-bold">{formatINR(p.total_value || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleClear(p.id)}
                    className="p-2 rounded-xl text-[#8E9482] hover:text-[#D7FF00] hover:bg-[#D7FF00]/10 transition"
                    title="Reset & Clear All Trades (Start Fresh)"
                  >
                    <ArrowCounterClockwise size={16} weight="bold" />
                  </button>
                  {portfolios.length > 1 && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-xl text-[#8E9482] hover:text-[#FF4343] hover:bg-[#FF4343]/10 transition"
                      title="Delete Portfolio"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Portfolio Section */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="mt-5 p-5 rounded-3xl bg-[#141710] border border-[#2B2F23] space-y-3 font-mono">
            <div className="text-xs font-bold uppercase tracking-wider text-white">NEW PORTFOLIO DETAILS</div>
            <div>
              <input
                type="text"
                placeholder="PORTFOLIO NAME (E.G. RETIREMENT BLUECHIP)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0D0D0D] text-xs font-bold text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00] uppercase"
                autoFocus
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="OPTIONAL DESCRIPTION OR STRATEGY..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0D0D0D] text-xs text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00] uppercase"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold uppercase text-[#8E9482] hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D7FF00] hover:bg-[#C7FF3D] text-black font-display font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(215,255,0,0.3)]"
              >
                CREATE PORTFOLIO
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#2B2F23] hover:border-[#D7FF00] text-[#8E9482] hover:text-[#D7FF00] text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
            >
              <FolderPlus size={18} weight="bold" />
              <span>CREATE NEW PORTFOLIO</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

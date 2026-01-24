'use client';

import { useState, useEffect } from 'react';
import { X, RotateCcw, Check, Info } from 'lucide-react';
import { ALL_ADVISORS, DEFAULT_ADVISOR_IDS, Advisor } from '@/lib/advisors';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (advisorIds: string[]) => void;
  activeAdvisorIds: string[];
}

const STORAGE_KEY = 'investment-board-advisors';

export function CustomizeModal({ isOpen, onClose, onSave, activeAdvisorIds }: CustomizeModalProps) {
  const [selected, setSelected] = useState<string[]>(activeAdvisorIds);

  useEffect(() => {
    setSelected(activeAdvisorIds);
  }, [activeAdvisorIds, isOpen]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selected.length < 2) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    onSave(selected);
    onClose();
  };

  const handleReset = () => {
    setSelected([...DEFAULT_ADVISOR_IDS]);
  };

  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/50 bg-emerald-500/20',
    blue: 'border-blue-500/50 bg-blue-500/20',
    cyan: 'border-cyan-500/50 bg-cyan-500/20',
    indigo: 'border-indigo-500/50 bg-indigo-500/20',
    amber: 'border-amber-500/50 bg-amber-500/20',
    purple: 'border-purple-500/50 bg-purple-500/20',
    violet: 'border-violet-500/50 bg-violet-500/20',
    red: 'border-red-500/50 bg-red-500/20',
    pink: 'border-pink-500/50 bg-pink-500/20',
    teal: 'border-teal-500/50 bg-teal-500/20',
    slate: 'border-slate-400/50 bg-slate-500/20',
    sky: 'border-sky-500/50 bg-sky-500/20',
    orange: 'border-orange-500/50 bg-orange-500/20',
    rose: 'border-rose-500/50 bg-rose-500/20',
  };

  const inactiveColor = 'border-white/10 bg-white/[0.02] opacity-50';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-gray-900/95 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Customize Your Board</h2>
            <p className="text-sm text-white/50 mt-0.5">Choose which advisors appear on your board</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* Instructions */}
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-300 mb-2">How to customize your board:</h3>
                <ol className="text-sm text-white/60 space-y-1 list-decimal list-inside">
                  <li>Tap any advisor card below to add or remove them</li>
                  <li>Green check = on your board, dimmed = not on your board</li>
                  <li>You need at least 2 advisors active</li>
                  <li>Click &quot;Save Board&quot; when you&apos;re happy with your selection</li>
                  <li>Board Meeting will automatically include only your active advisors</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Selection count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-white/50">
              <span className="text-white font-medium">{selected.length}</span> of {ALL_ADVISORS.length} advisors selected
            </p>
            {selected.length < 2 && (
              <p className="text-xs text-red-400">Minimum 2 advisors required</p>
            )}
          </div>

          {/* Advisor Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_ADVISORS.map((advisor) => {
              const isActive = selected.includes(advisor.id);
              return (
                <button
                  key={advisor.id}
                  onClick={() => toggle(advisor.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                    isActive ? colorMap[advisor.color] || colorMap.emerald : inactiveColor
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <span className="text-3xl">{advisor.emoji}</span>
                  <span className="text-sm font-medium text-white text-center leading-tight">{advisor.name}</span>
                  <span className="text-[10px] text-white/40 text-center leading-tight">{advisor.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-white/10 bg-gray-900/95 px-6 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={selected.length < 2}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save Board ({selected.length} advisors)
          </button>
        </div>
      </div>
    </div>
  );
}

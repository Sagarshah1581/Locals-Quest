import React, { useState, useEffect } from 'react';
import { FilterState } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: FilterState;
  onApply: (newFilters: { maxPrice: number; categories: string[] }) => void;
  onReset: () => void;
}

const ALL_CATEGORIES = [
  { value: 'Spectacles & Vibes', label: '✨ Spectacles & Vibes' },
  { value: 'The Creator Hub', label: '🎨 The Creator Hub' },
  { value: 'Quests & Escapes', label: '🧭 Quests & Escapes' },
  { value: 'Hidden Gems & Views', label: '💎 Hidden Gems & Views' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onApply,
  onReset,
}) => {
  const [tempMaxPrice, setTempMaxPrice] = useState(currentFilter.maxPrice);
  const [tempCategories, setTempCategories] = useState<string[]>(currentFilter.categories);

  useEffect(() => {
    if (isOpen) {
      setTempMaxPrice(currentFilter.maxPrice);
      setTempCategories(currentFilter.categories);
    }
  }, [isOpen, currentFilter]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    if (tempCategories.includes(cat)) {
      setTempCategories(tempCategories.filter((c) => c !== cat));
    } else {
      setTempCategories([...tempCategories, cat]);
    }
  };

  const handleApply = () => {
    onApply({
      maxPrice: tempMaxPrice,
      categories: tempCategories.length > 0 ? tempCategories : ALL_CATEGORIES.map((c) => c.value),
    });
    onClose();
  };

  const handleReset = () => {
    setTempMaxPrice(30);
    setTempCategories(ALL_CATEGORIES.map((c) => c.value));
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl transition-all max-h-[85vh] overflow-y-auto border border-slate-100">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" />

        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Filter Quests</h3>
            <p className="text-[11px] text-slate-400">Tailor quests by budget and category</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range Slider */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Base Admission
              </label>
              <span className="text-xs font-black px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                ${tempMaxPrice} CAD
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1.5">
              <span>$5</span>
              <span>$15</span>
              <span>$30</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Experience Categories
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = tempCategories.includes(cat.value);
                return (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-semibold text-xs">{cat.label}</span>
                    <span className="text-xs font-bold">
                      {isSelected ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md text-xs sm:text-sm transition active:scale-98 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

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
  { value: 'Outdoors & Nature', label: '🌲 Outdoors' },
  { value: 'Farm & Harvest', label: '🎃 Farm & Harvest' },
  { value: 'Wine & Cider', label: '🍷 Wine & Cider' },
  { value: 'Winter & Skating', label: '⛸️ Skating' },
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center md:items-center p-0 md:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl transition-all max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">Filter Quests</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Max Base Admission
              </label>
              <span className="text-sm font-black text-indigo-600">${tempMaxPrice} CAD</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
              <span>$5</span>
              <span>$15</span>
              <span>$30</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {ALL_CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <input
                    type="checkbox"
                    checked={tempCategories.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md text-sm transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { FilterState, SortOption } from '../types';

interface SearchBarAndFiltersProps {
  filterState: FilterState;
  onSearchChange: (val: string) => void;
  onOpenFilterModal: () => void;
  onSortChange: (option: SortOption) => void;
  onQuickCategory: (category: string) => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  onResetFilters: () => void;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  filterState,
  onSearchChange,
  onOpenFilterModal,
  onSortChange,
  onQuickCategory,
  activeFilterCount,
  totalFilteredCount,
  onResetFilters,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabelMap: Record<SortOption, string> = {
    recommended: 'Sort',
    'price-asc': 'Price ↑',
    'price-desc': 'Price ↓',
  };

  const categories = [
    { label: 'All', value: 'All' },
    { label: '🌲 Outdoors & Nature', value: 'Outdoors & Nature' },
    { label: '🎃 Farm & Harvest', value: 'Farm & Harvest' },
    { label: '🍷 Wine & Cider', value: 'Wine & Cider' },
    { label: '⛸️ Winter & Skating', value: 'Winter & Skating' },
  ];

  const isCategoryActive = (catVal: string) => {
    if (catVal === 'All') {
      return filterState.categories.length === 4;
    }
    return filterState.categories.length === 1 && filterState.categories[0] === catVal;
  };

  return (
    <section className="px-4 mb-4 relative z-20">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filterState.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests, orchards, regions, addresses..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Button */}
        <button
          onClick={onOpenFilterModal}
          title="Open Filters"
          className="relative px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center gap-1.5 transition text-xs font-bold border border-slate-200/80 active:scale-95 shrink-0"
        >
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort Button & Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen((prev) => !prev)}
            title="Sort Options"
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center gap-1.5 transition text-xs font-bold border border-slate-200/80 active:scale-95 shrink-0"
          >
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="hidden sm:inline">{sortLabelMap[filterState.sortBy]}</span>
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Sort By
              </div>
              <button
                onClick={() => {
                  onSortChange('recommended');
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
              >
                <span>Featured / Curated</span>
                {filterState.sortBy === 'recommended' && <span className="text-indigo-600 font-bold">✓</span>}
              </button>
              <button
                onClick={() => {
                  onSortChange('price-asc');
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
              >
                <span>Price: Low to High</span>
                {filterState.sortBy === 'price-asc' && <span className="text-indigo-600 font-bold">✓</span>}
              </button>
              <button
                onClick={() => {
                  onSortChange('price-desc');
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
              >
                <span>Price: High to Low</span>
                {filterState.sortBy === 'price-desc' && <span className="text-indigo-600 font-bold">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pt-3 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onQuickCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-full shrink-0 transition ${
              isCategoryActive(cat.value)
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Filter Status */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Showing {totalFilteredCount} quests</span>
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-indigo-600 font-bold hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </section>
  );
};

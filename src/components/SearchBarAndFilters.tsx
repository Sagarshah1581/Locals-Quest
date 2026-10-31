import React, { useState, useEffect, useRef } from 'react';
import { FilterState, SortOption } from '../types';

export type DisplayMode = 'rails' | 'grid';

interface SearchBarAndFiltersProps {
  filterState: FilterState;
  onSearchChange: (val: string) => void;
  onOpenFilterModal: () => void;
  onSortChange: (option: SortOption) => void;
  onQuickCategory: (category: string) => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  onResetFilters: () => void;
  displayMode?: DisplayMode;
  onToggleDisplayMode?: (mode: DisplayMode) => void;
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
  displayMode = 'rails',
  onToggleDisplayMode,
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
    recommended: 'Featured',
    'price-asc': 'Price: Low',
    'price-desc': 'Price: High',
  };

  const categories = [
    { label: 'All', value: 'All' },
    { label: '✨ Spectacles & Vibes', value: 'Spectacles & Vibes' },
    { label: '🎨 The Creator Hub', value: 'The Creator Hub' },
    { label: '🧭 Quests & Escapes', value: 'Quests & Escapes' },
    { label: '💎 Hidden Gems & Views', value: 'Hidden Gems & Views' },
  ];

  const isCategoryActive = (catVal: string) => {
    if (catVal === 'All') {
      return filterState.categories.length === 4;
    }
    return filterState.categories.length === 1 && filterState.categories[0] === catVal;
  };

  return (
    <section className="px-3 sm:px-6 mb-4 relative z-20">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filterState.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests, orchards, heritage trails, regions..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
          />
          <svg
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3.5 top-3 sm:top-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {filterState.search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full bg-slate-200/70 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter, Sort & Display Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Filter Button */}
          <button
            onClick={onOpenFilterModal}
            title="Open Filters"
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/90 text-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 transition text-xs font-bold border border-slate-200/80 active:scale-95 shrink-0 shadow-2xs cursor-pointer min-h-[42px]"
          >
            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Button & Dropdown */}
          <div className="relative flex-1 sm:flex-none" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              title="Sort Options"
              className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/90 text-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 transition text-xs font-bold border border-slate-200/80 active:scale-95 shrink-0 shadow-2xs cursor-pointer min-h-[42px]"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>{sortLabelMap[filterState.sortBy]}</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sort By
                </div>
                <button
                  onClick={() => {
                    onSortChange('recommended');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between transition cursor-pointer ${
                    filterState.sortBy === 'recommended' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Curated / Featured</span>
                  {filterState.sortBy === 'recommended' && <span>✓</span>}
                </button>
                <button
                  onClick={() => {
                    onSortChange('price-asc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between transition cursor-pointer ${
                    filterState.sortBy === 'price-asc' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Price: Low to High</span>
                  {filterState.sortBy === 'price-asc' && <span>✓</span>}
                </button>
                <button
                  onClick={() => {
                    onSortChange('price-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between transition cursor-pointer ${
                    filterState.sortBy === 'price-desc' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Price: High to Low</span>
                  {filterState.sortBy === 'price-desc' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Responsive Layout Toggle (Rails vs Grid) - visible on tablet & desktop */}
          {onToggleDisplayMode && (
            <div className="hidden md:flex bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/70 shrink-0">
              <button
                onClick={() => onToggleDisplayMode('rails')}
                title="Curated Rails View"
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  displayMode === 'rails'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden lg:inline text-[11px]">Rails</span>
              </button>
              <button
                onClick={() => onToggleDisplayMode('grid')}
                title="Catalog Grid View"
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  displayMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden lg:inline text-[11px]">Grid</span>
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
            className={`px-3.5 py-1.5 rounded-full shrink-0 transition-all duration-200 cursor-pointer ${
              isCategoryActive(cat.value)
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/90 text-slate-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Filter Status */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Showing {totalFilteredCount} verified quests</span>
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>
    </section>
  );
};

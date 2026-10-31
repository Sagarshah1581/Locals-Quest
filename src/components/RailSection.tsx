import React, { useRef } from 'react';
import { Experience } from '../types';
import { ExperienceRailCard } from './ExperienceCard';

interface RailSectionProps {
  title: string;
  category: string;
  items: Experience[];
  onSelect: (id: number) => void;
  onFilterCategory: (category: string) => void;
  savedIds?: number[];
  onToggleSave?: (id: number, e: React.MouseEvent) => void;
}

export const RailSection: React.FC<RailSectionProps> = ({
  title,
  category,
  items,
  onSelect,
  onFilterCategory,
  savedIds = [],
  onToggleSave,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-6 sm:mb-8 relative group/rail">
      <div className="px-3 sm:px-6 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{title}</span>
          </h2>
          <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {items.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Left/Right Navigation Chevrons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition cursor-pointer"
            >
              ›
            </button>
          </div>

          <button
            className="text-xs sm:text-sm text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition"
            onClick={() => onFilterCategory(category)}
          >
            See all →
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-3 sm:px-6 pb-2 scroll-smooth"
      >
        {items.map((item) => (
          <ExperienceRailCard
            key={item.id}
            experience={item}
            onSelect={onSelect}
            isSaved={savedIds.includes(item.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </section>
  );
};

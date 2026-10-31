import React from 'react';
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
  if (items.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="px-4 flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>{title}</span>
        </h2>
        <button
          className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition"
          onClick={() => onFilterCategory(category)}
        >
          See all →
        </button>
      </div>
      <div className="flex gap-3.5 overflow-x-auto hide-scrollbar px-4 pb-2">
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

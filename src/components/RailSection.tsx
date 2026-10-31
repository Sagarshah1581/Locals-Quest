import React from 'react';
import { Experience } from '../types';
import { ExperienceRailCard } from './ExperienceCard';

interface RailSectionProps {
  title: string;
  category: string;
  items: Experience[];
  onSelect: (id: number) => void;
  onFilterCategory: (category: string) => void;
}

export const RailSection: React.FC<RailSectionProps> = ({
  title,
  category,
  items,
  onSelect,
  onFilterCategory,
}) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-5">
      <div className="px-4 flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>{title}</span>
        </h2>
        <span
          className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
          onClick={() => onFilterCategory(category)}
        >
          See category
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
        {items.map((item) => (
          <ExperienceRailCard key={item.id} experience={item} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { Experience } from '../types';

interface ExperienceRailCardProps {
  experience: Experience;
  onSelect: (id: number) => void;
}

export const ExperienceRailCard: React.FC<ExperienceRailCardProps> = ({ experience, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(experience.id)}
      className="min-w-[185px] max-w-[185px] bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col shrink-0"
    >
      <div className="h-28 w-full bg-slate-200 relative overflow-hidden">
        <img
          src={experience.images[0]}
          className="w-full h-full object-cover"
          alt={experience.event_name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400';
          }}
        />
        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {experience.base_price_cad}
        </span>
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide block truncate">
            {experience.host_business_name}
          </span>
          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{experience.event_name}</h4>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">📍 {experience.location_region}</p>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-slate-900">{experience.base_price_cad}</span>
          <span className="text-[10px] text-indigo-600 font-bold hover:underline">Details →</span>
        </div>
      </div>
    </div>
  );
};

interface ExperienceListItemProps {
  experience: Experience;
  onSelect: (id: number) => void;
}

export const ExperienceListItem: React.FC<ExperienceListItemProps> = ({ experience, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(experience.id)}
      className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition cursor-pointer shadow-sm"
    >
      <img
        src={experience.images[0]}
        className="w-20 h-20 rounded-xl object-cover shrink-0"
        alt={experience.event_name}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200';
        }}
      />
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600">{experience.category}</span>
            <span className="text-xs font-black text-slate-900">{experience.base_price_cad}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">{experience.event_name}</h4>
          <p className="text-[11px] text-slate-500 font-medium truncate">{experience.host_business_name}</p>
          <p className="text-[10px] text-slate-400 truncate">📍 {experience.exact_address}</p>
        </div>
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-50">
          <span className="text-[10px] text-emerald-600 font-bold">✓ {experience.target_demographic}</span>
          <span className="text-xs font-bold text-indigo-600">View Details →</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Experience } from '../types';
import { getCategoryTheme } from '../utils/categoryTheme';
import { GoogleRatingBadge } from './GoogleRatingBadge';

interface ExperienceRailCardProps {
  experience: Experience;
  onSelect: (id: number) => void;
  isSaved?: boolean;
  onToggleSave?: (id: number, e: React.MouseEvent) => void;
}

export const ExperienceRailCard: React.FC<ExperienceRailCardProps> = ({
  experience,
  onSelect,
  isSaved = false,
  onToggleSave,
}) => {
  const theme = getCategoryTheme(experience.category);

  return (
    <div
      onClick={() => onSelect(experience.id)}
      className="min-w-[200px] max-w-[200px] bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col shrink-0 group select-none"
    >
      <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
        <img
          src={experience.images[0]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={experience.event_name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400';
          }}
        />
        {/* Google Review Badge overlay */}
        <div className="absolute top-2.5 left-2.5">
          <GoogleRatingBadge
            rating={experience.google_rating}
            reviewCount={experience.google_reviews_count}
            size="xs"
            theme="glass"
          />
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(experience.id, e)}
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-xs shadow-sm transition active:scale-90"
              title={isSaved ? 'Remove from saved' : 'Save quest'}
            >
              <span className={isSaved ? 'text-amber-500' : 'text-slate-400'}>
                {isSaved ? '★' : '☆'}
              </span>
            </button>
          )}
          <span className="bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
            {experience.base_price_cad}
          </span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeClass}`}>
              <span>{theme.icon}</span>
              <span className="truncate">{theme.shortLabel}</span>
            </span>
            <GoogleRatingBadge
              rating={experience.google_rating}
              reviewCount={experience.google_reviews_count}
              size="xs"
            />
          </div>
          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5 group-hover:text-indigo-600 transition">
            {experience.event_name}
          </h4>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{experience.host_business_name}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">📍 {experience.location_region}</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900">{experience.base_price_cad}</span>
          <span className="text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
};

interface ExperienceListItemProps {
  experience: Experience;
  onSelect: (id: number) => void;
  isSaved?: boolean;
  onToggleSave?: (id: number, e: React.MouseEvent) => void;
}

export const ExperienceListItem: React.FC<ExperienceListItemProps> = ({
  experience,
  onSelect,
  isSaved = false,
  onToggleSave,
}) => {
  const theme = getCategoryTheme(experience.category);

  return (
    <div
      onClick={() => onSelect(experience.id)}
      className="group flex gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer shadow-sm relative select-none"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <img
          src={experience.images[0]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={experience.event_name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200';
          }}
        />
        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(experience.id, e)}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-xs shadow-sm transition active:scale-90"
            title={isSaved ? 'Remove from saved' : 'Save quest'}
          >
            <span className={isSaved ? 'text-amber-500' : 'text-slate-400'}>
              {isSaved ? '★' : '☆'}
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeClass} shrink-0`}>
              <span>{theme.icon}</span>
              <span>{theme.shortLabel}</span>
            </span>
            <span className="text-xs font-black text-slate-900 shrink-0">{experience.base_price_cad}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-snug truncate mt-0.5 group-hover:text-indigo-600 transition">
            {experience.event_name}
          </h4>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{experience.host_business_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <GoogleRatingBadge
              rating={experience.google_rating}
              reviewCount={experience.google_reviews_count}
              size="xs"
            />
            <span className="text-[10px] text-slate-400 truncate">📍 {experience.exact_address}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="text-emerald-500">✓</span>
            <span>{experience.target_demographic}</span>
          </span>
          <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

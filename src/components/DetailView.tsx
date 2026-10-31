import React, { useState } from 'react';
import { Experience } from '../types';
import { getCategoryTheme } from '../utils/categoryTheme';
import { GoogleRatingBadge } from './GoogleRatingBadge';

interface DetailViewProps {
  experience: Experience;
  onViewOnMap: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: number, e: React.MouseEvent) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  experience,
  onViewOnMap,
  isSaved = false,
  onToggleSave,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const theme = getCategoryTheme(experience.category);

  const nextSlide = () => {
    setPhotoIndex((prev) => (prev + 1) % experience.images.length);
  };

  const prevSlide = () => {
    setPhotoIndex((prev) => (prev - 1 + experience.images.length) % experience.images.length);
  };

  return (
    <main className="flex-1 flex flex-col pb-8">
      {/* Immersive Photo Carousel */}
      <div className="relative bg-slate-950 h-72 sm:h-80 overflow-hidden group select-none">
        <div
          className="h-full flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${photoIndex * 100}%)` }}
        >
          {experience.images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 relative">
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`${experience.event_name} view ${i + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />
              {i > 0 && (
                <span className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                  Photo {i + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Save Toggle Floating Button */}
        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(experience.id, e)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-sm shadow-md transition active:scale-90"
            title={isSaved ? 'Remove from saved' : 'Save quest'}
          >
            <span className={isSaved ? 'text-amber-500' : 'text-slate-600'}>
              {isSaved ? '★' : '☆'}
            </span>
          </button>
        )}

        {experience.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition z-10 font-bold"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition z-10 font-bold"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              {experience.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === photoIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {/* Category & Title */}
          <div>
            <div className="mb-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${theme.badgeClass}`}>
                <span>{theme.icon}</span>
                <span>{experience.category}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {experience.event_name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <GoogleRatingBadge
                rating={experience.google_rating}
                reviewCount={experience.google_reviews_count}
                size="sm"
                showReviewWord
              />
              <span className="text-slate-300">·</span>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <span>Organized by:</span>
                <strong className="text-slate-700 font-bold">{experience.host_business_name}</strong>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Quest Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {experience.description}
            </p>
          </div>

          {/* Uniqueness Factor Highlight */}
          <div className="mt-5 bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/60 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold mb-1.5">
              <span>✨</span>
              <span>What Makes This Quest Unique</span>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed font-medium">
              {experience.uniqueness_factor}
            </p>
          </div>

          {/* Metadata Specs Grid */}
          <div className="mt-5 bg-slate-50/90 border border-slate-200/70 rounded-2xl p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
                Target Audience
              </span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                {experience.target_demographic}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
                Seasonality & Hours
              </span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                {experience.seasonality}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
                Base Admission
              </span>
              <span className="font-extrabold text-indigo-600 text-sm mt-0.5 block">
                {experience.base_price_cad} CAD
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
                Region
              </span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                {experience.location_region}
              </span>
            </div>
          </div>

          {/* Google Reviews Card */}
          <div className="mt-5">
            <GoogleRatingBadge
              rating={experience.google_rating}
              reviewCount={experience.google_reviews_count}
              size="lg"
            />
          </div>

          {/* Exact Address Pin & Directions */}
          <div className="mt-5 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-sm">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Exact Quest Location
              </span>
              <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">
                {experience.exact_address}
              </p>
              <button
                onClick={onViewOnMap}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold mt-2 inline-flex items-center gap-1 transition cursor-pointer"
              >
                <span>View on Interactive Map</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Group Discounts & Policies */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Discounts, Youth & Member Perks
            </h4>
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl leading-relaxed">
              {experience.group_discount_data}
            </div>
          </div>
        </div>

        {/* Modern Sticky Bottom CTA Bar */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-4">
          <div className="shrink-0">
            <span className="text-[11px] text-slate-400 block font-medium">Standard Admission</span>
            <span className="text-2xl font-black text-slate-900">{experience.base_price_cad}</span>
          </div>

          <a
            href={experience.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-slate-900/15 transition-all text-center text-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Book / Check Details</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
};

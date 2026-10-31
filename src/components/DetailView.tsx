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
    <main className="flex-1 flex flex-col pb-12 animate-in fade-in duration-200">
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Responsive Grid on Tablet & Desktop */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: Gallery & Editorial Narrative                     */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Immersive Photo Carousel & Gallery */}
            <div className="relative bg-slate-950 rounded-2xl sm:rounded-3xl h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden group select-none shadow-lg">
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
                        Photo {i + 1} of {experience.images.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Save Toggle Floating Button */}
              {onToggleSave && (
                <button
                  onClick={(e) => onToggleSave(experience.id, e)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-sm shadow-md transition active:scale-90 cursor-pointer"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition z-10 font-bold text-lg cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition z-10 font-bold text-lg cursor-pointer"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {experience.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Go to photo ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          i === photoIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip (Tablet & Desktop) */}
            {experience.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
                {experience.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      photoIndex === i
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Organization Header */}
            <div>
              <div className="mb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${theme.badgeClass}`}>
                  <span>{theme.icon}</span>
                  <span>{experience.category}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {experience.event_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
                <GoogleRatingBadge
                  rating={experience.google_rating}
                  reviewCount={experience.google_reviews_count}
                  size="sm"
                  showReviewWord
                />
                <span className="text-slate-300">·</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                  <span>Organized by:</span>
                  <strong className="text-slate-700 font-bold">{experience.host_business_name}</strong>
                </p>
              </div>
            </div>

            {/* Quest Overview Narrative */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <span>📖</span>
                <span>Quest Overview</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {experience.description}
              </p>
            </div>

            {/* Uniqueness Factor Highlight */}
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-bold mb-2">
                <span className="text-base">✨</span>
                <span>What Makes This Quest Standout</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed font-medium">
                {experience.uniqueness_factor}
              </p>
            </div>

            {/* Group Discounts & Perks */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🎟️</span>
                <span>Discounts, Youth & Member Perks</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {experience.group_discount_data}
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Sticky Booking & Spec Sidebar                    */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 mt-6 lg:mt-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Booking Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Admission Price
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">{experience.base_price_cad}</span>
                    <span className="text-xs font-bold text-slate-500">CAD / person</span>
                  </div>
                </div>
                <GoogleRatingBadge
                  rating={experience.google_rating}
                  reviewCount={experience.google_reviews_count}
                  size="sm"
                />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Audience</span>
                  <strong className="text-slate-800 font-bold block mt-0.5 truncate">
                    {experience.target_demographic}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Region</span>
                  <strong className="text-slate-800 font-bold block mt-0.5 truncate">
                    {experience.location_region}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Seasonality & Hours</span>
                <strong className="text-slate-800 font-bold block mt-0.5">
                  {experience.seasonality}
                </strong>
              </div>

              {/* Exact Address Pin */}
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 flex items-start gap-2.5">
                <span className="text-base">📍</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Exact Location</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{experience.exact_address}</p>
                  <button
                    onClick={onViewOnMap}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold mt-1.5 inline-flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>View Pin on Interactive Map</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Primary Booking Button */}
              <a
                href={experience.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-slate-900/15 transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2 group cursor-pointer"
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

              <p className="text-[11px] text-slate-400 text-center font-medium">
                Direct booking through official host website · Best rate guarantee
              </p>
            </div>

            {/* Google Reviews Card in Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <GoogleRatingBadge
                rating={experience.google_rating}
                reviewCount={experience.google_reviews_count}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

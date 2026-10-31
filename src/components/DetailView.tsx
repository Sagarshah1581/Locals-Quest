import React, { useState } from 'react';
import { Experience } from '../types';

interface DetailViewProps {
  experience: Experience;
  onViewOnMap: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ experience, onViewOnMap }) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextSlide = () => {
    setPhotoIndex((prev) => (prev + 1) % experience.images.length);
  };

  const prevSlide = () => {
    setPhotoIndex((prev) => (prev - 1 + experience.images.length) % experience.images.length);
  };

  return (
    <main className="flex-1 flex flex-col pb-8">
      {/* Photo Carousel */}
      <div className="relative bg-slate-900 h-64 overflow-hidden group">
        <div
          className="h-full flex transition-transform duration-300"
          style={{ transform: `translateX(-${photoIndex * 100}%)` }}
        >
          {experience.images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 relative">
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`${experience.event_name} photo ${i + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                }}
              />
              {i > 0 && (
                <span className="absolute top-3 left-3 bg-indigo-900/80 backdrop-blur-md text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  ✨ AI Visual
                </span>
              )}
            </div>
          ))}
        </div>

        {experience.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition z-10 font-bold"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition z-10 font-bold"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {experience.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === photoIndex ? 'bg-white w-5' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Host */}
          <div className="mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase">
              {experience.category}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1 leading-snug">{experience.event_name}</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Host: {experience.host_business_name}
            </p>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Quest Details:</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{experience.description}</p>
          </div>

          {/* Uniqueness Factor Highlight */}
          <div className="mt-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
              <span>✨ What Makes This Quest Unique</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">{experience.uniqueness_factor}</p>
          </div>

          {/* Metadata Box */}
          <div className="mt-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-2 gap-3.5 text-sm">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Target Demographic</span>
              <span className="font-bold text-slate-800 text-xs">{experience.target_demographic}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Seasonality & Hours</span>
              <span className="font-bold text-slate-800 text-xs">{experience.seasonality}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Base Price (CAD)</span>
              <span className="font-bold text-indigo-600 text-sm">{experience.base_price_cad}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Region</span>
              <span className="font-bold text-slate-800 text-xs">{experience.location_region}</span>
            </div>
          </div>

          {/* Exact Address Pin & Directions */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <span className="text-base mt-0.5">📍</span>
            <div className="flex-1">
              <span className="text-[11px] text-slate-400 font-bold block uppercase">Exact Quest Location</span>
              <p className="text-xs font-bold text-slate-800 leading-tight">{experience.exact_address}</p>
              <button
                onClick={onViewOnMap}
                className="text-xs text-indigo-600 font-bold mt-1 inline-flex items-center gap-1 hover:underline"
              >
                View on Interactive Map →
              </button>
            </div>
          </div>

          {/* Group Discounts & Policies */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Discounts & Member Perks:
            </h4>
            <p className="text-xs text-slate-600 bg-slate-100 p-3 rounded-xl leading-relaxed">
              {experience.group_discount_data}
            </p>
          </div>
        </div>

        {/* CTA: [ Check Details ] */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
          <div className="shrink-0">
            <span className="text-[11px] text-slate-400 block font-medium">Admission</span>
            <span className="text-xl font-black text-slate-900">{experience.base_price_cad}</span>
          </div>

          <a
            href={experience.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition text-center text-sm flex items-center justify-center gap-1.5 group"
          >
            <span>Check Details</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
};

import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import { GoogleRatingBadge } from './GoogleRatingBadge';

interface PromoCarouselProps {
  experiences: Experience[];
  onSelectExperience: (id: number) => void;
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ experiences, onSelectExperience }) => {
  const featured = experiences.filter((e) => e.featured);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  return (
    <section className="px-3 sm:px-6 py-3">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[400px] border border-slate-200/50 group select-none">
        <div
          className="h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featured.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectExperience(item.id)}
              className="w-full h-full flex-shrink-0 relative cursor-pointer"
            >
              <img
                src={item.images[0]}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.72]"
                alt={item.event_name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                }}
              />
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent">
                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                  {item.promoTag && (
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                      {item.promoTag}
                    </span>
                  )}
                  <GoogleRatingBadge
                    rating={item.google_rating}
                    reviewCount={item.google_reviews_count}
                    size="xs"
                    theme="glass"
                  />
                  <span className="text-white/40 text-xs hidden sm:inline">·</span>
                  <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug drop-shadow-sm text-white max-w-3xl">
                  {item.event_name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 sm:line-clamp-2 max-w-2xl mt-1 hidden sm:block font-normal text-slate-200/90">
                  {item.description}
                </p>

                <div className="text-xs sm:text-sm text-slate-300 mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 font-medium">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{item.location_region}</span>
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
                    {item.base_price_cad} CAD
                  </span>
                  <span className="text-slate-500 hidden md:inline">·</span>
                  <span className="text-[11px] sm:text-xs text-slate-400 hidden md:inline">
                    {item.target_demographic}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous / Next Chevron Overlays */}
        <button
          onClick={handlePrev}
          aria-label="Previous featured quest"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xl font-bold cursor-pointer"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          aria-label="Next featured quest"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xl font-bold cursor-pointer"
        >
          ›
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-3.5 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/40 w-1.5 sm:w-2 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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
    <section className="px-4 py-3">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 h-60 border border-slate-200/50 group select-none">
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
              <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  {item.promoTag && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {item.promoTag}
                    </span>
                  )}
                  <GoogleRatingBadge
                    rating={item.google_rating}
                    reviewCount={item.google_reviews_count}
                    size="xs"
                    theme="glass"
                  />
                </div>
                <h3 className="text-xl font-extrabold leading-snug drop-shadow-sm text-white">
                  {item.event_name}
                </h3>
                <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-2 font-medium">
                  <span>📍 {item.location_region}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-bold">{item.base_price_cad} CAD</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous / Next Chevron Overlays */}
        <button
          onClick={handlePrev}
          aria-label="Previous featured quest"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          aria-label="Next featured quest"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ›
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-3.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

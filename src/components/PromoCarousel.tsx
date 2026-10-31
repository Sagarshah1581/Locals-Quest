import React, { useState, useEffect } from 'react';
import { Experience } from '../types';

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
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  return (
    <section className="p-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg h-56">
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
                className="w-full h-full object-cover brightness-[0.65]"
                alt={item.event_name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                }}
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent">
                {item.promoTag && (
                  <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500 text-white w-max mb-1.5">
                    {item.promoTag}
                  </span>
                )}
                <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{item.event_name}</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 truncate">
                  <span>📍 {item.location_region}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{item.base_price_cad} CAD</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-5' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

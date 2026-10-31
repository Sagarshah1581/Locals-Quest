import React from 'react';

export const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const StarIcon: React.FC<{ filled?: boolean; className?: string }> = ({
  filled = true,
  className = 'w-3 h-3',
}) => (
  <svg
    className={`${className} ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface GoogleRatingBadgeProps {
  rating?: number;
  reviewCount?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'glass';
  className?: string;
  showReviewWord?: boolean;
}

export const GoogleRatingBadge: React.FC<GoogleRatingBadgeProps> = ({
  rating = 4.7,
  reviewCount = 380,
  size = 'sm',
  theme = 'light',
  className = '',
  showReviewWord = false,
}) => {
  const formattedRating = Number(rating).toFixed(1);
  const formattedCount = reviewCount ? reviewCount.toLocaleString() : '380';

  if (size === 'xs') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
          theme === 'glass'
            ? 'bg-slate-900/75 backdrop-blur-md text-white border border-white/10'
            : theme === 'dark'
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
        } ${className}`}
        title={`Google rating: ${formattedRating} (${formattedCount} reviews)`}
      >
        <GoogleGIcon className="w-2.5 h-2.5 shrink-0" />
        <span className="text-amber-500 font-extrabold text-[10px]">★</span>
        <span className="font-extrabold">{formattedRating}</span>
        <span className="text-slate-400 font-medium text-[9px]">({formattedCount})</span>
      </span>
    );
  }

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-shadow ${
          theme === 'glass'
            ? 'bg-slate-950/80 backdrop-blur-md text-white border border-white/15 shadow-sm'
            : theme === 'dark'
            ? 'bg-slate-900 text-white border border-slate-800'
            : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
        } ${className}`}
        title={`Google rating: ${formattedRating} from ${formattedCount} verified reviews`}
      >
        <GoogleGIcon className="w-3 h-3 shrink-0" />
        <span className="text-amber-500 font-black text-xs leading-none">★</span>
        <span className="font-extrabold text-slate-900">{formattedRating}</span>
        <span className="text-slate-500 font-medium text-[10px]">
          ({formattedCount}{showReviewWord ? ' reviews' : ''})
        </span>
      </span>
    );
  }

  if (size === 'md') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-semibold ${
          theme === 'glass'
            ? 'bg-slate-950/85 backdrop-blur-md text-white border border-white/20'
            : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
        } ${className}`}
      >
        <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-slate-900 text-sm">{formattedRating}</span>
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-3 h-3" filled={i < Math.floor(rating)} />
            ))}
          </div>
        </div>
        <span className="text-slate-500 text-[11px] font-medium">
          ({formattedCount} Google reviews)
        </span>
      </div>
    );
  }

  // Large Detailed Card (ideal for DetailView & Knowledge Panel)
  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white to-slate-50/70 border-slate-200/90 shadow-xs'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white shadow-2xs border border-slate-100 flex items-center justify-center shrink-0">
            <GoogleGIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-900 block leading-tight">
              Google Reviews
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Verified Local Rating
            </span>
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
          Google Maps
        </span>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formattedRating}
          </span>
          <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="w-3.5 h-3.5"
                filled={i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5)}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            Based on <strong className="font-bold text-slate-700">{formattedCount}</strong> ratings
          </span>
        </div>
      </div>
    </div>
  );
};

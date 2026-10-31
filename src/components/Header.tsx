import React, { useState } from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        {/* Back button */}
        {currentView === 'detail' && (
          <button
            onClick={() => onNavigate('list')}
            aria-label="Back to discovery list"
            className="mr-2 p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}

        {/* Logo & Tagline */}
        <div className="flex-1 cursor-pointer" onClick={() => onNavigate('list')}>
          <h1 className="text-xl font-black tracking-tight text-indigo-600 flex items-center gap-1.5">
            <span>Local's Quest</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Discover your next quest</p>
        </div>

        {/* Location Pill & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 transition"
            title="Center Map"
          >
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Ontario, CA</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            A
          </div>

          <button
            onClick={() => setShowInfoModal(true)}
            aria-label="Directory info"
            className="p-1 text-slate-600 hover:text-slate-900 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Directory Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>📍</span>
                <span>Local's Quest Directory</span>
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Curated Regional Experiences:</strong> Hand-picked activities across Halton, Peel, Durham, and Niagara.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Exact Address Pinpoint:</strong> Verified street addresses mapped with interactive teardrop markers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Verified Seasonal Data:</strong> Up-to-date hours, discounts, family policies, and direct booking links.</span>
              </li>
            </ul>
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

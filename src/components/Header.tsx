import React, { useState } from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  savedCount?: number;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  savedCount = 0,
  userEmail = null,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (view: ViewMode) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-xl flex items-center justify-between transition-colors shadow-2xs"
      style={{
        backgroundColor: 'var(--header-bg-custom, rgba(255, 255, 255, 0.95))',
        borderColor: 'var(--border-theme-custom, rgba(226, 232, 240, 0.8))',
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back button (shows when not on list) */}
        {currentView !== 'list' && (
          <button
            onClick={() => onNavigate('list')}
            aria-label="Back to discovery list"
            className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100/80 text-slate-700 transition active:scale-95 cursor-pointer shrink-0"
            title="Back to Quests"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}

        {/* Logo & Tagline */}
        <div className="cursor-pointer select-none group" onClick={() => onNavigate('list')}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <polygon points="12,6 15,12 12,14 9,12" fill="currentColor" stroke="none" />
                <polygon points="12,18 9,12 12,10 15,12" fill="white" stroke="none" opacity="0.6" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-theme-primary transition-colors leading-none">
                Locals' Quest
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-normal mt-0.5 hidden xs:block sm:block">
                Discover your next experience near by
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Map pill button on mobile/tablet */}
        <button
          onClick={() => onNavigate('map')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition active:scale-95 border cursor-pointer ${
            currentView === 'map'
              ? 'bg-theme-primary text-white border-transparent'
              : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border-slate-200/50'
          }`}
          title="Interactive Map"
        >
          <svg className="w-3.5 h-3.5 text-current shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden xs:inline sm:inline">Ontario, CA</span>
          <span className="inline xs:hidden sm:hidden">ON</span>
        </button>

        {/* Saved count badge */}
        {savedCount > 0 && (
          <button
            onClick={() => onNavigate('profile')}
            title={`${savedCount} saved quests in your profile`}
            className="text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-full flex items-center gap-1 transition cursor-pointer"
          >
            <span>★</span>
            <span>{savedCount}</span>
            <span className="hidden lg:inline text-[10px] font-semibold text-amber-700">Saved</span>
          </button>
        )}

        {/* Profile Circle (Navigates to Profile) */}
        <button
          onClick={() => onNavigate('profile')}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-sm select-none transition cursor-pointer shrink-0 ${
            currentView === 'profile'
              ? 'bg-theme-primary text-white ring-2 ring-blue-300'
              : userEmail
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          title={userEmail ? `Signed in as ${userEmail}` : 'Open Profile / Login with Google'}
        >
          {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
        </button>

        {/* Menu Drawer Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Navigation Menu"
            className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer ${
              isMenuOpen ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menu Dropdown - Clean and responsive */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Menu
              </div>

              {/* Contact Us & Inquiries */}
              <button
                onClick={() => handleMenuClick('contact')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-50 transition cursor-pointer ${
                  currentView === 'contact' ? 'text-theme-primary font-bold bg-theme-light' : 'text-slate-700'
                }`}
              >
                <span>✉️</span>
                <span>Contact Us & Inquiries</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              {/* Admin Portal */}
              <button
                onClick={() => handleMenuClick('admin')}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-purple-50 transition cursor-pointer ${
                  currentView === 'admin' ? 'text-purple-700 font-bold bg-purple-50' : 'text-purple-700'
                }`}
              >
                <span>🔐</span>
                <div className="flex items-center gap-1.5">
                  <span>Admin Portal</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                    Staff
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

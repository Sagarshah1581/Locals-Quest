import React, { useState } from 'react';
import { UserProfile, Experience } from '../types';
import { GoogleRatingBadge } from './GoogleRatingBadge';

interface ProfileViewProps {
  user: UserProfile | null;
  onLoginWithGoogle: () => void;
  onLoginWithEmail: (email: string, name: string) => void;
  onLogout: () => void;
  savedExperiences: Experience[];
  onSelectExperience: (id: number) => void;
  onRemoveSaved: (id: number, e: React.MouseEvent) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onLoginWithGoogle,
  onLoginWithEmail,
  onLogout,
  savedExperiences,
  onSelectExperience,
  onRemoveSaved,
}) => {
  const [isEmailForm, setIsEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onLoginWithEmail(emailInput, nameInput.trim() || 'Explorer');
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
          User Account
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explorer Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Save your favorite regional quests, customize travel notifications, and manage your account.
        </p>
      </div>

      {!user ? (
        /* Not logged in: Show Google Sign-in / Sign-up */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto w-full">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner mb-4">
            🧭
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            Sign In to Locals' Quest
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Access your saved orchards, seasonal festival reminders, and personalized Ontario itineraries across devices.
          </p>

          {/* Google Sign-in Primary Button */}
          <div className="max-w-sm mx-auto space-y-3">
            <button
              onClick={onLoginWithGoogle}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span className="text-xs sm:text-sm">Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {!isEmailForm ? (
              <button
                onClick={() => setIsEmailForm(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-2xl text-xs transition cursor-pointer"
              >
                Sign in with Email
              </button>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Sagar Shah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEmailForm(false)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Benefits */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-base block mb-1">⭐</span>
              <strong className="text-xs text-slate-800 block">Saved Quests</strong>
              <p className="text-[11px] text-slate-500 mt-0.5">Collect places to visit later.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-base block mb-1">🔔</span>
              <strong className="text-xs text-slate-800 block">Season Alerts</strong>
              <p className="text-[11px] text-slate-500 mt-0.5">Harvest and lighting date updates.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-base block mb-1">🎟️</span>
              <strong className="text-xs text-slate-800 block">Member Perks</strong>
              <p className="text-[11px] text-slate-500 mt-0.5">Discount codes and off-peak tips.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In View - Responsive Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* User Card (4 cols on desktop) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-extrabold text-slate-900 truncate">{user.name}</h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shrink-0">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <p className="text-[11px] text-indigo-600 font-semibold capitalize mt-0.5">
                  via {user.provider}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Saved Quests:</span>
                <strong className="text-slate-900 font-bold">{savedExperiences.length}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member Since:</span>
                <strong className="text-slate-900 font-bold">{user.memberSince}</strong>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200/70 cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/* Saved Quests Section (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>★</span>
                  <span>My Saved Experiences</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {savedExperiences.length} experiences bookmarked
                </p>
              </div>
            </div>

            {savedExperiences.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <span className="text-4xl block">☆</span>
                <p className="text-sm font-semibold text-slate-600">No saved experiences yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Browse the discovery list and click the star (★) to save quests here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {savedExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => onSelectExperience(exp.id)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 transition cursor-pointer flex gap-3 relative group"
                  >
                    <img
                      src={exp.images[0]}
                      alt={exp.event_name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider truncate">
                            {exp.category}
                          </span>
                          <GoogleRatingBadge
                            rating={exp.google_rating}
                            reviewCount={exp.google_reviews_count}
                            size="xs"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {exp.event_name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">📍 {exp.location_region}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                        <span className="text-xs font-extrabold text-slate-900">{exp.base_price_cad}</span>
                        <button
                          onClick={(e) => onRemoveSaved(exp.id, e)}
                          className="text-[11px] text-slate-400 hover:text-rose-500 font-bold px-2 py-0.5 rounded transition"
                          title="Remove from saved"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

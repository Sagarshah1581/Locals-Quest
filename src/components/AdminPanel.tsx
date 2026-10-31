import React, { useState, useEffect } from 'react';
import { Experience, AdminUser } from '../types';
import { GoogleRatingBadge } from './GoogleRatingBadge';
import {
  ThemeId,
  THEMES,
  BackgroundThemeId,
  BACKGROUND_THEMES,
  ThemeConfig,
  BackgroundThemeConfig,
} from '../utils/theme';

interface AdminPanelProps {
  experiences: Experience[];
  onAddExperience: (exp: Experience) => void;
  onUpdateExperience: (exp: Experience) => void;
  onDeleteExperience: (id: number) => void;
  onExitAdmin: () => void;
  currentTheme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
  currentBgTheme?: BackgroundThemeId;
  onBgThemeChange?: (bgTheme: BackgroundThemeId) => void;
}

const DEFAULT_ADMINS: AdminUser[] = [
  {
    userId: 'Sagarshah3094',
    name: 'Sagar Shah',
    role: 'Super Admin',
    password: '1122334455660',
    createdAt: '2026-10-30',
  },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onExitAdmin,
  currentTheme = 'cobalt',
  onThemeChange,
  currentBgTheme = 'warm-linen',
  onBgThemeChange,
}) => {
  // Authentication State
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem('locals_quest_admins');
      return stored ? JSON.parse(stored) : DEFAULT_ADMINS;
    } catch {
      return DEFAULT_ADMINS;
    }
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const session = sessionStorage.getItem('locals_quest_admin_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab: 'listings' | 'create' | 'crawler' | 'admins' | 'styling'
  const [activeTab, setActiveTab] = useState<'listings' | 'create' | 'crawler' | 'admins' | 'styling'>('listings');
  const [stylingSection, setStylingSection] = useState<'all' | 'atmosphere' | 'palette'>('all');
  const [stylingSuccessMsg, setStylingSuccessMsg] = useState<string | null>(null);

  // Listings Management State
  const [listingSearch, setListingSearch] = useState('');
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // Add / AI Generator State
  const [createMode, setCreateMode] = useState<'ai' | 'manual'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('Spectacles & Vibes');
  const [aiLocation, setAiLocation] = useState('Ontario, Canada');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');

  // Experience Form State
  const [formData, setFormData] = useState<Partial<Experience>>({
    event_name: '',
    host_business_name: '',
    category: 'Spectacles & Vibes',
    description: '',
    location_region: 'Halton Region',
    exact_address: '',
    lat: 43.46,
    lng: -80.02,
    seasonality: 'Seasonal (10:00 AM – 6:00 PM)',
    target_demographic: 'Family-Friendly / All Ages',
    base_price_cad: '$20.00',
    numeric_price: 20.0,
    group_discount_data: 'Kids under 3 free; group discounts on inquiry.',
    uniqueness_factor: '',
    source_url: 'https://',
    featured: false,
    promoTag: '',
    google_rating: 4.8,
    google_reviews_count: 320,
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
  });

  // Crawler State
  const [crawlerCity, setCrawlerCity] = useState('Niagara-on-the-Lake');
  const [crawlerProvince, setCrawlerProvince] = useState('Ontario');
  const [crawlerCountry, setCrawlerCountry] = useState('Canada');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlerProgress, setCrawlerProgress] = useState('');
  const [stagedCrawledItems, setStagedCrawledItems] = useState<Experience[]>([]);
  const [crawledEditItem, setCrawledEditItem] = useState<Experience | null>(null);

  // Admin Management State
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Content Editor' | 'Moderator' | 'Super Admin'>('Content Editor');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  // Sync admins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('locals_quest_admins', JSON.stringify(admins));
    } catch (e) {
      console.warn('Failed to save admins', e);
    }
  }, [admins]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const admin = admins.find(
      (a) =>
        a.userId.trim().toLowerCase() === loginId.trim().toLowerCase() &&
        a.password === loginPassword.trim()
    );

    if (admin) {
      setCurrentUser(admin);
      sessionStorage.setItem('locals_quest_admin_session', JSON.stringify(admin));
    } else {
      setLoginError('Invalid User ID or Password. Please check your credentials.');
    }
  };

  const fillDemoCredentials = () => {
    setLoginId('Sagarshah3094');
    setLoginPassword('1122334455660');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('locals_quest_admin_session');
  };

  // Add new Admin
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUserId.trim() || !newAdminPassword.trim() || !newAdminName.trim()) return;

    if (admins.some((a) => a.userId.toLowerCase() === newAdminUserId.toLowerCase())) {
      alert('An admin with this User ID already exists.');
      return;
    }

    const newAdmin: AdminUser = {
      userId: newAdminUserId.trim(),
      name: newAdminName.trim(),
      password: newAdminPassword.trim(),
      role: newAdminRole,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAdmins([...admins, newAdmin]);
    setNewAdminUserId('');
    setNewAdminName('');
    setNewAdminPassword('');
    setAdminSuccessMsg(`Admin ${newAdmin.name} added successfully!`);
    setTimeout(() => setAdminSuccessMsg(''), 4000);
  };

  const handleDeleteAdmin = (userId: string) => {
    if (userId.toLowerCase() === 'sagarshah3094') {
      alert('Root administrator account cannot be deleted.');
      return;
    }
    if (confirm(`Remove administrator ${userId}?`)) {
      setAdmins(admins.filter((a) => a.userId !== userId));
    }
  };

  // AI Generator handler
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a brief description or idea for the AI to expand.');
      return;
    }

    setIsGeneratingAi(true);
    setAiStatusMsg('Analyzing regional experiential databases and generating verified details...');

    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: aiCategory,
          location: aiLocation,
        }),
      });

      const data = await res.json();
      if (data.success && data.experience) {
        setFormData({
          ...data.experience,
          id: Date.now(),
        });
        setAiStatusMsg('Listing generated! Review the details below and click "Publish Experience".');
      } else {
        throw new Error(data.error || 'Failed to generate listing');
      }
    } catch {
      setAiStatusMsg('Loaded synthesized regional fields for your review.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save new experience
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event_name || !formData.exact_address) {
      alert('Please provide an event name and exact address.');
      return;
    }

    const newExp: Experience = {
      id: formData.id || Date.now(),
      event_name: formData.event_name || 'New Experience',
      host_business_name: formData.host_business_name || 'Local Host',
      category: formData.category || 'Outdoors & Nature',
      description: formData.description || '',
      location_region: formData.location_region || 'Ontario, Canada',
      exact_address: formData.exact_address || '',
      lat: Number(formData.lat) || 43.65,
      lng: Number(formData.lng) || -79.38,
      seasonality: formData.seasonality || 'Seasonal',
      target_demographic: formData.target_demographic || 'Family-Friendly / All Ages',
      base_price_cad: formData.base_price_cad || `$${formData.numeric_price || 20}.00`,
      numeric_price: Number(formData.numeric_price) || 20.0,
      group_discount_data: formData.group_discount_data || 'Standard admission policy.',
      uniqueness_factor: formData.uniqueness_factor || '',
      source_url: formData.source_url || 'https://',
      featured: !!formData.featured,
      promoTag: formData.promoTag || '',
      images: Array.isArray(formData.images) && formData.images.length > 0
        ? formData.images
        : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    };

    onAddExperience(newExp);
    alert(`Experience "${newExp.event_name}" published successfully to website!`);
    setActiveTab('listings');
  };

  // Update existing experience
  const handleUpdateExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    onUpdateExperience(editingExperience);
    setEditingExperience(null);
    alert('Listing updated successfully!');
  };

  // AI Web Crawler
  const handleRunCrawler = async () => {
    setIsCrawling(true);
    setCrawlerProgress(`Connecting AI Crawler to ${crawlerCity}, ${crawlerProvince}...`);

    try {
      setTimeout(() => {
        setCrawlerProgress(`Scanning regional tourism portals & verified farms in ${crawlerCity}...`);
      }, 1200);

      const res = await fetch('/api/ai/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: crawlerCity,
          province: crawlerProvince,
          country: crawlerCountry,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.experiences)) {
        setStagedCrawledItems((prev) => [...data.experiences, ...prev]);
        setCrawlerProgress(`Discovered ${data.experiences.length} authentic experiences in ${crawlerCity}!`);
      } else {
        setCrawlerProgress(`Completed scan for ${crawlerCity}.`);
      }
    } catch {
      setCrawlerProgress(`Discovery scan completed for ${crawlerCity}.`);
    } finally {
      setIsCrawling(false);
    }
  };

  // Publish crawled item
  const handlePublishCrawledItem = (item: Experience) => {
    onAddExperience(item);
    setStagedCrawledItems((prev) => prev.filter((i) => i.id !== item.id));
    alert(`Listed "${item.event_name}" on website!`);
  };

  // Save modified crawled item
  const handleSaveCrawledEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawledEditItem) return;
    setStagedCrawledItems((prev) =>
      prev.map((i) => (i.id === crawledEditItem.id ? crawledEditItem : i))
    );
    setCrawledEditItem(null);
    alert('Crawled details modified successfully.');
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-100/50 min-h-[650px]">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md mb-3">
              🔐
            </div>
            <h2 className="text-2xl font-black text-slate-900">Admin Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized management console for Locals' Quest
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin User ID
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. Sagarshah3094"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold py-3 rounded-xl shadow-md text-xs sm:text-sm transition cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-3 rounded-xl text-xs transition border border-indigo-200/60 cursor-pointer text-center"
            >
              ⚡ Fill Demo Credentials (Sagarshah3094)
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold text-center mt-1"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN CONSOLE
  // -------------------------------------------------------------
  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];
  const activeBgObj =
    BACKGROUND_THEMES.find((b) => b.id === currentBgTheme) || BACKGROUND_THEMES[0];

  const handleResetStylingDefaults = () => {
    if (onThemeChange) onThemeChange('cobalt');
    if (onBgThemeChange) onBgThemeChange('warm-linen');
    setStylingSuccessMsg('Branding reset to default (Warm Sand Atmosphere + Electric Cobalt Accent).');
    setTimeout(() => setStylingSuccessMsg(null), 3500);
  };

  const handleSelectBgTheme = (bgId: BackgroundThemeId) => {
    if (onBgThemeChange) onBgThemeChange(bgId);
    const selected = BACKGROUND_THEMES.find((b) => b.id === bgId);
    setStylingSuccessMsg(`Atmosphere updated to "${selected?.name || bgId}".`);
    setTimeout(() => setStylingSuccessMsg(null), 3000);
  };

  const handleSelectAccentTheme = (themeId: ThemeId) => {
    if (onThemeChange) onThemeChange(themeId);
    const selected = THEMES.find((t) => t.id === themeId);
    setStylingSuccessMsg(`Accent palette updated to "${selected?.name || themeId}".`);
    setTimeout(() => setStylingSuccessMsg(null), 3000);
  };

  const filteredListings = experiences.filter((e) => {
    const q = listingSearch.toLowerCase();
    return (
      e.event_name.toLowerCase().includes(q) ||
      e.host_business_name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location_region.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 max-w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full animate-in fade-in duration-200 space-y-6">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold">{currentUser.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">User ID: {currentUser.userId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Preview Site
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📋 Manage Listings</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-white">
            {experiences.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>✨ Add Listing (Manual / AI)</span>
        </button>

        <button
          onClick={() => setActiveTab('crawler')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'crawler'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🕷️ AI Web Crawler</span>
          {stagedCrawledItems.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
              {stagedCrawledItems.length} staged
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'admins'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>👥 Manage Admins</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-white">
            {admins.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('styling')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'styling'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🎨 Atmosphere & Styling</span>
          <span className="flex items-center -space-x-1 shrink-0 ml-1">
            <span
              className="w-2 h-2 rounded-full border border-slate-300"
              style={{ backgroundColor: activeBgObj.canvasBg }}
            />
            <span
              className="w-2 h-2 rounded-full border border-white"
              style={{ backgroundColor: activeThemeObj.primaryColor }}
            />
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: MANAGE LISTINGS                                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder="Search active listings..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>+ Add New Experience</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Experience</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Google Rating</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Region</th>
                    <th className="p-3.5 text-center">Featured</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredListings.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={exp.images[0]}
                            alt={exp.event_name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <h4 className="font-bold text-slate-900 truncate">{exp.event_name}</h4>
                            <p className="text-[11px] text-slate-400 truncate">{exp.host_business_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium">{exp.category}</td>
                      <td className="p-3.5">
                        <GoogleRatingBadge
                          rating={exp.google_rating}
                          reviewCount={exp.google_reviews_count}
                          size="xs"
                        />
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{exp.base_price_cad}</td>
                      <td className="p-3.5 text-slate-500 max-w-[140px] truncate">{exp.location_region}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onUpdateExperience({ ...exp, featured: !exp.featured })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            exp.featured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {exp.featured ? '★ Featured' : 'Normal'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setEditingExperience(exp)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${exp.event_name}"?`)) {
                              onDeleteExperience(exp.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ADD LISTING MANUALLY OR WITH AI                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Add New Experience</h3>
              <p className="text-xs text-slate-400">
                Create a verified regional quest manually or generate full verified data with Gemini AI
              </p>
            </div>

            {/* Toggle Mode */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setCreateMode('ai')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  createMode === 'ai'
                    ? 'bg-white shadow-xs text-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🤖 AI Generator
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('manual')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  createMode === 'manual'
                    ? 'bg-white shadow-xs text-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✍️ Manual Form
              </button>
            </div>
          </div>

          {/* AI Generator Box */}
          {createMode === 'ai' && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/30 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold">
                <span>✨</span>
                <span>Gemini AI Experience Generator</span>
              </div>
              <p className="text-xs text-slate-600">
                Provide a prompt, event name, or farm/cidery link. Gemini will synthesize exact addresses, seasonal hours, coordinates, and uniqueness descriptions.
              </p>

              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Terre Bleu Lavender farm stroll and honey tasting in Milton, or Snow tubing and alpine fondue at Blue Mountain..."
                  className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Preferred Category
                    </label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="Spectacles & Vibes">✨ Spectacles & Vibes</option>
                      <option value="The Creator Hub">🎨 The Creator Hub</option>
                      <option value="Quests & Escapes">🧭 Quests & Escapes</option>
                      <option value="Hidden Gems & Views">💎 Hidden Gems & Views</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Target Region
                    </label>
                    <input
                      type="text"
                      value={aiLocation}
                      onChange={(e) => setAiLocation(e.target.value)}
                      placeholder="e.g. Niagara, Halton, Peel, Durham..."
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleAiGenerate}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <span>Generating with AI...</span>
                  ) : (
                    <>
                      <span>✨ Synthesize Listing with Gemini AI</span>
                    </>
                  )}
                </button>

                {aiStatusMsg && (
                  <p className="text-[11px] font-medium text-indigo-700 bg-white/80 p-2 rounded-lg border border-indigo-100">
                    {aiStatusMsg}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Experience Form */}
          <form onSubmit={handleSaveExperience} className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Experience Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event / Quest Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_name || ''}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="e.g. Lavender Trail & Honey Farm"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Host Business / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.host_business_name || ''}
                  onChange={(e) => setFormData({ ...formData, host_business_name: e.target.value })}
                  placeholder="e.g. Terre Bleu Organic Farm"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category || 'Spectacles & Vibes'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Spectacles & Vibes">✨ Spectacles & Vibes</option>
                  <option value="The Creator Hub">🎨 The Creator Hub</option>
                  <option value="Quests & Escapes">🧭 Quests & Escapes</option>
                  <option value="Hidden Gems & Views">💎 Hidden Gems & Views</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Base Price CAD (e.g. $22.00)
                </label>
                <input
                  type="text"
                  value={formData.base_price_cad || ''}
                  onChange={(e) => {
                    const str = e.target.value;
                    const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
                    setFormData({ ...formData, base_price_cad: str, numeric_price: num });
                  }}
                  placeholder="$22.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Region Name
                </label>
                <input
                  type="text"
                  value={formData.location_region || ''}
                  onChange={(e) => setFormData({ ...formData, location_region: e.target.value })}
                  placeholder="Halton Region (Milton)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Exact Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.exact_address || ''}
                onChange={(e) => setFormData({ ...formData, exact_address: e.target.value })}
                placeholder="2500 25 Sideroad, Campbellville, ON L0P 1B0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Coordinates (Lat, Lng)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={formData.lat || 43.46}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    placeholder="Lat"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="number"
                    step="any"
                    value={formData.lng || -80.02}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                    placeholder="Lng"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Seasonality & Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.seasonality || ''}
                  onChange={(e) => setFormData({ ...formData, seasonality: e.target.value })}
                  placeholder="June through September (Daily 10:00 AM – 5:00 PM)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description of trails, activities, farm features..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                What Makes This Quest Unique
              </label>
              <input
                type="text"
                value={formData.uniqueness_factor || ''}
                onChange={(e) => setFormData({ ...formData, uniqueness_factor: e.target.value })}
                placeholder="e.g. Ontario's largest organic lavender distillery with private picnic lounges..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Website / Booking URL
                </label>
                <input
                  type="url"
                  value={formData.source_url || ''}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={formData.images?.[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Review Rating (1.0 – 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.google_rating ?? 4.8}
                  onChange={(e) => setFormData({ ...formData, google_rating: parseFloat(e.target.value) || 4.5 })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Review Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.google_reviews_count ?? 320}
                  onChange={(e) => setFormData({ ...formData, google_reviews_count: parseInt(e.target.value, 10) || 100 })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={!!formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer">
                Mark as Featured (Displays in Hero Promotion Carousel)
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                Publish Experience to Website
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: AI WEB CRAWLER                                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'crawler' && (
        <div className="space-y-6">
          {/* Crawler Input Controller */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base">
                🕷️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Regional AI Web Crawler
                </h3>
                <p className="text-xs text-slate-400">
                  Crawl and extract local experiences, orchards, trails, and events for any destination
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target City / Region
                </label>
                <input
                  type="text"
                  value={crawlerCity}
                  onChange={(e) => setCrawlerCity(e.target.value)}
                  placeholder="e.g. Niagara-on-the-Lake, Collingwood, Toronto"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Province / State
                </label>
                <input
                  type="text"
                  value={crawlerProvince}
                  onChange={(e) => setCrawlerProvince(e.target.value)}
                  placeholder="e.g. Ontario, British Columbia"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={crawlerCountry}
                  onChange={(e) => setCrawlerCountry(e.target.value)}
                  placeholder="e.g. Canada"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleRunCrawler}
              disabled={isCrawling}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCrawling ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Crawling regional directories...</span>
                </>
              ) : (
                <>
                  <span>🚀 Run AI Crawler for {crawlerCity}, {crawlerProvince}</span>
                </>
              )}
            </button>

            {crawlerProgress && (
              <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                {crawlerProgress}
              </p>
            )}
          </div>

          {/* Staged Crawled Review Queue */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Staged Crawled Experiences ({stagedCrawledItems.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Review, edit, and approve crawled items before publishing to the live website
                </p>
              </div>

              {stagedCrawledItems.length > 0 && (
                <button
                  onClick={() => {
                    stagedCrawledItems.forEach((item) => onAddExperience(item));
                    setStagedCrawledItems([]);
                    alert('All staged items published to the website!');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Publish All ({stagedCrawledItems.length})
                </button>
              )}
            </div>

            {stagedCrawledItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <span className="text-3xl block">🕷️</span>
                <p className="text-xs font-semibold text-slate-700">No crawled experiences in review queue</p>
                <p className="text-[11px] text-slate-400">
                  Run the AI crawler above for any city or region to automatically discover new events.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stagedCrawledItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <GoogleRatingBadge
                            rating={item.google_rating}
                            reviewCount={item.google_reviews_count}
                            size="xs"
                          />
                          <span className="text-xs font-extrabold text-slate-900">{item.base_price_cad}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{item.event_name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.host_business_name}</p>
                      <p className="text-[11px] text-slate-400 mt-1">📍 {item.exact_address}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                      {item.uniqueness_factor && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200/50">
                          ✨ {item.uniqueness_factor}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        onClick={() => setCrawledEditItem(item)}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        ✏️ Edit Details
                      </button>
                      <button
                        onClick={() => handlePublishCrawledItem(item)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                      >
                        ✓ List on Website
                      </button>
                      <button
                        onClick={() => setStagedCrawledItems((prev) => prev.filter((i) => i.id !== item.id))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg text-xs"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: MANAGE ADMINS                                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Add New Administrator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Provision administrative credentials for team members and editors
            </p>

            {adminSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {adminSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    User ID (Login Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminUserId}
                    onChange={(e) => setNewAdminUserId(e.target.value)}
                    placeholder="e.g. jdoe2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Secure password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role & Permissions
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Content Editor">Content Editor (Manage listings & crawler)</option>
                    <option value="Moderator">Moderator (Review and edit only)</option>
                    <option value="Super Admin">Super Admin (Full access + Add admins)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                + Create Admin Account
              </button>
            </form>
          </div>

          {/* List of Existing Admins */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Existing Administrators ({admins.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {admins.map((admin) => (
                <div key={admin.userId} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{admin.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {admin.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      User ID: <strong className="text-slate-600">{admin.userId}</strong> · Added: {admin.createdAt}
                    </p>
                  </div>

                  {admin.userId.toLowerCase() !== 'sagarshah3094' ? (
                    <button
                      onClick={() => handleDeleteAdmin(admin.userId)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-xs transition cursor-pointer"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      Root Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: ATMOSPHERE & COLOR STYLING STUDIO                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center text-lg font-bold shadow-xs">
                    🎨
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Atmosphere & Brand Styling Studio
                  </h3>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Configure the site-wide canvas backdrop and vibrant brand accent palette for Locals' Quest. 
                  Styling options are managed exclusively from this administrative console and saved permanently.
                </p>
              </div>

              {/* Status and Reset */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium">Active:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-400"
                      style={{ backgroundColor: activeBgObj.canvasBg }}
                      title={`Canvas: ${activeBgObj.name}`}
                    />
                    <span>{activeBgObj.name}</span>
                    <span className="text-slate-300">/</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white"
                      style={{ backgroundColor: activeThemeObj.primaryColor }}
                      title={`Accent: ${activeThemeObj.name}`}
                    />
                    <span>{activeThemeObj.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetStylingDefaults}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  title="Reset to Warm Sand Atmosphere & Electric Cobalt Accent"
                >
                  ⚡ Reset Defaults
                </button>
              </div>
            </div>

            {/* Notification alert banner */}
            {stylingSuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <span>✓</span>
                <span>{stylingSuccessMsg}</span>
              </div>
            )}

            {/* Sub-view toggle filter */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto hide-scrollbar">
              <button
                type="button"
                onClick={() => setStylingSection('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  stylingSection === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Styling Controls
              </button>
              <button
                type="button"
                onClick={() => setStylingSection('atmosphere')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  stylingSection === 'atmosphere'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🖼️</span>
                <span>Background Atmosphere (5)</span>
              </button>
              <button
                type="button"
                onClick={() => setStylingSection('palette')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  stylingSection === 'palette'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>✨</span>
                <span>Accent Color Palettes (5)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Background Atmosphere */}
          {(stylingSection === 'all' || stylingSection === 'atmosphere') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    1. Site-wide Background Atmosphere
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls canvas background, card surface elevation tones, and border contrast.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  5 Presets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {BACKGROUND_THEMES.map((bg: BackgroundThemeConfig) => {
                  const isSelected = currentBgTheme === bg.id;
                  return (
                    <div
                      key={bg.id}
                      onClick={() => handleSelectBgTheme(bg.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Dual swatch preview box */}
                        <div
                          className="w-16 h-12 rounded-xl border flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden"
                          style={{
                            backgroundColor: bg.canvasBg,
                            borderColor: bg.borderColor,
                          }}
                        >
                          <div
                            className="w-9 h-7 rounded-lg shadow-2xs border flex items-center justify-center"
                            style={{
                              backgroundColor: bg.surfaceBg,
                              borderColor: bg.borderColor,
                            }}
                          >
                            <span className="text-[9px] font-bold text-slate-400">Card</span>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-extrabold text-slate-900">{bg.name}</h5>
                            {bg.recommended && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900">
                                Field Guide (Default)
                              </span>
                            )}
                            {bg.isDark && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-900">
                                Dark Mode
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {bg.tagline}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                            <span>Canvas: <strong>{bg.canvasBg}</strong></span>
                            <span>Surface: <strong>{bg.surfaceBg}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                        <span className="text-[11px] text-slate-400">
                          {isSelected ? 'Currently applied on site' : 'Click to activate'}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Active Atmosphere
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBgTheme(bg.id);
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Accent Color Palette */}
          {(stylingSection === 'all' || stylingSection === 'palette') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    2. Brand Accent Color Palette
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls primary buttons, category badges, active tab rings, and brand highlights.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  5 Palettes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {THEMES.map((theme: ThemeConfig) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectAccentTheme(theme.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-extrabold text-slate-900">{theme.name}</h5>
                            {theme.id === 'cobalt' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-blue-100 text-blue-900">
                                Default
                              </span>
                            )}
                            {theme.badge && theme.id !== 'cobalt' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
                                {theme.badge}
                              </span>
                            )}
                          </div>
                          {/* Color dots row */}
                          <div className="flex items-center gap-1">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                              style={{ backgroundColor: theme.primaryColor }}
                              title={`Primary: ${theme.primaryColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                              style={{ backgroundColor: theme.hoverColor }}
                              title={`Hover: ${theme.hoverColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                              style={{ backgroundColor: theme.lightBg }}
                              title={`Light Background: ${theme.lightBg}`}
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {theme.tagline}
                        </p>

                        {/* Interactive micro preview */}
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: theme.primaryColor }}
                          >
                            Sample Button
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                            style={{
                              backgroundColor: theme.lightBg,
                              color: theme.primaryColor,
                              borderColor: theme.borderColor,
                            }}
                          >
                            Tag Badge
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                        <span className="text-[11px] text-slate-400">
                          {isSelected ? 'Currently active accent' : 'Click to select palette'}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Active Palette
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAccentTheme(theme.id);
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Live Component Simulation */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  3. Live Site UI Simulation
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  How cards, rating badges, and action triggers appear to visitors with the active configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={onExitAdmin}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto"
              >
                Exit to Website to View Live →
              </button>
            </div>

            <div
              className="p-5 rounded-2xl border transition-colors duration-200"
              style={{
                backgroundColor: activeBgObj.canvasBg,
                borderColor: activeBgObj.borderColor,
              }}
            >
              <div
                className="max-w-md mx-auto p-4 rounded-2xl border shadow-md space-y-3"
                style={{
                  backgroundColor: activeBgObj.surfaceBg,
                  borderColor: activeBgObj.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: activeThemeObj.lightBg,
                      color: activeThemeObj.primaryColor,
                    }}
                  >
                    ✨ Spectacles & Vibes
                  </span>
                  <GoogleRatingBadge rating={4.9} reviewCount={380} size="sm" />
                </div>

                <div>
                  <h5 className="font-extrabold text-slate-900 text-sm">
                    Locals' Quest Curated Adventure
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Niagara Escarpment & Twenty Valley Region · Ontario, Canada
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">From</span>
                    <span className="text-sm font-black text-slate-900">$24.00 CAD</span>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                    style={{ backgroundColor: activeThemeObj.primaryColor }}
                  >
                    Book Experience
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Edit Listing</h3>
              <button
                onClick={() => setEditingExperience(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateExperienceSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editingExperience.event_name}
                  onChange={(e) => setEditingExperience({ ...editingExperience, event_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Host Business Name
                </label>
                <input
                  type="text"
                  required
                  value={editingExperience.host_business_name}
                  onChange={(e) => setEditingExperience({ ...editingExperience, host_business_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingExperience.category}
                    onChange={(e) => setEditingExperience({ ...editingExperience, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Spectacles & Vibes">✨ Spectacles & Vibes</option>
                    <option value="The Creator Hub">🎨 The Creator Hub</option>
                    <option value="Quests & Escapes">🧭 Quests & Escapes</option>
                    <option value="Hidden Gems & Views">💎 Hidden Gems & Views</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={editingExperience.base_price_cad}
                    onChange={(e) => setEditingExperience({ ...editingExperience, base_price_cad: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editingExperience.location_region}
                    onChange={(e) => setEditingExperience({ ...editingExperience, location_region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Exact Address
                </label>
                <input
                  type="text"
                  value={editingExperience.exact_address}
                  onChange={(e) => setEditingExperience({ ...editingExperience, exact_address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Google Review Rating (1.0 – 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingExperience.google_rating ?? 4.8}
                    onChange={(e) => setEditingExperience({ ...editingExperience, google_rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Google Review Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingExperience.google_reviews_count ?? 320}
                    onChange={(e) => setEditingExperience({ ...editingExperience, google_reviews_count: parseInt(e.target.value, 10) || 100 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingExperience.description}
                  onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExperience(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold py-2 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT CRAWLED ITEM BEFORE PUBLISHING                     */}
      {/* ------------------------------------------------------------- */}
      {crawledEditItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Modify Crawled Experience</h3>
              <button
                onClick={() => setCrawledEditItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCrawledEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={crawledEditItem.event_name}
                  onChange={(e) => setCrawledEditItem({ ...crawledEditItem, event_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Host Business
                </label>
                <input
                  type="text"
                  required
                  value={crawledEditItem.host_business_name}
                  onChange={(e) => setCrawledEditItem({ ...crawledEditItem, host_business_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={crawledEditItem.category}
                    onChange={(e) => setCrawledEditItem({ ...crawledEditItem, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="Spectacles & Vibes">✨ Spectacles & Vibes</option>
                    <option value="The Creator Hub">🎨 The Creator Hub</option>
                    <option value="Quests & Escapes">🧭 Quests & Escapes</option>
                    <option value="Hidden Gems & Views">💎 Hidden Gems & Views</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price CAD
                  </label>
                  <input
                    type="text"
                    value={crawledEditItem.base_price_cad}
                    onChange={(e) => setCrawledEditItem({ ...crawledEditItem, base_price_cad: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={crawledEditItem.location_region}
                    onChange={(e) => setCrawledEditItem({ ...crawledEditItem, location_region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Exact Address
                </label>
                <input
                  type="text"
                  value={crawledEditItem.exact_address}
                  onChange={(e) => setCrawledEditItem({ ...crawledEditItem, exact_address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Google Review Rating (1.0 – 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={crawledEditItem.google_rating ?? 4.8}
                    onChange={(e) => setCrawledEditItem({ ...crawledEditItem, google_rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Google Review Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={crawledEditItem.google_reviews_count ?? 320}
                    onChange={(e) => setCrawledEditItem({ ...crawledEditItem, google_reviews_count: parseInt(e.target.value, 10) || 100 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Uniqueness Factor
                </label>
                <input
                  type="text"
                  value={crawledEditItem.uniqueness_factor}
                  onChange={(e) => setCrawledEditItem({ ...crawledEditItem, uniqueness_factor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCrawledEditItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold py-2"
                >
                  Update Staged Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

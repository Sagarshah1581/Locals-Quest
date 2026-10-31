import React, { useState, useMemo, useEffect } from 'react';
import { experiences as initialExperiences } from './data/experiences';
import { Experience, FilterState, ViewMode, UserProfile } from './types';
import { migrateLegacyCategory } from './utils/categoryTheme';
import { Header } from './components/Header';
import { TabNav } from './components/TabNav';
import { PromoCarousel } from './components/PromoCarousel';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { RailSection } from './components/RailSection';
import { MapView } from './components/MapView';
import { DetailView } from './components/DetailView';
import { FilterModal } from './components/FilterModal';
import { ContactView } from './components/ContactView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import {
  getStoredTheme,
  getStoredBackgroundTheme,
  applyTheme,
  ThemeId,
  BackgroundThemeId,
} from './utils/theme';

export const ALL_NEW_CATEGORIES = [
  'Spectacles & Vibes',
  'The Creator Hub',
  'Quests & Escapes',
  'Hidden Gems & Views',
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(initialExperiences[0].id);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => getStoredTheme());
  const [currentBgTheme, setCurrentBgTheme] = useState<BackgroundThemeId>(() =>
    getStoredBackgroundTheme()
  );

  useEffect(() => {
    applyTheme(currentTheme, currentBgTheme);
  }, [currentTheme, currentBgTheme]);

  // Persistent Experiences Directory (supports newly added/crawled listings)
  const [allExperiences, setAllExperiences] = useState<Experience[]>(() => {
    try {
      const stored = localStorage.getItem('locals_quest_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e: Experience) => {
            const seed = initialExperiences.find((s) => s.id === e.id);
            return {
              ...e,
              category: migrateLegacyCategory(e.category),
              google_rating: e.google_rating ?? seed?.google_rating ?? 4.7,
              google_reviews_count: e.google_reviews_count ?? seed?.google_reviews_count ?? 380,
            };
          });
        }
      }
      return initialExperiences;
    } catch {
      return initialExperiences;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locals_quest_listings', JSON.stringify(allExperiences));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [allExperiences]);

  // Saved / Favorited Experiences
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('locals_quest_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locals_quest_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [savedIds]);

  // User Profile State (supports Google login/signup)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('locals_quest_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('locals_quest_user', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('locals_quest_user');
      }
    } catch (e) {
      console.warn('Could not save user profile', e);
    }
  }, [userProfile]);

  const handleLoginWithGoogle = () => {
    const googleUser: UserProfile = {
      name: 'Sagar Shah',
      email: 'shahsagar3094@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      provider: 'google',
      memberSince: 'October 2026',
    };
    setUserProfile(googleUser);
    alert('Successfully signed in with Google as Sagar Shah (shahsagar3094@gmail.com)!');
  };

  const handleLoginWithEmail = (email: string, name: string) => {
    const emailUser: UserProfile = {
      name,
      email,
      provider: 'email',
      memberSince: 'October 2026',
    };
    setUserProfile(emailUser);
    alert(`Welcome, ${name}! Logged in as ${email}.`);
  };

  const handleLogout = () => {
    setUserProfile(null);
  };

  const toggleSaveQuest = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Admin Listing Actions
  const handleAddExperience = (newExp: Experience) => {
    setAllExperiences((prev) => [newExp, ...prev.filter((e) => e.id !== newExp.id)]);
  };

  const handleUpdateExperience = (updatedExp: Experience) => {
    setAllExperiences((prev) =>
      prev.map((e) => (e.id === updatedExp.id ? updatedExp : e))
    );
  };

  const handleDeleteExperience = (id: number) => {
    setAllExperiences((prev) => prev.filter((e) => e.id !== id));
    setSavedIds((prev) => prev.filter((item) => item !== id));
  };

  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    maxPrice: 30,
    categories: ALL_NEW_CATEGORIES,
    sortBy: 'recommended',
  });

  const selectedExperience = useMemo(() => {
    return allExperiences.find((e) => e.id === selectedExperienceId) || allExperiences[0] || initialExperiences[0];
  }, [allExperiences, selectedExperienceId]);

  const savedExperiencesList = useMemo(() => {
    return allExperiences.filter((e) => savedIds.includes(e.id));
  }, [allExperiences, savedIds]);

  // Compute filtered & sorted experiences
  const filteredExperiences = useMemo(() => {
    let result = allExperiences.filter((exp) => {
      const q = filterState.search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exp.event_name.toLowerCase().includes(q) ||
        exp.host_business_name.toLowerCase().includes(q) ||
        exp.location_region.toLowerCase().includes(q) ||
        exp.exact_address.toLowerCase().includes(q) ||
        exp.description.toLowerCase().includes(q);

      const matchesPrice = exp.numeric_price <= filterState.maxPrice;
      const matchesCategory = filterState.categories.includes(exp.category);

      return matchesSearch && matchesPrice && matchesCategory;
    });

    if (filterState.sortBy === 'price-asc') {
      result.sort((a, b) => a.numeric_price - b.numeric_price);
    } else if (filterState.sortBy === 'price-desc') {
      result.sort((a, b) => b.numeric_price - a.numeric_price);
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [allExperiences, filterState]);

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.maxPrice < 30) count++;
    if (filterState.categories.length < 4) count++;
    if (filterState.sortBy !== 'recommended') count++;
    return count;
  }, [filterState]);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExperience = (id: number) => {
    setSelectedExperienceId(id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOnMap = () => {
    setCurrentView('map');
  };

  const handleResetFilters = () => {
    setFilterState({
      search: '',
      maxPrice: 30,
      categories: ALL_NEW_CATEGORIES,
      sortBy: 'recommended',
    });
  };

  const handleQuickCategory = (cat: string) => {
    if (cat === 'All') {
      setFilterState((prev) => ({
        ...prev,
        categories: ALL_NEW_CATEGORIES,
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        categories: [cat],
      }));
    }
  };

  // 4 Dedicated Category Rails
  const spectaclesItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'Spectacles & Vibes'),
    [filteredExperiences]
  );
  const creatorItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'The Creator Hub'),
    [filteredExperiences]
  );
  const questsItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'Quests & Escapes'),
    [filteredExperiences]
  );
  const gemsItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'Hidden Gems & Views'),
    [filteredExperiences]
  );

  return (
    <div
      className="min-h-screen text-slate-800 font-sans antialiased flex flex-col justify-between transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Responsive App Frame */}
      <div
        className="w-full max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto min-h-screen shadow-xl relative flex flex-col pb-16 md:border-x transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-theme-custom)',
        }}
      >
        
        {/* Header with Navigation Menu */}
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          savedCount={savedIds.length}
          userEmail={userProfile?.email}
        />

        {/* Tab Nav (visible in list and map view) */}
        {(currentView === 'list' || currentView === 'map') && (
          <TabNav currentView={currentView} onNavigate={handleNavigate} />
        )}

        {/* ============================================================== */}
        {/* SCREEN 1: DISCOVERY / LIST VIEW                                */}
        {/* ============================================================== */}
        {currentView === 'list' && (
          <main className="flex-1 flex flex-col">
            {/* Promo Carousel */}
            <PromoCarousel
              experiences={allExperiences}
              onSelectExperience={handleSelectExperience}
            />

            {/* Search, Filter & Sort */}
            <SearchBarAndFilters
              filterState={filterState}
              onSearchChange={(val) => setFilterState((prev) => ({ ...prev, search: val }))}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onSortChange={(sort) => setFilterState((prev) => ({ ...prev, sortBy: sort }))}
              onQuickCategory={handleQuickCategory}
              activeFilterCount={activeFilterCount}
              totalFilteredCount={filteredExperiences.length}
              onResetFilters={handleResetFilters}
            />

            {/* 4 Dedicated Horizontal Rails */}
            {spectaclesItems.length > 0 && (
              <RailSection
                title="✨ Spectacles & Vibes"
                category="Spectacles & Vibes"
                items={spectaclesItems}
                onSelect={handleSelectExperience}
                onFilterCategory={handleQuickCategory}
                savedIds={savedIds}
                onToggleSave={toggleSaveQuest}
              />
            )}

            {creatorItems.length > 0 && (
              <RailSection
                title="🎨 The Creator Hub"
                category="The Creator Hub"
                items={creatorItems}
                onSelect={handleSelectExperience}
                onFilterCategory={handleQuickCategory}
                savedIds={savedIds}
                onToggleSave={toggleSaveQuest}
              />
            )}

            {questsItems.length > 0 && (
              <RailSection
                title="🧭 Quests & Escapes"
                category="Quests & Escapes"
                items={questsItems}
                onSelect={handleSelectExperience}
                onFilterCategory={handleQuickCategory}
                savedIds={savedIds}
                onToggleSave={toggleSaveQuest}
              />
            )}

            {gemsItems.length > 0 && (
              <RailSection
                title="💎 Hidden Gems & Views"
                category="Hidden Gems & Views"
                items={gemsItems}
                onSelect={handleSelectExperience}
                onFilterCategory={handleQuickCategory}
                savedIds={savedIds}
                onToggleSave={toggleSaveQuest}
              />
            )}

            {/* Empty State when no results match active filters */}
            {filteredExperiences.length === 0 && (
              <div className="mx-4 my-8 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm font-bold text-slate-800">No experiences match your criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your price range or category filters</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        )}

        {/* ============================================================== */}
        {/* SCREEN 2: INTERACTIVE MAP VIEW (Free OSM, No API Key Required) */}
        {/* ============================================================== */}
        {currentView === 'map' && (
          <main className="flex-1 relative flex flex-col w-full">
            <MapView
              experiences={filteredExperiences}
              selectedExperience={selectedExperience}
              onSelectExperience={handleSelectExperience}
            />
          </main>
        )}

        {/* ============================================================== */}
        {/* SCREEN 3: DETAIL VIEW                                          */}
        {/* ============================================================== */}
        {currentView === 'detail' && (
          <DetailView
            experience={selectedExperience}
            onViewOnMap={handleViewOnMap}
            isSaved={savedIds.includes(selectedExperience.id)}
            onToggleSave={toggleSaveQuest}
          />
        )}

        {/* ============================================================== */}
        {/* SCREEN 4: CONTACT US / INQUIRIES                               */}
        {/* ============================================================== */}
        {currentView === 'contact' && <ContactView />}

        {/* ============================================================== */}
        {/* SCREEN 5: USER PROFILE & GOOGLE AUTH                           */}
        {/* ============================================================== */}
        {currentView === 'profile' && (
          <ProfileView
            user={userProfile}
            onLoginWithGoogle={handleLoginWithGoogle}
            onLoginWithEmail={handleLoginWithEmail}
            onLogout={handleLogout}
            savedExperiences={savedExperiencesList}
            onSelectExperience={handleSelectExperience}
            onRemoveSaved={toggleSaveQuest}
          />
        )}

        {/* ============================================================== */}
        {/* SCREEN 6: ADMIN PANEL CONSOLE                                  */}
        {/* ============================================================== */}
        {currentView === 'admin' && (
          <AdminPanel
            experiences={allExperiences}
            onAddExperience={handleAddExperience}
            onUpdateExperience={handleUpdateExperience}
            onDeleteExperience={handleDeleteExperience}
            onExitAdmin={() => handleNavigate('list')}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            currentBgTheme={currentBgTheme}
            onBgThemeChange={setCurrentBgTheme}
          />
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilter={filterState}
          onApply={({ maxPrice, categories }) => {
            setFilterState((prev) => ({
              ...prev,
              maxPrice,
              categories,
            }));
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Modern, quiet footer */}
      <footer className="w-full max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto py-5 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Locals' Quest · Curated regional adventures & seasonal discoveries</p>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button onClick={() => handleNavigate('contact')} className="hover:text-slate-700 transition">
            Contact Us
          </button>
          <button onClick={() => handleNavigate('profile')} className="hover:text-slate-700 transition">
            Profile
          </button>
          <button onClick={() => handleNavigate('admin')} className="text-purple-600 hover:text-purple-800 transition">
            Admin Portal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;

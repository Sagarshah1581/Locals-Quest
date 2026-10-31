import React, { useState, useMemo } from 'react';
import { experiences } from './data/experiences';
import { FilterState, ViewMode } from './types';
import { Header } from './components/Header';
import { TabNav } from './components/TabNav';
import { PromoCarousel } from './components/PromoCarousel';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { RailSection } from './components/RailSection';
import { ExperienceListItem } from './components/ExperienceCard';
import { MapView } from './components/MapView';
import { DetailView } from './components/DetailView';
import { FilterModal } from './components/FilterModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(experiences[0].id);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    maxPrice: 30,
    categories: ['Outdoors & Nature', 'Farm & Harvest', 'Wine & Cider', 'Winter & Skating'],
    sortBy: 'recommended',
  });

  const selectedExperience = useMemo(() => {
    return experiences.find((e) => e.id === selectedExperienceId) || experiences[0];
  }, [selectedExperienceId]);

  // Compute filtered & sorted experiences
  const filteredExperiences = useMemo(() => {
    let result = experiences.filter((exp) => {
      const q = filterState.search.toLowerCase();
      const matchesSearch =
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
  }, [filterState]);

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
      categories: ['Outdoors & Nature', 'Farm & Harvest', 'Wine & Cider', 'Winter & Skating'],
      sortBy: 'recommended',
    });
  };

  const handleQuickCategory = (cat: string) => {
    if (cat === 'All') {
      setFilterState((prev) => ({
        ...prev,
        categories: ['Outdoors & Nature', 'Farm & Harvest', 'Wine & Cider', 'Winter & Skating'],
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        categories: [cat],
      }));
    }
  };

  // Outdoor and Farm rails
  const outdoorsItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'Outdoors & Nature'),
    [filteredExperiences]
  );
  const farmItems = useMemo(
    () => filteredExperiences.filter((e) => e.category === 'Farm & Harvest'),
    [filteredExperiences]
  );

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 font-sans antialiased">
      {/* Mobile-first App Frame */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative flex flex-col pb-16 md:max-w-xl lg:max-w-2xl border-x border-slate-200">
        {/* Header */}
        <Header currentView={currentView} onNavigate={handleNavigate} />

        {/* Tab Nav (visible in list and map view) */}
        {currentView !== 'detail' && (
          <TabNav currentView={currentView} onNavigate={handleNavigate} />
        )}

        {/* SCREEN 1: DISCOVERY / LIST VIEW */}
        {currentView === 'list' && (
          <main className="flex-1 flex flex-col">
            {/* Promo Carousel */}
            <PromoCarousel
              experiences={experiences}
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

            {/* Rails */}
            <RailSection
              title="🌲 Outdoors & Nature Quests"
              category="Outdoors & Nature"
              items={outdoorsItems}
              onSelect={handleSelectExperience}
              onFilterCategory={handleQuickCategory}
            />

            <RailSection
              title="🎃 Harvest Festivals & Orchards"
              category="Farm & Harvest"
              items={farmItems}
              onSelect={handleSelectExperience}
              onFilterCategory={handleQuickCategory}
            />

            {/* Full Discovery List */}
            <section className="px-4 mb-8">
              <h2 className="text-base font-bold text-slate-900 tracking-tight mb-3">
                📍 All Local Quests (Halton, Peel, Durham, Niagara)
              </h2>

              {filteredExperiences.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-2xl mb-1">🔍</p>
                  <p className="text-sm font-bold text-slate-700">No quests match your filters</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExperiences.map((exp) => (
                    <ExperienceListItem
                      key={exp.id}
                      experience={exp}
                      onSelect={handleSelectExperience}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        )}

        {/* SCREEN 2: INTERACTIVE MAP VIEW */}
        {currentView === 'map' && (
          <main className="flex-1 relative flex flex-col w-full">
            <MapView
              experiences={filteredExperiences}
              selectedExperience={selectedExperience}
              onSelectExperience={handleSelectExperience}
            />
          </main>
        )}

        {/* SCREEN 3: DETAIL VIEW */}
        {currentView === 'detail' && (
          <DetailView
            experience={selectedExperience}
            onViewOnMap={handleViewOnMap}
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
    </div>
  );
};

export default App;

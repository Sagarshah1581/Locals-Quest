import { ExperienceCategory } from '../types';

export interface CategoryTheme {
  name: ExperienceCategory;
  shortLabel: string;
  icon: string;
  badgeClass: string;
  dotColor: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  'Spectacles & Vibes': {
    name: 'Spectacles & Vibes',
    shortLabel: 'Spectacles & Vibes',
    icon: '✨',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dotColor: '#a855f7',
  },
  'The Creator Hub': {
    name: 'The Creator Hub',
    shortLabel: 'The Creator Hub',
    icon: '🎨',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dotColor: '#f59e0b',
  },
  'Quests & Escapes': {
    name: 'Quests & Escapes',
    shortLabel: 'Quests & Escapes',
    icon: '🧭',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dotColor: '#10b981',
  },
  'Hidden Gems & Views': {
    name: 'Hidden Gems & Views',
    shortLabel: 'Hidden Gems & Views',
    icon: '💎',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dotColor: '#0ea5e9',
  },
};

export const ALL_NEW_CATEGORIES: ExperienceCategory[] = [
  'Spectacles & Vibes',
  'The Creator Hub',
  'Quests & Escapes',
  'Hidden Gems & Views',
];

export function getCategoryTheme(category: string): CategoryTheme {
  return (
    CATEGORY_THEMES[category] || {
      name: 'Spectacles & Vibes',
      shortLabel: category,
      icon: '✨',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      dotColor: '#64748b',
    }
  );
}

export function migrateLegacyCategory(cat: string): ExperienceCategory {
  if (cat === 'Outdoors & Nature') return 'Hidden Gems & Views';
  if (cat === 'Farm & Harvest') return 'Quests & Escapes';
  if (cat === 'Wine & Cider') return 'The Creator Hub';
  if (cat === 'Winter & Skating') return 'Spectacles & Vibes';
  if (ALL_NEW_CATEGORIES.includes(cat as ExperienceCategory)) {
    return cat as ExperienceCategory;
  }
  return 'Spectacles & Vibes';
}

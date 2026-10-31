export type ExperienceCategory =
  | 'Spectacles & Vibes'
  | 'The Creator Hub'
  | 'Quests & Escapes'
  | 'Hidden Gems & Views';

export interface Experience {
  id: number;
  event_name: string;
  host_business_name: string;
  category: ExperienceCategory | string;
  description: string;
  location_region: string;
  exact_address: string;
  lat: number;
  lng: number;
  seasonality: string;
  target_demographic: string;
  base_price_cad: string;
  numeric_price: number;
  group_discount_data: string;
  uniqueness_factor: string;
  source_url: string;
  featured: boolean;
  promoTag?: string;
  images: string[];
  google_rating?: number;
  google_reviews_count?: number;
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc';

export interface FilterState {
  search: string;
  maxPrice: number;
  categories: string[];
  sortBy: SortOption;
}

export type ViewMode = 'list' | 'map' | 'detail' | 'contact' | 'profile' | 'admin';

export interface AdminUser {
  userId: string;
  name: string;
  role: 'Super Admin' | 'Content Editor' | 'Moderator';
  password?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'email';
  memberSince: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface Experience {
  id: number;
  event_name: string;
  host_business_name: string;
  category: 'Outdoors & Nature' | 'Farm & Harvest' | 'Wine & Cider' | 'Winter & Skating' | string;
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
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc';

export interface FilterState {
  search: string;
  maxPrice: number;
  categories: string[];
  sortBy: SortOption;
}

export type ViewMode = 'list' | 'map' | 'detail';

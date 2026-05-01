export type Category = 'all' | 'politics' | 'economy' | 'sports' | 'infrastructure' | 'finance' | 'government' | 'international';

export type Language = 'en' | 'hi';

export interface Trend {
  rank: number;
  tag: string;
  description: string;
  category: Category;
  heatScore: number; // 0-10
  posts: string;
  time: string;
  source: string[];
}

export interface Translations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  trendingNow: string;
  live: string;
  posts: string;
  ago: string;
  rising: string;
}

export const CATEGORIES: { value: Category; label: { en: string; hi: string } }[] = [
  { value: 'all', label: { en: 'All', hi: 'सभी' } },
  { value: 'politics', label: { en: 'Politics', hi: 'राजनीति' } },
  { value: 'sports', label: { en: 'Sports', hi: 'खेल' } },
  { value: 'economy', label: { en: 'Economy', hi: 'अर्थव्यवस्था' } },
  { value: 'finance', label: { en: 'Finance', hi: 'वित्त' } },
  { value: 'government', label: { en: 'Government', hi: 'सरकार' } },
  { value: 'international', label: { en: 'International', hi: 'अंतरराष्ट्रीय' } },
  { value: 'infrastructure', label: { en: 'Infrastructure', hi: 'बुनियादी ढांचा' } },
];

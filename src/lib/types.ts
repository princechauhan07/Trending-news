export type Category = 'all' | 'elections' | 'entertainment' | 'policy' | 'sports';

export type Language = 'en' | 'hi';

export interface Trend {
  rank: number;
  tag: string;
  description: string;
  category: Category;
  heatScore: number; // 0-100
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
  { value: 'elections', label: { en: 'Elections', hi: 'चुनाव' } },
  { value: 'entertainment', label: { en: 'Entertainment', hi: 'मनोरंजन' } },
  { value: 'policy', label: { en: 'Policy', hi: 'नीति' } },
  { value: 'sports', label: { en: 'Sports', hi: 'खेल' } },
];

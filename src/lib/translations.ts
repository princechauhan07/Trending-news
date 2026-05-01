import { Language, Translations } from './types';

export const i18n: Record<Language, Translations> = {
  en: {
    title: 'Bharat Trends',
    subtitle: 'Live Political Pulse of India',
    searchPlaceholder: 'Search hashtags, topics...',
    trendingNow: 'TRENDING NOW ACROSS INDIA',
    live: 'LIVE',
    posts: 'posts',
    ago: 'ago',
    rising: 'rising',
  },
  hi: {
    title: 'भारत ट्रेंड्स',
    subtitle: 'भारत की लाइव राजनीतिक नब्ज',
    searchPlaceholder: 'हैशटैग, विषय खोजें...',
    trendingNow: 'पूरे भारत में अभी क्या ट्रेंड कर रहा है',
    live: 'लाइव',
    posts: 'पोस्ट',
    ago: 'पहले',
    rising: 'बढ़ रहा है',
  },
};

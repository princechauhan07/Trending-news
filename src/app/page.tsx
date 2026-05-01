"use client"

import { useState, useEffect } from 'react';
import { Trend, Language, CATEGORIES, Category } from '@/lib/types';
import { i18n } from '@/lib/translations';
import { TrendingHeader } from '@/components/TrendingHeader';
import { TrendCard } from '@/components/TrendCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [language, setLanguage] = useState<Language>('hi');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        setTrends(data);
      } catch (e) {
        console.error("Failed to fetch trends", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  const t = i18n[language];

  const filteredTrends = trends.filter(trend => {
    const q = searchQuery.toLowerCase();
    const hashtag = language === 'hi' ? trend.hashtag_hi : trend.hashtag_en;
    const desc = language === 'hi' ? trend.description_hi : trend.description_en;
    
    const matchesSearch = hashtag.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'all' || trend.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <TrendingHeader 
        language={language} 
        onLanguageToggle={() => setLanguage(l => l === 'en' ? 'hi' : 'en')} 
      />

      <div className="px-4 py-4 space-y-4 bg-white border-b border-border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            className="pl-10 bg-secondary border-none rounded-xl h-11 text-sm focus:ring-destructive placeholder:text-muted-foreground text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-border/50'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow">
        <div className="px-4 py-3 flex items-center justify-between border-b border-border bg-background/50">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t.trendingNow}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span className="text-[10px] font-black text-destructive uppercase tracking-widest">{t.live}</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex gap-4 bg-white">
                <Skeleton className="h-6 w-8" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : filteredTrends.length > 0 ? (
            filteredTrends.map((trend) => (
              <TrendCard key={trend.hashtag_en} trend={trend} language={language} />
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground bg-white">
              <p className="text-sm font-medium">{t.noTrends}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

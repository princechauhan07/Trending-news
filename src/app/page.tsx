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
    const matchesSearch = trend.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trend.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || trend.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <TrendingHeader 
        language={language} 
        onLanguageToggle={() => setLanguage(l => l === 'en' ? 'hi' : 'en')} 
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            className="pl-10 bg-card/50 border-border rounded-xl h-12 text-sm focus:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.value
                  ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(160,106,255,0.4)]'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Trending List Section */}
      <div className="flex-grow bg-background">
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/50">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t.trendingNow}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span className="text-[9px] font-bold text-destructive uppercase tracking-widest">{t.live}</span>
          </div>
        </div>

        <div className="divide-y divide-border/30">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex gap-4 border-b border-border/50">
                <Skeleton className="h-6 w-8 bg-muted" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-1/2 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                </div>
              </div>
            ))
          ) : filteredTrends.length > 0 ? (
            filteredTrends.map((trend) => (
              <TrendCard key={trend.tag} trend={trend} language={language} />
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <p className="text-sm font-medium">No trends found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

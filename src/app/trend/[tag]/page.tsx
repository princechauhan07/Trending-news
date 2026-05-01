"use client"

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Trend, Language } from '@/lib/types';
import { i18n } from '@/lib/translations';
import { generateTrendSummary } from '@/ai/flows/generate-trend-summary-flow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Flame, Share2, TrendingUp, Newspaper, Info, Languages } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatHashtag } from '@/lib/utils';

export default function TrendDetail({ params }: { params: Promise<{ tag: string }> }) {
  const router = useRouter();
  const { tag: tagParam } = use(params);
  const tag = decodeURIComponent(tagParam);
  
  const [language, setLanguage] = useState<Language>('hi');
  const [trend, setTrend] = useState<Trend | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trending');
        const data: Trend[] = await res.json();
        // Match by cleaning hashes from stored data too
        const found = data.find(t => 
          t.hashtag_en.replace('#', '').toLowerCase() === tag.toLowerCase() || 
          t.hashtag_hi.replace('#', '').toLowerCase() === tag.toLowerCase()
        );
        
        if (found) {
          setTrend(found);
          setLoading(false);
          
          const aiResult = await generateTrendSummary({ 
            trendDescription: found.description_en 
          });
          setSummary(aiResult.summary);
          setSummaryLoading(false);
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error(e);
        router.push('/');
      }
    }
    fetchData();
  }, [tag, router]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 bg-white min-h-screen">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!trend) return null;

  const t = i18n[language];
  const hashtag = language === 'hi' ? trend.hashtag_hi : trend.hashtag_en;
  const description = language === 'hi' ? trend.description_hi : trend.description_en;
  const formattedHashtag = formatHashtag(hashtag);

  return (
    <main className="flex flex-col min-h-screen pb-10 bg-background">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border p-4 flex items-center justify-between shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-secondary text-foreground active:scale-90 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-grow text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t.trendDetails}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
            className="rounded-full text-foreground hover:bg-secondary"
          >
            <Languages className="h-4 w-4 text-destructive" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-secondary">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-8 bg-white">
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#EEF2FF] text-[#4F46E5] border-none uppercase text-[10px] font-black tracking-widest h-6 px-3">
              {trend.category}
            </Badge>
            <div className="bg-[#FEE2E2] text-[#DC2626] rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Flame className="h-3.5 w-3.5 fill-destructive text-destructive" />
              <span className="text-[11px] font-black">{trend.heatScore}/10 HEAT</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-headline font-black text-foreground leading-tight tracking-tight">
            {formattedHashtag}
          </h1>
          
          <div className="p-5 bg-secondary/20 rounded-2xl border border-border/50 shadow-inner">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">{t.summary}:</p>
            <p className="text-lg text-secondary-foreground font-semibold leading-relaxed">
              {language === 'hi' ? (
                <>आज <span className="text-destructive font-black underline decoration-destructive/20">{formattedHashtag}</span> भारत में ट्रेंड कर रहा है। यह <span className="text-foreground font-black">{description}</span> से जुड़ा हुआ है।</>
              ) : (
                <>Today <span className="text-destructive font-black underline decoration-destructive/20">{formattedHashtag}</span> is trending in India. It is related to <span className="text-foreground font-black">{description}</span>.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-8 pt-2">
            <div className="flex flex-col">
              <span className="text-2xl font-headline font-black text-destructive tabular-nums">{trend.posts}</span>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t.totalPosts}</span>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-headline font-black text-foreground tabular-nums">{trend.time}</span>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t.trendingFor}</span>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-16 w-16 text-destructive -rotate-12" />
          </div>
          
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-destructive/10 p-2 rounded-xl">
              <Info className="h-4 w-4 text-destructive" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{t.aiContext}</h2>
          </div>

          {summaryLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          ) : (
            <p className="text-base font-semibold text-foreground leading-relaxed">
              {summary}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">{t.sourcesTracked}</h3>
          <div className="flex flex-wrap gap-2.5">
            {trend.source.map((s) => (
              <Badge key={s} variant="secondary" className="bg-secondary text-secondary-foreground capitalize flex gap-2 items-center px-4 py-1.5 text-[10px] font-black shadow-sm border-none">
                {s === 'news' ? <Newspaper className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
                {s.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

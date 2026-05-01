"use client"

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Trend, Language, Category } from '@/lib/types';
import { generateTrendSummary } from '@/ai/flows/generate-trend-summary-flow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Flame, Share2, TrendingUp, Newspaper, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrendDetail({ params }: { params: Promise<{ tag: string }> }) {
  const router = useRouter();
  const { tag } = use(params);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trending');
        const data: Trend[] = await res.json();
        // Check for tag match (api tags are like #TagName)
        const found = data.find(t => t.tag.replace('#', '').toLowerCase() === tag.toLowerCase());
        
        if (found) {
          setTrend(found);
          setLoading(false);
          
          // Generate AI Summary
          const aiResult = await generateTrendSummary({ trendDescription: found.description });
          setSummary(aiResult.summary);
          setSummaryLoading(false);
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [tag, router]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 bg-white min-h-screen">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!trend) return null;

  return (
    <main className="flex flex-col min-h-screen pb-10 bg-background">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-secondary text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-grow text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Trend Details</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-foreground">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-8 bg-white">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#EEF2FF] text-[#4F46E5] border-none uppercase text-[10px] font-black tracking-widest h-5">
              {trend.category}
            </Badge>
            <div className="bg-[#FEE2E2] text-[#DC2626] rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <Flame className="h-3 w-3 fill-destructive text-destructive" />
              <span className="text-[11px] font-black">{trend.heatScore}/10 HEAT</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-headline font-black text-foreground leading-tight">
            {trend.tag}
          </h1>
          
          <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
            <p className="text-sm font-bold text-foreground mb-2">Summary:</p>
            <p className="text-base text-secondary-foreground font-medium leading-relaxed">
              आज <span className="text-destructive font-black">{trend.tag}</span> भारत में ट्रेंड कर रहा है। यह <span className="font-bold">{trend.description}</span> से जुड़ा हुआ है।
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-headline font-black text-destructive">{trend.posts}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Posts</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-xl font-headline font-black text-foreground">{trend.time}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Trending For</span>
            </div>
          </div>
        </section>

        {/* AI Insight Section */}
        <section className="bg-secondary/30 border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <TrendingUp className="h-10 w-10 text-destructive/10 -rotate-12" />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-destructive/10 p-1.5 rounded-lg">
              <Info className="h-4 w-4 text-destructive" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">AI Context (Hindi)</h2>
          </div>

          {summaryLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-base font-medium text-foreground leading-relaxed">
              {summary}
            </p>
          )}
        </section>

        {/* Meta Info */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Sources tracked</h3>
          <div className="flex flex-wrap gap-2">
            {trend.source.map((s) => (
              <Badge key={s} variant="secondary" className="bg-secondary text-secondary-foreground capitalize flex gap-1.5 items-center px-3 py-1 text-[10px] font-bold">
                {s === 'news' ? <Newspaper className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
                {s}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

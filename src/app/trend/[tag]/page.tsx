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
        const found = data.find(t => t.tag.toLowerCase() === `#${tag}`.toLowerCase());
        
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
      <div className="p-4 space-y-6">
        <Skeleton className="h-10 w-10 bg-muted" />
        <Skeleton className="h-12 w-3/4 bg-muted" />
        <Skeleton className="h-40 w-full bg-muted" />
      </div>
    );
  }

  if (!trend) return null;

  return (
    <main className="flex flex-col min-h-screen pb-10 bg-background">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-muted"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-grow text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Trend Details</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-accent border-none uppercase text-[10px] tracking-widest h-5">
              {trend.category}
            </Badge>
            <div className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 flex items-center gap-1">
              <Flame className="h-3 w-3 fill-destructive" />
              <span className="text-[10px] font-black">{Math.floor(trend.heatScore / 10)}/10 HEAT</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-headline font-black text-white leading-tight">
            {trend.tag}
          </h1>
          
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            {trend.description}
          </p>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-headline font-bold text-accent">{trend.posts}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Posts</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-xl font-headline font-bold text-white">{trend.time}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trending For</span>
            </div>
          </div>
        </section>

        {/* AI Insight Section */}
        <section className="bg-card/50 border border-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <TrendingUp className="h-12 w-12 text-accent/10 -rotate-12" />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-accent/20 p-1.5 rounded-lg">
              <Info className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">AI Context (Hindi)</h2>
          </div>

          {summaryLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </div>
          ) : (
            <p className="text-lg font-medium text-white leading-relaxed font-body">
              {summary}
            </p>
          )}
        </section>

        {/* Meta Info */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Sources tracked</h3>
          <div className="flex flex-wrap gap-2">
            {trend.source.map((s) => (
              <Badge key={s} variant="outline" className="border-border bg-transparent text-muted-foreground capitalize flex gap-1.5 items-center px-3 py-1">
                {s === 'news' ? <Newspaper className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
                {s}
              </Badge>
            ))}
          </div>
        </section>

        {/* Dummy Post Block */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Top related content</h3>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs">BT</div>
                <div>
                   <p className="text-sm font-bold">BharatTrends News</p>
                   <p className="text-[10px] text-muted-foreground">@bharattrends • 2h ago</p>
                </div>
             </div>
             <p className="text-sm text-foreground">
                आज {trend.tag} चर्चा का मुख्य विषय बना हुआ है। विभिन्न माध्यमों से मिल रही रिपोर्ट के अनुसार, लोग इस विषय पर अपनी गहरी प्रतिक्रियाएं दे रहे हैं।
             </p>
             <div className="aspect-video w-full bg-muted rounded-xl overflow-hidden relative">
                <img 
                  src={`https://picsum.photos/seed/${trend.rank}/600/400`} 
                  alt="Trend visualization" 
                  className="object-cover w-full h-full opacity-60"
                  data-ai-hint="India politics"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                   <p className="text-xs font-bold text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/20">Live Media</p>
                </div>
             </div>
          </div>
        </section>
      </div>
    </main>
  );
}

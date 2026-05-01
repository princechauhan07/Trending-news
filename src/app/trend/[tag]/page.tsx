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
              <span className="text-[11px] font-black">{Math.floor(trend.heatScore / 10)}/10 HEAT</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-headline font-black text-foreground leading-tight">
            {trend.tag}
          </h1>
          
          <p className="text-base text-secondary-foreground font-medium leading-relaxed">
            {trend.description}
          </p>

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

        {/* Post Block */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Top related content</h3>
          <div className="bg-white border border-border rounded-2xl p-4 space-y-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-black text-destructive text-xs">BT</div>
                <div>
                   <p className="text-sm font-black text-foreground">BharatTrends News</p>
                   <p className="text-[10px] text-muted-foreground font-bold">@bharattrends • 2h ago</p>
                </div>
             </div>
             <p className="text-[13px] text-secondary-foreground leading-relaxed">
                आज {trend.tag} चर्चा का मुख्य विषय बना हुआ है। विभिन्न माध्यमों से मिल रही रिपोर्ट के अनुसार, लोग इस विषय पर अपनी गहरी प्रतिक्रियाएं दे रहे हैं।
             </p>
             <div className="aspect-video w-full bg-secondary rounded-xl overflow-hidden relative">
                <img 
                  src={`https://picsum.photos/seed/${trend.rank}/600/400`} 
                  alt="Trend visualization" 
                  className="object-cover w-full h-full opacity-80"
                  data-ai-hint="India politics"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <p className="text-[9px] font-black text-white uppercase tracking-widest bg-destructive/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">Live Media</p>
                </div>
             </div>
          </div>
        </section>
      </div>
    </main>
  );
}

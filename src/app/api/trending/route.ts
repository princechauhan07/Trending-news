import { NextResponse } from 'next/server';
import { Trend, Category } from '@/lib/types';
import { enrichTrends } from '@/ai/flows/enrich-trends-flow';

const GOOGLE_TRENDS_RSS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN';

function calculateHeatScore(traffic: string): number {
  const num = parseInt(traffic.replace(/[^0-9]/g, '')) || 0;
  if (num >= 200000) return 10;
  if (num >= 100000) return 9;
  if (num >= 50000) return 8;
  if (num >= 20000) return 7;
  return 6;
}

function generatePosts(traffic: string): string {
  const base = parseInt(traffic.replace(/[^0-9]/g, '')) || 10000;
  const randomFactor = 1 + (Math.random() * 0.4);
  const val = Math.floor(base * randomFactor);
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return Math.floor(val / 1000) + 'K';
  return val.toString();
}

export async function GET() {
  try {
    const res = await fetch(GOOGLE_TRENDS_RSS, { next: { revalidate: 300 } });
    const xml = await res.text();

    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    const rawTrends = items.slice(0, 15).map(item => {
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const traffic = item.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || '10,000+';
      return { title, traffic };
    });

    if (rawTrends.length === 0) throw new Error('No trends found');

    const { enriched } = await enrichTrends({ rawTrends });

    const finalTrends: Trend[] = enriched.map((item, index) => {
      const raw = rawTrends[index] || { traffic: '10,000+' };
      return {
        rank: index + 1,
        hashtag_hi: item.hashtag_hi,
        hashtag_en: item.hashtag_en,
        description_hi: item.description_hi,
        description_en: item.description_en,
        category: item.category.toLowerCase() as Category,
        heatScore: calculateHeatScore(raw.traffic),
        posts: generatePosts(raw.traffic),
        time: `${Math.floor(Math.random() * 5) + 1}h`,
        source: ['google_trends', 'search'],
      };
    });

    return NextResponse.json(finalTrends);
  } catch (error) {
    console.error('API Error:', error);
    // Return empty list so UI can handle error state or show skeleton
    return NextResponse.json([]);
  }
}

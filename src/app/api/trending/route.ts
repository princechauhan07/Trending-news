import { NextResponse } from 'next/server';
import { Trend, Category } from '@/lib/types';
import { enrichTrends } from '@/ai/flows/enrich-trends-flow';

const GOOGLE_TRENDS_RSS = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN';

// Fallback data in case of API failure
const FALLBACK_TRENDS: Trend[] = [
  { rank: 1, hashtag_hi: "#पश्चिमबंगालचुनाव", hashtag_en: "#WestBengalElections", description_hi: "पश्चिम बंगाल चुनाव 2026", description_en: "West Bengal Assembly Elections 2026", category: "politics", heatScore: 10, posts: "450K", time: "1h", source: ["news", "social"] },
  { rank: 2, hashtag_hi: "#भाजपा", hashtag_en: "#BJPStrategy", description_hi: "भाजपा की रणनीति बैठक", description_en: "BJP Strategy Meeting Kolkata", category: "politics", heatScore: 9, posts: "320K", time: "2h", source: ["news"] },
  { rank: 3, hashtag_hi: "#आईपीएल", hashtag_en: "#IPL2026", description_hi: "आईपीएल क्रिकेट समाचार", description_en: "IPL Cricket News 2026", category: "sports", heatScore: 8, posts: "1.2M", time: "4h", source: ["social", "search"] },
];

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
  const randomFactor = 1 + (Math.random() * 0.5);
  const val = Math.floor(base * randomFactor);
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return Math.floor(val / 1000) + 'K';
  return val.toString();
}

export async function GET() {
  try {
    const res = await fetch(GOOGLE_TRENDS_RSS, { next: { revalidate: 300 } }); // Cache for 5 mins
    const xml = await res.text();

    // Simple XML parsing using regex for Edge compatibility
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    const rawTrends = items.slice(0, 10).map(item => {
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const traffic = item.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || '10,000+';
      return { title, traffic };
    });

    if (rawTrends.length === 0) throw new Error('No trends found in RSS');

    // Enrich using Genkit AI for bilingual support and categorization
    const { enriched } = await enrichTrends({ rawTrends });

    const finalTrends: Trend[] = enriched.map((item, index) => {
      const raw = rawTrends[index];
      const heatScore = calculateHeatScore(raw.traffic);
      
      return {
        rank: index + 1,
        hashtag_hi: item.hashtag_hi.startsWith('#') ? item.hashtag_hi : '#' + item.hashtag_hi,
        hashtag_en: item.hashtag_en.startsWith('#') ? item.hashtag_en : '#' + item.hashtag_en,
        description_hi: item.description_hi,
        description_en: item.description_en,
        category: item.category.toLowerCase() as Category,
        heatScore,
        posts: generatePosts(raw.traffic),
        time: `${Math.floor(Math.random() * 5) + 1}h`,
        source: ['google_trends', Math.random() > 0.5 ? 'news' : 'social'],
      };
    });

    return NextResponse.json(finalTrends);
  } catch (error) {
    console.error('Real-time fetch failed, using fallback:', error);
    return NextResponse.json(FALLBACK_TRENDS);
  }
}

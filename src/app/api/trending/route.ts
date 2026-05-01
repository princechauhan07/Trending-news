import { NextResponse } from 'next/server';
import { Trend, Category } from '@/lib/types';

const rawTrends = [
  { hashtag: "पश्चिम_बंगाल_चुनाव", description: "West Bengal Assembly Elections 2026", category: "Politics", heat_score: 10 },
  { hashtag: "भाजपा_रणनीति", description: "BJP Strategy Meeting Kolkata", category: "Politics", heat_score: 9 },
  { hashtag: "चुनाव_आयोग_विवाद", description: "Election Commission Controversy", category: "Politics", heat_score: 9 },
  { hashtag: "एलपीजी_मूल्य", description: "LPG Price Changes in India", category: "Economy", heat_score: 8 },
  { hashtag: "आईपीएल_खेल", description: "IPL Cricket News 2026", category: "Sports", heat_score: 8 },
  { hashtag: "छत्तीसगढ़_रेलवे", description: "Chhattisgarh Railway Station News", category: "Infrastructure", heat_score: 7 },
  { hashtag: "ओडिशा_राजनीति", description: "Odisha Political Updates", category: "Politics", heat_score: 7 },
  { hashtag: "शेयर_बाजार", description: "Stock Market Updates Today", category: "Finance", heat_score: 6 },
  { hashtag: "डिजिटल_जनगणना", description: "Digital Census Announcement", category: "Government", heat_score: 6 },
  { hashtag: "ईरान_संबंध", description: "International Relations with Iran", category: "International", heat_score: 5 }
];

function generatePosts() {
  const values = ["120K", "245K", "312K", "458K", "520K", "1.2M", "2.5M"];
  return values[Math.floor(Math.random() * values.length)];
}

function generateTime() {
  const hours = Math.floor(Math.random() * 24) + 1;
  return `${hours}h`;
}

function generateSources() {
  const all = ["social", "news", "search"];
  const count = Math.floor(Math.random() * 2) + 1;
  return all.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function GET() {
  // Map raw data to the internal Trend interface
  const trends: Trend[] = rawTrends.map((t, index) => {
    // Clean hashtag: remove underscores and prepend #
    const tag = `#${t.hashtag.replace(/_/g, '')}`;
    
    return {
      rank: 0, // Will be set after sorting
      tag,
      description: t.description,
      category: t.category.toLowerCase() as Category,
      heatScore: t.heat_score,
      posts: generatePosts(),
      time: generateTime(),
      source: generateSources(),
    };
  });

  // Sort by heatScore DESC
  const sortedTrends = [...trends].sort((a, b) => b.heatScore - a.heatScore);
  
  // Assign rank
  sortedTrends.forEach((t, i) => t.rank = i + 1);

  // Small randomization: shuffle order slightly for items with same heatScore
  // or just return sorted by rank
  return NextResponse.json(sortedTrends);
}

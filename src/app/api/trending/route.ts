import { NextResponse } from 'next/server';
import { Trend, Category } from '@/lib/types';

const rawTrends = [
  { hashtag_hi: "पश्चिम_बंगाल_चुनाव", hashtag_en: "WestBengalElections", description_hi: "पश्चिम बंगाल चुनाव 2026", description_en: "West Bengal Assembly Elections 2026", category: "Politics", heat_score: 10 },
  { hashtag_hi: "भाजपा_रणनीति", hashtag_en: "BJPStrategy", description_hi: "कोलकाता में भाजपा की रणनीति बैठक", description_en: "BJP Strategy Meeting Kolkata", category: "Politics", heat_score: 9 },
  { hashtag_hi: "चुनाव_आयोग_विवाद", hashtag_en: "ECIControversy", description_hi: "चुनाव आयोग विवाद", description_en: "Election Commission Controversy", category: "Politics", heat_score: 9 },
  { hashtag_hi: "एलपीजी_मूल्य", hashtag_en: "LPGPrice", description_hi: "भारत में एलपीजी की कीमतों में बदलाव", description_en: "LPG Price Changes in India", category: "Economy", heat_score: 8 },
  { hashtag_hi: "आईपीएल_खेल", hashtag_en: "IPL2026", description_hi: "आईपीएल क्रिकेट समाचार 2026", description_en: "IPL Cricket News 2026", category: "Sports", heat_score: 8 },
  { hashtag_hi: "छत्तीसगढ़_रेलवे", hashtag_en: "ChhattisgarhRailway", description_hi: "छत्तीसगढ़ रेलवे स्टेशन समाचार", description_en: "Chhattisgarh Railway Station News", category: "Infrastructure", heat_score: 7 },
  { hashtag_hi: "ओडिशा_राजनीति", hashtag_en: "OdishaPolitics", description_hi: "ओडिशा राजनीतिक अपडेट", description_en: "Odisha Political Updates", category: "Politics", heat_score: 7 },
  { hashtag_hi: "शेयर_बाजार", hashtag_en: "StockMarket", description_hi: "शेयर बाजार अपडेट आज", description_en: "Stock Market Updates Today", category: "Finance", heat_score: 6 },
  { hashtag_hi: "डिजिटल_जनगणना", hashtag_en: "DigitalCensus", description_hi: "डिजिटल जनगणना की घोषणा", description_en: "Digital Census Announcement", category: "Government", heat_score: 6 },
  { hashtag_hi: "ईरान_संबंध", hashtag_en: "IranRelations", description_hi: "ईरान के साथ अंतर्राष्ट्रीय संबंध", description_en: "International Relations with Iran", category: "International", heat_score: 5 }
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
  const trends: Trend[] = rawTrends.map((t) => ({
    ...t,
    rank: 0,
    heatScore: t.heat_score,
    posts: generatePosts(),
    time: generateTime(),
    source: generateSources(),
    category: t.category.toLowerCase() as Category,
  }));

  const sortedTrends = [...trends].sort((a, b) => b.heatScore - a.heatScore);
  sortedTrends.forEach((t, i) => t.rank = i + 1);

  return NextResponse.json(sortedTrends);
}

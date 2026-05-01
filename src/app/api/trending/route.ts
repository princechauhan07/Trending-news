import { NextResponse } from 'next/server';
import { Trend, Category } from '@/lib/types';

const RAW_DATA = [
  { hashtag_hi: "पश्चिम_बंगाल_चुनाव", hashtag_en: "WestBengalElections", description_en: "West Bengal Assembly Elections 2026", description_hi: "पश्चिम बंगाल विधानसभा चुनाव 2026", category: "politics", heat_score: 10 },
  { hashtag_hi: "भाजपा_रणनीति", hashtag_en: "BJPStrategy", description_en: "BJP Strategy Meeting Kolkata", description_hi: "कोलकाता में भाजपा की रणनीति बैठक", category: "politics", heat_score: 9 },
  { hashtag_hi: "चुनाव_आयोग_विवाद", hashtag_en: "ECControversy", description_en: "Election Commission Controversy", description_hi: "चुनाव आयोग विवाद", category: "politics", heat_score: 9 },
  { hashtag_hi: "एलपीजी_मूल्य", hashtag_en: "LPGPrice", description_en: "LPG Price Changes in India", description_hi: "भारत में एलपीजी की कीमतों में बदलाव", category: "economy", heat_score: 8 },
  { hashtag_hi: "आईपीएल_खेल", hashtag_en: "IPLNews", description_en: "IPL Cricket News 2026", description_hi: "आईपीएल क्रिकेट समाचार 2026", category: "sports", heat_score: 8 },
  { hashtag_hi: "छत्तीसगढ़_रेलवे", hashtag_en: "ChhattisgarhRailway", description_en: "Chhattisgarh Railway Station News", description_hi: "छत्तीसगढ़ रेलवे स्टेशन समाचार", category: "infrastructure", heat_score: 7 },
  { hashtag_hi: "ओडिशा_राजनीति", hashtag_en: "OdishaPolitics", description_en: "Odisha Political Updates", description_hi: "ओडिशा राजनीतिक अपडेट", category: "politics", heat_score: 7 },
  { hashtag_hi: "शेयर_बाजार", hashtag_en: "StockMarket", description_en: "Stock Market Updates Today", description_hi: "आज का शेयर बाजार अपडेट", category: "finance", heat_score: 6 },
  { hashtag_hi: "डिजिटल_जनगणना", hashtag_en: "DigitalCensus", description_en: "Digital Census Announcement", description_hi: "डिजिटल जनगणना की घोषणा", category: "government", heat_score: 6 },
  { hashtag_hi: "ईरान_संबंध", hashtag_en: "IranRelations", description_en: "International Relations with Iran", description_hi: "ईरान के साथ अंतरराष्ट्रीय संबंध", category: "international", heat_score: 5 }
];

function generatePosts(): string {
  const val = Math.floor(Math.random() * 500) + 50; // 50K to 550K
  return val + 'K';
}

function generateTime(): string {
  const hours = Math.floor(Math.random() * 5) + 1;
  return `${hours}h`;
}

function generateSource(): string[] {
  const sources = ["social", "news", "search"];
  const count = Math.floor(Math.random() * 2) + 1;
  return sources.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function GET() {
  try {
    // Sort by heat score descending
    const sortedData = [...RAW_DATA].sort((a, b) => b.heat_score - a.heat_score);

    const finalTrends: Trend[] = sortedData.map((item, index) => {
      return {
        rank: index + 1,
        hashtag_hi: item.hashtag_hi,
        hashtag_en: item.hashtag_en,
        description_hi: item.description_hi,
        description_en: item.description_en,
        category: item.category as Category,
        heatScore: item.heat_score,
        posts: generatePosts(),
        time: generateTime(),
        source: generateSource(),
      };
    });

    return NextResponse.json(finalTrends);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([]);
  }
}

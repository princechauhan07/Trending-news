import { NextResponse } from 'next/server';
import { Trend } from '@/lib/types';

const mockTrends: Trend[] = [
  {
    rank: 1,
    tag: "#FarmersProtest",
    description: "किसानों द्वारा MSP कानून की मांग",
    category: "policy",
    heatScore: 95,
    posts: "195K",
    time: "2h",
    source: ["social", "news"]
  },
  {
    rank: 2,
    tag: "#Elections2024",
    description: "लोकसभा चुनाव की रणनीतियां",
    category: "elections",
    heatScore: 92,
    posts: "458K",
    time: "1h",
    source: ["news", "social"]
  },
  {
    rank: 3,
    tag: "#CWC2023",
    description: "भारतीय टीम का शानदार प्रदर्शन",
    category: "sports",
    heatScore: 88,
    posts: "2.1M",
    time: "3h",
    source: ["social"]
  },
  {
    rank: 4,
    tag: "#Pathaan2",
    description: "शाहरुख खान की अगली फिल्म की चर्चा",
    category: "entertainment",
    heatScore: 85,
    posts: "110K",
    time: "5h",
    source: ["social"]
  },
  {
    rank: 5,
    tag: "#Budget2024",
    description: "आम आदमी के लिए नए टैक्स नियम",
    category: "policy",
    heatScore: 82,
    posts: "85K",
    time: "6h",
    source: ["news"]
  },
  {
    rank: 6,
    tag: "#IPLRetention",
    description: "खिलाड़ियों की नीलामी की ताजा अपडेट",
    category: "sports",
    heatScore: 78,
    posts: "320K",
    time: "4h",
    source: ["social", "news"]
  },
  {
    rank: 7,
    tag: "#UniformCivilCode",
    description: "UCC पर देश भर में बहस जारी",
    category: "policy",
    heatScore: 75,
    posts: "67K",
    time: "8h",
    source: ["news"]
  },
  {
    rank: 8,
    tag: "#RamMandir",
    description: "अयोध्या में भक्तों का तांता",
    category: "elections",
    heatScore: 72,
    posts: "1.5M",
    time: "12h",
    source: ["social"]
  },
  {
    rank: 9,
    tag: "#DelhiPollution",
    description: "प्रदूषण के चलते स्कूलों में छुट्टी",
    category: "policy",
    heatScore: 68,
    posts: "42K",
    time: "10h",
    source: ["news", "social"]
  },
  {
    rank: 10,
    tag: "#Stree3",
    description: "हॉरर कॉमेडी यूनिवर्स का विस्तार",
    category: "entertainment",
    heatScore: 65,
    posts: "28K",
    time: "15h",
    source: ["social"]
  }
];

export async function GET() {
  // Sort by heatScore DESC
  const sortedTrends = [...mockTrends].sort((a, b) => b.heatScore - a.heatScore);
  return NextResponse.json(sortedTrends);
}

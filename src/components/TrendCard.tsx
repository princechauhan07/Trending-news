"use client"

import { useRouter } from "next/navigation";
import { Trend, Language } from "@/lib/types";
import { i18n } from "@/lib/translations";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { cn, formatHashtag } from "@/lib/utils";

interface TrendCardProps {
  trend: Trend;
  language: Language;
}

export function TrendCard({ trend, language }: TrendCardProps) {
  const router = useRouter();
  const t = i18n[language];
  
  const hashtag = language === 'hi' ? trend.hashtag_hi : trend.hashtag_en;
  const description = language === 'hi' ? trend.description_hi : trend.description_en;
  const formattedHashtag = formatHashtag(hashtag);

  const rankStr = trend.rank.toString().padStart(2, '0');
  const isTopThree = trend.rank <= 3;
  const isRising = trend.heatScore >= 9;

  const handleCardClick = () => {
    // Navigate using the English hashtag as the URL identifier
    router.push(`/trend/${encodeURIComponent(trend.hashtag_en.replace('#', ''))}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white hover:bg-secondary/40 active:scale-[0.99] transition-all duration-200 cursor-pointer p-4 flex items-start gap-4 border-b border-border last:border-none",
        isTopThree && "border-l-4 border-l-destructive shadow-sm"
      )}
    >
      <div className="flex-shrink-0 w-8 pt-0.5">
        <span className={cn(
          "text-sm font-headline font-black transition-colors",
          isTopThree ? "text-destructive" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {rankStr}
        </span>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[15px] font-headline font-bold text-foreground truncate">
            {formattedHashtag}
          </span>
          <Badge className="bg-[#EEF2FF] text-[#4F46E5] border-none text-[9px] px-1.5 py-0 h-4 uppercase font-black tracking-wider">
            {trend.category}
          </Badge>
        </div>
        
        <p className="text-[13px] text-secondary-foreground leading-relaxed line-clamp-2 mb-1.5 font-medium">
          {description}
        </p>

        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <span>{trend.posts} {t.posts}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40"></span>
          <span>{trend.time} {t.ago}</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
        <div className="bg-[#FEE2E2] text-[#DC2626] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
          <Flame className="h-3 w-3 fill-destructive text-destructive" />
          <span className="text-[10px] font-black">{trend.heatScore}/10</span>
        </div>
        {isRising && (
          <span className="text-[9px] font-black text-destructive uppercase tracking-tighter animate-pulse flex items-center gap-0.5">
            🔥 {t.rising}
          </span>
        )}
      </div>
    </div>
  );
}

"use client"

import Link from "next/link";
import { Trend, Language } from "@/lib/types";
import { i18n } from "@/lib/translations";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface TrendCardProps {
  trend: Trend;
  language: Language;
}

export function TrendCard({ trend, language }: TrendCardProps) {
  const t = i18n[language];
  const rankStr = trend.rank.toString().padStart(2, '0');

  return (
    <Link href={`/trend/${trend.tag.replace('#', '')}`}>
      <div className="group relative bg-white hover:bg-secondary/30 active:bg-secondary/50 p-4 transition-all flex items-start gap-4 border-b border-border last:border-none">
        <div className="flex-shrink-0 w-6 pt-0.5">
          <span className="text-sm font-headline font-black text-muted-foreground group-hover:text-foreground transition-colors">
            {rankStr}
          </span>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[15px] font-headline font-bold text-foreground truncate">
              {trend.tag}
            </span>
            <Badge className="bg-[#EEF2FF] text-[#4F46E5] border-none text-[9px] px-1.5 py-0 h-4 uppercase font-black tracking-wider">
              {trend.category}
            </Badge>
          </div>
          
          <p className="text-[13px] text-secondary-foreground leading-relaxed line-clamp-1 mb-1.5">
            {trend.description}
          </p>

          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <span>{trend.posts} {t.posts}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40"></span>
            <span>{trend.time} {t.ago}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
          <div className="bg-[#FEE2E2] text-[#DC2626] rounded-full px-2 py-0.5 flex items-center gap-1">
            <Flame className="h-3 w-3 fill-destructive text-destructive" />
            <span className="text-[10px] font-black">{Math.floor(trend.heatScore / 10)}/10</span>
          </div>
          {trend.heatScore > 85 && (
            <span className="text-[9px] font-bold text-destructive uppercase tracking-tighter animate-pulse flex items-center gap-0.5">
              🔥 {t.rising}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

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
      <div className="group relative bg-card/40 hover:bg-card/60 active:bg-secondary border-b border-border/50 p-4 transition-all flex items-start gap-4">
        <div className="flex-shrink-0 w-8 pt-1">
          <span className="text-lg font-headline font-bold text-muted-foreground group-hover:text-accent transition-colors">
            {rankStr}
          </span>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-headline font-bold truncate group-hover:text-accent transition-colors">
              {trend.tag}
            </span>
            <Badge variant="secondary" className="bg-primary/20 text-accent border-none text-[10px] px-2 py-0 h-4 capitalize">
              {trend.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {trend.description}
          </p>

          <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <span>{trend.posts} {t.posts}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
            <span>{trend.time} {t.ago}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-full px-2 py-0.5 flex items-center gap-1">
            <Flame className="h-3 w-3 fill-destructive" />
            <span className="text-[10px] font-bold">{Math.floor(trend.heatScore / 10)}/10</span>
          </div>
          {trend.heatScore > 85 && (
            <span className="text-[9px] font-bold text-accent uppercase tracking-tighter animate-pulse">
              🔥 {t.rising}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

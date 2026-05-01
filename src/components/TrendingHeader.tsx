"use client"

import { Language } from "@/lib/types";
import { i18n } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface TrendingHeaderProps {
  language: Language;
  onLanguageToggle: () => void;
}

export function TrendingHeader({ language, onLanguageToggle }: TrendingHeaderProps) {
  const t = i18n[language];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-headline font-black tracking-tight text-foreground">
            {t.title.split(' ')[0]} <span className="text-destructive">{t.title.split(' ')[1]}</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onLanguageToggle}
          className="rounded-full bg-secondary hover:bg-border/50 text-foreground border-none h-8 px-4 flex items-center gap-2 transition-all active:scale-95"
        >
          <Languages className="h-3.5 w-3.5 text-destructive" />
          <span className="font-bold text-[10px] tracking-wide uppercase">
            {language === 'en' ? 'हिन्दी' : 'EN'}
          </span>
        </Button>
      </div>
    </header>
  );
}

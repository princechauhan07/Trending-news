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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-headline font-bold tracking-tight text-accent">
            {t.title}
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onLanguageToggle}
          className="rounded-full bg-card hover:bg-muted border border-border h-9 px-4 flex items-center gap-2 transition-all active:scale-95"
        >
          <Languages className="h-4 w-4 text-accent" />
          <span className="font-semibold text-xs tracking-wide uppercase">
            {language === 'en' ? 'हिन्दी' : 'EN'}
          </span>
        </Button>
      </div>
    </header>
  );
}

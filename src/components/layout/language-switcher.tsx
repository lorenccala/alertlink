
"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChangeLocale, useCurrentLocale, useI18n } from '@/lib/i18n/client';
import type { Locale } from 'next-international/middleware';

export function LanguageSwitcher() {
  const { toast } = useToast();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const t = useI18n();

  const handleLanguageChange = (lang: Locale) => {
    changeLocale(lang);
    toast({
      title: t('languageSwitcher.languageChangedTitle'),
      description: t('languageSwitcher.languageChangedDescription', { language: lang === 'en' ? t('languageSwitcher.english') : t('languageSwitcher.albanian') }),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:aspect-square" 
          title={t('appShell.languageSwitcherTitle')}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('appShell.languageSwitcherTitle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-40 mb-2">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          disabled={currentLocale === 'en'}
          className="flex justify-between"
        >
          <span>{t('languageSwitcher.english')}</span>
          {currentLocale === 'en' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('sq')}
          disabled={currentLocale === 'sq'}
          className="flex justify-between"
        >
          <span>{t('languageSwitcher.albanian')}</span>
          {currentLocale === 'sq' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

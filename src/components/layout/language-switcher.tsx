
"use client";

import { useChangeLocale, useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Languages } from 'lucide-react';
import type { Locale } from '@/lib/i18n/settings';

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const t = useI18n();

  const localeDisplayNames: Record<Locale, string> = {
    en: t('appShell.english'),
    sq: t('appShell.albanian'),
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:aspect-square">
          <Languages className="h-5 w-5 mr-0 group-data-[collapsible=icon]:mr-0 md:mr-2" />
          <span className="hidden md:inline group-data-[collapsible=icon]:hidden">{localeDisplayNames[currentLocale]}</span>
          <ChevronDown className="h-4 w-4 ml-1 hidden md:inline group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => changeLocale('en')} disabled={currentLocale === 'en'}>
          {localeDisplayNames['en']}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => changeLocale('sq')} disabled={currentLocale === 'sq'}>
          {localeDisplayNames['sq']}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

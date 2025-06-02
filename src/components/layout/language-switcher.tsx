
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'sq'; // English, Albanian (Shqip)

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const { toast } = useToast();

  useEffect(() => {
    const storedLang = localStorage.getItem('app-language') as Language | null;
    if (storedLang && ['en', 'sq'].includes(storedLang)) {
      setSelectedLanguage(storedLang);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    localStorage.setItem('app-language', lang);
    toast({
      title: "Language Changed",
      description: `Language set to ${lang === 'en' ? 'English' : 'Shqip'}. App content will update upon full i18n integration.`,
    });
    // In a real app with i18n, you might trigger a context update or router.refresh()
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:aspect-square" 
          title="Change language"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-40 mb-2">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          disabled={selectedLanguage === 'en'}
          className="flex justify-between"
        >
          <span>English</span>
          {selectedLanguage === 'en' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('sq')}
          disabled={selectedLanguage === 'sq'}
          className="flex justify-between"
        >
          <span>Shqip</span>
          {selectedLanguage === 'sq' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

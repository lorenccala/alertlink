'use client';

import { useRouter, useParams } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languages = [
    { code: 'al', name: 'Shqip' },
    { code: 'en', name: 'English' }
] as const;

export function LanguageSwitcher() {
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'al';

    const switchLanguage = (locale: string) => {
        // Get the current path without the locale prefix
        const path = window.location.pathname.replace(`/${currentLocale}`, '');
        router.push(`/${locale}${path}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 px-0">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={currentLocale === lang.code ? 'bg-accent' : ''}
                    >
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 
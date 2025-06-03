
"use client";

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Megaphone, Settings, LogOut, ShieldAlert, ChevronDown, Search, Users as UsersIcon } from 'lucide-react';
import { getCurrentUser, mockUsers, getLocalizedName } from '@/lib/mock-data';
import type { User, Locale } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '../ui/input';
import { LanguageSwitcher } from './language-switcher';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';


interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const t = useI18n();
  const currentLocale = useCurrentLocale() as Locale;


  React.useEffect(() => {
    setIsClient(true);
    const storedRole = localStorage.getItem('alertlink-user-role') as User['role'] | null;
    const authStatus = localStorage.getItem('alertlink-auth');

    if (!authStatus || !storedRole) {
      router.replace(`/${currentLocale}/auth/login`);
      return;
    }
    
    const user = mockUsers.find(u => u.role === storedRole) || getCurrentUser(); // getCurrentUser might need locale
    setCurrentUser({...user, role: storedRole}); 
  }, [router, currentLocale]);


  const handleLogout = () => {
    localStorage.removeItem('alertlink-user-role');
    localStorage.removeItem('alertlink-auth');
    router.push(`/${currentLocale}/auth/login`);
  };

  if (!isClient || !currentUser) {
    return <div className="flex h-screen items-center justify-center"><p>Loading user data...</p></div>;
  }
  
  const navItems = [
    { href: `/${currentLocale}/dashboard`, labelKey: 'appShell.chats', icon: MessageSquare, roles: ['admin', 'responder', 'observer'] },
    { href: `/${currentLocale}/dashboard/broadcasts`, labelKey: 'appShell.broadcasts', icon: Megaphone, roles: ['admin', 'responder', 'observer'] },
    { href: `/${currentLocale}/dashboard/user-management`, labelKey: 'appShell.userManagement', icon: UsersIcon, roles: ['admin'] },
    { href: `/${currentLocale}/dashboard/settings`, labelKey: 'appShell.settings', icon: Settings, roles: ['admin', 'responder', 'observer'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));
  const currentUserName = getLocalizedName(currentUser.name, currentLocale);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4 items-center">
          <Link href={`/${currentLocale}/dashboard`} className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">AlertLink</h1>
          </Link>
           <Link href={`/${currentLocale}/dashboard`} className="items-center gap-2 hidden group-data-[collapsible=icon]:flex">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="p-2">
            <div className="relative group-data-[collapsible=icon]:hidden mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('appShell.searchChats')} className="pl-8" />
            </div>
             <Button variant="ghost" size="icon" className="hidden group-data-[collapsible=icon]:flex mx-auto mb-2">
                <Search className="h-5 w-5" />
             </Button>
          </SidebarGroup>

          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== `/${currentLocale}/dashboard` && pathname.startsWith(item.href))}
                  tooltip={t(item.labelKey as any)}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.labelKey as any)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="p-3 flex flex-col gap-2">
          <div className="w-full">
             <LanguageSwitcher />
          </div>
          <div className="grow group-data-[collapsible=icon]:grow-0 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:aspect-square">
                  <Avatar className="h-8 w-8 mr-2 group-data-[collapsible=icon]:mr-0">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUserName} data-ai-hint="profile avatar" />
                    <AvatarFallback>{currentUserName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="group-data-[collapsible=icon]:hidden grow text-left">{currentUserName}</span>
                  <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>{t('appShell.myAccount')} ({currentUser.role})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push(`/${currentLocale}/dashboard/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('appShell.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('appShell.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 md:hidden">
           <SidebarTrigger />
           <h1 className="text-xl font-semibold">AlertLink</h1>
        </header>
        <main className="flex-1 overflow-auto">
         {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


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
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users, Megaphone, Settings, LogOut, ShieldAlert, ChevronDown, Search } from 'lucide-react';
import { getCurrentUser, mockUsers } from '@/lib/mock-data';
import type { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '../ui/input';
import { LanguageSwitcher } from './language-switcher'; // Added import

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isClient, setIsClient] = React.useState(false);


  React.useEffect(() => {
    setIsClient(true);
    const storedRole = localStorage.getItem('alertlink-user-role') as User['role'] | null;
    const authStatus = localStorage.getItem('alertlink-auth');

    if (!authStatus || !storedRole) {
      router.replace('/auth/login');
      return;
    }
    
    const user = mockUsers.find(u => u.role === storedRole) || getCurrentUser();
    setCurrentUser({...user, role: storedRole}); // Ensure role from localStorage is used
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem('alertlink-user-role');
    localStorage.removeItem('alertlink-auth');
    localStorage.removeItem('app-language'); // Clear language preference on logout
    router.push('/auth/login');
  };

  if (!isClient || !currentUser) {
    return <div className="flex h-screen items-center justify-center"><p>Loading user data...</p></div>;
  }
  
  const navItems = [
    { href: '/dashboard', label: 'Chats', icon: MessageSquare, roles: ['admin', 'responder', 'observer'] },
    { href: '/dashboard/broadcasts', label: 'Broadcasts', icon: Megaphone, roles: ['admin', 'responder', 'observer'] },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['admin', 'responder', 'observer'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">AlertLink</h1>
          </Link>
           <Link href="/dashboard" className="items-center gap-2 hidden group-data-[collapsible=icon]:flex">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="p-2">
            <div className="relative group-data-[collapsible=icon]:hidden mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-8" />
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
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="p-3 flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-2">
          <div className="group-data-[collapsible=icon]:order-2">
            <LanguageSwitcher />
          </div>
          <div className="grow group-data-[collapsible=icon]:grow-0 group-data-[collapsible=icon]:order-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:aspect-square">
                  <Avatar className="h-8 w-8 mr-2 group-data-[collapsible=icon]:mr-0">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile avatar" />
                    <AvatarFallback>{currentUser.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="group-data-[collapsible=icon]:hidden grow text-left">{currentUser.name}</span>
                  <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>My Account ({currentUser.role})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
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

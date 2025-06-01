"use client";

import type { Chat } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatListItem } from './chat-list-item';
import { mockChats } from '@/lib/mock-data'; // Using mock data
import { usePathname } from 'next/navigation';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ChatListProps {
  // chats: Chat[]; // In a real app, pass chats as props
}

export function ChatList({}: ChatListProps) {
  const pathname = usePathname();
  const chats = mockChats; // Using mock data directly for now
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.lastMessage?.content && chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col border-r bg-background/80 backdrop-blur-sm">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search or start new chat" 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-4 pt-0">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/dashboard/chat/${chat.id}`}
              />
            ))
          ) : (
            <p className="p-4 text-center text-muted-foreground">No chats found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

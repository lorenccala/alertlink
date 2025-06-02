
"use client";

import type { Chat, User } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatListItem } from './chat-list-item';
import { mockChats, mockUsers, getCurrentUser } from '@/lib/mock-data';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, UserPlus, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ChatList() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  
  const [chatsState, setChatsState] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setChatsState(mockChats); 

    if (user) {
      setAvailableUsers(mockUsers.filter(u => u.id !== user.id));
    }
  }, []);

  const filteredChats = chatsState.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.lastMessage?.content && chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    if (a.lastMessage?.timestamp && b.lastMessage?.timestamp) {
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    }
    if (a.lastMessage?.timestamp) return -1;
    if (b.lastMessage?.timestamp) return 1;
    return 0;
  });

  const handleSelectUser = (selectedUser: User) => {
    if (!currentUser) return;

    const existingChat = chatsState.find(chat => 
      chat.type === 'direct' &&
      chat.participants.some(p => p.id === selectedUser.id) &&
      chat.participants.some(p => p.id === currentUser.id)
    );

    if (existingChat) {
      router.push(`/dashboard/chat/${existingChat.id}`);
    } else {
      const newChatId = `chat${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        name: selectedUser.name,
        type: 'direct',
        participants: [currentUser, selectedUser],
        avatarUrl: selectedUser.avatarUrl,
        isEncrypted: true,
        lastMessage: undefined, 
        unreadCount: 0,
      };
      setChatsState(prevChats => [newChat, ...prevChats]);
      router.push(`/dashboard/chat/${newChatId}`);
    }
    setIsNewChatDialogOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    const chatToDelete = chatsState.find(c => c.id === chatId);
    if (!chatToDelete) return;

    setChatsState(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    if (pathname === `/dashboard/chat/${chatId}`) {
      router.push('/dashboard');
    }

    toast({
      title: "Chat Deleted",
      description: `Chat "${chatToDelete.name}" has been removed.`,
    });
  };

  if (!currentUser) {
    return (
      <div className="flex h-full flex-col border-r bg-background/80 backdrop-blur-sm p-4 items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r bg-background/80 backdrop-blur-sm">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search or start new chat" 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="New Chat">
                <UserPlus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a new chat</DialogTitle>
                <DialogDescription>Select a user to begin a conversation.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-2 p-1">
                  {availableUsers.map(user => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user profile"/>
                        <AvatarFallback>
                          {user.name ? user.name.substring(0,1) : <UserIcon size={20} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
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
                onDeleteChat={handleDeleteChat}
              />
            ))
          ) : (
             <div className="p-4 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
              <img src="https://placehold.co/300x200.png?text=No+Chats" alt="No chats" className="mb-4 rounded-md opacity-70" data-ai-hint="empty state illustration"/>
              <p>No chats found.</p>
              {searchTerm && <p className="text-sm">Try a different search term.</p>}
              {!searchTerm && <p className="text-sm">Click the '+' icon to start a new chat.</p>}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}


"use client";

import { useEffect, useState, useRef } from 'react';
import type { Chat, Message, User } from '@/types';
import { mockMessages, mockChats, getCurrentUser, mockUsers } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import { ChatHeader } from './chat-header';
import { MessageSquareDashed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatViewProps {
  chatId: string;
}

export function ChatView({ chatId }: ChatViewProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentChat = mockChats.find(c => c.id === chatId) || null;
    setChat(currentChat);
    
    const user = getCurrentUser();
    setCurrentUser(user);

    if (currentChat) {
      const chatMessages = (mockMessages[chatId] || []).map(msg => {
        const sender = Array.isArray(mockUsers) ? mockUsers.find(u => u.id === msg.senderId) : undefined;
        return {
          ...msg,
          isOwnMessage: msg.senderId === user.id,
          senderAvatarUrl: sender?.avatarUrl,
        };
      });
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSendMessage = (content: string, type: 'text' | 'file' | 'location' | 'voice') => {
    if (!chat || !currentUser) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      chatId: chat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatarUrl: currentUser.avatarUrl,
      content,
      timestamp: new Date().toISOString(),
      type,
      status: 'sent',
      isOwnMessage: true,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    // In a real app, send to backend and update message status on confirmation
    setTimeout(() => {
       setMessages(prev => prev.map(m => m.id === newMessage.id ? {...m, status: 'delivered'} : m));
    }, 1000);
     setTimeout(() => {
       setMessages(prev => prev.map(m => m.id === newMessage.id ? {...m, status: 'read'} : m));
    }, 3000);
  };

  if (!chat || !currentUser) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background/50 p-4">
        <MessageSquareDashed className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Chat not found or user data unavailable.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-screen flex-col bg-background">
      <ChatHeader chat={chat} currentUser={currentUser} />
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-2 md:p-4 space-y-1">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} isGroupChat={chat.type === 'group'} />
          ))}
        </div>
      </ScrollArea>
      <MessageInput onSendMessage={handleSendMessage} chatId={chat.id} />
    </div>
  );
}


"use client";

import { useEffect, useRef } from 'react';
import type { Message } from '@/types';
import { MessageItem } from './message-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessagesProps {
  messages: Message[];
  isGroupChat: boolean;
  autoScroll?: boolean;
  className?: string;
  showDateSeparators?: boolean;
}

export function Messages({ 
  messages, 
  isGroupChat, 
  autoScroll = true, 
  className,
  showDateSeparators = true
}: MessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages, autoScroll]);

  // Group messages by date for separators
  const messagesByDate = messages.reduce<{ [date: string]: Message[] }>((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Check if a message should show sender info based on previous message
  const shouldShowSender = (message: Message, index: number, messagesGroup: Message[]) => {
    if (index === 0) return true;
    const prevMessage = messagesGroup[index - 1];
    return prevMessage.senderId !== message.senderId || 
           (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1", className)} ref={scrollAreaRef}>
      <div className="p-2 md:p-4 space-y-4">
        {showDateSeparators ? (
          // Render with date separators
          Object.entries(messagesByDate).map(([date, messagesGroup]) => (
            <div key={date} className="space-y-1">
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </div>
              </div>
              {messagesGroup.map((message, index) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  isGroupChat={isGroupChat && shouldShowSender(message, index, messagesGroup)} 
                />
              ))}
            </div>
          ))
        ) : (
          // Render without date separators
          messages.map((message, index) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isGroupChat={isGroupChat && shouldShowSender(message, index, messages)} 
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
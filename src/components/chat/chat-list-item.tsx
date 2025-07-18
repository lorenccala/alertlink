
"use client";

import Link from 'next/link';
import type { Chat, Locale } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Users, User, Lock, Volume2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';
import { getLocalizedName } from '@/lib/mock-data';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onDeleteChat: (chatId: string) => void;
}

export function ChatListItem({ chat, isActive, onDeleteChat }: ChatListItemProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const t = useI18n();
  const currentLocale = useCurrentLocale() as Locale;

  const lastMessageTime = chat.lastMessage?.timestamp
    ? formatDistanceToNowStrict(new Date(chat.lastMessage.timestamp), { addSuffix: true })
    : '';

  const ChatIcon = chat.type === 'group' ? Users : chat.type === 'broadcast_channel' ? Volume2 : User;
  const chatName = getLocalizedName(chat.name, currentLocale);
  const lastMessageSenderName = chat.lastMessage?.senderName ? getLocalizedName(chat.lastMessage.senderName, currentLocale) : '';


  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
  };

  const handleDeleteInitiate = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteChat(chat.id);
    setIsAlertOpen(false); 
  };

  return (
    <div className="relative group">
      <Link href={`/${currentLocale}/dashboard/chat/${chat.id}`} passHref legacyBehavior>
        <a
          className={cn(
            'flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-accent/50',
            isActive ? 'bg-accent text-accent-foreground shadow-md' : 'text-foreground'
          )}
        >
          <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary data-[active=true]:border-primary">
            <AvatarImage src={chat.avatarUrl} alt={chatName} data-ai-hint={chat.type === 'group' ? 'group discussion' : 'person talking'} />
            <AvatarFallback>
              <ChatIcon className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{chatName}</h3>
              {chat.lastMessage && (
                <span className={cn("text-xs", isActive ? "text-accent-foreground/80" : "text-muted-foreground")}>
                  {lastMessageTime}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className={cn("truncate", isActive ? "text-accent-foreground/90" : "text-muted-foreground")}>
                {lastMessageSenderName && `${lastMessageSenderName}: `}{chat.lastMessage?.content || t('chatList.noMessagesYet')}
              </p>
              <div className="flex items-center gap-1">
                {chat.isEncrypted && <Lock size={12} className={cn(isActive ? "text-accent-foreground/70" : "text-muted-foreground/70")} />}
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <Badge variant={isActive ? "default" : "secondary"} className="h-5 px-1.5 text-xs">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>
      
      <div className="absolute top-1/2 right-2 -translate-y-1/2 hidden group-hover:block z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDeleteClick}>
              <MoreHorizontal size={18} />
              <span className="sr-only">{t('chatList.moreOptions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive-foreground focus:bg-destructive/90"
              onClick={handleDeleteInitiate}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('chatList.deleteChatAction')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('chatList.deleteChatTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('chatList.deleteChatDescription', { chatName })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>{t('chatList.deleteChatCancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('chatList.deleteChatConfirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

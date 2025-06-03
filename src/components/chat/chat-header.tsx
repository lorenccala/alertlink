
"use client";

import type { Chat, User, Locale } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, Users, User as UserIcon, Phone, Video, Info, BellOff, Search, Sparkles, Lock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';
import { getLocalizedName } from '@/lib/mock-data';

interface ChatHeaderProps {
  chat: Chat;
  currentUser: User;
}

export function ChatHeader({ chat, currentUser }: ChatHeaderProps) {
  const { toast } = useToast();
  const t = useI18n();
  const currentLocale = useCurrentLocale() as Locale;

  const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
  const displayParticipants = otherParticipants.slice(0, 3);
  const remainingCount = otherParticipants.length - displayParticipants.length;

  const handleFeatureClick = (featureNameKey: string) => {
    const featureName = t(featureNameKey as any);
    toast({
      title: t('chatHeader.featureNotImplemented', { featureName }),
      description: t('chatHeader.featureNotImplementedDescription', { featureName }),
    });
  };

  const ChatIcon = chat.type === 'group' ? Users : UserIcon;
  const chatName = getLocalizedName(chat.name, currentLocale);

  const handleAISummarize = () => {
    const summary = `Summary for ${chatName}:\nKey topics discussed include emergency response coordination, resource allocation, and status updates from various sectors. Important decisions made regarding deployment of responder teams.`; // This summary itself isn't translated here, for brevity.
     toast({
      title: t('chatHeader.aiSummaryGeneratedTitle'),
      description: summary,
      duration: 10000, 
    });
  };

  return (
    <div className="sticky top-0 z-10 flex h-[73px] items-center justify-between border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.avatarUrl} alt={chatName} data-ai-hint={chat.type === 'group' ? 'team discussion' : 'person icon'} />
          <AvatarFallback>
            <ChatIcon size={20} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            {chatName}
            {chat.isEncrypted && <Lock size={14} className="text-green-500" title={t('chatHeader.encryptedTooltip')} />}
          </h2>
          {chat.type !== 'broadcast_channel' && (
            <div className="flex items-center text-xs text-muted-foreground">
              {displayParticipants.map(p => getLocalizedName(p.name, currentLocale).split(' ')[0]).join(', ')}
              {remainingCount > 0 && ` +${remainingCount} more`}
              {chat.type === 'direct' && otherParticipants.length > 0 && (otherParticipants[0].status === 'online' ? <span className="ml-1.5 flex items-center gap-1 text-green-500"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>{t('chatHeader.onlineStatus')}</span> : <span className="ml-1.5">{t('chatHeader.offlineStatus')}</span>)}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {chat.type === 'group' && (currentUser.role === 'admin' || currentUser.role === 'responder') && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title={t('chatHeader.aiSummarizeTooltip')}>
                <Sparkles size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('chatHeader.aiSummarizeDialogTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                 {t('chatHeader.aiSummarizeDialogDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('chatHeader.aiSummarizeCancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleAISummarize}>{t('chatHeader.aiSummarizeGenerate')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden md:inline-flex" onClick={() => handleFeatureClick('chatHeader.callButton')}>
          <Phone size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden md:inline-flex" onClick={() => handleFeatureClick('chatHeader.videoCallButton')}>
          <Video size={20} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFeatureClick('chatHeader.chatInfoButton')}>
              <Info className="mr-2 h-4 w-4" />
              <span>{t('chatHeader.chatInfoButton')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('chatHeader.searchMessagesButton')}>
              <Search className="mr-2 h-4 w-4" />
              <span>{t('chatHeader.searchMessagesButton')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('chatHeader.muteNotificationsButton')}>
              <BellOff className="mr-2 h-4 w-4" />
              <span>{t('chatHeader.muteNotificationsButton')}</span>
            </DropdownMenuItem>
            {chat.type === 'group' && (currentUser.role === 'admin') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFeatureClick('chatHeader.manageGroupButton')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>{t('chatHeader.manageGroupButton')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

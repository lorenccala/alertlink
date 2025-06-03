
"use client";

import type { Message, Locale } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCheck, Clock, Paperclip, MapPin, Mic, AlertTriangle, Play } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useCurrentLocale, useI18n } from '@/lib/i18n/client';
import { getLocalizedName } from '@/lib/mock-data';

interface MessageItemProps {
  message: Message;
  isGroupChat: boolean;
}

export function MessageItem({ message, isGroupChat }: MessageItemProps) {
  const isOwn = message.isOwnMessage;
  const { toast } = useToast();
  const currentLocale = useCurrentLocale() as Locale;
  // const t = useI18n(); // If needed for other text within MessageItem

  const senderDisplayName = getLocalizedName(message.senderName, currentLocale);

  const MessageStatusIcon = () => {
    if (!isOwn) return null;
    if (message.status === 'read') return <CheckCheck size={16} className="text-primary" />;
    if (message.status === 'delivered') return <CheckCheck size={16} className="text-muted-foreground" />;
    if (message.status === 'sent') return <Check size={16} className="text-muted-foreground" />;
    return <Clock size={16} className="text-muted-foreground" />;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'file':
        return (
          <a href={message.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
            <Paperclip size={18} />
            <span>{message.fileName || 'Shared File'}</span>
          </a>
        );
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-red-500" />
            <div>
              <p>Location Shared: {message.location?.address || `${message.location?.lat}, ${message.location?.lng}`}</p>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toast({ title: "Map view not implemented."})}>View Map</Button>
            </div>
          </div>
        );
      case 'voice':
        if (message.content.startsWith('data:audio/')) {
          return (
            <div className="flex items-center gap-2">
              <Mic size={18} />
              <audio controls src={message.content} className="h-10 max-w-full"></audio>
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
              <Mic size={18} />
              <span>{message.content}</span> 
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Playback for this message type is not implemented."})}>
                <Play size={16} />
              </Button>
            </div>
          );
        }
      case 'alert':
         return (
          <Card className="border-destructive bg-destructive/10 shadow-lg">
            <CardHeader className="p-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle size={20} /> System Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p>{message.content}</p>
            </CardContent>
          </Card>
        );
      default: 
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={cn('flex gap-3 p-3 items-end', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarImage src={message.senderAvatarUrl} alt={senderDisplayName} data-ai-hint="user avatar" />
          <AvatarFallback>{senderDisplayName?.substring(0, 1) || 'U'}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
          'max-w-[70%] rounded-xl px-4 py-2.5 shadow-md',
          isOwn ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'
        )}>
        {isGroupChat && !isOwn && <p className="text-xs font-semibold mb-1 text-muted-foreground">{senderDisplayName}</p>}
        <div className="text-sm">
         {renderContent()}
        </div>
        <div className={cn('mt-1.5 flex items-center gap-1.5', isOwn ? 'justify-end' : 'justify-start')}>
          <span className="text-xs opacity-70">
            {format(new Date(message.timestamp), 'p')}
          </span>
          {isOwn && <MessageStatusIcon />}
        </div>
      </div>
       {isOwn && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarImage src={message.senderAvatarUrl} alt={senderDisplayName} data-ai-hint="user avatar" />
          <AvatarFallback>{senderDisplayName?.substring(0, 1) || 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

"use client";

import type { Chat, User } from '@/types';
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

interface ChatHeaderProps {
  chat: Chat;
  currentUser: User;
}

export function ChatHeader({ chat, currentUser }: ChatHeaderProps) {
  const { toast } = useToast();
  const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
  const displayParticipants = otherParticipants.slice(0, 3);
  const remainingCount = otherParticipants.length - displayParticipants.length;

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: `${featureName} Feature`,
      description: `${featureName} functionality is not yet implemented in this demo.`,
    });
  };

  const ChatIcon = chat.type === 'group' ? Users : UserIcon;

  const handleAISummarize = () => {
    // Mock AI summarization
    const summary = `Summary for ${chat.name}:\nKey topics discussed include emergency response coordination, resource allocation, and status updates from various sectors. Important decisions made regarding deployment of responder teams.`;
     toast({
      title: "AI Summary Generated",
      description: summary,
      duration: 10000, // Longer duration for summary
    });
  };

  return (
    <div className="sticky top-0 z-10 flex h-[73px] items-center justify-between border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.avatarUrl} alt={chat.name} data-ai-hint={chat.type === 'group' ? 'team discussion' : 'person icon'} />
          <AvatarFallback>
            <ChatIcon size={20} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            {chat.name}
            {chat.isEncrypted && <Lock size={14} className="text-green-500" title="End-to-end encrypted" />}
          </h2>
          {chat.type !== 'broadcast_channel' && (
            <div className="flex items-center text-xs text-muted-foreground">
              {displayParticipants.map(p => p.name.split(' ')[0]).join(', ')}
              {remainingCount > 0 && ` +${remainingCount} more`}
              {chat.type === 'direct' && otherParticipants.length > 0 && (otherParticipants[0].status === 'online' ? <span className="ml-1.5 flex items-center gap-1 text-green-500"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>Online</span> : <span className="ml-1.5">Offline</span>)}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {chat.type === 'group' && (currentUser.role === 'admin' || currentUser.role === 'responder') && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="AI Summarize">
                <Sparkles size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>AI Discussion Summary</AlertDialogTitle>
                <AlertDialogDescription>
                  This AI tool will summarize the key points, decisions, and action items from this group discussion. This helps responders quickly grasp essential information.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAISummarize}>Generate Summary</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden md:inline-flex" onClick={() => handleFeatureClick('Call')}>
          <Phone size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden md:inline-flex" onClick={() => handleFeatureClick('Video Call')}>
          <Video size={20} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFeatureClick('Chat Info')}>
              <Info className="mr-2 h-4 w-4" />
              <span>Chat Info</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('Search Messages')}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('Mute Notifications')}>
              <BellOff className="mr-2 h-4 w-4" />
              <span>Mute Notifications</span>
            </DropdownMenuItem>
            {chat.type === 'group' && (currentUser.role === 'admin') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFeatureClick('Manage Group')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Manage Group</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

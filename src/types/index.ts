export type UserRole = 'admin' | 'responder' | 'observer';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status?: 'online' | 'offline' | 'typing';
  lastSeen?: string; 
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string; // Added for convenience
  senderAvatarUrl?: string; // Added for convenience
  content: string;
  timestamp: string; 
  type: 'text' | 'voice' | 'file' | 'location' | 'alert';
  fileName?: string;
  fileUrl?: string;
  location?: { lat: number; lng: number; address?: string };
  status?: MessageStatus;
  isOwnMessage?: boolean; // UI helper
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'broadcast_channel';
  participants: User[]; 
  admins?: string[]; 
  lastMessage?: Pick<Message, 'content' | 'timestamp' | 'senderName'>;
  unreadCount?: number;
  avatarUrl?: string; 
  isEncrypted?: boolean;
}

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface BroadcastAlert {
  id: string;
  title: string;
  content: string;
  priority: AlertPriority;
  timestamp: string; 
  senderId: string; 
  senderName: string;
  targetRoles: UserRole[];
}

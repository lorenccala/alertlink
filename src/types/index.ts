
export type Locale = 'en' | 'sq';

export interface LocalizedString {
  en: string;
  sq: string;
}

export type UserRole = 'admin' | 'responder' | 'observer';

export interface User {
  id: string;
  name: LocalizedString;
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
  senderName: LocalizedString; 
  senderAvatarUrl?: string; 
  content: string; // Content itself is not localized in this model, but could be a key if needed
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
  name: LocalizedString;
  type: 'direct' | 'group' | 'broadcast_channel';
  participants: User[]; 
  admins?: string[]; 
  lastMessage?: {
    content: string; // Assuming last message content is not a translation key for simplicity
    timestamp: string;
    senderName?: LocalizedString; // Make senderName here localized too
  };
  unreadCount?: number;
  avatarUrl?: string; 
  isEncrypted?: boolean;
}

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface BroadcastAlert {
  id: string;
  title: string; // Could be LocalizedString if titles need translation
  content: string; // Could be LocalizedString
  priority: AlertPriority;
  timestamp: string; 
  senderId: string; 
  senderName: LocalizedString;
  targetRoles: UserRole[];
}

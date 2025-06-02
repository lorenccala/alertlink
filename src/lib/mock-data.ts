
import type { User, Chat, Message, BroadcastAlert, UserRole, AlertPriority } from '@/types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice (Admin)', role: 'admin', avatarUrl: 'https://placehold.co/100x100.png', status: 'online' },
  { id: 'user2', name: 'Bob (Responder)', role: 'responder', avatarUrl: 'https://placehold.co/100x100.png', status: 'offline', lastSeen: new Date(Date.now() - 3600 * 1000).toISOString() },
  { id: 'user3', name: 'Charlie (Responder)', role: 'responder', avatarUrl: 'https://placehold.co/100x100.png', status: 'online' },
  { id: 'user4', name: 'Diana (Observer)', role: 'observer', avatarUrl: 'https://placehold.co/100x100.png', status: 'offline', lastSeen: new Date(Date.now() - 86400 * 1000).toISOString()},
  { id: 'currentUser', name: 'Eva (You)', role: 'responder', avatarUrl: 'https://placehold.co/100x100.png', status: 'online' },
];

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    name: 'Emergency Ops Team',
    type: 'group',
    participants: mockUsers.filter(u => u.role !== 'observer'),
    admins: ['user1'],
    lastMessage: { content: 'Stand by for updates.', timestamp: new Date().toISOString(), senderName: 'Alice (Admin)' },
    unreadCount: 2,
    avatarUrl: 'https://placehold.co/100x100.png',
    isEncrypted: true,
  },
  {
    id: 'chat2',
    name: 'Bob (Responder)',
    type: 'direct',
    participants: [mockUsers.find(u => u.id === 'user2')!, mockUsers.find(u => u.id === 'currentUser')!],
    lastMessage: { content: 'On my way to sector 5.', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), senderName: 'Bob (Responder)' },
    avatarUrl: mockUsers.find(u => u.id === 'user2')?.avatarUrl,
    isEncrypted: true,
  },
  {
    id: 'chat3',
    name: 'City Wide Alerts',
    type: 'broadcast_channel',
    participants: mockUsers, 
    admins: ['user1'],
    lastMessage: { content: 'Weather advisory issued.', timestamp: new Date(Date.now() - 60000 * 30).toISOString(), senderName: 'System Alert' },
    avatarUrl: 'https://placehold.co/100x100.png',
    isEncrypted: false, 
  },
];

export const mockMessages: { [chatId: string]: Message[] } = {
  'chat1': [
    { id: 'msg1-1', chatId: 'chat1', senderId: 'user1', senderName: 'Alice (Admin)', content: 'Team, situation report for Zone A needed ASAP.', timestamp: new Date(Date.now() - 60000 * 10).toISOString(), type: 'text', status: 'read', isOwnMessage: false },
    { id: 'msg1-2', chatId: 'chat1', senderId: 'currentUser', senderName: 'Eva (You)', content: 'Acknowledged. Zone A is stable, minor flooding.', timestamp: new Date(Date.now() - 60000 * 8).toISOString(), type: 'text', status: 'delivered', isOwnMessage: true },
    { id: 'msg1-3', chatId: 'chat1', senderId: 'user3', senderName: 'Charlie (Responder)', content: 'Sharing images from Zone A now.', timestamp: new Date(Date.now() - 60000 * 7).toISOString(), type: 'text', status: 'read', isOwnMessage: false },
    { id: 'msg1-4', chatId: 'chat1', senderId: 'user3', senderName: 'Charlie (Responder)', content: 'Flooding_ZoneA.jpg', timestamp: new Date(Date.now() - 60000 * 6).toISOString(), type: 'file', fileName: 'Flooding_ZoneA.jpg', fileUrl:'#', status: 'read', isOwnMessage: false },
    { id: 'msg1-5', chatId: 'chat1', senderId: 'user1', senderName: 'Alice (Admin)', content: 'Voice Message (0:23)', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), type: 'voice', status: 'read', isOwnMessage: false },
    { id: 'msg1-6', chatId: 'chat1', senderId: 'currentUser', senderName: 'Eva (You)', content: 'Voice Message (0:41)', timestamp: new Date(Date.now() - 60000 * 4).toISOString(), type: 'voice', status: 'delivered', isOwnMessage: true },
    { id: 'msg1-7', chatId: 'chat1', senderId: 'user1', senderName: 'Alice (Admin)', content: 'Thanks Charlie. Bob, any updates from Sector 5?', timestamp: new Date().toISOString(), type: 'text', status: 'sent', isOwnMessage: false },
  ],
  'chat2': [
    { id: 'msg2-1', chatId: 'chat2', senderId: 'user2', senderName: 'Bob (Responder)', content: 'On my way to sector 5.', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), type: 'text', status: 'read', isOwnMessage: false },
    { id: 'msg2-2', chatId: 'chat2', senderId: 'currentUser', senderName: 'Eva (You)', content: 'Roger that. Keep us posted.', timestamp: new Date(Date.now() - 60000 * 4).toISOString(), type: 'text', status: 'delivered', isOwnMessage: true },
    { id: 'msg2-3', chatId: 'chat2', senderId: 'user2', senderName: 'Bob (Responder)', content: 'My current location.', timestamp: new Date(Date.now() - 60000 * 2).toISOString(), type: 'location', location: { lat: 34.0522, lng: -118.2437, address: "Sector 5 Command Post"}, status: 'read', isOwnMessage: false },
  ],
  'chat3': [
     { id: 'msg3-1', chatId: 'chat3', senderId: 'user1', senderName: 'System Alert', content: 'Weather advisory: Heavy rain expected in the next 2 hours. Please take necessary precautions.', timestamp: new Date(Date.now() - 60000 * 30).toISOString(), type: 'alert', status: 'delivered', isOwnMessage: false },
     { id: 'msg3-2', chatId: 'chat3', senderId: 'user1', senderName: 'System Alert', content: 'Power outage reported in downtown area. Crews are being dispatched.', timestamp: new Date(Date.now() - 60000 * 15).toISOString(), type: 'alert', status: 'sent', isOwnMessage: false },
  ]
};

export const mockBroadcastAlerts: BroadcastAlert[] = [
  { 
    id: 'alert1', 
    title: 'Immediate Evacuation Order: Downtown Area', 
    content: 'A critical incident has occurred. All personnel and civilians in the downtown area are ordered to evacuate immediately. Follow designated routes.',
    priority: 'critical', 
    timestamp: new Date().toISOString(), 
    senderId: 'user1', 
    senderName: 'Alice (Admin)',
    targetRoles: ['admin', 'responder', 'observer'] 
  },
  { 
    id: 'alert2', 
    title: 'Road Closure: Main Street', 
    content: 'Main Street is closed between 1st Ave and 5th Ave due to emergency operations. Use alternate routes.',
    priority: 'high', 
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), 
    senderId: 'user1',
    senderName: 'Alice (Admin)',
    targetRoles: ['admin', 'responder'] 
  },
];

export const getCurrentUser = (): User => mockUsers.find(u => u.id === 'currentUser')!;

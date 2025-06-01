"use client";

import { useState, useEffect } from 'react';
import { BroadcastCard } from '@/components/broadcast/broadcast-card';
import { BroadcastComposer } from '@/components/broadcast/broadcast-composer';
import { mockBroadcastAlerts, getCurrentUser } from '@/lib/mock-data';
import type { BroadcastAlert, User, UserRole } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListFilter, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BroadcastsPage() {
  const [alerts, setAlerts] = useState<BroadcastAlert[]>(mockBroadcastAlerts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<Record<BroadcastAlert['priority'], boolean>>({
    low: true,
    medium: true,
    high: true,
    critical: true,
  });
  
  useEffect(() => {
    const user = getCurrentUser(); // Assuming this might use localStorage if adapted
    setCurrentUser(user);
  }, []);


  const handleSendAlert = (newAlertData: Omit<BroadcastAlert, 'id' | 'timestamp' | 'senderId' | 'senderName'>) => {
    if (!currentUser) return;
    const newAlert: BroadcastAlert = {
      id: `alert${Date.now()}`,
      timestamp: new Date().toISOString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      ...newAlertData,
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setShowComposer(false);
  };
  
  if (!currentUser) {
    return <div className="p-4">Loading user data...</div>;
  }

  const filteredAlerts = alerts
    .filter(alert => alert.targetRoles.includes(currentUser.role) && priorityFilter[alert.priority])
    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-headline">Broadcast Alerts</h1>
          <div className="flex items-center gap-2">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(priorityFilter) as BroadcastAlert['priority'][]).map((p) => (
                  <DropdownMenuCheckboxItem
                    key={p}
                    checked={priorityFilter[p]}
                    onCheckedChange={(checked) => setPriorityFilter(prev => ({...prev, [p]: checked}))}
                    className="capitalize"
                  >
                    {p}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {currentUser.role === 'admin' && (
              <Button onClick={() => setShowComposer(!showComposer)}>
                <PlusCircle className="mr-2 h-4 w-4" /> {showComposer ? "Cancel" : "New Alert"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {currentUser.role === 'admin' && showComposer && (
        <div className="p-4 border-b">
          <BroadcastComposer onSendAlert={handleSendAlert} />
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <BroadcastCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <img src="https://placehold.co/300x200.png?text=No+Alerts" alt="No alerts" className="mb-4 rounded-md" data-ai-hint="empty state illustration"/>
            <p className="text-lg">No alerts matching your filters or role.</p>
            <p className="text-sm">Check back later or adjust your filter settings.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

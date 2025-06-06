"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BroadcastCard } from '@/components/broadcast/broadcast-card';
import { BroadcastComposer } from '@/components/broadcast/broadcast-composer';
import { mockBroadcastAlerts, getCurrentUser } from '@/lib/mock-data';
import type { BroadcastAlert, User } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListFilter, PlusCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BroadcastsPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { t } = useTranslations();
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
        const user = getCurrentUser();
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
        setAlerts(prevAlerts => [newAlert, ...prevAlerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setShowComposer(false);
    };

    if (!currentUser) {
        return <div className="p-4">{t('loadingUserData')}</div>;
    }

    const filteredAlerts = alerts
        .filter(alert => alert.targetRoles.includes(currentUser.role) && priorityFilter[alert.priority])
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold font-headline">{t('broadcastAlerts')}</h1>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <ListFilter className="mr-2 h-4 w-4" /> {t('filter')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('filterByPriority')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(Object.keys(priorityFilter) as BroadcastAlert['priority'][]).map((p) => (
                                    <DropdownMenuCheckboxItem
                                        key={p}
                                        checked={priorityFilter[p]}
                                        onCheckedChange={(checked) => setPriorityFilter(prev => ({ ...prev, [p]: checked }))}
                                        className="capitalize"
                                    >
                                        {t(`priority${p.charAt(0).toUpperCase() + p.slice(1)}`)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {currentUser.role === 'admin' && (
                            <Button onClick={() => setShowComposer(!showComposer)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> {showComposer ? t('cancel') : t('newAlert')}
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
                        <img src="https://placehold.co/300x200.png?text=No+Alerts" alt={t('noAlerts')} className="mb-4 rounded-md" data-ai-hint="empty state illustration" />
                        <p className="text-lg">{t('noAlertsMatching')}</p>
                        <p className="text-sm">{t('checkBackLater')}</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
} 
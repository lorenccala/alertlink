
"use client";

import { ChatList } from '@/components/chat/chat-list';
import { MessageSquareDashed } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

export default function DashboardPage() {
  const t = useI18n();

  return (
    <div className="grid h-full md:grid-cols-[350px_1fr]">
      <ChatList />
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-background/50 p-8 text-center">
        <MessageSquareDashed className="h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">{t('dashboardPage.welcome')}</h2>
        <p className="text-muted-foreground max-w-md">
          {t('dashboardPage.selectChat')}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          {t('dashboardPage.platformUsageNotice')}
        </p>
      </div>
    </div>
  );
}

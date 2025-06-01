import type { BroadcastAlert } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { PriorityBadge } from './priority-badge';
import { mockUsers } from '@/lib/mock-data';
import { AlertTriangle } from 'lucide-react';

interface BroadcastCardProps {
  alert: BroadcastAlert;
}

export function BroadcastCard({ alert }: BroadcastCardProps) {
  const sender = mockUsers.find(u => u.id === alert.senderId);
  const timeAgo = formatDistanceToNowStrict(new Date(alert.timestamp), { addSuffix: true });

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 data-[priority=critical]:border-destructive data-[priority=high]:border-orange-500 data-[priority=medium]:border-yellow-500 data-[priority=low]:border-blue-500" data-priority={alert.priority}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            {alert.priority === 'critical' && <AlertTriangle className="text-destructive h-6 w-6" />}
            {alert.title}
          </CardTitle>
          <PriorityBadge priority={alert.priority} />
        </div>
        <CardDescription className="text-xs">
          Sent {timeAgo} by {sender?.name || 'System Admin'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{alert.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Targeted Roles: {alert.targetRoles.join(', ')}
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AlertPriority, BroadcastAlert, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';

interface BroadcastComposerProps {
  onSendAlert: (alert: Omit<BroadcastAlert, 'id' | 'timestamp' | 'senderId' | 'senderName'>) => void;
}

const availableRoles: UserRole[] = ['admin', 'responder', 'observer'];

export function BroadcastComposer({ onSendAlert }: BroadcastComposerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AlertPriority>('medium');
  const [targetRoles, setTargetRoles] = useState<UserRole[]>(['responder', 'observer']);
  const { toast } = useToast();

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    setTargetRoles(prev => 
      checked ? [...prev, role] : prev.filter(r => r !== role)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || targetRoles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all fields and select target roles.',
      });
      return;
    }
    onSendAlert({ title, content, priority, targetRoles });
    setTitle('');
    setContent('');
    setPriority('medium');
    setTargetRoles(['responder', 'observer']);
    toast({
      title: 'Broadcast Sent',
      description: `Alert "${title}" has been broadcasted.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Compose Broadcast Alert</CardTitle>
        <CardDescription>Create and send priority alerts to designated user groups.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="alert-title">Alert Title</Label>
            <Input id="alert-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Urgent Weather Warning" />
          </div>
          <div>
            <Label htmlFor="alert-content">Message Content</Label>
            <Textarea id="alert-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Detailed alert message..." rows={5} />
          </div>
          <div>
            <Label htmlFor="alert-priority">Priority Level</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as AlertPriority)}>
              <SelectTrigger id="alert-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical (Life-Threatening)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label>Target Roles</Label>
            <div className="space-y-2 mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={targetRoles.includes(role)}
                    onCheckedChange={(checked) => handleRoleChange(role, !!checked)}
                  />
                  <Label htmlFor={`role-${role}`} className="font-normal capitalize">{role}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Send Broadcast</Button>
        </form>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole, LocalizedString } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n/client';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: { name: LocalizedString, email?: string, role: UserRole }) => void;
}

const availableRoles: UserRole[] = ['admin', 'responder', 'observer'];

export function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
  const { toast } = useToast();
  const t = useI18n();

  const [nameEn, setNameEn] = useState('');
  const [nameSq, setNameSq] = useState('');
  const [email, setEmail] = useState(''); 
  const [role, setRole] = useState<UserRole>('responder');

  const handleSubmit = () => {
    if (!nameEn.trim() || !nameSq.trim()) {
      toast({
        variant: 'destructive',
        title: t('userManagementPage.addUserDialog.validationErrorTitle'),
        description: t('userManagementPage.addUserDialog.validationErrorDescription'),
      });
      return;
    }
    onAddUser({ name: { en: nameEn, sq: nameSq }, email, role });
    setNameEn('');
    setNameSq('');
    setEmail('');
    setRole('responder');
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('userManagementPage.addUserDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('userManagementPage.addUserDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nameEn" className="text-right">
              {t('userManagementPage.addUserDialog.nameLabel')} (EN)
            </Label>
            <Input
              id="nameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="col-span-3"
              placeholder={t('userManagementPage.addUserDialog.namePlaceholder')}
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nameSq" className="text-right">
              {t('userManagementPage.addUserDialog.nameLabel')} (SQ)
            </Label>
            <Input
              id="nameSq"
              value={nameSq}
              onChange={(e) => setNameSq(e.target.value)}
              className="col-span-3"
              placeholder={t('userManagementPage.addUserDialog.namePlaceholder')}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {t('userManagementPage.addUserDialog.emailLabel')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder={t('userManagementPage.addUserDialog.emailPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              {t('userManagementPage.addUserDialog.roleLabel')}
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="role" className="col-span-3">
                <SelectValue placeholder={t('userManagementPage.addUserDialog.rolePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('userManagementPage.addUserDialog.cancelButton')}</Button>
          <Button type="submit" onClick={handleSubmit}>{t('userManagementPage.addUserDialog.addUserButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

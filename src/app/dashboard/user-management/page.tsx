
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/user-management/user-table';
import { AddUserDialog } from '@/components/user-management/add-user-dialog';
import { mockUsers as initialMockUsers, getCurrentUser, getLocalizedName } from '@/lib/mock-data';
import type { User, UserRole, Locale, LocalizedString } from '@/types';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useI18n();
  const currentLocale = useCurrentLocale() as Locale;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialMockUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user?.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: t('userManagementPage.accessDeniedTitle'),
        description: t('userManagementPage.accessDeniedDescription'),
      });
      router.replace(`/${currentLocale}/dashboard`);
    }
  }, [router, toast, currentLocale, t]);

  const handleAddUser = (newUserData: { name: LocalizedString, role: UserRole, email?: string }) => {
    const newUser: User = {
      id: `user${Date.now()}`,
      name: newUserData.name, // name is LocalizedString
      role: newUserData.role,
      avatarUrl: `https://placehold.co/100x100.png?text=${newUserData.name.en.substring(0,1)}`, 
      status: 'offline', 
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    toast({
      title: t('userManagementPage.userAddedTitle'),
      description: t('userManagementPage.userAddedDescription', {userName: getLocalizedName(newUser.name, currentLocale)}),
    });
    setIsAddUserDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    if (userId === currentUser?.id) {
      toast({
        variant: 'destructive',
        title: t('userManagementPage.actionDeniedTitle'),
        description: t('userManagementPage.actionDeniedDescription'),
      });
      return;
    }
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({
      title: t('userManagementPage.userDeletedTitle'),
      description: t('userManagementPage.userDeletedDescription'),
    });
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p>{t('userManagementPage.accessDeniedRedirecting')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-headline">{t('userManagementPage.title')}</h1>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> {t('userManagementPage.addNewUser')}
          </Button>
        </div>
      </header>
      <div className="flex-1 p-4 md:p-6">
        <UserTable users={users} onDeleteUser={handleDeleteUser} />
      </div>
      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
      />
    </div>
  );
}

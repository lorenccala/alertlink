"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/user-management/user-table';
import { AddUserDialog } from '@/components/user-management/add-user-dialog';
import { mockUsers as initialMockUsers, getCurrentUser } from '@/lib/mock-data';
import type { User } from '@/types';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/use-translations';

export default function UserManagementPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { toast } = useToast();
    const { t } = useTranslations();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialMockUsers);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        if (user?.role !== 'admin') {
            toast({
                variant: 'destructive',
                title: t('accessDenied'),
                description: t('noPermission'),
            });
            router.replace(`/${locale}/dashboard`);
        }
    }, [router, toast, locale, t]);

    const handleAddUser = (newUserData: Omit<User, 'id' | 'status' | 'lastSeen' | 'avatarUrl'> & { email?: string }) => {
        const newUser: User = {
            id: `user${Date.now()}`,
            name: newUserData.name,
            role: newUserData.role,
            avatarUrl: `https://placehold.co/100x100.png?text=${newUserData.name.substring(0, 1)}`,
            status: 'offline',
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        toast({
            title: t('userAdded'),
            description: t('userAddedSuccess', { name: newUser.name }),
        });
        setIsAddUserDialogOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        if (userId === currentUser?.id) {
            toast({
                variant: 'destructive',
                title: t('actionDenied'),
                description: t('cannotDeleteSelf'),
            });
            return;
        }
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        toast({
            title: t('userDeleted'),
            description: t('userDeletedSuccess'),
        });
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <p>{t('accessDeniedRedirecting')}</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold font-headline">{t('userManagement')}</h1>
                    <Button onClick={() => setIsAddUserDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" /> {t('addNewUser')}
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
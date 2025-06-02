
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/user-management/user-table';
import { AddUserDialog } from '@/components/user-management/add-user-dialog';
import { mockUsers as initialMockUsers, getCurrentUser } from '@/lib/mock-data';
import type { User, UserRole } from '@/types';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialMockUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user?.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to view this page.',
      });
      router.replace('/dashboard');
    }
  }, [router, toast]);

  const handleAddUser = (newUserData: Omit<User, 'id' | 'status' | 'lastSeen' | 'avatarUrl'> & { email?: string }) => {
    const newUser: User = {
      id: `user${Date.now()}`,
      name: newUserData.name,
      role: newUserData.role,
      avatarUrl: `https://placehold.co/100x100.png?text=${newUserData.name.substring(0,1)}`, // Basic placeholder
      status: 'offline', // Default status
      // email: newUserData.email, // If you add email to User type
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    toast({
      title: 'User Added',
      description: `${newUser.name} has been added successfully.`,
    });
    setIsAddUserDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        variant: 'destructive',
        title: 'Action Denied',
        description: 'You cannot delete your own account.',
      });
      return;
    }
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({
      title: 'User Deleted',
      description: `User has been deleted successfully.`,
    });
  };

  if (currentUser?.role !== 'admin') {
    // This check is mostly for initial render before redirect, or if redirect fails.
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p>Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-headline">User Management</h1>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
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

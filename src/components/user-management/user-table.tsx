
"use client";

import type { User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ShieldCheck, UserCircle, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '../ui/scroll-area';

interface UserTableProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
}

const roleIcons: Record<User['role'], React.ReactNode> = {
  admin: <ShieldCheck className="h-4 w-4 text-red-500" />,
  responder: <UserCircle className="h-4 w-4 text-blue-500" />,
  observer: <Eye className="h-4 w-4 text-gray-500" />,
};

const roleColors: Record<User['role'], string> = {
  admin: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
  responder: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
  observer: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30",
};

export function UserTable({ users, onDeleteUser }: UserTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] rounded-lg border shadow-md">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user profile small" />
                  <AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={roleColors[user.role]}>
                  {roleIcons[user.role]}
                  <span className="ml-1.5 capitalize">{user.role}</span>
                </Badge>
              </TableCell>
              <TableCell>
                <span className={`capitalize flex items-center gap-2 ${user.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {user.status === 'online' && <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>}
                    {user.status || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user "{user.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteUser(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {users.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p>No users found. Click "Add New User" to get started.</p>
        </div>
      )}
    </ScrollArea>
  );
}

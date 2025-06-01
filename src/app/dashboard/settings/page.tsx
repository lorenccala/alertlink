"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/mock-data";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Assuming default is dark

  useEffect(() => {
    const user = getCurrentUser(); 
    setCurrentUser(user);
    if (user) {
      setName(user.name);
    }
    // Check actual dark mode state if possible
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const handleSaveSettings = () => {
    // Mock save
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const toggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // In a real app, persist this preference (e.g., localStorage)
  };

  if (!currentUser) {
    return <div className="p-4">Loading user settings...</div>;
  }

  return (
    <div className="flex h-full flex-col">
       <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
        <h1 className="text-2xl font-semibold font-headline">Settings</h1>
      </header>
      <div className="flex-1 p-4 md:p-8">
        <Card className="mx-auto max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Manage your account preferences and application settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile large"/>
                  <AvatarFallback className="text-3xl">{currentUser.name.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="text-lg" />
                </div>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="notifications" className="flex flex-col space-y-1">
                    <span>Enable Notifications</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Receive push notifications for new messages and alerts.
                    </span>
                    </Label>
                    <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Toggle dark mode for the application interface.
                    </span>
                    </Label>
                    <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                    />
                </div>
            </div>
            
            <Button onClick={handleSaveSettings} className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

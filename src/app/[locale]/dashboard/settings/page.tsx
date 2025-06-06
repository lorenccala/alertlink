"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser } from '@/lib/mock-data';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/use-translations';

export default function SettingsPage() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { toast } = useToast();
    const { t } = useTranslations();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
    });
    const [language, setLanguage] = useState(locale);
    const [theme, setTheme] = useState('system');

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    const handleNotificationChange = (type: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
        toast({
            title: t('settingsUpdated'),
            description: t('notificationSettingsUpdated'),
        });
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        toast({
            title: t('settingsUpdated'),
            description: t('languageSettingsUpdated'),
        });
    };

    const handleThemeChange = (value: string) => {
        setTheme(value);
        toast({
            title: t('settingsUpdated'),
            description: t('themeSettingsUpdated'),
        });
    };

    if (!currentUser) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <p>{t('loadingUserData')}</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4 shadow-sm">
                <h1 className="text-2xl font-semibold font-headline">{t('settings')}</h1>
            </header>
            <div className="flex-1 p-4 md:p-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('notifications')}</CardTitle>
                            <CardDescription>{t('manageNotificationPreferences')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications">{t('emailNotifications')}</Label>
                                <Switch
                                    id="email-notifications"
                                    checked={notifications.email}
                                    onCheckedChange={() => handleNotificationChange('email')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notifications">{t('pushNotifications')}</Label>
                                <Switch
                                    id="push-notifications"
                                    checked={notifications.push}
                                    onCheckedChange={() => handleNotificationChange('push')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="sms-notifications">{t('smsNotifications')}</Label>
                                <Switch
                                    id="sms-notifications"
                                    checked={notifications.sms}
                                    onCheckedChange={() => handleNotificationChange('sms')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('language')}</CardTitle>
                            <CardDescription>{t('selectPreferredLanguage')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectLanguage')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">{t('english')}</SelectItem>
                                    <SelectItem value="sq">{t('albanian')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('theme')}</CardTitle>
                            <CardDescription>{t('selectPreferredTheme')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={theme} onValueChange={handleThemeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectTheme')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">{t('light')}</SelectItem>
                                    <SelectItem value="dark">{t('dark')}</SelectItem>
                                    <SelectItem value="system">{t('system')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/use-translations';
import { LanguageSwitcher } from '@/components/language-switcher';

const roleToTranslationKey = {
    admin: 'roleAdmin',
    responder: 'roleResponder',
    observer: 'roleObserver'
} as const;

export default function LoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { toast } = useToast();
    const { t } = useTranslations();
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState('responder');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (otp === '123456') {
            localStorage.setItem('alertlink-user-role', role);
            localStorage.setItem('alertlink-auth', 'true');
            toast({
                title: t('loginSuccess'),
                description: t('welcomeRole', { role: t(roleToTranslationKey[role as keyof typeof roleToTranslationKey]) }),
            });
            router.push(`/${locale}/dashboard`);
        } else {
            toast({
                variant: "destructive",
                title: t('loginFailed'),
                description: t('invalidOtp'),
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-[350px]">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <ShieldAlert className="h-8 w-8" />
                        <LanguageSwitcher />
                    </div>
                    <CardTitle className="text-center">{t('loginTitle')}</CardTitle>
                    <CardDescription className="text-center">{t('loginDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="role">{t('selectRole')}</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder={t('selectRole')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">{t('roleAdmin')}</SelectItem>
                                        <SelectItem value="responder">{t('roleResponder')}</SelectItem>
                                        <SelectItem value="observer">{t('roleObserver')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="otp">{t('enterOtp')}</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? t('loggingIn') : t('login')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">{t('demoCredentials')}</p>
                </CardFooter>
            </Card>
        </div>
    );
} 
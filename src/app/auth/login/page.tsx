
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n, useCurrentLocale } from '@/lib/i18n/client';
import type { Locale } from '@/lib/i18n/settings';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useI18n();
  const currentLocale = useCurrentLocale() as Locale;

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
        title: t('loginPage.loginSuccessTitle'),
        description: t('loginPage.loginSuccessDescription', { role }),
      });
      router.push(`/${currentLocale}/dashboard`);
    } else {
      toast({
        variant: "destructive",
        title: t('loginPage.loginFailedTitle'),
        description: t('loginPage.loginFailedDescription'),
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldAlert size={32} />
          </div>
          <CardTitle className="font-headline text-3xl">{t('loginPage.mainTitle')}</CardTitle>
          <CardDescription>{t('loginPage.tagline')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">{t('loginPage.otpLabel')}</Label>
              <Input
                id="otp"
                type="text"
                placeholder={t('loginPage.otpPlaceholder')}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">{t('loginPage.otpHint')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('loginPage.roleLabel')}</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder={t('loginPage.rolePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('loginPage.adminRole')}</SelectItem>
                  <SelectItem value="responder">{t('loginPage.responderRole')}</SelectItem>
                  <SelectItem value="observer">{t('loginPage.observerRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? t('loginPage.verifyingButton') : t('loginPage.loginButton')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>{t('loginPage.footerText', { year: new Date().getFullYear() })}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

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
import { useI18n } from '@/lib/i18n/client';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useI18n();
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
        title: t('login.loginSuccessTitle'),
        description: t('login.loginSuccessDescription', { role }),
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: t('login.loginFailedTitle'),
        description: t('login.loginFailedDescription'),
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
          <CardTitle className="font-headline text-3xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">{t('login.otpLabel')}</Label>
              <Input
                id="otp"
                type="text"
                placeholder={t('login.otpPlaceholder')}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">{t('login.otpHint')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('login.roleLabel')}</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder={t('login.rolePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('login.adminRole')}</SelectItem>
                  <SelectItem value="responder">{t('login.responderRole')}</SelectItem>
                  <SelectItem value="observer">{t('login.observerRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? t('login.verifyingButton') : t('login.loginButton')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>{t('login.footerText', { year: new Date().getFullYear() })}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

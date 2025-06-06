import { AppShell } from '@/components/layout/app-shell';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
    params: {
        locale: string;
    };
}

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    return <AppShell>{children}</AppShell>;
} 
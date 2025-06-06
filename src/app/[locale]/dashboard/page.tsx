import { getTranslations } from '@/app/i18n';
import { ChatList } from '@/components/chat/chat-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardPageProps {
    params: {
        locale: string;
    };
}

export default async function DashboardPage({
    params,
}: DashboardPageProps) {
    const { t } = await getTranslations(params.locale, ['common']);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChatList />
                </CardContent>
            </Card>
        </div>
    );
} 
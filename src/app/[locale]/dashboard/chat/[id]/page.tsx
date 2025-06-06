import { ChatList } from '@/components/chat/chat-list';
import { ChatView } from '@/components/chat/chat-view';
import { getTranslations } from '../../../../i18n';

interface ChatPageProps {
    params: {
        id: string;
        locale: string;
    };
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { t } = await getTranslations(params.locale, ['common']);

    return (
        <div className="grid h-full md:grid-cols-[350px_1fr]">
            <div className="hidden md:block h-full">
                <ChatList />
            </div>
            <ChatView chatId={params.id} />
        </div>
    );
}

export async function generateStaticParams() {
    // In a real app, fetch chat IDs. For now, using mock data.
    const { mockChats } = await import('@/lib/mock-data');
    const locales = ['en', 'al'];

    return locales.flatMap(locale =>
        mockChats.map((chat) => ({
            locale,
            id: chat.id,
        }))
    );
} 
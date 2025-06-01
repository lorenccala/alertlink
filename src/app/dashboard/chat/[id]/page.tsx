import { ChatList } from '@/components/chat/chat-list';
import { ChatView } from '@/components/chat/chat-view';

interface ChatPageProps {
  params: { id: string };
}

export default function ChatPage({ params }: ChatPageProps) {
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
  return mockChats.map((chat) => ({
    id: chat.id,
  }));
}

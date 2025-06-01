import { ChatList } from '@/components/chat/chat-list';
import { MessageSquareDashed } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid h-full md:grid-cols-[350px_1fr]">
      <ChatList />
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-background/50 p-8 text-center">
        <MessageSquareDashed className="h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Welcome to AlertLink</h2>
        <p className="text-muted-foreground max-w-md">
          Select a chat to start messaging or view broadcasts. Use the sidebar to navigate through different sections.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Remember, this platform is for authorized emergency communication.
        </p>
      </div>
    </div>
  );
}

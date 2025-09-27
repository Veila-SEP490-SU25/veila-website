'use client';

import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatRoom } from '@/components/chat/chatroom';
import { useSocket } from '@/hooks/use-socket';

export default function ChatPage() {
  const { conversations, currentRoomId, changeRoom, messages, sendMessage } = useSocket();
  return (
    <div className="h-screen md:max-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <ChatSidebar
        conversations={conversations}
        currentRoomId={currentRoomId}
        changeRoom={changeRoom}
      />
      <ChatRoom
        messages={messages}
        currentRoomId={currentRoomId}
        sendMessage={sendMessage}
        conversations={conversations}
      />
    </div>
  );
}

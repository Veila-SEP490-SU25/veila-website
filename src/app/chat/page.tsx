'use client';

import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatRoom } from '@/components/chat/chatroom';

export default function ChatPage() {
  return (
    <div className="h-screen md:max-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <ChatSidebar />
      <ChatRoom />
    </div>
  );
}

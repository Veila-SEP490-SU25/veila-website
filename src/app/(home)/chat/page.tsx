'use client';

import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/chat-sidebar';

export default function ChatPage() {
  return (
    <div className="h-screen md:h-[calc(100vh-4rem)] flex max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <ChatSidebar />
    </div>
  );
}

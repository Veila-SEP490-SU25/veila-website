"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Chatroom } from "@/components/chat/chatroom";

export default function ChatPage() {
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  return (
    <div className="h-screen flex">
      <ChatSidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isChatMinimized ? "h-16 overflow-hidden" : "h-full"
        }`}
      >
        <Chatroom
          isMinimized={isChatMinimized}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
        />
      </div>
    </div>
  );
}

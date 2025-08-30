"use client"

import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { Chatroom } from "@/components/chat/chatroom"

export default function ChatPage() {
  return (
      <div className="h-screen flex">
        <ChatSidebar />
        <Chatroom />
      </div>
  )
}

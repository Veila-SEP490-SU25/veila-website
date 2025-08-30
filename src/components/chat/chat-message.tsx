"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { IMessage } from "@/services/types/chat.type"
import { MessageType } from "@/services/types/chat.type"
import { FileImage, FileVideo } from "lucide-react"

interface ChatMessageProps {
  message: IMessage
  sender: {
    id: string
    name: string
    avatarUrl: string | null
    type: string
  } | null
  isCurrentUser: boolean
}

export function ChatMessage({ message, sender, isCurrentUser }: ChatMessageProps) {
  const formatTime = (dateString: Date | string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <p className="text-sm">{message.content}</p>
      case MessageType.IMAGE:
        return (
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            <span className="text-sm">Image: {message.content}</span>
          </div>
        )
      case MessageType.VIDEO:
        return (
          <div className="flex items-center gap-2">
            <FileVideo className="h-4 w-4" />
            <span className="text-sm">Video: {message.content}</span>
          </div>
        )
      default:
        return <p className="text-sm">{message.content}</p>
    }
  }

  return (
    <div className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender?.avatarUrl || undefined} />
        <AvatarFallback className="text-xs">{sender?.name.charAt(0).toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {renderMessageContent()}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{sender?.name || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

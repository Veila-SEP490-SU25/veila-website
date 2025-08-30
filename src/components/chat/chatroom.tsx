"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/providers/chat.provider"
import type { IChatroom } from "@/services/types/chat.type"
import { MessageType } from "@/services/types/chat.type"
import { MoreVertical, Send, Store, User } from "lucide-react"
import { useState } from "react"
import { ChatMessage } from "@/components/chat/chat-message"

export function Chatroom() {
  const { currentRoom, messages, sendMessage, currentUserId } = useChat()
  const [newMessage, setNewMessage] = useState("")

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  const getOtherParticipant = (chatroom: IChatroom) => {
    const isCustomer = chatroom.customerId === currentUserId
    return {
      id: isCustomer ? chatroom.shopId : chatroom.customerId,
      name: isCustomer ? chatroom.shopName : chatroom.customerName,
      avatarUrl: isCustomer ? chatroom.shopAvatarUrl : chatroom.customerAvatarUrl,
      type: isCustomer ? "shop" : "customer",
    }
  }

  const getParticipantById = (senderId: string) => {
    if (senderId === currentRoom.customerId) {
      return {
        id: currentRoom.customerId,
        name: currentRoom.customerName,
        avatarUrl: currentRoom.customerAvatarUrl,
        type: "customer",
      }
    } else if (senderId === currentRoom.shopId) {
      return {
        id: currentRoom.shopId,
        name: currentRoom.shopName,
        avatarUrl: currentRoom.shopAvatarUrl,
        type: "shop",
      }
    }
    return null
  }

  const otherParticipant = getOtherParticipant(currentRoom)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    await sendMessage(newMessage.trim(), MessageType.TEXT)
    setNewMessage("")
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant.avatarUrl || undefined} />
                <AvatarFallback>{otherParticipant.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {otherParticipant.type === "shop" ? (
                <Store className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
              ) : (
                <User className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{otherParticipant.name}</h2>
              <div className="flex gap-2">
                {currentRoom.orderId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Order #{currentRoom.orderId}
                  </span>
                )}
                {currentRoom.requestId && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Request #{currentRoom.requestId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const sender = getParticipantById(message.senderId)
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  sender={sender}
                  isCurrentUser={message.senderId === currentUserId}
                />
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

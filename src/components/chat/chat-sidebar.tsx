"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/providers/chat.provider"
import type { IChatroom } from "@/services/types/chat.type"
import { MessageCircle, Plus, Search, Store, User } from "lucide-react"
import { useState } from "react"

export function ChatSidebar() {
  const { chatrooms, currentRoom, selectRoom, currentUserId, createChatroom } = useChat()
  const [searchTerm, setSearchTerm] = useState("")

  const getOtherParticipant = (chatroom: IChatroom) => {
    const isCustomer = chatroom.customerId === currentUserId
    return {
      id: isCustomer ? chatroom.shopId : chatroom.customerId,
      name: isCustomer ? chatroom.shopName : chatroom.customerName,
      avatarUrl: isCustomer ? chatroom.shopAvatarUrl : chatroom.customerAvatarUrl,
      unreadCount: isCustomer ? chatroom.customerUnreadCount : chatroom.shopUnreadCount,
      type: isCustomer ? "shop" : "customer",
    }
  }

  const filteredChatrooms = chatrooms.filter((chatroom) => {
    const participant = getOtherParticipant(chatroom)
    const searchLower = searchTerm.toLowerCase()
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      chatroom.orderId?.toLowerCase().includes(searchLower) ||
      chatroom.requestId?.toLowerCase().includes(searchLower) ||
      chatroom.name?.toLowerCase().includes(searchLower)
    )
  })

  const handleCreateChatroom = async () => {
    // Example: Create a new chatroom with mock data
    await createChatroom({
      orderId: null,
      requestId: null,
      name: "New Chat",
      customerId: "customer-1",
      customerName: "John Doe",
      customerAvatarUrl: null,
      shopId: "shop-1",
      shopName: "Fashion Store",
      shopAvatarUrl: null,
    })
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </h2>
          <Button size="sm" variant="outline" onClick={handleCreateChatroom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChatrooms.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredChatrooms.map((chatroom) => {
              const participant = getOtherParticipant(chatroom)
              const isSelected = currentRoom?.id === chatroom.id

              return (
                <div
                  key={chatroom.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    isSelected ? "bg-accent" : ""
                  }`}
                  onClick={() => selectRoom(chatroom.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatarUrl || undefined} />
                        <AvatarFallback>{participant.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {participant.type === "shop" ? (
                        <Store className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
                      ) : (
                        <User className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{participant.name}</h3>
                        {participant.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {participant.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {chatroom.orderId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                            Order #{chatroom.orderId}
                          </span>
                        )}
                        {chatroom.requestId && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                            Request #{chatroom.requestId}
                          </span>
                        )}
                        {chatroom.messages.length > 0 && (
                          <p className="truncate mt-1">{chatroom.messages[chatroom.messages.length - 1].content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

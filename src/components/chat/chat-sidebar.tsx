"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/providers/chat.provider";
import type { IChatroom } from "@/services/types/chat.type";
import { MessageType } from "@/services/types/chat.type";
import {
  MessageCircle,
  Plus,
  Search,
  Store,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

export function ChatSidebar() {
  const { chatrooms, currentRoom, selectRoom, currentUserId, messages } =
    useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Loading effect
  useEffect(() => {
    if (chatrooms.length > 0 || currentUserId) {
      setIsLoading(false);
    }
  }, [chatrooms.length, currentUserId]);

  const getLastMessageContent = (chatroom: IChatroom) => {
    // Check lastMessage from chatroom first
    if (chatroom.lastMessage && chatroom.lastMessage.content) {
      // Check if it's an image message
      if (chatroom.lastMessage.content.startsWith("data:image/")) {
        return { content: "🖼️ Hình ảnh", isImage: true };
      }
      return { content: chatroom.lastMessage.content, isImage: false };
    }

    // Fallback to messages collection
    const chatroomMessages = messages.filter(
      (msg) =>
        msg.chatRoomId === chatroom.id || msg.chatRoomId === chatroom.docId
    );

    if (chatroomMessages.length > 0) {
      const lastMessage = chatroomMessages[chatroomMessages.length - 1];

      // Check message type
      if (lastMessage.type === MessageType.IMAGE) {
        return { content: "🖼️ Hình ảnh", isImage: true };
      }

      // Check if content is base64 image
      if (
        lastMessage.content &&
        lastMessage.content.startsWith("data:image/")
      ) {
        return { content: "🖼️ Hình ảnh", isImage: true };
      }

      return { content: lastMessage.content, isImage: false };
    }

    return { content: null, isImage: false };
  };

  const getOtherParticipant = (chatroom: IChatroom) => {
    if (chatroom.lastMessage) {
      const otherParticipant = {
        id: chatroom.lastMessage.shopId,
        name:
          chatroom.lastMessage.shopName || chatroom.shopName || "Unknown Shop",
        avatarUrl: chatroom.customerAvatarUrl,
        unreadCount: chatroom.lastMessage.unreadCount || 0,
        type: "shop" as const,
      };
      return otherParticipant;
    }

    const isCustomer = chatroom.customerId === currentUserId;
    const otherParticipant = {
      id: isCustomer ? chatroom.shopId || "" : chatroom.customerId,
      name: isCustomer
        ? chatroom.shopName || "Unknown Shop"
        : chatroom.customerName || "Unknown Customer",
      avatarUrl: isCustomer
        ? chatroom.shopAvatarUrl
        : chatroom.customerAvatarUrl,
      unreadCount: isCustomer
        ? chatroom.customerUnreadCount || 0
        : chatroom.shopUnreadCount || 0,
      type: isCustomer ? "shop" : "customer",
    };

    return otherParticipant;
  };

  const filteredChatrooms = chatrooms.filter((chatroom) => {
    const participant = getOtherParticipant(chatroom);
    const searchLower = searchTerm.toLowerCase();
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      chatroom.orderId?.toLowerCase().includes(searchLower) ||
      chatroom.requestId?.toLowerCase().includes(searchLower) ||
      chatroom.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateChatroom = async () => {
    console.log(
      "Create chatroom functionality - would open shop selection modal"
    );
  };

  return (
    <div className="w-80 border-r bg-background flex flex-col">
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

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="h-12 w-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p>Đang tải cuộc trò chuyện...</p>
              <p className="text-sm mt-2">Vui lòng chờ trong giây lát</p>
            </div>
          ) : filteredChatrooms.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có cuộc trò chuyện nào</p>
              <p className="text-sm mt-2">Tìm kiếm shop để bắt đầu nhắn tin</p>
            </div>
          ) : (
            filteredChatrooms.map((chatroom) => {
              const participant = getOtherParticipant(chatroom);
              const isSelected = currentRoom?.id === chatroom.id;

              return (
                <div
                  key={chatroom.docId || chatroom.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    isSelected ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    const roomIdToSelect = chatroom.id || chatroom.docId;
                    if (roomIdToSelect) {
                      selectRoom(roomIdToSelect);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatarUrl || undefined} />
                        <AvatarFallback>
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {participant.type === "shop" ? (
                        <Store className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
                      ) : (
                        <User className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {participant.name}
                        </h3>
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
                        {(() => {
                          const lastMessageInfo =
                            getLastMessageContent(chatroom);
                          if (lastMessageInfo.content) {
                            return (
                              <div className="flex items-center gap-1 mt-1">
                                {lastMessageInfo.isImage && (
                                  <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                )}
                                <p className="truncate text-xs">
                                  {lastMessageInfo.content}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/providers/chat.provider";
import { useAuth } from "@/providers/auth.provider";
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
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Loading effect
  useEffect(() => {
    // Set loading to false immediately if we have user ID
    if (currentUserId) {
      setIsLoading(false);
    }
  }, [currentUserId]);

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
    // Check if current user is customer or shop
    const isCustomer = chatroom.customerId === currentUserId;
    const isShop =
      chatroom.shopId === currentUserId ||
      (currentUser?.role === "SHOP" && chatroom.shopId === undefined);

    if (isCustomer) {
      // Current user is customer, show shop info
      return {
        id: chatroom.shopId || "",
        name:
          chatroom.shopName || chatroom.lastMessage?.shopName || "Unknown Shop",
        avatarUrl: chatroom.shopAvatarUrl,
        unreadCount: chatroom.shopUnreadCount || 0,
        type: "shop" as const,
      };
    } else if (isShop) {
      // Current user is shop, show customer info
      return {
        id: chatroom.customerId,
        name: chatroom.customerName || "Unknown Customer",
        avatarUrl: chatroom.customerAvatarUrl,
        unreadCount: chatroom.customerUnreadCount || 0,
        type: "customer" as const,
      };
    }

    // Fallback for other cases - this should not happen with proper role checking
    console.warn("Unexpected chatroom structure:", {
      chatroom,
      currentUserId,
      customerId: chatroom.customerId,
      shopId: chatroom.shopId,
    });

    // Default fallback - try to determine based on available data
    if (chatroom.shopId && chatroom.shopId !== currentUserId) {
      // This is a customer chatroom
      return {
        id: chatroom.customerId,
        name: chatroom.customerName || "Unknown Customer",
        avatarUrl: chatroom.customerAvatarUrl,
        unreadCount: chatroom.customerUnreadCount || 0,
        type: "customer" as const,
      };
    } else if (chatroom.customerId && chatroom.customerId !== currentUserId) {
      // This is a shop chatroom
      return {
        id: chatroom.shopId || "",
        name:
          chatroom.shopName || chatroom.lastMessage?.shopName || "Unknown Shop",
        avatarUrl: chatroom.shopAvatarUrl,
        unreadCount: chatroom.shopUnreadCount || 0,
        type: "shop" as const,
      };
    }

    // Last resort fallback
    return {
      id: "unknown",
      name: "Unknown Participant",
      avatarUrl: null,
      unreadCount: 0,
      type: "unknown" as const,
    };
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
    <div className="w-64 border-r bg-background flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </h2>
          <Button size="sm" variant="outline" onClick={handleCreateChatroom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-1">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-6">
              <div className="h-10 w-10 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Đang tải cuộc trò chuyện...</p>
              <p className="text-xs mt-1">Vui lòng chờ trong giây lát</p>
            </div>
          ) : filteredChatrooms.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs mt-1">Tìm kiếm shop để bắt đầu nhắn tin</p>
            </div>
          ) : (
            filteredChatrooms.map((chatroom) => {
              const participant = getOtherParticipant(chatroom);
              const isSelected = currentRoom?.id === chatroom.id;

              return (
                <div
                  key={chatroom.docId || chatroom.id}
                  className={`p-2 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    isSelected ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    const roomIdToSelect = chatroom.id || chatroom.docId;
                    if (roomIdToSelect) {
                      selectRoom(roomIdToSelect);
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatarUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {participant.type === "shop" ? (
                        <Store className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full p-0.5" />
                      ) : (
                        <User className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full p-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate text-sm">
                          {participant.name}
                        </h3>
                        {participant.unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-1 rounded-full text-xs px-1.5 py-0.5"
                          >
                            {participant.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chatroom.orderId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-1">
                            Order #{chatroom.orderId}
                          </span>
                        )}
                        {chatroom.requestId && (
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded mr-1">
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
                                  <ImageIcon className="h-2.5 w-2.5 text-muted-foreground" />
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

"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useChat } from "@/providers/chat.provider";
import type { IChatroom } from "@/services/types/chat.type";
import { MessageType } from "@/services/types/chat.type";
import {
  MoreVertical,
  Send,
  Store,
  User,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/chat-message";

interface ChatroomProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function Chatroom({
  isMinimized = false,
  onToggleMinimize,
}: ChatroomProps) {
  const {
    currentRoom,
    currentRoomId,
    messages,
    sendMessage,
    currentUserId,
    markAsRead,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Loading effect when switching rooms
  useEffect(() => {
    if (currentRoomId) {
      setIsLoadingMessages(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoadingMessages(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRoomId]);

  // Initial loading effect
  useEffect(() => {
    if (currentRoom || currentRoomId) {
      setIsInitialLoading(false);
    }
  }, [currentRoom, currentRoomId]);

  useEffect(() => {
    if (!currentRoomId) return;

    const timeoutId = setTimeout(() => {
      markAsRead(currentRoomId);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentRoomId, markAsRead]);

  if (isInitialLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h3 className="text-lg font-medium mb-2">Đang tải...</h3>
            <p className="text-muted-foreground">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Chọn cuộc trò chuyện</h3>
            <p className="text-muted-foreground">
              Chọn một cuộc trò chuyện từ sidebar để bắt đầu nhắn tin
            </p>
          </div>
        </div>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Chọn cuộc trò chuyện để bắt đầu nhắn tin..."
              disabled
              className="flex-1"
            />
            <Button disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getOtherParticipant = (chatroom: IChatroom) => {
    // Check if current user is customer
    const isCustomer = chatroom.customerId === currentUserId;

    if (isCustomer) {
      // Current user is customer, show shop info
      return {
        id: chatroom.shopId || "",
        name: chatroom.shopName || "Unknown Shop",
        avatarUrl: chatroom.shopAvatarUrl || null,
        type: "shop" as const,
      };
    } else {
      // Current user is shop, show customer info
      return {
        id: chatroom.customerId,
        name: chatroom.customerName || "Unknown Customer",
        avatarUrl: chatroom.customerAvatarUrl || null,
        type: "customer" as const,
      };
    }
  };

  const getParticipantById = (senderId: string) => {
    // Check if sender is customer
    if (senderId === currentRoom.customerId) {
      return {
        id: currentRoom.customerId,
        name: currentRoom.customerName,
        avatarUrl: currentRoom.customerAvatarUrl || null,
        type: "customer",
      };
    }

    // Check if sender is shop (from currentRoom.shopId)
    if (senderId === currentRoom.shopId) {
      return {
        id: currentRoom.shopId || "",
        name: currentRoom.shopName || "Unknown Shop",
        avatarUrl: currentRoom.shopAvatarUrl || null,
        type: "shop",
      };
    }

    // Check if sender is shop (from lastMessage.shopId)
    if (
      currentRoom.lastMessage &&
      senderId === currentRoom.lastMessage.shopId
    ) {
      return {
        id: currentRoom.lastMessage.shopId,
        name:
          currentRoom.lastMessage.shopName ||
          currentRoom.shopName ||
          "Unknown Shop",
        avatarUrl: currentRoom.shopAvatarUrl || null,
        type: "shop",
      };
    }

    // Default fallback
    return {
      id: senderId,
      name: "Unknown",
      avatarUrl: null,
      type: "unknown",
    };
  };

  const otherParticipant = getOtherParticipant(currentRoom);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage.trim(), MessageType.TEXT);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage) return;

    setIsUploadingImage(true);
    try {
      // Convert image to base64 for demo (in real app, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        sendMessage(imageUrl, MessageType.IMAGE);
        setSelectedImage(null);
        setIsUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("Error sending image:", error);
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-background flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant.avatarUrl || undefined} />
                <AvatarFallback>
                  {otherParticipant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <ScrollArea className="flex-1 p-4 overflow-auto" ref={scrollAreaRef}>
          <div className="space-y-4 min-h-0">
            {isLoadingMessages ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="mb-4">
                  <div className="h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium mb-2">Đang tải tin nhắn...</p>
                <p className="text-sm">Vui lòng chờ trong giây lát</p>
              </div>
            ) : (
              (() => {
                const roomMessages = messages.filter(
                  (msg) =>
                    msg.chatRoomId === currentRoomId ||
                    msg.chatRoomId === currentRoom?.id ||
                    msg.chatRoomId === currentRoom?.docId
                );

                // Temporary debug for message order
                if (roomMessages.length > 0) {
                  console.log("=== MESSAGE ORDER CHECK ===");
                  console.log("Room messages count:", roomMessages.length);
                  console.log("First message:", {
                    content: roomMessages[0]?.content?.substring(0, 30),
                    timestamp: roomMessages[0]?.timestamp,
                    sender: roomMessages[0]?.senderName,
                  });
                  console.log("Last message:", {
                    content: roomMessages[
                      roomMessages.length - 1
                    ]?.content?.substring(0, 30),
                    timestamp: roomMessages[roomMessages.length - 1]?.timestamp,
                    sender: roomMessages[roomMessages.length - 1]?.senderName,
                  });
                }

                if (roomMessages.length === 0) {
                  return (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="mb-4">
                        <Send className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      </div>
                      <p className="text-lg font-medium mb-2">
                        Chưa có tin nhắn nào
                      </p>
                      <p className="text-sm">
                        Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu
                        tiên!
                      </p>
                    </div>
                  );
                }

                return roomMessages.map((message, index) => {
                  const sender = getParticipantById(message.senderId);

                  return (
                    <ChatMessage
                      key={message.docId || `${message.id}-${index}`}
                      message={message}
                      sender={sender}
                      isCurrentUser={message.senderId === currentUserId}
                    />
                  );
                });
              })()
            )}
          </div>
        </ScrollArea>
      )}

      {!isMinimized && (
        <div className="p-4 border-t bg-background flex-shrink-0">
          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-3 p-3 bg-muted/20 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hình ảnh đã chọn:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="relative">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  width={320}
                  height={128}
                  className="max-h-32 max-w-full rounded object-cover"
                  unoptimized={true}
                  priority={false}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSendImage}
                  disabled={isUploadingImage}
                  className="flex-1"
                >
                  {isUploadingImage ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Gửi hình ảnh"
                  )}
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Nhắn tin với ${otherParticipant.name}...`}
              className="flex-1"
              disabled={isUploadingImage}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              title="Gửi hình ảnh"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              disabled={!newMessage.trim() || isUploadingImage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

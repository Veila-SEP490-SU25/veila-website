"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IMessage } from "@/services/types/chat.type";
import { MessageType } from "@/services/types/chat.type";
import { FileImage, FileVideo } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ChatMessageProps {
  message: IMessage;
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null | undefined;
    type: string;
  } | null;
  isCurrentUser: boolean;
}

export function ChatMessage({
  message,
  sender,
  isCurrentUser,
}: ChatMessageProps) {
  const [imageError, setImageError] = useState(false);
  const formatTime = (dateString: Date | string | undefined | null) => {
    try {
      if (!dateString) {
        console.warn("Date is undefined or null:", dateString);
        return "Invalid Date";
      }

      let date: Date;
      if (
        typeof dateString === "object" &&
        dateString !== null &&
        "toDate" in dateString
      ) {
        date = (dateString as any).toDate();
      } else if (typeof dateString === "string") {
        date = new Date(dateString);
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        console.error("Invalid date format:", dateString);
        return "Invalid Date";
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date value:", dateString);
        return "Invalid Date";
      }

      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid Date";
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <p className="text-sm">{message.content}</p>;
      case MessageType.IMAGE:
      case "image":
        // Use imageUrl if available, fallback to content
        const imageSrc = message.imageUrl || message.content;

        if (imageError) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <FileImage className="h-4 w-4" />
                <span className="text-sm">Không thể tải hình ảnh</span>
              </div>
            </div>
          );
        }

        if (!imageSrc) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <FileImage className="h-4 w-4" />
                <span className="text-sm">Không có URL hình ảnh</span>
              </div>
            </div>
          );
        }

        // Check if it's a local file path (can't load in web)
        if (imageSrc.startsWith("file://")) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <FileImage className="h-4 w-4" />
                <span className="text-sm">
                  Hình ảnh từ thiết bị (không thể hiển thị trên web)
                </span>
              </div>
            </div>
          );
        }

        // Check if it's a base64 image
        const isBase64 = imageSrc.startsWith("data:image/");

        return (
          <div className="space-y-2">
            <div className="relative max-w-xs">
              {isBase64 ? (
                <Image
                  src={imageSrc}
                  alt="Message image"
                  width={200}
                  height={150}
                  className="max-w-full h-auto rounded-lg"
                  onError={() => {
                    setImageError(true);
                  }}
                  unoptimized={true}
                  priority={false}
                />
              ) : (
                <Image
                  src={imageSrc}
                  alt="Message image"
                  width={200}
                  height={150}
                  className="rounded-lg"
                  onError={() => {
                    setImageError(true);
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                  unoptimized={true}
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span className="text-sm">Hình ảnh</span>
            </div>
          </div>
        );
      case MessageType.VIDEO:
        return (
          <div className="space-y-2">
            <video
              src={message.content}
              controls
              className="max-w-xs rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4" />
              <span className="text-sm">Video</span>
            </div>
          </div>
        );
      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender?.avatarUrl || undefined} />
        <AvatarFallback className="text-xs">
          {sender?.name.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {renderMessageContent()}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {sender?.name || "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(
              message.timestamp ||
                message.createdAt ||
                message.updatedAt ||
                new Date()
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@/providers/chat.provider";
import { useAuth } from "@/providers/auth.provider";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateChatButtonProps {
  shopId: string;
  shopName: string;
  shopAvatarUrl?: string | null;
  orderId?: string | null;
  requestId?: string | null;
  dressId?: string | null;
  dressName?: string | null;
  className?: string;
}

export function CreateChatButton({
  shopId,
  shopName,
  shopAvatarUrl,
  orderId,
  requestId,
  dressId,
  dressName,
  className,
}: CreateChatButtonProps) {
  const { createChatroom } = useChat();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để nhắn tin với shop");
      return;
    }

    if (!shopId || !shopName) {
      toast.error("Thông tin shop không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      const chatroomId = await createChatroom({
        orderId: orderId || null,
        requestId: requestId || null,
        dressId: dressId || null,
        name: orderId
          ? `Đơn hàng #${orderId}`
          : requestId
          ? `Yêu cầu #${requestId}`
          : dressId
          ? `Váy: ${dressName || dressId}`
          : null,
        customerId: currentUser.id,
        customerName:
          `${currentUser.firstName || ""} ${
            currentUser.lastName || ""
          }`.trim() || `${currentUser.username || "Khách hàng"}`,
        customerAvatarUrl: currentUser.avatarUrl || null,
        shopId,
        shopName,
        shopAvatarUrl: shopAvatarUrl || null,
      });

      if (chatroomId) {
        toast.success("Đã tạo cuộc trò chuyện với shop!");
        window.location.href = `/chat`;
      } else {
        toast.error("Không thể tạo cuộc trò chuyện. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error creating chatroom:", error);
      toast.error("Có lỗi xảy ra khi tạo cuộc trò chuyện");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateChat}
      disabled={isLoading}
      className={className}
      variant="outline"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {isLoading ? "Đang tạo..." : "Nhắn tin với shop"}
    </Button>
  );
}

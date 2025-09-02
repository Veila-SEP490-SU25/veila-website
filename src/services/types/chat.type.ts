import { IItem } from "@/services/types/base.type";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

export interface IChatroom extends IItem {
  docId?: string;
  customerId: string;
  customerName: string;
  isActive?: boolean;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: Date | string;
    lastMessageTime: Date | string;
    shopId: string;
    shopName: string;
    unreadCount: number;
  };

  orderId?: string | null;
  requestId?: string | null;
  name?: string | null;
  messages?: IMessage[];
  customerAvatarUrl?: string | null;
  customerUnreadCount?: number;
  shopId?: string;
  shopName?: string;
  shopAvatarUrl?: string | null;
  shopUnreadCount?: number;
  members?: string[];
}

export interface IMessage extends IItem {
  docId?: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  timestamp: Date | string;
  isRead: boolean;
  imageUrl?: string; // For image messages
  senderAvatar?: string; // For sender avatar
}

export interface CreateChatroomData {
  orderId?: string | null;
  requestId?: string | null;
  dressId?: string | null;
  name?: string | null;
  customerId: string;
  customerName: string;
  customerAvatarUrl?: string | null;
  shopId: string;
  shopName: string;
  shopAvatarUrl?: string | null;
}

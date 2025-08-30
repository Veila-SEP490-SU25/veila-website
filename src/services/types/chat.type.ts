import { IItem } from "@/services/types/base.type";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

export interface IChatroom extends IItem {
  docId?: string
  orderId: string | null
  requestId: string | null
  name: string | null
  messages: IMessage[]
  customerId: string
  customerName: string
  customerAvatarUrl: string | null
  customerUnreadCount: number
  shopId: string
  shopName: string
  shopAvatarUrl: string | null
  shopUnreadCount: number
  members: string[]
}

export interface IMessage extends IItem {
  docId?: string
  chatroomId: string
  senderId: string
  content: string
  type: MessageType
}
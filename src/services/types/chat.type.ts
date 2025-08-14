import { IItem } from "@/services/types/base.type";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

export interface IChatroom extends IItem{
  docId?: string;
  orderId: string;
  name: string;
  memberIds: string[];
  messages: IMessage[];
}

export interface IMessage extends IItem{
  docId?: string;
  chatroomId: string;
  senderId: string;
  content: string;
  type: MessageType;
}
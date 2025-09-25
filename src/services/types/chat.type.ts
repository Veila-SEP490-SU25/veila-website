export interface IMessage {
  chatRoomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface IConversation {
  conversationId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string | null;
  lastMessage: IMessage | null;
  unReadCount: number;
}

"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useChatData } from "@/hooks/use-chat-data";
import type {
  IChatroom,
  IMessage,
  MessageType,
  CreateChatroomData,
} from "@/services/types/chat.type";

interface ChatContextType {
  chatrooms: IChatroom[];
  currentRoom: IChatroom | null;
  currentRoomId: string | null;
  messages: IMessage[];
  currentUserId: string;
  selectRoom: (id: string) => void;
  sendMessage: (content: string, type: MessageType) => Promise<void>;
  createChatroom: (data: CreateChatroomData) => Promise<string | null>;
  markAsRead: (chatroomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chatData = useChatData();

  return (
    <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

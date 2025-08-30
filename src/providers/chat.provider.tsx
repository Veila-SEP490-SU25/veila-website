"use client";

import type React from "react";
import { useFirestore, type Condition } from "@/hooks/use-firestore";
import { useAuth } from "@/providers/auth.provider";
import { useFirebase } from "@/services/firebase";
import type {
  IChatroom,
  IMessage,
  MessageType,
} from "@/services/types/chat.type";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { v4 } from "uuid";

interface CreateChatroomData {
  orderId: string | null;
  requestId: string | null;
  name: string | null;
  customerId: string;
  customerName: string;
  customerAvatarUrl: string | null;
  shopId: string;
  shopName: string;
  shopAvatarUrl: string | null;
}

interface ChatContextType {
  chatrooms: IChatroom[];
  currentRoom: IChatroom | null;
  messages: IMessage[];
  currentUserId: string;
  selectRoom: (id: string) => void;
  sendMessage: (content: string, type: MessageType) => Promise<void>;
  createChatroom: (data: CreateChatroomData) => Promise<string | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const { firestore } = useFirebase();

  const updateDocument = async (
    collectionPath: string,
    docId: string,
    data: any
  ) => {
    if (!firestore) return;
    const docRef = doc(firestore, collectionPath, docId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  };

  const addDocument = async (collectionPath: string, data: any) => {
    if (!firestore) return;
    const query = collection(firestore, collectionPath);
    const docRef = await addDoc(query, { ...data, createdAt: new Date() });
    return docRef.id;
  };

  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const currentUserId = currentUser?.id || "current-user";

  // Query chatrooms where current user is either customer or shop
  const chatroomCondition = useMemo<Condition>(() => {
    return {
      field: "members",
      operator: "array-contains",
      value: currentUserId,
    };
  }, [currentUserId]);

  const roomCondition = useMemo<Condition>(() => {
    return {
      field: "id",
      operator: "==",
      value: currentRoomId || "",
    };
  }, [currentRoomId]);

  const messageCondition = useMemo<Condition>(() => {
    return {
      field: "chatroomId",
      operator: "==",
      value: currentRoomId || "",
    };
  }, [currentRoomId]);

  const { data: chatrooms } = useFirestore("chatrooms", chatroomCondition);
  const { data: currentRoomData } = useFirestore("chatrooms", roomCondition);
  const { data: messages } = useFirestore("messages", messageCondition);

  const currentRoom = currentRoomData[0] as IChatroom | null;

  useEffect(() => {
    const handleFirestoreError = (error: any) => {
      console.warn("Firestore query error:", error);
      if (error.code === "failed-precondition") {
        console.info(
          "Firestore index required. Please create the required indexes."
        );
      }
    };

    // Add global error handler for unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason?.code === "failed-precondition") {
        event.preventDefault();
        handleFirestoreError(event.reason);
      }
    });

    return () => {
      window.removeEventListener("unhandledrejection", handleFirestoreError);
    };
  }, []);

  const selectRoom = (id: string) => {
    setCurrentRoomId(id);
  };

  const createChatroom = useCallback(
    async (data: CreateChatroomData): Promise<string | null> => {
      if (!firestore) return null;

      const chatroomId = v4();
      const newChatroom: Omit<IChatroom, "docId"> = {
        id: chatroomId,
        orderId: data.orderId,
        requestId: data.requestId,
        name: data.name,
        messages: [],
        customerId: data.customerId,
        customerName: data.customerName,
        customerAvatarUrl: data.customerAvatarUrl,
        customerUnreadCount: 0,
        shopId: data.shopId,
        shopName: data.shopName,
        shopAvatarUrl: data.shopAvatarUrl,
        shopUnreadCount: 0,
        members: [data.customerId, data.shopId],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        const docId = await addDocument("chatrooms", newChatroom);
        console.log("Chatroom created with ID:", docId);
        return chatroomId;
      } catch (error) {
        console.error("Error creating chatroom:", error);
        return null;
      }
    },
    [firestore]
  );

  const sendMessage = useCallback(
    async (content: string, type: MessageType) => {
      if (!currentRoom || !currentUserId) return;

      const newMessage: IMessage = {
        id: v4(),
        content,
        chatroomId: currentRoomId || "",
        senderId: currentUserId,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        // Send the message to Firestore
        await addDocument("messages", newMessage);

        // Update the chatroom with the new message
        const updatedMessages = [...(currentRoom.messages || []), newMessage];
        await updateDocument("chatrooms", currentRoom.docId || "", {
          messages: updatedMessages,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [currentRoomId, currentUserId, currentRoom]
  );

  return (
    <ChatContext.Provider
      value={{
        chatrooms: chatrooms as IChatroom[],
        currentRoom,
        messages: messages as IMessage[],
        currentUserId,
        selectRoom,
        sendMessage,
        createChatroom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

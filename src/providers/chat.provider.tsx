"use client";

import { Condition, useFirestore } from "@/hooks/use-firestore";
import { useAuth } from "@/providers/auth.provider";
import { useFirebase } from "@/services/firebase";
import { IChatroom, IMessage, MessageType } from "@/services/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { v4 } from "uuid";

type ChatContextType = {
  chatrooms: IChatroom[];
  currentRoom: IChatroom | null;
  messages: IMessage[];
  selectRoom: (id: string) => void;
  sendMessage: (content: string, type: MessageType) => Promise<void>;
};

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
    await addDoc(query, { ...data, createdAt: new Date() });
  };

  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const chatroomCondition = useMemo<Condition>(() => {
    return {
      field: "memberIds",
      operator: "array-contains",
      value: currentUser?.id || "",
    };
  }, [currentUser]);

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

  const chatrooms = useFirestore("chatrooms", chatroomCondition) as IChatroom[];
  const currentRoom = useFirestore(
    "chatrooms",
    roomCondition
  )[0] as IChatroom | null;
  const messages = useFirestore("messages", messageCondition) as IMessage[];

  const selectRoom = (id: string) => {
    setCurrentRoomId(id);
  };

  const sendMessage = useCallback(
    async (content: string, type: MessageType) => {
      if (!currentRoom && !currentUser) return;
      const newMessage: IMessage = {
        id: v4(),
        images: "",
        content,
        chatroomId: currentRoomId || "",
        senderId: currentUser?.id || "",
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      // Send the message to Firestore
      await addDocument("messages", newMessage);
      currentRoom?.messages.push(newMessage);
      await updateDocument("chatrooms", currentRoom?.docId || "", {
        messages: currentRoom?.messages || [],
      });
    },
    [currentRoomId, currentUser]
  );

  return (
    <ChatContext.Provider
      value={{ chatrooms, currentRoom, messages, selectRoom, sendMessage }}
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

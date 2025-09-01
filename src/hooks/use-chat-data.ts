import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/providers/auth.provider";
import { useFirebase } from "@/services/firebase";
import { useFirestore } from "@/hooks/use-firestore";
import { FIREBASE_COLLECTIONS, FIREBASE_FIELDS } from "@/constants/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import type {
  IChatroom,
  IMessage,
  MessageType,
  CreateChatroomData,
} from "@/services/types/chat.type";
import type { Condition } from "@/hooks/use-firestore";

export const useChatData = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { firestore } = useFirebase();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const updateDocument = useCallback(
    async (collectionPath: string, docId: string, data: any) => {
      if (!firestore) return;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      const docRef = doc(firestore, collectionPath, docId);
      await updateDoc(docRef, { ...cleanData, updatedAt: new Date() });
    },
    [firestore]
  );

  const addDocument = useCallback(
    async (collectionPath: string, data: any) => {
      if (!firestore) return;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      const query = collection(firestore, collectionPath);
      const docRef = await addDoc(query, {
        ...cleanData,
        createdAt: new Date(),
      });
      return docRef.id;
    },
    [firestore]
  );

  const currentUserId = currentUser?.id || "";

  const chatroomCondition = useMemo<Condition | undefined>(() => {
    if (!currentUserId || !isAuthenticated || !firestore) return undefined;

    const isShop = currentUser?.role === "SHOP";

    if (isShop) {
      return {
        field: FIREBASE_FIELDS.SHOP_ID,
        operator: "==",
        value: currentUserId,
      };
    } else {
      return {
        field: FIREBASE_FIELDS.CUSTOMER_ID,
        operator: "==",
        value: currentUserId,
      };
    }
  }, [currentUserId, isAuthenticated, firestore, currentUser?.role]);

  const roomCondition = useMemo<Condition | undefined>(() => {
    if (!currentRoomId) return undefined;
    return {
      field: "id",
      operator: "==",
      value: currentRoomId,
    };
  }, [currentRoomId]);

  const messageCondition = useMemo<Condition | undefined>(() => {
    if (!currentRoomId) return undefined;

    return {
      field: FIREBASE_FIELDS.CHATROOM_ID,
      operator: "==" as const,
      value: currentRoomId,
    };
  }, [currentRoomId]);

  const { data: rawChatrooms, error: chatroomsError } = useFirestore(
    FIREBASE_COLLECTIONS.CHATROOMS,
    chatroomCondition
  );

  // Fallback query for shop role if no data found
  const { data: fallbackChatrooms } = useFirestore(
    FIREBASE_COLLECTIONS.CHATROOMS,
    currentUser?.role === "SHOP" && (!rawChatrooms || rawChatrooms.length === 0)
      ? undefined // Query all chatrooms without condition
      : undefined
  );

  // Use main query data or fallback for shop role
  const effectiveChatrooms = useMemo(() => {
    if (
      currentUser?.role === "SHOP" &&
      (!rawChatrooms || rawChatrooms.length === 0)
    ) {
      return fallbackChatrooms || [];
    }
    return rawChatrooms || [];
  }, [rawChatrooms, fallbackChatrooms, currentUser?.role]);

  const { data: _currentRoomData, error: roomError } = useFirestore(
    FIREBASE_COLLECTIONS.CHATROOMS,
    roomCondition
  );
  const { data: rawMessages, error: messagesError } = useFirestore(
    FIREBASE_COLLECTIONS.MESSAGES,
    messageCondition
  );

  useEffect(() => {
    if (chatroomsError) {
      console.error("Error fetching chatrooms:", chatroomsError);
    }
    if (roomError) {
      console.error("Error fetching current room:", roomError);
    }
    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
    }
  }, [chatroomsError, roomError, messagesError]);

  useEffect(() => {
    // Only log when there are significant changes and not too frequently
    if (effectiveChatrooms && effectiveChatrooms.length > 0) {
      console.log("=== CHATROOMS DEBUG ===");
      console.log("Effective chatrooms count:", effectiveChatrooms.length);
      console.log("Current user role:", currentUser?.role);
      console.log("Current user ID:", currentUserId);

      // Only log first few chatrooms to avoid spam
      effectiveChatrooms.slice(0, 2).forEach((chatroom, index) => {
        console.log(`Chatroom ${index}:`, {
          id: chatroom.id,
          customerId: chatroom.customerId,
          shopId: chatroom.shopId,
          customerName: chatroom.customerName,
          shopName: chatroom.shopName,
          isForCurrentUser:
            currentUser?.role === "SHOP"
              ? chatroom.shopId === currentUserId
              : chatroom.customerId === currentUserId,
        });
      });
    }
  }, [effectiveChatrooms, currentUserId, currentUser?.role]);

  useEffect(() => {
    if (!firestore || !currentUserId || !isAuthenticated) return;

    const migrateData = async () => {
      try {
        const lowercaseQuery = query(
          collection(firestore, "chatrooms"),
          where(FIREBASE_FIELDS.MEMBERS, "array-contains", currentUserId)
        );
        const lowercaseSnapshot = await getDocs(lowercaseQuery);

        if (lowercaseSnapshot.docs.length > 0) {
          console.log(
            `Found ${lowercaseSnapshot.docs.length} chatrooms in lowercase collection, migrating...`
          );

          for (const docSnapshot of lowercaseSnapshot.docs) {
            const data = docSnapshot.data();

            await addDocument(FIREBASE_COLLECTIONS.CHATROOMS, {
              ...data,
              docId: docSnapshot.id,
            });

            console.log(`Migrated chatroom: ${docSnapshot.id}`);
          }

          console.log("Migration completed");
        }
      } catch (error) {
        console.error("Migration error:", error);
      }
    };

    if (rawChatrooms && rawChatrooms.length === 0) {
      migrateData();
    }
  }, [firestore, currentUserId, isAuthenticated, rawChatrooms, addDocument]);

  const messages = useMemo(() => {
    if (!rawMessages || rawMessages.length === 0) return [];

    const uniqueMap = new Map();
    rawMessages.forEach((message: any) => {
      const key = message.docId || message.id;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, message);
      } else {
        const existing = uniqueMap.get(key);
        const existingDate = existing.updatedAt || existing.createdAt;
        const currentDate = message.updatedAt || message.createdAt;

        if (currentDate > existingDate) {
          uniqueMap.set(key, message);
        }
      }
    });

    const deduplicatedMessages = Array.from(uniqueMap.values());

    const sortedMessages = deduplicatedMessages.sort((a, b) => {
      let timeA: Date;
      let timeB: Date;

      if (a.timestamp instanceof Date) {
        timeA = a.timestamp;
      } else if (typeof a.timestamp === "string") {
        timeA = new Date(a.timestamp);
      } else if (
        a.timestamp &&
        typeof a.timestamp === "object" &&
        "toDate" in a.timestamp
      ) {
        timeA = (a.timestamp as any).toDate();
      } else {
        timeA = new Date(0);
      }

      if (b.timestamp instanceof Date) {
        timeB = b.timestamp;
      } else if (typeof b.timestamp === "string") {
        timeB = new Date(b.timestamp);
      } else if (
        b.timestamp &&
        typeof b.timestamp === "object" &&
        "toDate" in b.timestamp
      ) {
        timeB = (b.timestamp as any).toDate();
      } else {
        timeB = new Date(0);
      }

      return timeA.getTime() - timeB.getTime();
    });

    return sortedMessages;
  }, [rawMessages]);

  const chatrooms = useMemo(() => {
    if (!effectiveChatrooms || effectiveChatrooms.length === 0) {
      return [];
    }

    const filteredChatrooms = effectiveChatrooms.filter((chatroom: any) => {
      if (currentUser?.role === "SHOP") {
        return (
          chatroom.shopId === currentUserId || chatroom.shopId === undefined
        );
      } else if (currentUser?.role === "CUSTOMER") {
        return chatroom.customerId === currentUserId;
      }
      return false;
    });

    if (filteredChatrooms.length === 0) {
      return [];
    }

    const uniqueMap = new Map();

    filteredChatrooms.forEach((chatroom: any) => {
      const key = chatroom.docId || chatroom.id;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, chatroom);
      } else {
        const existing = uniqueMap.get(key);

        const existingDate =
          existing.updatedAt ||
          existing.createdAt ||
          existing.lastMessage?.timestamp;
        const currentDate =
          chatroom.updatedAt ||
          chatroom.createdAt ||
          chatroom.lastMessage?.timestamp;

        const existingTime = new Date(existingDate || 0).getTime();
        const currentTime = new Date(currentDate || 0).getTime();

        if (currentTime > existingTime) {
          uniqueMap.set(key, chatroom);
        }
      }
    });

    const sortedChatrooms = Array.from(uniqueMap.values()).sort((a, b) => {
      const aTime = new Date(
        a.updatedAt || a.createdAt || a.lastMessage?.timestamp || 0
      ).getTime();
      const bTime = new Date(
        b.updatedAt || b.createdAt || b.lastMessage?.timestamp || 0
      ).getTime();
      return bTime - aTime;
    });

    return sortedChatrooms;
  }, [effectiveChatrooms, currentUser?.role, currentUserId]);

  const currentRoom = useMemo(() => {
    if (!currentRoomId || !chatrooms.length) return null;

    const foundRoom = chatrooms.find(
      (room) => room.id === currentRoomId || room.docId === currentRoomId
    );

    return foundRoom || null;
  }, [currentRoomId, chatrooms]);

  useEffect(() => {
    if (!currentRoomId && chatrooms.length > 0) {
      const firstChatroom = chatrooms[0];
      const roomIdToSelect = firstChatroom.id || firstChatroom.docId;
      console.log("Auto-selecting room:", roomIdToSelect);
      setCurrentRoomId(roomIdToSelect);
    }
  }, [currentRoomId, chatrooms]);

  const selectRoom = useCallback(
    (id: string) => {
      console.log("=== SELECT ROOM DEBUG ===");
      console.log("Selecting room ID:", id);
      console.log(
        "Available chatrooms:",
        chatrooms.map((room) => ({ id: room.id, docId: room.docId }))
      );

      const foundChatroom = chatrooms.find(
        (room) => room.id === id || room.docId === id
      );
      console.log("Found chatroom:", foundChatroom);

      setCurrentRoomId(id);
    },
    [chatrooms]
  );

  const createChatroom = useCallback(
    async (data: CreateChatroomData): Promise<string | null> => {
      if (!firestore) return null;

      if (
        !data.customerId ||
        !data.customerName ||
        !data.shopId ||
        !data.shopName
      ) {
        return null;
      }

      const existingChatroom = chatrooms.find(
        (room) =>
          room.customerId === data.customerId &&
          room.lastMessage?.shopId === data.shopId
      );

      if (existingChatroom) {
        setCurrentRoomId(existingChatroom.id);
        return existingChatroom.id;
      }

      const chatroomId = uuidv4();

      const newChatroom: Omit<IChatroom, "docId"> = {
        id: chatroomId,
        customerId: data.customerId,
        shopId: data.shopId,
        customerName: data.customerName,
        shopName: data.shopName,
        customerAvatarUrl: data.customerAvatarUrl,
        shopAvatarUrl: data.shopAvatarUrl,
        orderId: data.orderId,
        requestId: data.requestId,
        name: data.name,
        lastMessage: undefined,
        customerUnreadCount: 0,
        shopUnreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        const docId = await addDocument(
          FIREBASE_COLLECTIONS.CHATROOMS,
          newChatroom
        );
        console.log("Created chatroom:", docId);

        setCurrentRoomId(chatroomId);

        return chatroomId;
      } catch (error) {
        console.error("Error creating chatroom:", error);
        return null;
      }
    },
    [firestore, addDocument, setCurrentRoomId, chatrooms]
  );

  const sendMessage = useCallback(
    async (content: string, type: MessageType) => {
      if (!currentRoom || !currentUserId || !firestore) {
        return;
      }

      try {
        const newMessage: Omit<IMessage, "docId"> = {
          id: uuidv4(),
          chatRoomId: currentRoomId || "",
          senderId: currentUserId,
          senderName: currentUser?.firstName || currentUser?.username || "User",
          content: content,
          type: type,
          timestamp: new Date(),
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        };

        await addDocument(FIREBASE_COLLECTIONS.MESSAGES, newMessage);

        const updateData: any = {
          updatedAt: new Date(),
          lastMessage: {
            content: content,
            senderName:
              currentUser?.firstName || currentUser?.username || "User",
            timestamp: new Date(),
            lastMessageTime: new Date(),
            shopId: currentRoom.lastMessage?.shopId || "",
            shopName: currentRoom.lastMessage?.shopName || "",
            unreadCount: (currentRoom.lastMessage?.unreadCount || 0) + 1,
          },
        };

        await updateDocument(
          FIREBASE_COLLECTIONS.CHATROOMS,
          currentRoom.docId || "",
          updateData
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [
      currentRoomId,
      currentUserId,
      currentRoom,
      currentUser,
      firestore,
      addDocument,
      updateDocument,
    ]
  );

  const markAsRead = useCallback(
    async (chatroomId: string) => {
      if (!firestore || !currentUserId) return;

      try {
        const chatroom = chatrooms.find((room) => room.id === chatroomId);
        if (!chatroom) return;

        const isCustomer = chatroom.customerId === currentUserId;
        const currentUnreadCount = isCustomer
          ? chatroom.customerUnreadCount
          : chatroom.shopUnreadCount;

        if (currentUnreadCount === 0) {
          return;
        }

        const updateData: any = { updatedAt: new Date() };

        if (isCustomer) {
          updateData.customerUnreadCount = 0;
        } else {
          updateData.shopUnreadCount = 0;
        }

        await updateDocument(
          FIREBASE_COLLECTIONS.CHATROOMS,
          chatroom.docId || "",
          updateData
        );
        console.log("Marked chatroom as read:", chatroomId);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    },
    [firestore, currentUserId, chatrooms, updateDocument]
  );

  return {
    chatrooms,
    currentRoom,
    currentRoomId,
    messages,
    currentUserId,
    selectRoom,
    createChatroom,
    sendMessage,
    markAsRead,
    isAuthenticated,
  };
};

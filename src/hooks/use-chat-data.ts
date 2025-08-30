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
    return {
      field: FIREBASE_FIELDS.CUSTOMER_ID, // Use customerId instead of members
      operator: "==",
      value: currentUserId,
    };
  }, [currentUserId, isAuthenticated, firestore]);

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
  const { data: _currentRoomData, error: roomError } = useFirestore(
    FIREBASE_COLLECTIONS.CHATROOMS,
    roomCondition
  );
  const { data: rawMessages, error: messagesError } = useFirestore(
    FIREBASE_COLLECTIONS.MESSAGES,
    messageCondition
  );

  // Log errors for debugging
  useEffect(() => {
    if (chatroomsError) {
      console.error("Chatrooms query error:", chatroomsError);
    }
    if (roomError) {
      console.error("Room query error:", roomError);
    }
    if (messagesError) {
      console.error("Messages query error:", messagesError);
    }
  }, [chatroomsError, roomError, messagesError]);

  // Debug: Log chatrooms data
  useEffect(() => {
    console.log("=== CHATROOMS DEBUG ===");
    console.log("Current user ID:", currentUserId);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Firestore available:", !!firestore);
    console.log("Chatroom condition:", chatroomCondition);

    if (rawChatrooms && rawChatrooms.length > 0) {
      console.log("Raw chatrooms:", rawChatrooms.length, rawChatrooms);
      console.log("Collection name:", FIREBASE_COLLECTIONS.CHATROOMS);

      // Log each chatroom details
      rawChatrooms.forEach((chatroom, index) => {
        console.log(`Chatroom ${index}:`, {
          id: chatroom.id,
          docId: chatroom.docId,
          customerId: chatroom.customerId,
          customerName: chatroom.customerName,
          isActive: chatroom.isActive,
          lastMessage: chatroom.lastMessage,
          createdAt: chatroom.createdAt,
          updatedAt: chatroom.updatedAt,
        });

        // Check if this chatroom matches the target message
        if (rawMessages && rawMessages.length > 0) {
          const chatroomMessages = rawMessages.filter(
            (msg) =>
              msg.chatRoomId === chatroom.id ||
              msg.chatRoomId === chatroom.docId
          );
          console.log(
            `Messages for chatroom ${chatroom.id}:`,
            chatroomMessages.length
          );
        }
      });

      // Check if any chatroom matches the message chatRoomId
      if (rawMessages && rawMessages.length > 0) {
        const messageChatRoomIds = [
          ...new Set(rawMessages.map((msg) => msg.chatRoomId)),
        ];
        console.log("Message chatRoomIds:", messageChatRoomIds);

        messageChatRoomIds.forEach((msgChatRoomId) => {
          const matchingChatroom = rawChatrooms.find(
            (room) => room.id === msgChatRoomId || room.docId === msgChatRoomId
          );
          console.log(`Chatroom match for ${msgChatRoomId}:`, matchingChatroom);
        });
      }
    } else {
      console.log(
        "No chatrooms found in collection:",
        FIREBASE_COLLECTIONS.CHATROOMS
      );

      // Check if there are other collections with chat data
      if (firestore && currentUserId) {
        console.log("Checking for other chat collections...");

        // Check "chatrooms" (lowercase) collection
        const checkLowercaseCollection = async () => {
          try {
            const lowercaseQuery = query(
              collection(firestore, "chatrooms"),
              where(FIREBASE_FIELDS.MEMBERS, "array-contains", currentUserId)
            );
            const lowercaseSnapshot = await getDocs(lowercaseQuery);
            console.log(
              "Found in 'chatrooms' collection:",
              lowercaseSnapshot.docs.length
            );

            if (lowercaseSnapshot.docs.length > 0) {
              console.log(
                "Lowercase chatrooms:",
                lowercaseSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            }
          } catch (error) {
            console.log("No 'chatrooms' collection or error:", error);
          }
        };

        checkLowercaseCollection();

        // Check all chatrooms without condition
        const checkAllChatrooms = async () => {
          try {
            const allQuery = query(
              collection(firestore, FIREBASE_COLLECTIONS.CHATROOMS)
            );
            const allSnapshot = await getDocs(allQuery);
            console.log(
              "All chatrooms in collection:",
              allSnapshot.docs.length
            );

            if (allSnapshot.docs.length > 0) {
              console.log(
                "All chatrooms:",
                allSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            }
          } catch (error) {
            console.error("Error checking all chatrooms:", error);
          }
        };

        checkAllChatrooms();
      }
    }
  }, [
    rawChatrooms,
    firestore,
    currentUserId,
    isAuthenticated,
    chatroomCondition,
    rawMessages,
  ]);

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

            // Add to camelCase collection
            await addDocument(FIREBASE_COLLECTIONS.CHATROOMS, {
              ...data,
              docId: docSnapshot.id, // Preserve original docId
            });

            console.log(`Migrated chatroom: ${docSnapshot.id}`);
          }

          console.log("Migration completed");
        }
      } catch (error) {
        console.error("Migration error:", error);
      }
    };

    // Only migrate if no data in camelCase collection
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

    // Sort messages by timestamp (oldest first for display)
    const sortedMessages = deduplicatedMessages.sort((a, b) => {
      let timeA: Date;
      let timeB: Date;

      // Handle different timestamp formats
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
        timeA = new Date(0); // Fallback
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
        timeB = new Date(0); // Fallback
      }

      return timeA.getTime() - timeB.getTime(); // Ascending: oldest first
    });

    return sortedMessages;
  }, [rawMessages]);

  const chatrooms = useMemo(() => {
    if (!rawChatrooms || rawChatrooms.length === 0) return [];

    const uniqueMap = new Map();
    const duplicates: Array<{
      key: string;
      existing: any;
      current: any;
    }> = [];

    rawChatrooms.forEach((chatroom: any) => {
      // Use docId as primary key, fallback to id
      const key = chatroom.docId || chatroom.id;

      if (!key) {
        console.warn("Chatroom without key:", chatroom);
        return;
      }

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, chatroom);
      } else {
        // Found duplicate
        const existing = uniqueMap.get(key);

        // Get timestamps from different possible locations
        const existingDate =
          existing.updatedAt ||
          existing.createdAt ||
          existing.lastMessage?.lastMessageTime ||
          existing.lastMessage?.timestamp;
        const currentDate =
          chatroom.updatedAt ||
          chatroom.createdAt ||
          chatroom.lastMessage?.lastMessageTime ||
          chatroom.lastMessage?.timestamp;

        // Compare dates properly
        const existingTime = new Date(existingDate || 0).getTime();
        const currentTime = new Date(currentDate || 0).getTime();

        duplicates.push({
          key,
          existing: { ...existing, time: existingTime },
          current: { ...chatroom, time: currentTime },
        });

        if (currentTime > existingTime) {
          uniqueMap.set(key, chatroom);
          console.log(`Replaced chatroom ${key} with newer version`);
        }
      }
    });

    // Log duplicates for debugging
    if (duplicates.length > 0) {
      console.log("Found duplicates:", duplicates);
    }

    // Sort by most recent first
    const sortedChatrooms = Array.from(uniqueMap.values()).sort((a, b) => {
      const aTime = new Date(
        a.updatedAt ||
          a.createdAt ||
          a.lastMessage?.lastMessageTime ||
          a.lastMessage?.timestamp ||
          0
      ).getTime();
      const bTime = new Date(
        b.updatedAt ||
          b.createdAt ||
          b.lastMessage?.lastMessageTime ||
          b.lastMessage?.timestamp ||
          0
      ).getTime();
      return bTime - aTime;
    });

    // Debug: Log deduplication results
    if (rawChatrooms && rawChatrooms.length !== sortedChatrooms.length) {
      console.log(
        `Deduplicated chatrooms: ${rawChatrooms.length} -> ${sortedChatrooms.length}`
      );
    }

    return sortedChatrooms;
  }, [rawChatrooms]);

  // Find current room from chatrooms array instead of separate query
  const currentRoom = useMemo(() => {
    if (!currentRoomId || !chatrooms.length) return null;

    const foundRoom = chatrooms.find(
      (room) => room.id === currentRoomId || room.docId === currentRoomId
    );

    return foundRoom || null;
  }, [currentRoomId, chatrooms]);

  // Debug: Log current room
  useEffect(() => {
    if (currentRoomId) {
      console.log("Current room ID:", currentRoomId);
    }
  }, [currentRoomId]);

  // Auto-select first chatroom if none selected
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

      // Check if this ID exists in chatrooms
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
        console.error("Missing required fields for chatroom creation");
        return null;
      }

      // Check if chatroom already exists
      const existingChatroom = chatrooms.find(
        (room) =>
          room.customerId === data.customerId &&
          room.lastMessage?.shopId === data.shopId
      );

      if (existingChatroom) {
        console.log(
          "Chatroom already exists, selecting existing:",
          existingChatroom.id
        );
        setCurrentRoomId(existingChatroom.id);
        return existingChatroom.id;
      }

      const chatroomId = uuidv4();

      // Use mobile app structure
      const newChatroom: Omit<IChatroom, "docId"> = {
        id: chatroomId,
        customerId: data.customerId,
        customerName: data.customerName,
        isActive: true,
        lastMessage: {
          content: "",
          senderName: data.customerName,
          timestamp: new Date(),
          lastMessageTime: new Date(),
          shopId: data.shopId,
          shopName: data.shopName,
          unreadCount: 0,
        },
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

        // Select the new chatroom
        setCurrentRoomId(chatroomId);

        return chatroomId;
      } catch (error) {
        console.error("Error creating chatroom:", error);
        return null;
      }
    },
    [firestore, addDocument, chatrooms, setCurrentRoomId]
  );

  const sendMessage = useCallback(
    async (content: string, type: MessageType) => {
      if (!currentRoom || !currentUserId || !firestore) {
        console.error("Cannot send message: missing required data");
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

        console.log("Sending message:", newMessage);

        await addDocument(FIREBASE_COLLECTIONS.MESSAGES, newMessage);

        // Update lastMessage in chatroom
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

        console.log("Message sent successfully");
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

'use client';

import { io, type Socket } from 'socket.io-client';
import { getSocketConfig } from '@/lib/utils';
import { useAuth } from '@/providers/auth.provider';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { IConversation, IMessage } from '@/services/types';

export interface ISendMessagePayload {
  content: string;
  imageUrl?: string;
}

export const useSocket = () => {
  const socketUrl = getSocketConfig();
  const { currentAccessToken, refreshTokens, currentUser } = useAuth();

  // Socket ref for cleanup and operations
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Chat data with better state management
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');

  // Refs to prevent stale closures
  const currentRoomIdRef = useRef<string>('');

  // Update refs when state changes
  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  // Socket connection management with better cleanup
  useEffect(() => {
    if (!socketUrl || !currentAccessToken) {
      // Clean up existing socket if credentials are missing
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Clean up existing socket before creating new one
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const newSocket: Socket = io(socketUrl, {
      extraHeaders: {
        authorization: currentAccessToken,
      },
      auth: {
        token: currentAccessToken,
      },
      transports: ['websocket'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // Set a timeout to attempt reconnection if needed
      if (reason === 'io server disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.connect();
          }
        }, 2000);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Auth error handling
    newSocket.on('exception', (error) => {
      console.error('Socket exception:', error);
      refreshTokens();
    });

    // Message handling with duplicate prevention
    newSocket.on('message', (message: IMessage) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => {
        // Check for duplicate messages based on content, sender, and timestamp
        const isDuplicate = prevMessages.some(
          (existingMessage) =>
            existingMessage.senderId === message.senderId &&
            existingMessage.content === message.content &&
            Math.abs(
              new Date(existingMessage.createdAt).getTime() - new Date(message.createdAt).getTime(),
            ) < 1000, // Within 1 second
        );

        if (isDuplicate) {
          return prevMessages;
        }

        // Add new message and sort by timestamp
        const updatedMessages = [...prevMessages, message];
        return updatedMessages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    });

    // Conversation handling with better state updates
    newSocket.on('conversation', (conversation: IConversation) => {
      console.log('Received conversation:', conversation);
      setConversations((prevConversations) => {
        // Remove existing conversation with same ID to prevent duplicates
        const filteredConversations = prevConversations.filter(
          (c) => c.conversationId !== conversation.conversationId,
        );

        // Add updated conversation and sort by last message timestamp
        const updatedConversations = [...filteredConversations, conversation];
        return updatedConversations.sort((a, b) => {
          const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      });
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up socket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      newSocket.removeAllListeners();
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [currentAccessToken, socketUrl, refreshTokens]);

  // Enhanced changeRoom with better state management
  const changeRoom = useCallback((roomId: string) => {
    if (roomId === currentRoomIdRef.current) return;
    if (!socketRef.current || !socketRef.current.connected) return;

    // Clear current messages immediately for better UX
    setMessages([]);
    setCurrentRoomId(roomId);

    // Request messages for new room
    socketRef.current.emit('getMessage', { conversationId: roomId });
  }, []);

  // Enhanced sendMessage with validation
  const sendMessage = useCallback((payload: ISendMessagePayload) => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.warn('Socket not connected, cannot send message');
      return;
    }

    if (!currentRoomIdRef.current) {
      console.warn('No current room selected, cannot send message');
      return;
    }

    if (!payload.content.trim() && !payload.imageUrl) {
      console.warn('Message content is empty, cannot send message');
      return;
    }

    socketRef.current.emit('sendMessage', {
      ...payload,
      chatRoomId: currentRoomIdRef.current,
    });
  }, []);

  // Enhanced createConversation with validation
  const createConversation = useCallback(
    (receiverId: string) => {
      if (!socketRef.current || !socketRef.current.connected) {
        console.warn('Socket not connected, cannot create conversation');
        return;
      }

      if (!currentUser) {
        console.warn('User not authenticated, cannot create conversation');
        return;
      }

      if (receiverId === currentUser.id) {
        console.warn('Cannot create conversation with self');
        return;
      }

      socketRef.current.emit('createConversation', {
        user1Id: currentUser.id,
        user2Id: receiverId,
      });
    },
    [currentUser],
  );

  return {
    messages,
    conversations,
    sendMessage,
    changeRoom,
    createConversation,
    currentRoomId: currentRoomIdRef.current,
  };
};

'use client';

import { io, Socket } from 'socket.io-client';
import { getSocketConfig } from '@/lib/utils';
import { useAuth } from '@/providers/auth.provider';
import { useCallback, useEffect, useState } from 'react';
import { IConversation, IMessage } from '@/services/types';

export interface ISendMessagePayload {
  content: string;
  imageUrl?: string;
}

export const useSocket = () => {
  const socketUrl = getSocketConfig();
  const { currentAccessToken, refreshTokens, currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');

  useEffect(() => {
    if (!socketUrl || !currentAccessToken) return;
    const socket: Socket = io(socketUrl, {
      extraHeaders: {
        authorization: currentAccessToken,
      },
      auth: {
        token: currentAccessToken,
      },
      transports: ['websocket'],
    });

    socket.on('exception', () => {
      refreshTokens();
    });

    socket.on('message', (message: IMessage) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('conversation', (conversation: IConversation) => {
      setConversations((prevConversations) =>
        [
          ...prevConversations.filter((c) => c.conversationId !== conversation.conversationId),
          conversation,
        ].sort((a, b) => {
          const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return dateB - dateA;
        }),
      );
    });

    setSocket(socket);
  }, [currentAccessToken, socketUrl]);

  const changeRoom = useCallback(
    (roomId: string) => {
      if (roomId === currentRoomId) return;
      if (!socket) return;

      socket.emit('getMessage', { conversationId: roomId });
      setCurrentRoomId(roomId);
      setMessages([]);
    },
    [socket, currentRoomId],
  );

  const sendMessage = useCallback(
    (payload: ISendMessagePayload) => {
      if (!socket || !currentRoomId) return;
      socket.emit('sendMessage', { ...payload, chatRoomId: currentRoomId });
    },
    [socket, currentRoomId],
  );

  const createConversation = useCallback(
    (receiverId: string) => {
      if (!socket || !currentUser) return;
      socket.emit('createConversation', {
        user1Id: currentUser.id,
        user2Id: receiverId,
      });
    },
    [socket, currentUser],
  );

  return {
    messages,
    conversations,
    sendMessage,
    changeRoom,
    createConversation,
    currentRoomId,
  };
};

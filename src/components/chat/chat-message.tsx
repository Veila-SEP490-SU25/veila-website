"use client";

import { useAuth } from '@/providers/auth.provider';
import { IMessage } from '@/services/types';

interface MessageProps {
  message: IMessage;
}

export const ChatMessage = ({ message }: MessageProps) => {
  const { currentUser } = useAuth();

  
};

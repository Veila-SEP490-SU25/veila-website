'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DateFormatType, formatDate } from '@/lib/chat-utils';
import { IMessage } from '@/services/types';
import Image from 'next/image';

interface MessageProps {
  message: IMessage;
  isOwn: boolean;
}

export const ChatMessage = ({ message, isOwn }: MessageProps) => {
  return (
    <div className={`flex items-start justify-start gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar className="size-10">
        <AvatarImage src={message.senderAvatar || undefined} />
        <AvatarFallback>{message.senderName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
        <p className="text-sm font-medium">{message.senderName}</p>
        <div
          className={`w-fit max-w-1/3 h-auto border rounded-lg space-y-2 ${isOwn ? 'ml-auto bg-rose-400' : ''} p-2`}
        >
          <p className="text-sm font-normal">{message.content}</p>
          {message.imageUrl && (
            <Image
              src={message.imageUrl || ''}
              alt="Message Image"
              className="w-full h-auto object-cover"
              width={300}
              height={300}
            />
          )}
          <p className={`text-xs font-light`}>
            {formatDate(message.createdAt, DateFormatType.DATEDIFF)}
          </p>
        </div>
      </div>
    </div>
  );
};

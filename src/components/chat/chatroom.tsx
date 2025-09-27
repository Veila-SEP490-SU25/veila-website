'use client';

import { ChatMessage } from '@/components/chat/chat-message';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadButton } from '@/components/upload-button';
import { ISendMessagePayload, useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/providers/auth.provider';
import { IConversation, IMessage, UserRole } from '@/services/types';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Image as ImageIcon, MessageCircleMore, SendHorizonal } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface ChatRoomProps {
  messages: IMessage[];
  conversations: IConversation[];
  currentRoomId: string;
  sendMessage: (payload: ISendMessagePayload) => void;
}

export const ChatRoom = ({
  messages,
  currentRoomId,
  sendMessage,
  conversations,
}: ChatRoomProps) => {
  const { currentUser } = useAuth();
  const [currentConv, setCurrentConv] = useState<IConversation | null>(null);

  // message state
  const [message, setMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    console.log('Messages updated, scrolling to bottom');

    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [messages]);

  useEffect(() => {
    const conv = conversations.find((c) => c.conversationId === currentRoomId);
    setCurrentConv(conv || null);
  }, [currentRoomId, conversations]);

  const handleSendMessage = useCallback(() => {
    console.log('Sending message:', { content: message, imageUrl });
    sendMessage({ content: message, imageUrl: imageUrl || undefined });
    setMessage('');
    setImageUrl('');
  }, [message, imageUrl, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  useEffect(() => {
    if (!imageUrl) return;
    handleSendMessage();
  }, [handleSendMessage]);

  if (!currentRoomId || !currentConv) {
    return (
      <div className="col-span-1 md:col-span-3 size-full relative">
        <div className="flex items-center justify-center flex-col gap-4 absolute top-1/2 left-1/2 -translate-1/2">
          <div className="border-6 border-black rounded-full p-8">
            <MessageCircleMore className="font-light" size={150} />
          </div>
          <p className="font-semibold">Tin nhắn của bạn</p>
          <p className="font-light text-sm">
            Gửi ảnh hoặc tin nhắn riêng tư đến{' '}
            {currentUser?.role === UserRole.SHOP ? 'khách hàng của bạn' : 'người bán hàng'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full col-span-1 md:col-span-3 border-r">
      {/* Chatroom Header */}
      <div className="w-full border-b p-4">
        <div className="flex gap-2 w-full items-center">
          <Avatar className="size-9">
            <AvatarImage src={currentConv.receiverAvatar || undefined} />
            <AvatarFallback>{currentConv.receiverName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-none">{currentConv.receiverName}</p>
          </div>
        </div>
      </div>
      {/* Chatroom Messages */}
      <ScrollArea className={`w-full h-[calc(100vh-12rem)] px-4 py-2`} ref={scrollAreaRef}>
        <div className="w-full h-max space-y-4" ref={scrollRef}>
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} isOwn={msg.senderId === currentUser?.id} />
          ))}
        </div>
      </ScrollArea>
      {/* Message Input */}
      <div className="w-full border-t p-4 relative gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="rounded-full pr-24"
          onKeyDown={handleKeyPress}
        />
        <div className="flex gap-2 absolute right-6 top-1/2 -translate-y-1/2">
          <UploadButton
            urls={imageUrl}
            setUrls={setImageUrl}
            trigger={
              <Button
                size="sm"
                variant="outline"
                className="border-none bg-transparent hover:bg-transparent"
              >
                <ImageIcon className="size-5" />
              </Button>
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="border-none bg-transparent hover:bg-transparent"
            onClick={handleSendMessage}
          >
            <SendHorizonal className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

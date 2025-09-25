'use client';

import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/providers/auth.provider';
import { UserRole } from '@/services/types';
import { MessageCircleMore } from 'lucide-react';
import { useEffect } from 'react';

export const ChatRoom = () => {
  const { currentRoomId, messages } = useSocket();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('Current Room ID:', currentRoomId);
    console.log('Messages in Room:', messages);
  }, [currentRoomId, messages]);
  
  if (!currentRoomId) {
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
};

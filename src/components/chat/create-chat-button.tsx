'use client';

import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/providers/auth.provider';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface CreateChatButtonProps {
  receiverId: string;
  trigger?: React.ReactNode;
}

export function CreateChatButton({ receiverId, trigger }: CreateChatButtonProps) {
  const { createConversation } = useSocket();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateChat = useCallback(() => {
    if (!currentUser) return;
    setIsLoading(true);
    createConversation(receiverId);
    router.push('/chat');
    setIsLoading(false);
  }, [createConversation, receiverId, currentUser, router]);

  return trigger ? (
    <div onClick={handleCreateChat} className="cursor-pointer w-full">
      {trigger}
    </div>
  ) : (
    <Button onClick={handleCreateChat} className="w-full">
      <MessageCircle className="h-4 w-4 mr-2" />
      {isLoading ? 'Đang tạo...' : 'Nhắn tin'}
    </Button>
  );
}

'use client';

import { CreateChatButton } from '@/components/chat/create-chat-button';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ShopChatButtonProps {
  shopId: string;
}

export function ShopChatButton({
  shopId,
}: ShopChatButtonProps) {
  return (
    <CreateChatButton
      receiverId={shopId}
      trigger={
        <Button className="" variant="outline">
          <MessageCircle className="size-4 mr-2" />
          Nhắn tin
        </Button>
      }
    />
  );
}

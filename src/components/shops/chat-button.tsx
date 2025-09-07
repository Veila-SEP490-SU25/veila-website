'use client';

import { CreateChatButton } from '@/components/chat/create-chat-button';

interface ShopChatButtonProps {
  shopId: string;
  shopName: string;
  shopAvatarUrl?: string | null;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShopChatButton({
  shopId,
  shopName,
  shopAvatarUrl,
  className,
}: ShopChatButtonProps) {
  return (
    <CreateChatButton
      shopId={shopId}
      shopName={shopName}
      shopAvatarUrl={shopAvatarUrl}
      className={className}
    />
  );
}

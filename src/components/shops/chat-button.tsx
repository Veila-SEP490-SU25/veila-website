"use client"

import { CreateChatButton } from "@/components/chat/create-chat-button"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface ShopChatButtonProps {
  shopId: string
  shopName: string
  shopAvatarUrl?: string | null
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShopChatButton({
  shopId,
  shopName,
  shopAvatarUrl,
  variant = "outline",
  size = "default",
  className
}: ShopChatButtonProps) {
  return (
    <CreateChatButton
      shopId={shopId}
      shopName={shopName}
      shopAvatarUrl={shopAvatarUrl}
      className={className}
    />
  )
}

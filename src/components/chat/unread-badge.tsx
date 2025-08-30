"use client"

import { Badge } from "@/components/ui/badge"
import { useChat } from "@/providers/chat.provider"
import { useAuth } from "@/providers/auth.provider"
import { useMemo } from "react"

export function UnreadBadge() {
  const { chatrooms } = useChat()
  const { currentUser } = useAuth()

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0

    return chatrooms.reduce((total, chatroom) => {
      const isCustomer = chatroom.customerId === currentUser.id
      const count = isCustomer ? chatroom.customerUnreadCount : chatroom.shopUnreadCount
      return total + (count || 0)
    }, 0)
  }, [chatrooms, currentUser])

  if (unreadCount === 0) return null

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  )
}

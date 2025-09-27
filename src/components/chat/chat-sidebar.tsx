'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { IConversation } from '@/services/types';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatSidebarProps {
  conversations: IConversation[];
  currentRoomId: string;
  changeRoom: (conversationId: string) => void;
}

export const ChatSidebar = ({ conversations, currentRoomId, changeRoom }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredConversations(conversations);
      return;
    }
    const filtered = conversations.filter((conv) =>
      conv.receiverName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
    setFilteredConversations(filtered);
  }, [conversations, debouncedSearchTerm]);

  const handleRoomChange = (conversationId: string) => {
    console.log('Changing room to:', conversationId);
    changeRoom(conversationId);
  };

  return (
    <div className="w-full h-full col-span-1 border-r border-l">
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tin nhắn..."
            className="w-full rounded-md p-2 pr-6"
          />
          <Search className="absolute top-1/2 right-2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
        </div>
      </div>
      <ScrollArea className="w-full h-[calc(100vh-8rem)]">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground p-4">
            Không có cuộc trò chuyện nào
          </p>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.conversationId}
              className={cn(
                'p-2 hover:bg-rose-50 cursor-pointer flex items-center gap-2 transition-colors',
                currentRoomId === conv.conversationId ? 'bg-rose-200' : '',
              )}
              onClick={() => handleRoomChange(conv.conversationId)}
            >
              <Avatar className="size-12 border">
                <AvatarImage src={conv.receiverAvatar || ''} alt={conv.receiverName} />
                <AvatarFallback>{conv.receiverName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{conv.receiverName}</p>
                <p
                  className={cn(
                    'text-xs text-muted-foreground truncate',
                    conv.unReadCount > 0 ? 'font-semibold' : '',
                  )}
                >
                  {(() => {
                    if (conv.lastMessage) {
                      if (conv.lastMessage.content) {
                        return conv.lastMessage.content;
                      }
                      if (conv.lastMessage.imageUrl) {
                        return 'Đã gửi 1 ảnh';
                      }
                    }
                    return 'Chưa có tin nhắn';
                  })()}
                </p>
              </div>
              {conv.unReadCount > 0 && (
                <div className="bg-rose-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                  {conv.unReadCount > 99 ? '99+' : conv.unReadCount}
                </div>
              )}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

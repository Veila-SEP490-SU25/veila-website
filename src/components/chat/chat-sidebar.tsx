import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/use-debounce';
import { useSocket } from '@/hooks/use-socket';
import { cn } from '@/lib/utils';
import { IConversation } from '@/services/types';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const mockedConversations: IConversation[] = [
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
  {
    conversationId: '1',
    receiverName: 'Nguyễn Văn A',
    receiverAvatar: '',
    receiverId: '1',
    lastMessage: {
      chatRoomId: '1',
      senderId: '2',
      senderName: 'Nguyễn Văn B',
      content: 'Hello, how are you?',
      senderAvatar: '',
      createdAt: new Date(),
    },
    unReadCount: 2,
  },
];

export const ChatSidebar = () => {
  const { conversations, currentRoomId, changeRoom } = useSocket();
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
                `p-2 hover:bg-rose-50 ${currentRoomId === conv.conversationId ? 'bg-rose-200' : ''}`,
                `flex items-center cursor-pointer gap-2`,
              )}
              onClick={() => changeRoom(conv.conversationId)}
            >
              <Avatar className="size-12 border">
                <AvatarImage src={conv.receiverAvatar || ''} alt={conv.receiverName} />
                <AvatarFallback>{conv.receiverName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-bold truncate">{conv.receiverName}</p>
                <p
                  className={`text-xs text-muted-foreground truncate ${conv.unReadCount > 0 ? 'font-semibold' : ''}`}
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
                    return '';
                  })()}
                </p>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

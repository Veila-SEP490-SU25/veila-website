import { useSocket } from '@/hooks/use-socket';
import { useEffect, useState } from 'react';

export const ChatSidebar = () => {
  const { conversations } = useSocket();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (!searchTerm) return;
    const filtered = conversations.filter((conv) =>
      conv.receiverName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  return <div className='w-full h-full col-span-1'>
    {filteredConversations.map((conv) => (
      <div key={conv.conversationId} className='p-4 border-b cursor-pointer hover:bg-gray-100'>
        <div className='font-medium'>{conv.receiverName}</div>
        <div className='text-sm text-gray-500'></div>
      </div>
    ))}
  </div>
};

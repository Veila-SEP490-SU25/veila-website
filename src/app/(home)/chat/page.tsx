"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/providers/auth.provider";
import { useChat } from "@/providers/chat.provider";
import { useRouter } from "next/navigation";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const { chatrooms, currentRoom , selectRoom} = useChat();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-4 h-screen min-h-screen max-h-screen w-full gap-4">
        <div className="col-span-1 p-4 border-r size-full">
          <h2 className="text-xl mb-4 font-playfair border-b py-2">
            Tin nhắn của bạn
          </h2>
          {/* Chatroom list component can be added here */}
          {chatrooms.length === 0 ? (
            <p className="font-sans">Bạn hiện không có đoạn chat nào</p>
          ) : (
            chatrooms.map((room) => (
              <Card key={room.id} onClick={() => selectRoom(room.id)}>
                <h3 className="font-semibold">{}</h3>
                <p className="text-sm text-gray-500">
                  {room.messages.length > 0 ? room.messages[room.messages.length - 1].content : "Không có tin nhắn"}
                </p>
              </Card>
            ))
          )}
        </div>
        <div className="col-span-3 p-4 size-full"></div>
      </div>
    </div>
  );
};

export default ChatPage;

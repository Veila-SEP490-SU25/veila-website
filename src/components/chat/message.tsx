import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth.provider";
import { IMessage, MessageType } from "@/services/types";

interface MessageProps {
  message: IMessage;
  className?: string;
}

export const Message = ({ message, className }: MessageProps) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const isSender = message.senderId === currentUser.id;

  return (
    <div
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm overflow-hidden",
        isSender ? "bg-rose-500 ml-auto text-white" : "bg-muted",
        className
      )}
    >
      {message.type === MessageType.TEXT ? (
        message.content
      ) : message.type === MessageType.IMAGE ? (
        <img
          src={message.content}
          alt="Image"
          className="w-full h-auto object-cover"
        />
      ) : (
        <video className="w-full h-auto object-center">
          <source src={message.content} type="video/*" />
        </video>
      )}
    </div>
  );
};

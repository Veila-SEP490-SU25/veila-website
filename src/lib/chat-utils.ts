import { MessageType } from "@/services/types";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import { ImageIcon, Video } from "lucide-react";

export const formatMessageTime = (date: Date) => {
  if (isToday(date)) {
    return format(date, "HH:mm", { locale: vi });
  } else if (isYesterday(date)) {
    return `Hôm qua ${format(date, "HH:mm", { locale: vi })}`;
  } else {
    return format(date, "dd/MM HH:mm", { locale: vi });
  }
};

export const formatChatTime = (date: Date) => {
  if (isToday(date)) {
    return format(date, "HH:mm", { locale: vi });
  } else if (isYesterday(date)) {
    return "Hôm qua";
  } else {
    return format(date, "dd/MM", { locale: vi });
  }
};

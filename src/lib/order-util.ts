import { MilestoneStatus, OrderStatus, OrderType } from "@/services/types";

export const parseImages = (images: string | string[]): string[] => {
  if (Array.isArray(images)) {
    return images;
  }
  if (typeof images === "string") {
    return images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
  }
  return [];
};

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case OrderStatus.PAYING:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case OrderStatus.IN_PROCESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Chờ xử lý";
    case OrderStatus.PAYING:
      return "Chờ thanh toán";
    case OrderStatus.IN_PROCESS:
      return "Đang xử lý";
    case OrderStatus.COMPLETED:
      return "Hoàn thành";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
};

export const getTypeText = (type: OrderType) => {
  switch (type) {
    case OrderType.SELL:
      return "Bán hàng";
    case OrderType.RENT:
      return "Cho thuê";
    case OrderType.CUSTOM:
      return "Đặt may";
    default:
      return type;
  }
};

export const getTypeColor = (type: OrderType) => {
  switch (type) {
    case OrderType.SELL:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case OrderType.RENT:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case OrderType.CUSTOM:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getMilestoneStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "CheckCircle";
    case MilestoneStatus.IN_PROGRESS:
      return "PlayCircle";
    case MilestoneStatus.CANCELLED:
      return "XCircle";
    default:
      return "AlertCircle";
  }
};

export const getMilestoneStatusText = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "Hoàn thành";
    case MilestoneStatus.IN_PROGRESS:
      return "Đang thực hiện";
    case MilestoneStatus.CANCELLED:
      return "Đã hủy";
    case MilestoneStatus.PENDING:
      return "Chờ thực hiện";
    default:
      return status;
  }
};

export const getMilestoneStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case MilestoneStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case MilestoneStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    case MilestoneStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatDateShort = (date: Date | string) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(date));
};

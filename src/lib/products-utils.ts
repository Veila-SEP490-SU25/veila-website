import { IDress } from "@/services/types";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const dressStatusColors = {
  AVAILABLE: "bg-green-100 text-green-800",
  RENTED: "bg-yellow-100 text-yellow-800",
  SOLD: "bg-gray-100 text-gray-800",
  MAINTENANCE: "bg-red-100 text-red-800",
  UNAVAILABLE: "bg-gray-100 text-gray-600",
};

export const dressStatusLabels = {
  AVAILABLE: "Có sẵn",
  RENTED: "Đã cho thuê",
  SOLD: "Đã bán",
  MAINTENANCE: "Bảo trì",
  UNAVAILABLE: "Không có sẵn",
};

export const getCoverImage = (dress: IDress) => {
  if (!dress.images) {
    return "/placeholder.svg?height=400&width=400";
  }
  return dress.images.split(",")[0];
};

export const getImages = (dress: IDress) => {
  if (!dress.images) {
    return ["/placeholder.svg?height=400&width=400"];
  }
  return dress.images.split(",").map((image) => image.trim());
};

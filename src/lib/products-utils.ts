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

export const getCoverImage = (images: string | null) => {
  if (!images) {
    return "/placeholder.svg?height=400&width=400";
  }
  return images.split(",")[0];
};

export const getImages = (images: string | null) => {
  if (!images) {
    return ["/placeholder.svg?height=400&width=400"];
  }
  return images.split(",").map((image) => image.trim());
};

export const accessoryStatusColors = {
  AVAILABLE: "bg-green-100 text-green-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
  DISCONTINUED: "bg-gray-100 text-gray-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
};

export const accessoryStatusLabels = {
  AVAILABLE: "Có sẵn",
  OUT_OF_STOCK: "Hết hàng",
  DISCONTINUED: "Ngừng kinh doanh",
  MAINTENANCE: "Bảo trì",
};

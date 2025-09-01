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
  UNAVAILABLE: "bg-red-100 text-red-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
};

export const dressStatusLabels = {
  AVAILABLE: "Có sẵn",
  RENTED: "Đã cho thuê",
  SOLD: "Đã bán",
  MAINTENANCE: "Bảo trì",
  UNAVAILABLE: "Không có sẵn",
  OUT_OF_STOCK: "Hết hàng",
};

export const getCoverImage = (images: string | null) => {
  if (!images) {
    return getPlaceholderImage(400, 600, "Veila Dress");
  }
  const imageUrl = images.split(",")[0];
  if (!isValidImageUrl(imageUrl)) {
    return getPlaceholderImage(400, 600, "Veila Dress");
  }
  return imageUrl;
};

export const getImages = (images: string | null) => {
  if (!images) {
    return [getPlaceholderImage(400, 600, "Veila Dress")];
  }
  return images.split(",").map((image) => {
    const trimmedImage = image.trim();
    // Check if it's a valid image URL
    if (!isValidImageUrl(trimmedImage)) {
      return getPlaceholderImage(400, 600, "Veila Dress");
    }
    return trimmedImage;
  });
};

export const accessoryStatusColors = {
  AVAILABLE: "bg-green-100 text-green-800",
  UNAVAILABLE: "bg-red-100 text-red-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
  DISCONTINUED: "bg-gray-100 text-gray-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
};

export const accessoryStatusLabels = {
  AVAILABLE: "Có sẵn",
  UNAVAILABLE: "Không có sẵn",
  OUT_OF_STOCK: "Hết hàng",
  DISCONTINUED: "Ngừng kinh doanh",
  MAINTENANCE: "Bảo trì",
};

export const parseNumber = (
  value: number | string | null | undefined
): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const formatRating = (
  rating: number | string | null | undefined
): string => {
  return parseNumber(rating).toFixed(1);
};

/**
 * Generate placeholder image URL with custom dimensions
 */
export const getPlaceholderImage = (
  width: number = 400,
  height: number = 600,
  text: string = "Veila+Dress"
) => {
  return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=${encodeURIComponent(
    text
  )}`;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  const problematicDomains = ["loremflickr.com"];

  if (url.includes("picsum.photos")) {
    return true;
  }

  return !problematicDomains.some((domain) => url.includes(domain));
};

export const getFallbackImage = (width = 400, height = 300, index = 0) => {
  const services = [
    `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=Image`,
    `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
    `https://dummyimage.com/${width}x${height}/f3f4f6/9ca3af&text=Image`,
  ];

  return services[index] || services[0];
};

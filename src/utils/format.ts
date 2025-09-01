export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
};

export const formatDateDetailed = (dateString: string | Date): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export const formatDateShort = (dateString: string | Date): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateOnly = (dateString: string | Date): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("84")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
      5,
      8
    )} ${cleaned.slice(8)}`;
  } else if (cleaned.startsWith("0")) {
    return `+84 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7
    )}`;
  }

  return phone;
};

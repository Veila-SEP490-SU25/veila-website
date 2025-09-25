export enum DateFormatType {
  FULLDATE,
  DATEONLY,
  DATEDIFF,
}

export const formatDate = (dateString: string | Date, type?: DateFormatType) => {
  const date = new Date(dateString);
  switch (type) {
    case DateFormatType.FULLDATE:
      const datePart = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timePart = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      return `${datePart} ${timePart}`;

    case DateFormatType.DATEONLY:
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    case DateFormatType.DATEDIFF:
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

      if (diffInHours >= 24) {
        const datePart = date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const timePart = date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return `${datePart} ${timePart}`;
      }
      if (diffInMinutes < 1) return 'Vừa xong';
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      return `${diffInHours} giờ trước`;

    default:
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
  }
};
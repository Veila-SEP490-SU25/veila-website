export const isSuccess = (statusCode: number) => {
  return [200, 201, 202, 203, 204].includes(statusCode);
};

export const isTokenExpired = (statusCode: number, message: string) => {
  return statusCode === 401 && message.includes('hết hạn.');
};

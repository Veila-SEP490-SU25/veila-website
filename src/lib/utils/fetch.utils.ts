export const isSuccess = (statusCode: number) => {
  return [200, 201, 202, 203, 204].includes(statusCode);
};

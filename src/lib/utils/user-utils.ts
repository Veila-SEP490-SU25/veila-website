export const formatPhoneNumber = (phone: string) => {
  //if startwith +84 or 84 replace with 0
  if (phone.startsWith("+84")) {
    return phone.replace("+84", "0");
  }
  if (phone.startsWith("84")) {
    return phone.replace("84", "0");
  }
  return phone;
}
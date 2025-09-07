export const FIREBASE_COLLECTIONS = {
  CHATROOMS: 'chatRooms',
  MESSAGES: 'messages',
  USERS: 'users',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  VERIFICATION_CODES: 'verificationCodes',
} as const;

export const FIREBASE_FIELDS = {
  MEMBERS: 'members',
  CUSTOMER_ID: 'customerId',
  SHOP_ID: 'shopId',
  ORDER_ID: 'orderId',
  REQUEST_ID: 'requestId',
  CUSTOMER_UNREAD_COUNT: 'customerUnreadCount',
  SHOP_UNREAD_COUNT: 'shopUnreadCount',

  CHATROOM_ID: 'chatRoomId',
  SENDER_ID: 'senderId',
  SENDER_NAME: 'senderName',
  CONTENT: 'content',
  TYPE: 'type',
  TIMESTAMP: 'timestamp',
  IS_READ: 'isRead',

  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  DELETED_AT: 'deletedAt',
} as const;

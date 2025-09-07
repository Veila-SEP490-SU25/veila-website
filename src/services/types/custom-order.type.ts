export interface ICustomOrderRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  description: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hip: number;
  armpit: number;
  bicep: number;
  neck: number;
  shoulderWidth: number;
  sleeveLength: number;
  backLength: number;
  lowerWaist: number;
  waistToFloor: number;
  material: string | null;
  color: string | null;
  length: string | null;
  neckline: string | null;
  sleeve: string | null;
  images: string | null;
  status: CustomOrderStatus;
  isPrivate: boolean;
}

export interface ICustomOrderRequestDetail extends ICustomOrderRequest {
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string | null;
    address: string | null;
    birthDate: string | null;
    avatarUrl: string | null;
    role: string;
    status: string;
    reputation: number;
    isVerified: boolean;
    isIdentified: boolean;
  };
}

// API Response wrapper
export interface ICustomOrderRequestResponse {
  message: string;
  statusCode: number;
  item: ICustomOrderRequestDetail;
}

export enum CustomOrderStatus {
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const customOrderStatusColors = {
  [CustomOrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [CustomOrderStatus.SUBMIT]: 'bg-yellow-100 text-yellow-800',
  [CustomOrderStatus.APPROVED]: 'bg-green-100 text-green-800',
  [CustomOrderStatus.REJECTED]: 'bg-red-100 text-red-800',
  [CustomOrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [CustomOrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [CustomOrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export const customOrderStatusLabels = {
  [CustomOrderStatus.DRAFT]: 'Bản nháp',
  [CustomOrderStatus.SUBMIT]: 'Đã gửi',
  [CustomOrderStatus.APPROVED]: 'Đã duyệt',
  [CustomOrderStatus.REJECTED]: 'Từ chối',
  [CustomOrderStatus.IN_PROGRESS]: 'Đang thực hiện',
  [CustomOrderStatus.COMPLETED]: 'Hoàn thành',
  [CustomOrderStatus.CANCELLED]: 'Đã hủy',
};

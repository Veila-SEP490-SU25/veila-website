export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
}

export interface IRequestOtp {
  email: string;
}

export interface IVerifyOtp {
  userId: string;
  otp: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IResetPassword {
  userId: string;
  otp: string;
  newPassword: string;
}

export interface IGoogleAuth {
  email: string;
  fullname: string;
}

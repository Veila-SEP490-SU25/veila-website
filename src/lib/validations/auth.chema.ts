import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt"
    ),
});

export const loginOTPSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    firstName: z
      .string()
      .min(1, "Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ chỉ được chứa chữ cái"),
    middleName: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        "Tên đệm phải có ít nhất 2 ký tự"
      )
      .refine(
        (val) => !val || /^[a-zA-ZÀ-ỹ\s]+$/.test(val),
        "Tên đệm chỉ được chứa chữ cái"
      ),
    lastName: z
      .string()
      .min(1, "Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{8,}$/,
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "Bạn phải đồng ý với điều khoản sử dụng"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .min(10, "Số điện thoại phải có 10 số")
    .max(10, "Số điện thoại phải có 10 số")
    .regex(/^\d{10}$/, "Số điện thoại không hợp lệ"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Mã OTP phải có 6 ký tự")
    .max(6, "Mã OTP phải có 6 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginOTPSchema = z.infer<typeof loginOTPSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type PhoneSchema = z.infer<typeof phoneSchema>;
export type OTPSchema = z.infer<typeof otpSchema>;

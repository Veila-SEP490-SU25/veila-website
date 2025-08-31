"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone } from "lucide-react";
import { phoneSchema, type PhoneSchema } from "@/lib/validations/auth.chema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useCallback, useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { useFirebase } from "@/services/firebase";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth.provider";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";

// Extend Window interface for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export function VerifyPhonePopup() {
  const { isOpen, closePopup } = useVerifyPhonePopup();
  const [result, setResult] = useState<ConfirmationResult>();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [otp, setOtp] = useState<string>("");
  const [recaptchaReady, setRecaptchaReady] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockUntil, setBlockUntil] = useState<number>(0);
  const [firebaseReady, setFirebaseReady] = useState<boolean>(false);
  const recaptchaVerifierRef = useRef<any>(null);

  const { auth, signInWithPhoneNumber } = useFirebase();
  const { reloadProfile } = useAuth();

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (auth && auth.config && auth.config.apiKey) {
      setFirebaseReady(true);
    } else {
      setFirebaseReady(false);
    }
  }, [auth]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (isBlocked && blockUntil > 0) {
      const now = Date.now();
      if (now >= blockUntil) {
        setIsBlocked(false);
        setBlockUntil(0);
        setAttemptCount(0);
      } else {
        const remaining = Math.ceil((blockUntil - now) / 1000);
        setCountdown(remaining);
      }
    }
  }, [isBlocked, blockUntil, countdown]);

  const resetRecaptcha = useCallback(async () => {
    if (!auth) return false;

    try {
      if (!auth.config || !auth.config.apiKey) {
        console.error("Firebase Auth not properly initialized");
        return false;
      }

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }

      const container = document.getElementById("verify-phone-recaptcha");
      if (container) {
        container.remove();
      }

      const newContainer = document.createElement("div");
      newContainer.id = "verify-phone-recaptcha";
      newContainer.style.position = "absolute";
      newContainer.style.top = "-9999px";
      document.body.appendChild(newContainer);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "verify-phone-recaptcha",
        {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            setError("reCAPTCHA đã hết hạn. Vui lòng thử lại.");
          },
          "error-callback": () => {
            setError("Lỗi reCAPTCHA. Vui lòng thử lại.");
          },
        }
      );

      await recaptchaVerifierRef.current.render();
      setRecaptchaReady(true);
      return true;
    } catch (error) {
      console.error("Error resetting reCAPTCHA:", error);
      setRecaptchaReady(false);
      return false;
    }
  }, [auth]);

  useEffect(() => {
    if (!isClient || !auth || !firebaseReady) return;

    const initializeRecaptcha = async () => {
      try {
        if (!auth.config || !auth.config.apiKey) {
          console.error("Firebase Auth not properly initialized");
          setError("Firebase Auth chưa được khởi tạo. Vui lòng tải lại trang.");
          setRecaptchaReady(false);
          return;
        }

        if (window.recaptchaVerifier) {
          recaptchaVerifierRef.current = window.recaptchaVerifier;
          setRecaptchaReady(true);
          return;
        }

        let recaptchaContainer = document.getElementById(
          "verify-phone-recaptcha"
        );
        if (!recaptchaContainer) {
          recaptchaContainer = document.createElement("div");
          recaptchaContainer.id = "verify-phone-recaptcha";
          recaptchaContainer.style.position = "absolute";
          recaptchaContainer.style.top = "-9999px";
          document.body.appendChild(recaptchaContainer);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "verify-phone-recaptcha",
          {
            size: "invisible",
            callback: () => {},
            "expired-callback": () => {
              setError("reCAPTCHA đã hết hạn. Vui lòng thử lại.");
            },
            "error-callback": () => {
              setError("Lỗi reCAPTCHA. Vui lòng thử lại.");
            },
          }
        );

        recaptchaVerifierRef.current = window.recaptchaVerifier;

        await window.recaptchaVerifier.render();
        setRecaptchaReady(true);
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
        setError("Không thể khởi tạo reCAPTCHA. Vui lòng tải lại trang.");
        setRecaptchaReady(false);
      }
    };

    const timer = setTimeout(() => {
      initializeRecaptcha();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [auth, isClient, firebaseReady]);

  const handleSendOTP = useCallback(
    async (data: PhoneSchema) => {
      if (!auth || !signInWithPhoneNumber) {
        setError("Chưa sẵn sàng để gửi OTP. Vui lòng thử lại.");
        return;
      }

      // Check if user is blocked
      if (isBlocked) {
        const remaining = Math.ceil((blockUntil - Date.now()) / 1000);
        setError(
          `Tài khoản tạm thời bị khóa do gửi quá nhiều OTP. Vui lòng đợi ${remaining} giây.`
        );
        return;
      }

      // Rate limiting: prevent requests within 60 seconds
      const currentTime = Date.now();
      const timeSinceLastRequest = currentTime - lastRequestTime;
      const minimumInterval = 60000; // 60 seconds

      if (timeSinceLastRequest < minimumInterval && lastRequestTime > 0) {
        const remainingTime = Math.ceil(
          (minimumInterval - timeSinceLastRequest) / 1000
        );
        setCountdown(remainingTime);
        setError(
          `Vui lòng đợi ${remainingTime} giây trước khi gửi OTP tiếp theo.`
        );
        return;
      }

      // Increment attempt count
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      // Block after 5 attempts for 1 hour
      if (newAttemptCount >= 5) {
        const blockTime = 60 * 60 * 1000; // 1 hour
        setIsBlocked(true);
        setBlockUntil(Date.now() + blockTime);
        setError("Quá nhiều lần thử gửi OTP. Tài khoản bị khóa trong 1 giờ.");
        return;
      }

      setLastRequestTime(currentTime);
      setIsLoading(true);
      setError("");

      try {
        let phoneNumber = data.phoneNumber;

        if (phoneNumber.startsWith("0")) {
          phoneNumber = phoneNumber.substring(1);
        }
        phoneNumber = `+84${phoneNumber}`;

        const result = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifierRef.current
        );
        setResult(result);
        setOtpSent(true);
      } catch (error: any) {
        setOtpSent(false);

        // Handle specific Firebase errors
        if (error.code === "auth/invalid-app-credential") {
          setError(
            "Phone authentication chưa được kích hoạt trong Firebase Console. Vui lòng kiểm tra cấu hình Firebase."
          );
        } else if (error.code === "auth/invalid-phone-number") {
          setError("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
        } else if (error.code === "auth/too-many-requests") {
          const blockTime = 60 * 60 * 1000; // 1 hour
          setIsBlocked(true);
          setBlockUntil(Date.now() + blockTime);
          setError(
            "Quá nhiều yêu cầu OTP từ Firebase. Tài khoản bị khóa trong 1 giờ để bảo mật. Vui lòng thử lại sau hoặc sử dụng số điện thoại khác."
          );
          toast.error("Quá nhiều yêu cầu OTP", {
            description: "Vui lòng đợi 1 giờ hoặc thử số điện thoại khác.",
          });
        } else if (error.code === "auth/quota-exceeded") {
          setError(
            "Đã vượt quá giới hạn gửi OTP. Vui lòng thử lại sau 24 giờ hoặc liên hệ hỗ trợ."
          );
          toast.error("Vượt quá giới hạn OTP", {
            description: "Vui lòng thử lại sau 24 giờ.",
          });
        } else if (error.code === "auth/invalid-recaptcha-token") {
          setError("reCAPTCHA không hợp lệ. Đang thử khởi tạo lại...");
          const success = await resetRecaptcha();
          if (success) {
            setError("reCAPTCHA đã được khởi tạo lại. Vui lòng thử gửi OTP.");
          } else {
            setError(
              "Không thể khởi tạo lại reCAPTCHA. Vui lòng tải lại trang."
            );
          }
        } else if (
          error.code === "auth/operation-not-supported-in-this-environment"
        ) {
          setError(
            "Tính năng này không được hỗ trợ trong môi trường hiện tại."
          );
        } else {
          setError(
            error.message || "Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      signInWithPhoneNumber,
      auth,
      setResult,
      resetRecaptcha,
      isBlocked,
      blockUntil,
      attemptCount,
      lastRequestTime,
    ]
  );

  const handleVerifyOTP = useCallback(async () => {
    if (!result || !otp || otp.length !== 6) return;

    try {
      const credential = await result.confirm(otp);
      const { user } = credential;
      if (user.phoneNumber?.startsWith("+84")) {
        const phoneNumber = user.phoneNumber.replace("+84", "0");

        const response = await fetch("/api/users/identify", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phoneNumber,
          }),
        });

        if (response.ok) {
          toast.success("Xác thực số điện thoại thành công.");
          reloadProfile();
          closePopup();
        } else {
          const errorData = await response.json();
          toast.error("Xác thực số điện thoại thất bại", {
            description: errorData.message || "Có lỗi xảy ra khi xác thực.",
          });
        }
      } else {
        toast.error("Số điện thoại không hợp lệ.");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xác thực OTP.");
    }
  }, [result, otp, reloadProfile, closePopup]);

  const onSubmit = async (data: PhoneSchema) => {
    await handleSendOTP(data);
  };

  if (!isClient) {
    return (
      <Dialog open={isOpen} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Đang tải...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? closePopup : undefined}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Xác Thực Số Điện Thoại
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Chúng tôi sẽ gửi mã OTP đến số điện thoại của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại *</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Nhập số điện thoại (VD: 0912345678)"
                            className="pl-10 h-11"
                            {...field}
                          />
                          <Button
                            type="submit"
                            disabled={
                              isLoading ||
                              otpSent ||
                              countdown > 0 ||
                              !recaptchaReady ||
                              !firebaseReady ||
                              isBlocked
                            }
                            className="w-fit bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium absolute right-0 top-0 disabled:opacity-50"
                          >
                            {isLoading
                              ? "Đang gửi..."
                              : countdown > 0
                              ? `Đợi ${countdown}s`
                              : isBlocked
                              ? "Đã bị khóa"
                              : !firebaseReady
                              ? "Đang tải Firebase..."
                              : !recaptchaReady
                              ? "Đang tải reCAPTCHA..."
                              : otpSent
                              ? "Đã gửi OTP"
                              : "Gửi OTP"}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {otpSent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Mã OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm tra
                tin nhắn.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-2">{error}</p>
              {error.includes("reCAPTCHA") && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setError("Đang khởi tạo lại reCAPTCHA...");
                      const success = await resetRecaptcha();
                      if (success) {
                        setError("");
                      } else {
                        setError(
                          "Không thể khởi tạo lại reCAPTCHA. Vui lòng tải lại trang."
                        );
                      }
                    }}
                    className="text-xs"
                  >
                    Khởi tạo lại reCAPTCHA
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="text-xs"
                  >
                    Tải lại trang
                  </Button>
                </div>
              )}
              {isBlocked && process.env.NODE_ENV === "development" && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsBlocked(false);
                      setBlockUntil(0);
                      setAttemptCount(0);
                      setError("");
                      toast.success("Đã reset trạng thái khóa (DEV)");
                    }}
                    className="text-xs text-orange-600"
                  >
                    [DEV] Reset Block Status
                  </Button>
                </div>
              )}
            </div>
          )}

          {isBlocked && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800 mb-2">
                Tài khoản tạm thời bị khóa do gửi quá nhiều OTP.
              </p>
              <p className="text-xs text-orange-700">
                Thời gian còn lại: {Math.ceil(countdown / 60)} phút{" "}
                {countdown % 60} giây
              </p>
              <p className="text-xs text-orange-700 mt-1">
                💡 Gợi ý: Thử sử dụng số điện thoại khác hoặc đợi thời gian khóa
                kết thúc.
              </p>
              <p className="text-xs text-orange-700 mt-1">
                🔧 Nếu vẫn gặp lỗi, vui lòng thử lại sau 24 giờ hoặc liên hệ hỗ
                trợ.
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsBlocked(false);
                    setBlockUntil(0);
                    setAttemptCount(0);
                    setError("");
                    form.reset();
                    toast.success("Đã reset để thử số điện thoại khác");
                  }}
                  className="text-xs"
                >
                  Thử số điện thoại khác
                </Button>
              </div>
            </div>
          )}

          {!recaptchaReady && !error && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                {!firebaseReady
                  ? "Đang khởi tạo Firebase..."
                  : "Đang khởi tạo bảo mật reCAPTCHA..."}
              </p>
            </div>
          )}

          {recaptchaReady && !error && !otpSent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Sẵn sàng gửi OTP. Còn {5 - attemptCount} lần thử.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP</Label>
            <div className="flex items-center justify-between">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="gap-1"
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                  />
                </InputOTPGroup>
              </InputOTP>
              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={!result || otp.length !== 6}
                className="w-fit bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium disabled:opacity-50"
              >
                Xác Thực
              </Button>
            </div>
          </div>
        </div>

        <div
          id="verify-phone-recaptcha"
          style={{ position: "absolute", top: "-9999px" }}
        ></div>
      </DialogContent>
    </Dialog>
  );
}

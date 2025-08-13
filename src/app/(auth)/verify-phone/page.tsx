"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { phoneSchema, type PhoneSchema } from "@/lib/validations";
import { TextLogo } from "@/components/text-logo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useFirebase } from "@/services/firebase";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { useIdentifyMutation } from "@/services/apis";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";

export default function VerifyPhonePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [returnUrl, setReturnUrl] = useState<string>(
    searchParams.get("returnUrl") || ""
  );
  const [result, setResult] = useState<ConfirmationResult>();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const { auth, signInWithPhoneNumber } = useFirebase();
  const [otp, setOtp] = useState<string>("");
  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const [identifyUserMutation, { isLoading: isIdentifying }] =
    useIdentifyMutation();

  useEffect(() => {
    setIsClient(true);
    setReturnUrl(searchParams.get("returnUrl") || "");
  }, [searchParams]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!isClient || !auth) return;
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible", // or 'normal' for visible reCAPTCHA
      }
    );
  }, [auth, isClient]);

  const handleSendOTP = useCallback(
    async (data: PhoneSchema) => {
      console.log("Starting OTP send process...");
      console.log(
        "AppVerifier available:",
        !!(window as any).recaptchaVerifier
      );
      console.log("Auth available:", !!auth);
      console.log("SignInWithPhoneNumber available:", !!signInWithPhoneNumber);

      if (!auth || !signInWithPhoneNumber) {
        console.error("Missing required dependencies:", {
          auth: !!auth,
          signInWithPhoneNumber: !!signInWithPhoneNumber,
        });
        setError("Chưa sẵn sàng để gửi OTP. Vui lòng thử lại.");
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

      setLastRequestTime(currentTime);
      setIsLoading(true);
      setError("");

      try {
        // Convert Vietnamese phone number to international format
        let phoneNumber = data.phoneNumber;

        // Remove any leading 0 and add Vietnam country code (+84)
        if (phoneNumber.startsWith("0")) {
          phoneNumber = phoneNumber.substring(1);
        }
        phoneNumber = `+84${phoneNumber}`;

        console.log("Formatted phone number:", phoneNumber);
        console.log("Auth object:", auth);
        console.log("Auth config:", {
          apiKey: auth.config.apiKey,
          authDomain: auth.config.authDomain,
        });
        console.log("AppVerifier:", (window as any).recaptchaVerifier);

        const result = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          (window as any).recaptchaVerifier
        );
        setResult(result);
        setOtpSent(true);
        console.log("OTP sent successfully");
      } catch (error: any) {
        console.error("Error sending OTP:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        setOtpSent(false);

        // Handle specific Firebase errors
        if (error.code === "auth/invalid-app-credential") {
          setError(
            "Phone authentication chưa được kích hoạt trong Firebase Console. Vui lòng kiểm tra cấu hình Firebase."
          );
        } else if (error.code === "auth/invalid-phone-number") {
          setError("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
        } else if (error.code === "auth/too-many-requests") {
          setError(
            "Quá nhiều yêu cầu OTP. Vui lòng đợi ít nhất 1 giờ trước khi thử lại hoặc thử từ mạng/thiết bị khác."
          );
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
    [signInWithPhoneNumber, auth, setResult]
  );

  const {reloadProfile} = useAuth();

  const handleVerifyOTP = useCallback(async () => {
    if (!result || !otp || otp.length !== 6) return;

    try {
      const credential = await result.confirm(otp);
      console.log("Phone number verified successfully:", credential.user);
      const { user } = credential;
      if (user.phoneNumber?.startsWith("+84")) {
        // Phone number is in the correct format
        console.log("Phone number is valid:", user.phoneNumber);
        const phoneNumber = user.phoneNumber.replace("+84", "0");
        const { statusCode, message } = await identifyUserMutation({
          phone: phoneNumber,
        }).unwrap();
        if (statusCode === 200) {
          toast.success("Xác thực số điện thoại thành công.");
          reloadProfile();
          if (returnUrl) {
            router.push(decodeURIComponent(returnUrl));
          } else {
            router.push("/");
          }
        } else {
          toast.error("Xác thực số điẹn thoại thất bại", {
            description: message,
          });
        }
      } else {
        console.error("Invalid phone number format:", user.phoneNumber);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error - show error message to user
    }
  }, [result, otp]);

  const onSubmit = async (data: PhoneSchema) => {
    await handleSendOTP(data);
  };

  // Don't render Firebase-dependent content during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <TextLogo />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Xác Thực Số Điện Thoại
            </h1>
            <p className="text-gray-600">
              Xác thực số điện thoại để bảo mật tài khoản của bạn
            </p>
          </div>
          <Card className="shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <TextLogo />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Xác Thực Số Điện Thoại
          </h1>
          <p className="text-gray-600">
            Xác thực số điện thoại để bảo mật tài khoản của bạn
          </p>
        </div>

        {/* Phone Verification Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Nhập Số Điện Thoại
            </CardTitle>
            <CardDescription className="text-center">
              Chúng tôi sẽ gửi mã OTP đến số điện thoại của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                              disabled={isLoading || otpSent || countdown > 0}
                              className="w-fit bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium absolute right-0 top-0 disabled:opacity-50"
                            >
                              {isLoading
                                ? "Đang gửi..."
                                : countdown > 0
                                ? `Đợi ${countdown}s`
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
                  Mã OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm
                  tra tin nhắn.
                </p>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
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
                disabled={!result || otp.length !== 6 || isIdentifying}
                className="w-fit bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium disabled:opacity-50"
              >
                Xác Thực
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Hidden reCAPTCHA container */}
        <div
          id="recaptcha-container"
          style={{ position: "absolute", top: "-9999px" }}
        ></div>
      </div>
    </div>
  );
}

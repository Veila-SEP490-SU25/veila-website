"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { otpSchema, type OTPSchema } from "@/lib/validations";
import { useRequestOtpMutation } from "@/services/apis";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth.provider";
import { TextLogo } from "@/components/text-logo";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300);

  const [requestOtpMutation, { isLoading: isResending }] =
    useRequestOtpMutation();
  const { verifyOtp, isAuthenticating } = useAuth();

  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (userId && email) {
      setUserId(userId);
      setEmail(email);
    } else {
      router.push("/login-otp");
    }
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = useCallback(
    async (data: OTPSchema) => {
      await verifyOtp({ userId, otp: data.otp });
    },
    [userId, verifyOtp]
  );

  const handleResendOTP = useCallback(async () => {
    try {
      const { item, message, statusCode } = await requestOtpMutation({
        email,
      }).unwrap();
      if (statusCode === 200) {
        toast.success("Mã OTP đã được gửi lại đến email của bạn.");
        setTimeLeft(300);
        form.reset();
        setUserId(item);
      } else {
        toast.error("Không thể gửi mã xác thực đến email này.", {
          description: message,
        });
      }
    } catch {
      toast.error(
        "Đã xảy ra lỗi trong quá trình gửi mã OTP. Vui lòng thử lại sau."
      );
    }
  }, [email, requestOtpMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <TextLogo />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Xác Thực OTP
          </h1>
          <p className="text-gray-600">
            Nhập mã 6 số đã được gửi đến
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Nhập Mã Xác Thực
            </CardTitle>
            <CardDescription className="text-center">
              Mã OTP có hiệu lực trong {formatTime(timeLeft)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* OTP Input */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            className="gap-2"
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
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium"
                  disabled={isAuthenticating || timeLeft === 0}
                >
                  {isAuthenticating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xác thực...
                    </>
                  ) : (
                    "Xác Thực"
                  )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-gray-600">
                      Không nhận được mã?{" "}
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isResending}
                        className="text-rose-600 hover:text-rose-700 font-medium hover:underline disabled:opacity-50"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="inline h-3 w-3 animate-spin mr-1" />
                            Đang gửi...
                          </>
                        ) : (
                          "Gửi lại"
                        )}
                      </button>
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Đang gửi...
                        </>
                      ) : (
                        "Gửi Lại Mã OTP"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

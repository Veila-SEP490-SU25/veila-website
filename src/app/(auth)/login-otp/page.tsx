"use client";

import { useCallback, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heart, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { loginOTPSchema, LoginOTPSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useRequestOtpMutation } from "@/services/apis";
import { toast } from "sonner";
import { TextLogo } from "@/components/text-logo";

export default function LoginOTPPage() {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const [requestOtpMutation, { isLoading }] = useRequestOtpMutation();

  const form = useForm<LoginOTPSchema>({
    resolver: zodResolver(loginOTPSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (data: LoginOTPSchema) => {
    try {
      const { item, message, statusCode } = await requestOtpMutation({
        email: data.email,
      }).unwrap();
      if (statusCode === 200) {
        router.push(`/verify-otp?userId=${item}&email=${data.email}`);
      } else {
        toast.error("Không thể gửi mã xác thực đến email này.", {
          description: message,
        });
      }
    } catch (error) {
      toast.error(
        "Đã xảy ra lỗi trong quá trình gửi mã OTP. Vui lòng thử lại sau."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <TextLogo />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng Nhập Bằng OTP
          </h1>
          <p className="text-gray-600">Nhập email để nhận mã xác thực OTP</p>
        </div>

        {/* OTP Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Xác Thực Email
            </CardTitle>
            <CardDescription className="text-center">
              Chúng tôi sẽ gửi mã OTP 6 số đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa Chỉ Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Nhập địa chỉ email của bạn"
                            className="pl-10 h-11"
                            disabled={isOTPSent}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium"
                  disabled={isLoading || isOTPSent}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi OTP...
                    </>
                  ) : isOTPSent ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      OTP Đã Được Gửi
                    </>
                  ) : (
                    "Gửi Mã OTP"
                  )}
                </Button>
              </form>
            </Form>

            {/* Back to Login */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-rose-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại đăng nhập thường
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            Mã OTP sẽ có hiệu lực trong 5 phút. Kiểm tra cả thư mục spam nếu
            không thấy email.
          </p>
        </div>
      </div>
    </div>
  );
}

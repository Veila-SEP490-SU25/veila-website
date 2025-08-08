"use client";

import { GoogleButton } from "@/app/(auth)/components/google-button";
import { TextLogo } from "@/components/text-logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginSchema } from "@/lib/validations";
import { useAuth } from "@/providers/auth.provider";
import { Mail, EyeOff, Eye, Lock } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
  const { login, isAuthenticating } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(
    async (data: LoginSchema) => {
      await login(data);
    },
    [login]
  );

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <TextLogo />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600 text-sm">
            Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Đăng Nhập Tài Khoản
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Nhập địa chỉ email của bạn"
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật Khẩu *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu của bạn"
                            className="pl-10 pr-10 h-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng Nhập"
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <GoogleButton />
            </div>

            {/* OTP Login */}
            <Link href="/login-otp">
              <Button
                variant="outline"
                className="w-full h-11 border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                Đăng Nhập Bằng OTP
              </Button>
            </Link>

            {/* Register Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-rose-600 hover:text-rose-700 font-medium hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

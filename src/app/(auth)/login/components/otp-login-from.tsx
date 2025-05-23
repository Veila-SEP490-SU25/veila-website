"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestOtpMutation } from "@/services/apis";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const OtpLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [requestOtpMutation, { isLoading }] = useRequestOtpMutation();

  const handleLogin = useCallback(async () => {
    if (!email) {
      toast.error("Vui lòng không để trống email.");
      return;
    }
    try {
      const { item, message, statusCode } = await requestOtpMutation({
        email,
      }).unwrap();
      if (statusCode === 200) {
        router.push(`/verify-otp?userId=${item}&email=${email}`);
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
  }, [email, requestOtpMutation]);

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <Input
        className="w-full col-span-5"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        onClick={handleLogin}
        className="cursor-pointer bg-maroon-400 hover:bg-maroon-400/80 text-white rounded-full w-full"
        disabled={isLoading}
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Ban chưa có tài khoản?
        <Link href="/register" className="text-blue-400 hover:underline">
          {" "}
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

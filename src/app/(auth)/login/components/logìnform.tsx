"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth.provider";
import Link from "next/link";
import { useCallback, useState } from "react";

export const LoginFrom = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isAuthenticating } = useAuth();

  const handleLogin = useCallback(async () => {
    await login({ email, password });
  }, [email, password, login]);

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <div className="w-full grid grid-cols-7 gap-2">
        <Label className="font-medium text-md col-span-2">Email</Label>
        <Input
          className="w-full col-span-5"
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-full grid grid-cols-7 gap-2">
        <Label className="font-medium text-md col-span-2">Mật khẩu</Label>
        <Input
          className="w-full col-span-5"
          type="password"
          placeholder="Nhập mật khẩu của bạn"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        onClick={handleLogin}
        className="cursor-pointer bg-maroon-400 hover:bg-maroon-400/80 text-white rounded-full w-full"
      >
        {isAuthenticating ? "Đang đăng nhập..." : "Đăng nhập"}
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

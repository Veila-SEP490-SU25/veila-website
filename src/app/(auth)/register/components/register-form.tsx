"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/services/apis";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const RegisterForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    } else {
      const { item, message, statusCode } = await registerMutation({
        email,
        password,
        firstName,
        lastName,
        middleName,
      }).unwrap();
      if (statusCode === 200) {
        router.push(`/verify-otp?userId=${item}&email=${email}`);
      } else {
        toast.error("Đăng ký thất bại.", {
          description: message,
        });
      }
    }
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    middleName,
    registerMutation,
  ]);

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <Input
        className="w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="w-full grid grid-cols-2 gap-2">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full col-span-1"
          type="text"
          placeholder="Họ"
        />
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full col-span-1"
          type="text"
          placeholder="Tên"
        />
      </div>
      <Input
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        className="w-full"
        type="text"
        placeholder="Tên đệm"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
        type="password"
        placeholder="Mật khẩu"
      />
      <Input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full"
        type="password"
        placeholder="Xác nhận mật khẩu"
      />
      <Button
        onClick={handleRegister}
        className="cursor-pointer bg-maroon-400 hover:bg-maroon-400/80 text-white rounded-full w-full"
        disabled={isLoading}
      >
        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Ban dã có tài khoản?
        <Link href="/login" className="text-blue-400 hover:underline">
          {" "}
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
};

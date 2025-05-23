"use client";

import { SpanTimer } from "@/components/span-timer";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/providers/auth.provider";
import { useRequestOtpMutation } from "@/services/apis";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const VerifyOtpForm = () => {
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyOtp, isAuthenticating } = useAuth();
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [totalTime, setTotalTime] = useState(5 * 60); // 5 minutes
  const [requestOtpMutation] = useRequestOtpMutation();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (userId && email) {
      setUserId(userId);
      setEmail(email);
      setIsTimerStarted(true);
    } else {
      router.push("/login");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (otp.length < 6) {
      toast.error("Vui lòng nhập mã OTP hợp lệ");
      return;
    } else {
      await verifyOtp({
        userId,
        otp,
      });
    }
  }, [userId, otp]);

  const handleResendOtp = useCallback(async () => {
    try {
      const { item, message, statusCode } = await requestOtpMutation({
        email,
      }).unwrap();
      if (statusCode === 200) {
        toast.success("Mã OTP đã được gửi lại đến email của bạn.");
        setIsTimerStarted(true);
        setTotalTime(5 * 60); // Reset the timer to 5 minutes
        setUserId(item);
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
      <InputOTP
        value={otp}
        onChange={(value) => {
          setOtp(value);
        }}
        maxLength={6}
        pattern="[0-9]*"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-center text-sm text-crimson-900">
        Mã OTP sẽ hết hạn sau{" "}
        <SpanTimer
          totalTime={totalTime}
          className=""
          isTimerStarted={isTimerStarted}
          onTimeUp={() => {
            setIsTimerStarted(false);
          }}
        />{" "}
        phút.
        <Button
          variant="link"
          className="text-sm font-bold text-maroon-400 cursor-pointer"
          disabled={isTimerStarted}
        >
          Gửi lại
        </Button>
      </p>
      <Button
        className="w-full bg-maroon-400 rounded-full hover:bg-maroon-400/80 text-white"
        onClick={handleSubmit}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <div className="">
            <Loader className="mr-2 h-4 w-4 text-white animate-spin" />{" "}
            {" Đang xác thực..."}
          </div>
        ) : (
          <div className="">
            {"Xác thực "}
            <ArrowRight className="ml-2 h-4 w-4 text-white" />
          </div>
        )}
      </Button>
    </div>
  );
};

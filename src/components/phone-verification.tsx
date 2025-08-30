"use client";

import { useState, useEffect, useCallback } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFirebase } from "@/services/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIdentifyUserMutation } from "@/services/apis/auth.api";
import { toast } from "sonner";
import { Phone, CheckCircle } from "lucide-react";

interface PhoneVerificationProps {
  phone: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phone,
  onSuccess,
  onCancel,
}) => {
  const [_verificationId, setVerificationId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [identifyUser] = useIdentifyUserMutation();
  const { auth } = useFirebase();

  const sendVerificationCode = useCallback(async () => {
    if (!phone) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }

    if (!auth) {
      toast.error("Firebase chưa được khởi tạo!");
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith("+84")
        ? phone
        : `+84${phone.replace(/^0/, "")}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier!
      );

      setVerificationId(confirmationResult.verificationId);
      setIsCodeSent(true);
      toast.success("Mã xác thực đã được gửi đến số điện thoại của bạn!");
    } catch (error: any) {
      console.error("Error sending verification code:", error);

      let errorMessage = "Có lỗi xảy ra khi gửi mã xác thực!";

      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Số điện thoại không hợp lệ!";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau!";
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "Đã vượt quá giới hạn SMS. Vui lòng thử lại sau!";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [phone, auth, recaptchaVerifier]);

  useEffect(() => {
    // Initialize reCAPTCHA
    if (typeof window !== "undefined" && !recaptchaVerifier && auth) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: () => {
          // reCAPTCHA solved, allow sending SMS
          sendVerificationCode();
        },
        "expired-callback": () => {
          toast.error("reCAPTCHA đã hết hạn. Vui lòng thử lại!");
        },
      });
      setRecaptchaVerifier(verifier);
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [auth, recaptchaVerifier, sendVerificationCode]);

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Vui lòng nhập mã xác thực 6 số!");
      return;
    }

    setIsLoading(true);
    try {
      // Call API to identify user first
      await identifyUser({ phone }).unwrap();

      setIsVerified(true);
      toast.success("Xác thực số điện thoại thành công!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error verifying code:", error);

      let errorMessage = "Có lỗi xảy ra khi xác thực mã!";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ!";
      } else if (error?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau!";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = () => {
    setIsCodeSent(false);
    setVerificationCode("");
    if (recaptchaVerifier) {
      recaptchaVerifier.render();
    }
  };

  // Show loading if Firebase is not ready
  if (!auth) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang khởi tạo Firebase...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Xác thực thành công!
            </h3>
            <p className="text-gray-600">
              Số điện thoại {phone} đã được xác thực thành công.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Xác thực số điện thoại
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" value={phone} disabled className="bg-gray-50" />
        </div>

        {!isCodeSent ? (
          <div className="space-y-4">
            <div id="recaptcha-container"></div>
            <p className="text-sm text-gray-600">
              Nhấn vào reCAPTCHA để gửi mã xác thực
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã xác thực</Label>
              <Input
                id="code"
                type="text"
                placeholder="Nhập mã 6 số"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resendCode}
                disabled={isLoading}
                className="flex-1"
              >
                Gửi lại
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Mã xác thực đã được gửi đến {phone}
            </p>
          </div>
        )}

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Hủy
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Phone } from 'lucide-react';
import { phoneSchema, type PhoneSchema } from '@/lib/validations/auth.chema';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth.provider';
import { useVerifyPhonePopup } from '@/hooks/use-verify-phone-popup';
import { useSendSmsMutation, useVerifyPhoneOtpMutation } from '@/services/apis';

export function VerifyPhonePopup() {
  const { isOpen, closePopup } = useVerifyPhonePopup();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [otp, setOtp] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockUntil, setBlockUntil] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [sendSms] = useSendSmsMutation();
  const [verifyPhoneOtp, { isLoading: isVerifying }] = useVerifyPhoneOtpMutation();
  const { reloadProfile } = useAuth();

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  }, [isBlocked, blockUntil]);

  const handleSendOTP = useCallback(
    async (data: PhoneSchema) => {
      const currentTime = Date.now();

      // Check if user is blocked
      if (isBlocked && blockUntil > 0) {
        const now = Date.now();
        if (now < blockUntil) {
          const remainingTime = Math.ceil((blockUntil - now) / 1000);
          setCountdown(remainingTime);
          setError(`Vui lòng đợi ${remainingTime} giây trước khi gửi OTP tiếp theo.`);
          return;
        }
      }

      // Check rate limiting (30 seconds between requests)
      if (currentTime - lastRequestTime < 30000) {
        const remainingTime = Math.ceil((30000 - (currentTime - lastRequestTime)) / 1000);
        setCountdown(remainingTime);
        setError(`Vui lòng đợi ${remainingTime} giây trước khi gửi OTP tiếp theo.`);
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
        setError('Quá nhiều lần thử gửi OTP. Tài khoản bị khóa trong 1 giờ.');
        return;
      }

      setLastRequestTime(currentTime);
      setIsLoading(true);
      setError('');

      try {
        let phoneNumber = data.phoneNumber;

        // Đảm bảo số điện thoại có số 0 ở đầu
        if (!phoneNumber.startsWith('0')) {
          phoneNumber = `0${phoneNumber}`;
        }

        // Lưu số điện thoại gốc (có số 0) để verify
        setPhoneNumber(phoneNumber);

        // Chuyển đổi sang format +84 để gửi SMS
        const vonagePhone = phoneNumber.startsWith('0')
          ? `+84${phoneNumber.substring(1)}`
          : `+84${phoneNumber}`;

        // Gửi SMS qua Vonage API
        const result = await sendSms({ to: vonagePhone }).unwrap();

        if (result) {
          setOtpSent(true);
          toast.success('Mã OTP đã được gửi thành công!');
        }
      } catch (error: any) {
        setError(error?.data?.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    },
    [sendSms, isBlocked, blockUntil, attemptCount, lastRequestTime],
  );

  const handleVerifyOTP = useCallback(async () => {
    if (!phoneNumber || !otp || otp.length !== 6) return;

    try {
      // Gọi API verify OTP qua vonage API
      const result = await verifyPhoneOtp({
        phone: phoneNumber, // Số điện thoại có số 0 ở đầu
        otp: otp,
      }).unwrap();

      if (result) {
        toast.success('Xác thực số điện thoại thành công.');
        reloadProfile();
        closePopup();
      }
    } catch (error: any) {
      toast.error('Xác thực số điện thoại thất bại', {
        description: error?.data?.message || 'Có lỗi xảy ra khi xác thực.',
      });
    }
  }, [phoneNumber, otp, reloadProfile, closePopup, verifyPhoneOtp]);

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
                            disabled={isLoading || otpSent || countdown > 0 || isBlocked}
                            className="w-fit bg-rose-600 hover:bg-rose-700 h-11 text-base font-medium absolute right-0 top-0 disabled:opacity-50"
                          >
                            {isLoading
                              ? 'Đang gửi...'
                              : countdown > 0
                                ? `Đợi ${countdown}s`
                                : isBlocked
                                  ? 'Đã bị khóa'
                                  : otpSent
                                    ? 'Đã gửi OTP'
                                    : 'Gửi OTP'}
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
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  Mã OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm tra tin nhắn.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Nhập mã OTP *</Label>
                <InputOTP
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError(''); // Clear error when user types
                  }}
                  maxLength={6}
                  disabled={isVerifying}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots && slots.length > 0
                        ? slots.map((slot, index) => (
                            <InputOTPSlot
                              key={index}
                              {...slot}
                              index={index}
                              className="w-12 h-12 text-lg"
                            />
                          ))
                        : // Fallback khi slots chưa sẵn sàng
                          Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} className="w-12 h-12 text-lg" />
                          ))}
                    </InputOTPGroup>
                  )}
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={!otp || otp.length !== 6 || isVerifying}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isVerifying ? 'Đang xác thực...' : 'Xác thực OTP'}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

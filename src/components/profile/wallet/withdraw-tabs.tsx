"use client";

import { RequestSmartOtpDialog } from "@/components/request-smart-otp-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useRequestWithdrawMutation } from "@/services/apis";
import { IWallet } from "@/services/types";
import { AlertCircleIcon, Minus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface WithdrawTabsProps {
  wallet: IWallet;
  onWithdrawSuccess?: () => void;
}

export const WithdrawTabs = ({
  wallet,
  onWithdrawSuccess,
}: WithdrawTabsProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [trigger, { isLoading }] = useRequestWithdrawMutation();

  useEffect(() => {
    if (!wallet.bin || !wallet.bankNumber) {
      setIsError(true);
      setError(
        "Vui lòng cập nhật thông tin tài khoản ngân hàng trước khi rút tiền"
      );
    }

    if (withdrawAmount <= 0) {
      setIsError(true);
      setError("Số tiền rút phải lớn hơn 0");
    }

    if (withdrawAmount > wallet.availableBalance) {
      setIsError(true);
      setError("Số tiền rút không được lớn hơn số dư khả dụng");
    }

    setIsError(false);
    setError("");
  }, [withdrawAmount, wallet]);

  const confirmWithdraw = useCallback(
    async (otp: string) => {
      try {
        const { statusCode, message } = await trigger({
          amount: withdrawAmount,
          otp,
          note: `Giao dịch rút tiền về tài khoản cá nhân`,
        }).unwrap();
        if ([201, 202, 203, 204, 200].includes(statusCode)) {
          toast.success("Rút tiền thành công");
          onWithdrawSuccess?.();
          return true;
        } else {
          toast.error("Rút tiền thất bại", {
            description: message,
          });
          return false;
        }
      } catch (error) {
        toast.error("Xác thực không thành công, vui lòng thử lại");
        return false;
      }
    },
    [trigger, withdrawAmount]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minus className="h-5 w-5 text-red-600" />
          Rút Tiền Từ Ví
        </CardTitle>
        <CardDescription>
          Chuyển tiền về tài khoản ngân hàng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="withdrawAmount">Số Tiền</Label>
          <div className="relative">
            <Input
              id="withdrawAmount"
              type="number"
              placeholder="0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
              className="pl-8"
              min={0}
            />
            <span className="absolute left-3 top-3 text-sm text-gray-400">
              ₫
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Số dư khả dụng: {formatPrice(wallet.availableBalance)}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            Việc rút tiền thường mất 3-5 ngày làm việc để xử lý.
          </p>
        </div>
        {isError && (
          <Alert variant={"destructive"} className="mb-4 h-full">
            <AlertCircleIcon />
            <AlertTitle>
              Đã có lỗi xảy ra trong quá trình lấy dữ liệu
            </AlertTitle>
            <AlertDescription>
              <p>Chi tiết lỗi:</p>
              <ul className="list-inside list-disc text-sm">
                <li>{error}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <RequestSmartOtpDialog
          trigger={
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isError || isLoading}
            >
              <Minus className="h-4 w-4 mr-2" />
              Yêu Cầu Rút Tiền
            </Button>
          }
          message="Vui lòng xác thực mã PIN để tiếp tục rút tiền."
          onConfirm={confirmWithdraw}
        />
      </CardContent>
    </Card>
  );
};

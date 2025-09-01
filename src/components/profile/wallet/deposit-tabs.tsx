"use client";

import { useState, useCallback } from "react";
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
import {
  Plus,
  Banknote,
  Wallet,
  ArrowLeft,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { useDepositMutation } from "@/services/apis";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products-utils";
import { ITransfer } from "@/services/types";
import { useRouter } from "next/navigation";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";
import { PayOsCard } from "@/components/profile/wallet/pay-os-card";

export const DepositTabs = ({
  onDepositSuccess,
}: {
  onDepositSuccess?: () => void;
}) => {
  const router = useRouter();
  const { openPopup } = useVerifyPhonePopup();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("Nạp tiền vào ví");
  const [paymentMethod] = useState<string>("bank");

  const [currentTransaction, setCurrentTransaction] =
    useState<ITransfer | null>(null);

  const [deposit, { isLoading }] = useDepositMutation();

  const handleDeposit = useCallback(async () => {
    const amountNum = parseInt(amount);
    if (!amount || amountNum <= 0 || isNaN(amountNum)) {
      toast.error("Vui lòng nhập số tiền hợp lệ (số nguyên dương)");
      return;
    }

    if (amountNum < 20000) {
      toast.error("Số tiền nạp tối thiểu là 20,000 VNĐ");
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      const { statusCode, message, item } = await deposit({
        amount: amountNum,
        note: note || "Nạp tiền vào ví",
      }).unwrap();

      if (statusCode === 403 && message === "Người dùng chưa định danh") {
        console.log("Detected 403 error - opening phone verification popup");
        toast.error("Vui lòng xác thực số điện thoại trước khi nạp tiền", {
          description: "Tiến hành xác thực",
          action: {
            label: "Xác thực ngay",
            onClick: () => {
              console.log("Opening phone verification popup from toast action");
              openPopup();
            },
          },
        });

        setTimeout(() => {
          console.log("Opening phone verification popup with delay");
          openPopup();
        }, 500);

        return;
      }

      if (statusCode === 200 && item) {
        setCurrentTransaction(item);
      } else {
        toast.error("Không thể tạo giao dịch nạp tiền", {
          description: message || "Vui lòng thử lại sau",
        });
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi nạp tiền", {
        description:
          error?.data?.message || error?.message || "Vui lòng thử lại sau",
      });
    }
  }, [amount, note, deposit, isLoading, openPopup]);

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              <div>
                <CardTitle>Nạp Tiền Vào Ví</CardTitle>
                <CardDescription>
                  Nạp tiền vào ví để thực hiện mua hàng và giao dịch
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay về
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Số Tiền (VNĐ)</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm text-gray-400">
                ₫
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="20000"
                step="1000"
                disabled={!!currentTransaction}
              />
            </div>
            <p className="text-xs text-gray-500">
              Số tiền tối thiểu: 20,000 VNĐ
            </p>
          </div>

          <div className="space-y-2">
            <Label>Phương Thức Thanh Toán</Label>
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "bank" ? "default" : "outline"}
                className="h-12 flex items-center gap-2"
                disabled={!!currentTransaction}
              >
                <Banknote className="h-4 w-4" />
                Chuyển khoản
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
            <Input
              id="note"
              placeholder="Ghi chú cho giao dịch"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!!currentTransaction}
            />
          </div>

          <div className="space-y-2">
            <Label>Số Tiền Nhanh</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("50000")}
                disabled={!!currentTransaction}
              >
                50K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("100000")}
                disabled={!!currentTransaction}
              >
                100K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("500000")}
                disabled={!!currentTransaction}
              >
                500K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("1000000")}
                disabled={!!currentTransaction}
              >
                1M
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">Thông tin giao dịch</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Số tiền:</span>
                <div className="font-semibold text-green-600">
                  {amount ? formatPrice(parseInt(amount)) : "0 VNĐ"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Phương thức:</span>
                <div className="font-semibold">
                  {paymentMethod === "bank" ? "Chuyển khoản" : "Thẻ tín dụng"}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-medium"
            onClick={handleDeposit}
            disabled={
              isLoading ||
              !amount ||
              parseInt(amount) <= 0 ||
              isNaN(parseInt(amount)) ||
              parseInt(amount) < 20000
            }
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLoading ? "Đang tạo link thanh toán..." : "Đang xử lý..."}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Nạp Tiền {amount ? formatPrice(parseInt(amount)) : ""}
              </>
            )}
          </Button>

          <div className="mt-4">
            <div className=" border border-blue-200 p-4 rounded-lg ">
              <div className="flex w-full items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Thông tin thanh toán
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>
                      <strong>Tên sản phẩm:</strong> Nạp tiền vào ví Veila
                    </p>
                    <p>
                      <strong>Giá tiền:</strong>{" "}
                      {amount ? formatPrice(parseInt(amount)) : "0 VNĐ"}
                    </p>
                    <p>
                      <strong>Phương thức:</strong>{" "}
                      {paymentMethod === "bank"
                        ? "Chuyển khoản ngân hàng"
                        : "Thẻ tín dụng/ghi nợ"}
                    </p>
                    <p>
                      <strong>Số lượng:</strong> 1
                    </p>
                  </div>
                </div>
                {currentTransaction && (
                  <PayOsCard
                    transfer={currentTransaction}
                    onUpdate={() => {
                      setCurrentTransaction(null);
                      onDepositSuccess?.();
                    }}
                    trigger={
                      <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                        <ExternalLink className="size-4" />
                        Thanh toán qua PayOS
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Reset Button */}
          {currentTransaction && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCurrentTransaction(null);
              }}
            >
              Tạo giao dịch mới
            </Button>
          )}
        </CardContent>
      </Card>

      <VerifyPhonePopup />
    </div>
  );
};

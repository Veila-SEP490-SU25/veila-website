"use client";

import { useState, useCallback, useRef } from "react";
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
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import { useDepositMutation, walletApi } from "@/services/apis";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products-utils";
import { ITransfer } from "@/services/types";
import { useRouter } from "next/navigation";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";

export const DepositTabs = ({}: { onDepositSuccess?: () => void }) => {
  const router = useRouter();
  const { openPopup } = useVerifyPhonePopup();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("Nạp tiền vào ví");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [deposit, { reset }] = useDepositMutation();
  const dispatch = useDispatch();
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

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

    if (isLoading || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      reset();

      dispatch(walletApi.util.resetApiState());

      console.log("Sending deposit request:", {
        amount: amountNum,
        amountType: typeof amountNum,
        originalAmount: amount,
        note: note || "Nạp tiền vào ví",
      });

      const result = await deposit({
        amount: amountNum,
        note: note || "Nạp tiền vào ví",
      }).unwrap();

      if (
        result.statusCode === 403 &&
        result.message === "Người dùng chưa định danh"
      ) {
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

      if (result.statusCode === 200 && result.item) {
        const depositData: ITransfer = result.item;
        console.log(
          "Deposit successful, checkout URL:",
          depositData.checkoutUrl
        );

        // Set creating link state
        setIsCreatingLink(true);

        try {
          // Open PayOS link directly in new tab
          window.open(depositData.checkoutUrl, "_blank");

          // Set open state
          setIsOpen(true);
          setIsCreatingLink(false);
          toast.success("Đã mở PayOS thanh toán trong tab mới");
        } catch (payosError) {
          console.error("PayOS error:", payosError);
          toast.error("Không thể mở PayOS. Vui lòng thử lại.");
          setIsCreatingLink(false);
        }
      } else {
        console.log("Deposit failed:", result);
        toast.error("Không thể tạo giao dịch nạp tiền", {
          description: result.message || "Vui lòng thử lại sau",
        });
        setIsCreatingLink(false);
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      console.error("Error data:", error?.data);
      console.error("Error status:", error?.status);

      if (
        error?.data?.statusCode === 403 &&
        error?.data?.message === "Người dùng chưa định danh"
      ) {
        console.log(
          "Detected 403 error in catch block - opening phone verification popup"
        );
        toast.error("Vui lòng xác thực số điện thoại trước khi nạp tiền", {
          description: "Tiến hành xác thực",
          action: {
            label: "Xác thực ngay",
            onClick: () => {
              console.log(
                "Opening phone verification popup from toast action (catch block)"
              );
              openPopup();
            },
          },
        });

        setTimeout(() => {
          console.log(
            "Opening phone verification popup with delay (catch block)"
          );
          openPopup();
        }, 500);

        return;
      }

      toast.error("Có lỗi xảy ra khi nạp tiền", {
        description:
          error?.data?.message || error?.message || "Vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }, [amount, note, deposit, isLoading, reset, dispatch, openPopup]);

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
          {/* Số tiền */}
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
              />
            </div>
            <p className="text-xs text-gray-500">
              Số tiền tối thiểu: 20,000 VNĐ
            </p>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-2">
            <Label>Phương Thức Thanh Toán</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "bank" ? "default" : "outline"}
                className="h-12 flex items-center gap-2"
                onClick={() => setPaymentMethod("bank")}
              >
                <Banknote className="h-4 w-4" />
                Chuyển khoản
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="h-12 flex items-center gap-2"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="h-4 w-4" />
                Thẻ tín dụng
              </Button>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
            <Input
              id="note"
              placeholder="Ghi chú cho giao dịch"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              >
                50K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("100000")}
              >
                100K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("500000")}
              >
                500K
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount("1000000")}
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
              parseInt(amount) < 20000 ||
              isCreatingLink
            }
          >
            {isLoading || isCreatingLink ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isCreatingLink
                  ? "Đang tạo link thanh toán..."
                  : "Đang xử lý..."}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Nạp Tiền {amount ? formatPrice(parseInt(amount)) : ""}
              </>
            )}
          </Button>

          {/* PayOS Info */}
          {isOpen && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                PayOS đã được mở trong tab mới. Sau khi thực hiện thanh toán
                thành công, vui lòng đợi từ 5 - 10s để hệ thống tự động cập
                nhật.
              </p>
            </div>
          )}

          <div ref={contentContainerRef} className="mt-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Phone Verification Popup */}
      <VerifyPhonePopup />
    </div>
  );
};

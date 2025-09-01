"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  Smartphone,
  Wallet,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  ExternalLink,
} from "lucide-react";
import {
  useDepositMutation,
  usePostWebhookMutation,
  walletApi,
} from "@/services/apis";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products-utils";
import { ITransfer } from "@/services/types";
import { useRouter } from "next/navigation";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";

// Transaction status types
type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
type WebhookStatus = "COMPLETED" | "FAILED" | "CANCELLED";

interface TransactionInfo {
  transactionId: string;
  orderCode: string;
  checkoutUrl: string;
  qrCode: string;
  expiredAt: Date;
  status?: TransactionStatus;
}

export const DepositTabs = ({}: { onDepositSuccess?: () => void }) => {
  const router = useRouter();
  const { openPopup } = useVerifyPhonePopup();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("Nạp tiền vào ví");
  const [paymentMethod] = useState<string>("bank");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionInfo | null>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null);
  const [_isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const [deposit, { reset }] = useDepositMutation();
  const [postWebhook] = usePostWebhookMutation();
  const dispatch = useDispatch();
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  const postToWebhook = useCallback(
    async (transactionId: string, status: TransactionStatus) => {
      // Only post webhook for non-pending statuses
      if (status === "PENDING") {
        console.log("⏸️ Skipping webhook for PENDING status");
        return true;
      }

      try {
        const payload = {
          transactionId: transactionId,
          status: status as WebhookStatus,
        };

        console.log("🚀 Posting webhook with Redux:", payload);

        const result = await postWebhook(payload).unwrap();

        console.log("✅ Webhook posted successfully:", {
          transactionId,
          status,
          result,
        });

        // Save status to localStorage
        localStorage.setItem(`transaction_${transactionId}`, status);
        return true;
      } catch (error: any) {
        console.error("❌ Failed to post webhook:", {
          error: error?.data || error?.message || error,
        });
        return false;
      }
    },
    [postWebhook]
  );

  useEffect(() => {
    const checkReturnFromPayOS = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const status = urlParams.get("status");
      const cancel = urlParams.get("cancel");

      console.log("🔍 Checking URL parameters:", {
        code,
        status,
        cancel,
        orderCode: urlParams.get("orderCode"),
        id: urlParams.get("id"),
        hasCurrentTransaction: !!currentTransaction,
        currentUrl: window.location.href,
      });

      if (code && status && currentTransaction) {
        console.log("✅ User returned from PayOS:", {
          code,
          status,
          cancel,
          orderCode: urlParams.get("orderCode"),
          id: urlParams.get("id"),
        });

        let transactionStatus: TransactionStatus = "PENDING";

        if (status === "PAID") {
          transactionStatus = "COMPLETED";
        } else if (status === "CANCELLED") {
          transactionStatus = "CANCELLED";
        } else if (status === "FAILED") {
          transactionStatus = "FAILED";
        }

        console.log("🔄 Processing transaction status:", {
          originalStatus: status,
          mappedStatus: transactionStatus,
        });

        if (transactionStatus !== "PENDING") {
          console.log("📤 Calling postToWebhook...");
          const webhookResult = await postToWebhook(
            currentTransaction.transactionId,
            transactionStatus
          );
          console.log("📤 Webhook result:", webhookResult);

          setTransactionStatus(transactionStatus);
          setIsPolling(false);

          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }

          if (transactionStatus === "COMPLETED") {
            toast.success("Nạp tiền thành công! Số dư đã được cập nhật.");
            dispatch(walletApi.util.resetApiState());
          } else if (transactionStatus === "FAILED") {
            toast.error("Giao dịch thất bại. Vui lòng thử lại.");
          } else if (transactionStatus === "CANCELLED") {
            toast.info("Giao dịch đã bị hủy.");
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }
    };

    checkReturnFromPayOS();
  }, [currentTransaction, postToWebhook, dispatch, pollingInterval]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const checkTransactionStatus = useCallback(
    async (transactionId: string) => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const status = urlParams.get("status");
        const _cancel = urlParams.get("cancel");

        if (code && status) {
          let transactionStatus: TransactionStatus = "PENDING";

          if (status === "PAID") {
            transactionStatus = "COMPLETED";
          } else if (status === "CANCELLED") {
            transactionStatus = "CANCELLED";
          } else if (status === "FAILED") {
            transactionStatus = "FAILED";
          }

          if (transactionStatus !== "PENDING") {
            await postToWebhook(transactionId, transactionStatus);
            return transactionStatus;
          }
        }

        const savedStatus = localStorage.getItem(
          `transaction_${transactionId}`
        );
        if (savedStatus && savedStatus !== "PENDING") {
          return savedStatus as TransactionStatus;
        }

        return "PENDING";
      } catch (error) {
        console.error("Error checking transaction status:", error);
        return "PENDING";
      }
    },
    [postToWebhook]
  );

  const startPolling = useCallback(
    (transactionId: string) => {
      setIsPolling(true);

      const interval = setInterval(async () => {
        try {
          const status = await checkTransactionStatus(transactionId);

          if (status && status !== "PENDING") {
            setTransactionStatus(status);
            setIsPolling(false);
            clearInterval(interval);

            if (status === "COMPLETED") {
              toast.success("Nạp tiền thành công! Số dư đã được cập nhật.");
              dispatch(walletApi.util.resetApiState());
            } else if (status === "FAILED") {
              toast.error("Giao dịch thất bại. Vui lòng thử lại.");
            } else if (status === "CANCELLED") {
              toast.info("Giao dịch đã bị hủy.");
            }
          }
        } catch (error) {
          console.error("Error polling transaction status:", error);
        }
      }, 3000);

      setPollingInterval(interval);
    },
    [dispatch, checkTransactionStatus]
  );

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

    setCurrentTransaction(null);
    setTransactionStatus(null);
    setIsPolling(false);

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

        const transactionInfo: TransactionInfo = {
          transactionId: depositData.transactionId,
          orderCode: depositData.orderCode,
          checkoutUrl: depositData.checkoutUrl,
          qrCode: depositData.qrCode,
          expiredAt: depositData.expiredAt,
          status: "PENDING",
        };

        setCurrentTransaction(transactionInfo);
        setTransactionStatus("PENDING");
        setIsCreatingLink(true);

        startPolling(depositData.transactionId);

        try {
          window.open(depositData.checkoutUrl, "_blank");

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
  }, [
    amount,
    note,
    deposit,
    isLoading,
    reset,
    dispatch,
    openPopup,
    startPolling,
  ]);

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "Thành công";
      case "FAILED":
        return "Thất bại";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Đang xử lý";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50 border-green-200";
      case "FAILED":
        return "text-red-600 bg-red-50 border-red-200";
      case "CANCELLED":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
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

          {currentTransaction && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  Trạng thái giao dịch
                </h3>
                <div
                  className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                    transactionStatus || "PENDING"
                  )}`}
                >
                  {getStatusIcon(transactionStatus || "PENDING")}
                  <span className="ml-2">
                    {getStatusText(transactionStatus || "PENDING")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-gray-100 p-4 rounded-lg mb-2">
                    <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                    <p className="text-xs text-gray-500 mt-2">
                      QR Code: {currentTransaction.qrCode.substring(0, 20)}...
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Quét mã QR để thanh toán
                  </p>
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  <Button
                    onClick={() =>
                      window.open(currentTransaction.checkoutUrl, "_blank")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Thanh toán qua PayOS
                  </Button>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Mã giao dịch:</strong>{" "}
                      {currentTransaction.transactionId.substring(0, 8)}...
                    </p>
                    <p>
                      <strong>Mã đơn hàng:</strong>{" "}
                      {currentTransaction.orderCode}
                    </p>
                    <p>
                      <strong>Hết hạn:</strong>{" "}
                      {currentTransaction.expiredAt.toLocaleString("vi-VN")}
                    </p>
                    <p className="text-xs text-blue-600">
                      💡 Click để mở trang thanh toán PayOS
                    </p>
                  </div>
                </div>
              </div>

              {transactionStatus === "PENDING" && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    📋 Luồng thanh toán:
                  </p>
                  <div className="bg-blue-50 p-3 rounded text-xs space-y-1">
                    <p className="font-medium text-blue-800">
                      1. Click "Thanh toán qua PayOS" → Mở trang thanh toán
                    </p>
                    <p className="font-medium text-blue-800">
                      2. Thực hiện thanh toán trên PayOS
                    </p>
                    <p className="font-medium text-blue-800">
                      3. PayOS redirect về với status:
                    </p>
                    <div className="ml-4 space-y-1 text-gray-700">
                      <p>
                        • <strong>Thành công:</strong> status=PAID → COMPLETED
                      </p>
                      <p>
                        • <strong>Hủy:</strong> status=CANCELLED → CANCELLED
                      </p>
                      <p>
                        • <strong>Thất bại:</strong> status=FAILED → FAILED
                      </p>
                    </div>
                    <p className="font-medium text-blue-800 mt-2">
                      4. FE tự động post webhook và cập nhật UI
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!currentTransaction && (
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
          )}

          {/* Reset Button */}
          {currentTransaction &&
            transactionStatus &&
            transactionStatus !== "PENDING" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCurrentTransaction(null);
                  setTransactionStatus(null);
                  setIsPolling(false);
                  if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                  }
                }}
              >
                Tạo giao dịch mới
              </Button>
            )}

          {/* PayOS Info */}
          {isOpen && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                🚀 <strong>PayOS đã được mở trong tab mới!</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                • Thực hiện thanh toán trên trang PayOS • Sau khi hoàn tất,
                PayOS sẽ redirect về trang này • Hệ thống tự động cập nhật trạng
                thái giao dịch
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

      <VerifyPhonePopup />
    </div>
  );
};

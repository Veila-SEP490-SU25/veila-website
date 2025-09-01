"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentFailedPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const id = searchParams.get("id");
    const cancel = searchParams.get("cancel");
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");

    if (code === "01" || status === "FAILED") {
      setTransactionData({
        code,
        id,
        cancel: cancel === "true",
        status,
        orderCode,
      });
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleRetryPayment = () => {
    router.push("/profile/wallet");
  };

  const handleBackToWallet = () => {
    router.push("/profile/wallet");
  };

  const handleBackToHome = () => {
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-gray-600">Đang xử lý...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Thanh toán thất bại!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Giao dịch của bạn không thể hoàn thành
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Chi tiết lỗi</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-red-600">Thất bại</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">
                  {new Date().toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium text-gray-800">
                  {transactionData?.orderCode || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-800">
                  {transactionData?.id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã lỗi:</span>
                <span className="font-medium text-red-600">
                  {transactionData?.code || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Rất tiếc, giao dịch thanh toán của bạn không thể hoàn thành.
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng kiểm tra lại thông tin và thử lại.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Có thể do:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Thông tin thẻ không chính xác</li>
              <li>• Số dư tài khoản không đủ</li>
              <li>• Kết nối mạng không ổn định</li>
              <li>• Giao dịch bị hủy bởi ngân hàng</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại thanh toán
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToWallet}
              className="w-full"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Quay về ví
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về trang chủ
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ khách hàng.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentFailedPageContent />
    </Suspense>
  );
}

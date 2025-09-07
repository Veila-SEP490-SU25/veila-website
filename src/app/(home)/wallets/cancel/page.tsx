'use client';

import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentCancelPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const id = searchParams.get('id');
    const cancel = searchParams.get('cancel');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');

    if (cancel === 'true' || status === 'CANCELLED') {
      setTransactionData({
        code,
        id,
        cancel: cancel === 'true',
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
    router.push('/profile/wallet');
  };

  const handleBackToWallet = () => {
    router.push('/profile/wallet');
  };

  const handleBackToHome = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
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
            <AlertCircle className="h-16 w-16 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-yellow-600">Thanh toán đã bị hủy</CardTitle>
          <CardDescription className="text-gray-600">
            Bạn đã hủy giao dịch thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Chi tiết giao dịch</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-yellow-600">Đã hủy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium text-gray-800">
                  {transactionData?.orderCode || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-800">{transactionData?.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-700">Giao dịch thanh toán đã được hủy bởi bạn.</p>
            <p className="text-sm text-gray-500">
              Không có khoản tiền nào bị trừ khỏi tài khoản của bạn.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại thanh toán
            </Button>
            <Button variant="outline" onClick={handleBackToWallet} className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Quay về ví
            </Button>
            <Button variant="outline" onClick={handleBackToHome} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về trang chủ
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Bạn có thể thử lại thanh toán bất cứ lúc nào.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      }
    >
      <PaymentCancelPageContent />
    </Suspense>
  );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLazyGetMyWalletQuery } from "@/services/apis";
import { formatPrice } from "@/lib/products-utils";
import { useVietQR } from "@/hooks/use-vietqr";
import { DepositTabs } from "@/components/profile/wallet/deposit-tabs";
import { WithdrawTabs } from "@/components/profile/wallet/withdraw-tabs";
import { TransactionHistoryTabs } from "@/components/profile/wallet/transaction-history-tabs";
import { CreateWalletPINDialog } from "@/components/profile/wallet/create-wallet-pin-dialog";
import { UpdateWalletPINDialog } from "@/components/profile/wallet/update-wallet-pin-dialog";
import { UpdateBankInfoDialog } from "@/components/profile/wallet/update-bank-info-dialog";

function WalletPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreatePinDialog, setShowCreatePinDialog] = useState(false);
  const [showUpdatePinDialog, setShowUpdatePinDialog] = useState(false);
  const [showBankInfoDialog, setShowBankInfoDialog] = useState(false);

  const [getMyWallet, { data: walletData, isLoading, error }] =
    useLazyGetMyWalletQuery();
  const { banks } = useVietQR();

  useEffect(() => {
    getMyWallet();
  }, [getMyWallet]);

  const handleDepositSuccess = () => {
    getMyWallet();
    setActiveTab("overview");
  };

  const handleWithdrawSuccess = () => {
    getMyWallet();
    setActiveTab("overview");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <Wallet className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Không thể tải thông tin ví
            </h3>
            <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
            <Button onClick={() => getMyWallet()}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const wallet = walletData?.item;
  const hasPin = wallet?.hasPin || false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay về
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ví Điện Tử</h1>
            <p className="text-gray-600">
              Quản lý tài khoản và giao dịch của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Overview Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-green-600" />
            Thông Tin Ví
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Balance */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {wallet ? formatPrice(wallet.availableBalance || 0) : "0 VNĐ"}
              </div>
              <div className="text-sm text-gray-600">Số dư khả dụng</div>
            </div>

            {/* Locked Balance */}
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {wallet ? formatPrice(wallet.lockedBalance || 0) : "0 VNĐ"}
              </div>
              <div className="text-sm text-gray-600">Số dư bị khóa</div>
            </div>

            {/* PIN Status with Action Button */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600 mb-3">
                {hasPin ? "Đã có PIN" : "Chưa có PIN"}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Trạng thái bảo mật
              </div>
              {hasPin ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpdatePinDialog(true)}
                  className="w-full text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Cập nhật PIN
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreatePinDialog(true)}
                  className="w-full text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Tạo PIN
                </Button>
              )}
            </div>

            {/* Bank Info with Action Button */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600 mb-3">
                Thông tin ngân hàng
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {wallet?.bin && wallet?.bankNumber ? (
                  <div className="space-y-1">
                    <div className="font-medium">
                      Ngân hàng:{" "}
                      {banks?.find((bank) => bank.bin === wallet.bin)
                        ?.shortName || wallet.bin}
                    </div>
                    <div className="font-medium">
                      Số TK: {wallet.bankNumber}
                    </div>
                  </div>
                ) : (
                  "Chưa cập nhật"
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBankInfoDialog(true)}
                className="w-full text-xs"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                {wallet?.bin && wallet?.bankNumber ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
          <TabsTrigger value="withdraw">Rút tiền</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
              <CardDescription>
                Tìm hiểu cách sử dụng ví điện tử của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">💳 Nạp tiền</h4>
                  <p className="text-sm text-gray-600">
                    Nạp tiền vào ví để thực hiện mua hàng và giao dịch
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">💰 Rút tiền</h4>
                  <p className="text-sm text-gray-600">
                    Rút tiền từ ví về tài khoản ngân hàng của bạn
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">🔒 Bảo mật</h4>
                  <p className="text-sm text-gray-600">
                    Tạo và quản lý mã PIN để bảo vệ ví của bạn
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Theo dõi</h4>
                  <p className="text-sm text-gray-600">
                    Xem lịch sử giao dịch và quản lý tài khoản
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit">
          <DepositTabs onDepositSuccess={handleDepositSuccess} />
        </TabsContent>

        <TabsContent value="withdraw">
          {wallet && (
            <WithdrawTabs
              wallet={wallet}
              onWithdrawSuccess={handleWithdrawSuccess}
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistoryTabs />
        </TabsContent>
      </Tabs>

      <CreateWalletPINDialog
        open={showCreatePinDialog}
        onOpenChange={setShowCreatePinDialog}
        onSuccess={() => {
          setShowCreatePinDialog(false);
          getMyWallet();
        }}
      />

      <UpdateWalletPINDialog
        open={showUpdatePinDialog}
        onOpenChange={setShowUpdatePinDialog}
        onSuccess={() => {
          setShowUpdatePinDialog(false);
          getMyWallet();
        }}
      />

      {wallet && (
        <UpdateBankInfoDialog
          open={showBankInfoDialog}
          onOpenChange={setShowBankInfoDialog}
          wallet={wallet}
          onSuccess={() => {
            setShowBankInfoDialog(false);
            getMyWallet();
          }}
        />
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <WalletPageContent />
    </Suspense>
  );
}

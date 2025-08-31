"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLazyGetMyWalletQuery } from "@/services/apis";
import { IWallet } from "@/services/types";
import {
  Wallet,
  AlertCircleIcon,
  CircleDollarSign,
  Calendar,
  MapPin,
  Lock,
  Unlock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth.provider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const WalletCard = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState<IWallet>();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [balance, setBalance] = useState<number>(0);
  const [hasPin, setHasPin] = useState<boolean>(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState<boolean>(false);
  const [isUpdatingPin, setIsUpdatingPin] = useState<boolean>(false);
  const [oldPin, setOldPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");

  const [getMyWWallet, { isLoading }] = useLazyGetMyWalletQuery();

  const fetchWallet = useCallback(async () => {
    try {
      const { statusCode, message, item } = await getMyWWallet().unwrap();
      if (statusCode === 200) {
        setWallet(item);
        setBalance(item.availableBalance + item.lockedBalance);
        // Kiểm tra xem có mã PIN không - nếu không có field pin thì chưa có PIN
        const hasPinValue =
          item.hasOwnProperty("pin") &&
          item.pin !== null &&
          item.pin !== "" &&
          item.pin.length > 0;
        setHasPin(hasPinValue);
      } else {
        setError(message);
        setIsError(true);
      }
    } catch (error) {
      console.log("Failed to fetch wallet", error);
    }
  }, [setIsError, setError, setWallet, getMyWWallet]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handlePinAction = async () => {
    if (!newPin || newPin.length !== 6) {
      toast.error("Mã PIN phải có 6 chữ số");
      return;
    }

    if (hasPin && (!oldPin || oldPin.length !== 6)) {
      toast.error("Vui lòng nhập mã PIN cũ");
      return;
    }

    setIsUpdatingPin(true);
    try {
      const endpoint = hasPin
        ? "/wallets/my-wallet/update-pin"
        : "/wallets/my-wallet/create-pin";
      const body = hasPin ? { oldPin, pin: newPin } : { pin: newPin };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          hasPin ? "Cập nhật mã PIN thành công" : "Tạo mã PIN thành công"
        );
        setIsPinDialogOpen(false);
        setOldPin("");
        setNewPin("");
        fetchWallet();
      } else {
        const errorData = await response.json();
        toast.error(
          hasPin ? "Cập nhật mã PIN thất bại" : "Tạo mã PIN thất bại",
          {
            description: errorData.message || "Có lỗi xảy ra",
          }
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xử lý mã PIN");
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const openPinDialog = () => {
    setOldPin("");
    setNewPin("");
    setIsPinDialogOpen(true);
  };

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    // console.log("hasPin state:", hasPin); // Removed debug log
  }, [hasPin]);

  return (
    <>
      {isError ? (
        <Alert variant={"destructive"} className="mb-4 h-full">
          <AlertCircleIcon />
          <AlertTitle>Đã có lỗi xảy ra trong quá trình lấy dữ liệu</AlertTitle>
          <AlertDescription>
            <p>Chi tiết lỗi:</p>
            <ul className="list-inside list-disc text-sm">
              <li>{error}</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng Số Dư Ví</span>
                <Wallet className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <CircleDollarSign className="mr-2 text-green-500" />
                {formatVND(balance)}
              </div>
              <Button
                size="sm"
                className="w-full bg-rose-600 hover:bg-rose-700"
                onClick={() => {
                  router.push(`/profile/wallet`);
                }}
                disabled={true}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Xem chi tiết ví
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        wallet && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {currentUser && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Ngày sinh:{" "}
                        {currentUser.birthDate
                          ? new Date(currentUser.birthDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Địa chỉ: {currentUser.address || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng Số Dư Ví</span>
                    <Wallet className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 flex items-center">
                    <CircleDollarSign className="mr-2 text-green-500" />
                    {formatVND(balance)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {hasPin ? (
                    <>
                      <Lock className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">
                        Đã thiết lập mã PIN
                      </span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 text-orange-500" />
                      <span className="text-orange-600">
                        Chưa thiết lập mã PIN
                      </span>
                    </>
                  )}
                </div>

                {/* Debug info - chỉ hiển thị trong development */}
                {process.env.NODE_ENV === "development" && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    <div>Debug Info:</div>
                    <div>
                      Has PIN field:{" "}
                      {wallet?.hasOwnProperty("pin") ? "Yes" : "No"}
                    </div>
                    <div>PIN field: {wallet?.pin || "undefined"}</div>
                    <div>PIN type: {typeof wallet?.pin}</div>
                    <div>hasPin state: {hasPin.toString()}</div>
                    <div>
                      Available fields:{" "}
                      {wallet ? Object.keys(wallet).join(", ") : "No wallet"}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    onClick={() => {
                      router.push(`/profile/wallet`);
                    }}
                    disabled={isLoading || isError}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Xem chi tiết ví
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={openPinDialog}
                    disabled={isUpdatingPin}
                  >
                    {hasPin ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Đổi mã PIN
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        Tạo mã PIN
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{hasPin ? "Đổi Mã PIN" : "Tạo Mã PIN"}</DialogTitle>
            <DialogDescription>
              {hasPin
                ? "Nhập mã PIN cũ và mã PIN mới (6 chữ số)"
                : "Tạo mã PIN mới cho ví của bạn (6 chữ số)"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {hasPin && (
              <div className="space-y-2">
                <Label htmlFor="oldPin">Mã PIN cũ</Label>
                <Input
                  id="oldPin"
                  type="password"
                  placeholder="Nhập mã PIN cũ"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newPin">{hasPin ? "Mã PIN mới" : "Mã PIN"}</Label>
              <Input
                id="newPin"
                type="password"
                placeholder={hasPin ? "Nhập mã PIN mới" : "Nhập mã PIN"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPinDialogOpen(false)}
                disabled={isUpdatingPin}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-700"
                onClick={handlePinAction}
                disabled={isUpdatingPin}
              >
                {isUpdatingPin ? "Đang xử lý..." : hasPin ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

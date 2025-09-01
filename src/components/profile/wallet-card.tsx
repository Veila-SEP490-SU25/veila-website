"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useLazyGetMyWalletQuery,
  useUpdateWalletPINMutation,
  useCreateWalletPINMutation,
} from "@/services/apis";
import { IWallet } from "@/services/types";
import {
  Wallet,
  AlertCircleIcon,
  CircleDollarSign,
  Lock,
  Unlock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const [updateWalletPIN] = useUpdateWalletPINMutation();
  const [createWalletPIN] = useCreateWalletPINMutation();

  const fetchWallet = useCallback(async () => {
    try {
      const { statusCode, message, item } = await getMyWWallet().unwrap();
      if (statusCode === 200) {
        setWallet(item);
        setBalance(item.availableBalance + item.lockedBalance);

        // Kiểm tra hasPin với fallback
        const hasPinValue = item.hasOwnProperty("hasPin")
          ? Boolean(item.hasPin)
          : false;
        setHasPin(hasPinValue);
      } else {
        setError(message);
        setIsError(true);
      }
    } catch (error) {
      console.log("Failed to fetch wallet", error);
    }
  }, [getMyWWallet]);

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
      await fetchWallet();
    } catch (error) {
      console.log("Failed to refresh wallet before PIN action:", error);
    }
    try {
      const currentHasPin = wallet?.hasOwnProperty("hasPin")
        ? Boolean(wallet.hasPin)
        : false;

      if (currentHasPin) {
        const result = await updateWalletPIN({ oldPin, pin: newPin }).unwrap();
        if (result.statusCode === 200) {
          toast.success("Cập nhật mã PIN thành công");
          setIsPinDialogOpen(false);
          setOldPin("");
          setNewPin("");
          fetchWallet();
        } else {
          toast.error("Cập nhật mã PIN thất bại", {
            description: result.message || "Có lỗi xảy ra",
          });
        }
      } else {
        const result = await createWalletPIN(newPin).unwrap();

        if (result.statusCode === 200) {
          toast.success("Tạo mã PIN thành công");
          setIsPinDialogOpen(false);
          setOldPin("");
          setNewPin("");
          fetchWallet();
        } else {
          toast.error("Tạo mã PIN thất bại", {
            description: result.message || "Có lỗi xảy ra",
          });
        }
      }
    } catch (error: any) {
      console.error("PIN action error:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });
      toast.error("Có lỗi xảy ra khi xử lý mã PIN", {
        description:
          error?.data?.message || error?.message || "Vui lòng thử lại",
      });
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

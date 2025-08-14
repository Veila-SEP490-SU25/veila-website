"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLazyGetMyWalletQuery } from "@/services/apis";
import { IWallet } from "@/services/types";
import { Wallet, AlertCircleIcon, CircleDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const WalletCard = () => {
  const router = useRouter();
  const [wallet, setWallet] = useState<IWallet>();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [balance, setBalance] = useState<number>(0);

  const [getMyWWallet, { isLoading }] = useLazyGetMyWalletQuery();

  const fetchWallet = useCallback(async () => {
    try {
      const { statusCode, message, item } = await getMyWWallet().unwrap();
      if (statusCode === 200) {
        setWallet(item);
        setBalance(item.availableBalance + item.lockedBalance);
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

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return isError ? (
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
              disabled={isLoading || isError}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Xem chi tiết ví
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  );
};

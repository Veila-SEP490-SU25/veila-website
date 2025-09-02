"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { LoadingItem } from "@/components/loading-item";
import { StaffNotFound } from "@/components/staff-not-found";
import { ShopTabs } from "@/components/staff/shops/detail/shop-tabs";
import { ShopVerifyDialog } from "@/components/staff/shops/shop-verify-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSuccess } from "@/lib/utils";
import { useLazyGetShopQuery } from "@/services/apis";
import { IShop } from "@/services/types";
import { Check, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function StaffShopDetailPage() {
  const { shopId } = useParams();

  const [trigger, { isLoading }] = useLazyGetShopQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shop, setShop] = useState<IShop | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const fetchShop = useCallback(async () => {
    try {
      const { statusCode, item, message } = await trigger(
        shopId as string
      ).unwrap();
      if (isSuccess(statusCode)) {
        setShop(item);
        setError("");
        setIsError(false);
      } else if (statusCode === 404) {
        setIsNotFound(true);
        setError(message);
        setIsError(true);
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      setIsError(true);
      setError("Đã xảy ra lỗi trong quá trình lấy dữ liệu cửa hàng.");
    }
  }, [shopId, setIsError, setError, trigger, setShop]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  if (isNotFound)
    return (
      <div className="space-y-6 max-w-full h-full">
        <StaffNotFound />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu
            </CardTitle>
            <CardDescription>
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchShop}
              >
                <RefreshCw
                  className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Thử lại
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorCard message={error} />
          </CardContent>
        </Card>
      </div>
    );

  if (isLoading)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <LoadingItem />
      </div>
    );

  return (
    shop && (
      <div className="p-6 space-y-6 w-full">
        <div className="flex items-center justify-between">
          <GoBackButton />
          {!shop.isVerified && (
            <ShopVerifyDialog
              shop={shop}
              onUpdate={fetchShop}
              trigger={
                <Button
                  className="flex items-center justify-start gap-2"
                  variant="outline"
                >
                  <Check className="size-4" />
                  Xác thực
                </Button>
              }
            />
          )}
        </div>
        <ShopTabs shop={shop} onUpdate={fetchShop} />
      </div>
    )
  );
}

"use client";

import { UpdateShopStatusDialog } from "@/components/staff/shop/update-shop-status-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, isSuccess } from "@/lib/utils";
import { useUpdateShopStatusMutation } from "@/services/apis";
import { IShop, ShopStatus } from "@/services/types";
import { MoreHorizontal, Check, LockOpen, Ban, Lock } from "lucide-react";
import { useCallback } from "react";

interface ActionButtonProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const ActionButton = ({ shop, onUpdate }: ActionButtonProps) => {
  const [trigger, { isLoading }] = useUpdateShopStatusMutation();

  const handleUpdateStatus = useCallback(
    async (status: ShopStatus) => {
      try {
        const { statusCode } = await trigger({
          shopId: shop.id,
          status,
        }).unwrap();
        if (isSuccess(statusCode)) {
          onUpdate?.();
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [trigger]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          size="icon"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max space-y-1">
        {shop.status === ShopStatus.PENDING ? (
          <DropdownMenuItem asChild>
            <Button
              className="flex items-center justify-start gap-2 w-full"
              variant="ghost"
              size="sm"
            >
              <Check className="size-4" />
              Phê duyệt
            </Button>
          </DropdownMenuItem>
        ) : (
          <>
            {shop.status === ShopStatus.SUSPENDED ? (
              <DropdownMenuItem asChild>
                <UpdateShopStatusDialog
                  onConfirm={async () =>
                    await handleUpdateStatus(ShopStatus.PENDING)
                  }
                  trigger={
                    <Button
                      className="flex items-center justify-start gap-2 w-full"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                    >
                      <LockOpen className="size-4" />
                      Mở khoá
                    </Button>
                  }
                  title="Xác nhận mở khoá cửa hàng"
                  message="Bạn có chắc chắn muốn mở khoá cửa hàng này không?"
                  errorMessage="Mở khoá cửa hàng thất bại. Vui lòng thử lại sau ít phút."
                  successMessage="Đã mở khoá cửa hàng"
                />
              </DropdownMenuItem>
            ) : (
              shop.status !== ShopStatus.INACTIVE && (
                <DropdownMenuItem asChild>
                  <UpdateShopStatusDialog
                    onConfirm={async () =>
                      await handleUpdateStatus(ShopStatus.SUSPENDED)
                    }
                    trigger={
                      <Button
                        className="flex items-center justify-start gap-2 w-full"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                      >
                        <Lock className="size-4" />
                        Tạm khoá
                      </Button>
                    }
                    title="Xác nhận tạm khoá cửa hàng"
                    message="Bạn có chắc chắn muốn tạm khoá cửa hàng này không?"
                    errorMessage="Tạm khoá cửa hàng thất bại. Vui lòng thử lại sau ít phút."
                    successMessage="Đã tạm khoá cửa hàng"
                  />
                </DropdownMenuItem>
              )
            )}
            {shop.status !== ShopStatus.BANNED ? (
              <DropdownMenuItem asChild>
                <UpdateShopStatusDialog
                  onConfirm={async () =>
                    await handleUpdateStatus(ShopStatus.BANNED)
                  }
                  trigger={
                    <Button
                      className={cn(
                        "flex items-center justify-start gap-2 bg-rose-500/10 text-rose-500",
                        "hover:bg-rose-500 hover:text-white",
                        "w-full"
                      )}
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                    >
                      <Ban className="size-4" />
                      Cấm hoạt động
                    </Button>
                  }
                  title="Xác nhận cấm hoạt động cửa hàng"
                  message="Bạn có chắc chắn muốn cấm hoạt động cửa hàng này không?"
                  errorMessage="Cấm hoạt động cửa hàng thất bại. Vui lòng thử lại sau ít phút."
                  successMessage="Đã cấm hoạt động cửa hàng"
                />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <UpdateShopStatusDialog
                  onConfirm={async () =>
                    await handleUpdateStatus(
                      shop.isVerified ? ShopStatus.ACTIVE : ShopStatus.INACTIVE
                    )
                  }
                  trigger={
                    <Button
                      className={cn(
                        "flex items-center justify-start gap-2 bg-green-500/10 text-green-500",
                        "hover:bg-green-500 hover:text-white",
                        "w-full"
                      )}
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                    >
                      <Ban className="size-4" />
                      Mở hoạt động
                    </Button>
                  }
                  title="Xác nhận mở hoạt động cửa hàng"
                  message="Bạn có chắc chắn muốn mở hoạt động cửa hàng này không?"
                  errorMessage="Mở hoạt động cửa hàng thất bại. Vui lòng thử lại sau ít phút."
                  successMessage="Đã mở hoạt động cửa hàng"
                />
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

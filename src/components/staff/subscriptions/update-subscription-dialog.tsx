"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SingleImageUploadDialog } from "@/components/upload-image-dialog";
import { isSuccess } from "@/lib/utils";
import {
  useUpdateSubscriptionMutation,
} from "@/services/apis";
import {
  ICreateSubscription,
  ISubscription,
  IUpdateSubscription,
} from "@/services/types";
import { Check, Trash, X } from "lucide-react";
import Image from "next/image";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface UpdateSubscriptionDialogProps {
  subscription: ISubscription;
  onSuccess?: () => void;
  children?: ReactNode;
}

export const UpdateSubscriptionDialog = ({
  onSuccess,
  children,
  subscription,
}: UpdateSubscriptionDialogProps) => {
  const [trigger, { isLoading }] = useUpdateSubscriptionMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<IUpdateSubscription>({
    id: subscription.id,
    name: subscription.name,
    description: subscription.description,
    duration: subscription.duration,
    amount: subscription.amount,
    images: subscription.images || "",
  });

  const handleConfirm = useCallback(async () => {
    if (!formData.name || !formData.description || !formData.images) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.duration <= 0) {
      toast.error("Thời gian phải lớn hơn 0");
      return;
    }

    if (formData.amount <= 0) {
      toast.error("Số tiền phải lớn hơn 0");
      return;
    }

    try {
      const { statusCode, message } = await trigger({
        ...formData,
        amount: Number(formData.amount),
        duration: Number(formData.duration),
      }).unwrap();
      if (isSuccess(statusCode)) {
        setOpen(false);
        onSuccess?.();
        resetForm();
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Failed to respond to complaint:", error);
    }
  }, [formData, onSuccess, trigger, setOpen]);

  const resetForm = useCallback(() => {
    setFormData({
      id: subscription.id,
      name: subscription.name,
      description: subscription.description,
      duration: subscription.duration,
      amount: subscription.amount,
      images: subscription.images || "",
    });
  }, [setFormData]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [setOpen, resetForm]);

  const handleInputChange = (
    field: keyof ICreateSubscription,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <Trash className="size-4" />
      Khôi phục gói đăng ký
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Tạo gói đăng ký</DialogTitle>
          <DialogDescription>Tạo gói đăng ký mới</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-4">
          <div className="w-full space-y-4">
            <div className="flex flex-col gap-2">
              <Label>
                Hình ảnh<span className="text-xs text-rose-500">*</span>
              </Label>
              <SingleImageUploadDialog
                imageUrl={formData.images}
                onImageChange={(url) =>
                  setFormData((prev) => ({ ...prev, images: url }))
                }
                trigger={
                  <Image
                    src={formData.images || "/placeholder.svg"}
                    alt="Uploaded image"
                    width={100}
                    height={100}
                    className="object-cover w-full aspect-[4/3] rounded-lg"
                  />
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Tên gói<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                placeholder="Tên gói"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Mô tả<span className="text-xs text-rose-500">*</span>
              </Label>
              <Textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Thời hạn (ngày)<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                placeholder="Thời hạn (ngày)"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Giá gói (đồng)<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                placeholder="Giá gói (đồng)"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            className="flex items-center justify-start gap-2"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="size-4" />
            Huỷ
          </Button>
          <Button
            className="flex items-center justify-start gap-2 bg-rose-500 text-white"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            <Check className="size-4" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

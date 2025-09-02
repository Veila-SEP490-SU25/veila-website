"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit, Calendar } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { IMilestone } from "@/services/types";
import { useUpdateMilestoneInfoMutation } from "@/services/apis";

interface EditMilestoneDialogProps {
  milestone: IMilestone;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  previousMilestoneDueDate?: string | null; // Ngày của milestone trước đó
}

export function EditMilestoneDialog({
  milestone,
  onSuccess,
  trigger,
  previousMilestoneDueDate,
}: EditMilestoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateMilestoneInfo] = useUpdateMilestoneInfoMutation();
  const [dueDate, setDueDate] = useState<Date | undefined>(
    milestone.dueDate ? new Date(milestone.dueDate) : undefined
  );

  const handleSubmit = async () => {
    if (!dueDate) {
      toast.error("Vui lòng chọn ngày hạn hoàn thành");
      return;
    }

    // Kiểm tra ngày không được trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      toast.error("Ngày hạn hoàn thành không được trong quá khứ");
      return;
    }

    // Kiểm tra ngày phải lớn hơn milestone trước đó (nếu có)
    if (previousMilestoneDueDate) {
      const prevDate = new Date(previousMilestoneDueDate);
      if (dueDate <= prevDate) {
        toast.error("Ngày hạn hoàn thành phải lớn hơn milestone trước đó");
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await updateMilestoneInfo({
        id: milestone.id,
        dueDate: dueDate.toISOString(),
      }).unwrap();

      if (response.statusCode === 200) {
        toast.success("Cập nhật thời hạn thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Không thể cập nhật thời hạn", {
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thời hạn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Chỉnh sửa thời hạn</span>
          </DialogTitle>
          <DialogDescription>
            Cập nhật thời hạn hoàn thành cho giai đoạn "{milestone.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Thời hạn hoàn thành *</Label>
            <DatePicker date={dueDate} setDate={setDueDate} />
            <p className="text-xs text-muted-foreground">
              Ngày hạn hoàn thành không được trong quá khứ
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !dueDate}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Cập nhật
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

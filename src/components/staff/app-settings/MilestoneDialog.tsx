import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddMilestoneTemplateMutation,
  useUpdateMilestoneTemplateMutation,
} from '@/services/apis/appsetting.api';
import { IMilestoneTemplate, MilestoneTemplateType } from '@/services/types/appsetting.type';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: IMilestoneTemplate | null;
  type: MilestoneTemplateType;
  onSaved?: () => void;
}

export const MilestoneDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  editing,
  type,
  onSaved,
}) => {
  const [form, setForm] = useState({ title: '', description: '', timeGap: 0 });
  const [addMilestoneTemplate, { isLoading: isAdding }] = useAddMilestoneTemplateMutation();
  const [updateMilestoneTemplate, { isLoading: isUpdating }] = useUpdateMilestoneTemplateMutation();

  useEffect(() => {
    if (editing) {
      setForm({ title: editing.title, description: editing.description, timeGap: editing.timeGap });
    } else {
      setForm({ title: '', description: '', timeGap: 0 });
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      if (editing) {
        const res = await updateMilestoneTemplate({
          id: editing.id,
          title: form.title,
          description: form.description,
          timeGap: form.timeGap,
          type,
        }).unwrap();
        if (isSuccess(res.statusCode)) {
          toast('Đã cập nhật mốc thời gian');
          onSaved?.();
          onOpenChange(false);
        } else {
          toast.error(res.message || 'Không thể cập nhật mốc thời gian');
        }
      } else {
        const res = await addMilestoneTemplate({
          title: form.title,
          description: form.description,
          timeGap: form.timeGap,
          type,
        }).unwrap();
        if (isSuccess(res.statusCode)) {
          toast('Đã thêm mốc thời gian mới');
          onSaved?.();
          onOpenChange(false);
        } else {
          toast.error(res.message || 'Không thể thêm mốc thời gian mới');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu mốc thời gian');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Chỉnh sửa mốc thời gian' : 'Thêm mốc thời gian mới'}
          </DialogTitle>
          <DialogDescription>Nhập thông tin cho mốc thời gian loại {type}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Xác nhận đơn hàng"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả chi tiết về mốc thời gian này"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeGap">Khoảng thời gian (ngày)</Label>
            <Input
              id="timeGap"
              type="number"
              min="0"
              value={form.timeGap}
              onChange={(e) => setForm({ ...form, timeGap: Number(e.target.value) })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAdding || isUpdating}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isAdding || isUpdating}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneDialog;

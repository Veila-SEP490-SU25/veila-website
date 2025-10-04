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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComplaintReasonType, type IComplaintReason } from '@/services/types/appsetting.type';
import {
  useCreateComplaintReasonMutation,
  useUpdateComplaintReasonMutation,
} from '@/services/apis/appsetting.api';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: IComplaintReason | null;
  onSaved?: () => void;
}

export const ComplaintReasonDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  editing,
  onSaved,
}) => {
  const [form, setForm] = useState({
    code: '',
    reason: '',
    reputationPenalty: 0,
    type: ComplaintReasonType.SHOP,
  });

  const [createComplaintReason, { isLoading: isCreating }] = useCreateComplaintReasonMutation();
  const [updateComplaintReason, { isLoading: isUpdating }] = useUpdateComplaintReasonMutation();

  useEffect(() => {
    if (editing) {
      setForm({
        code: editing.code,
        reason: editing.reason,
        reputationPenalty: editing.reputationPenalty,
        type: editing.type,
      });
    } else {
      setForm({ code: '', reason: '', reputationPenalty: 0, type: ComplaintReasonType.SHOP });
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      if (editing) {
        const res = await updateComplaintReason({
          id: editing.id,
          code: form.code,
          reason: form.reason,
          complaintReputationPenalty: form.reputationPenalty,
        }).unwrap();
        if (isSuccess(res.statusCode)) {
          toast('Đã cập nhật lý do khiếu nại');
          onSaved?.();
          onOpenChange(false);
        } else {
          toast.error(res.message || 'Không thể cập nhật lý do khiếu nại');
        }
      } else {
        const res = await createComplaintReason({
          code: form.code,
          reason: form.reason,
          complaintReputationPenalty: form.reputationPenalty,
        }).unwrap();
        if (isSuccess(res.statusCode)) {
          toast('Đã thêm lý do khiếu nại mới');
          onSaved?.();
          onOpenChange(false);
        } else {
          toast.error(res.message || 'Không thể thêm lý do khiếu nại mới');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu lý do khiếu nại');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Chỉnh sửa lý do khiếu nại' : 'Thêm lý do khiếu nại mới'}
          </DialogTitle>
          <DialogDescription>Nhập thông tin cho lý do khiếu nại</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã lý do</Label>
            <Input
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="VD: LATE_DELIVERY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do</Label>
            <Textarea
              id="reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Mô tả chi tiết lý do khiếu nại"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Loại</Label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value as ComplaintReasonType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ComplaintReasonType.SHOP}>Cửa hàng</SelectItem>
                <SelectItem value={ComplaintReasonType.CUSTOMER}>Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reputationPenalty">Phạt uy tín (điểm)</Label>
            <Input
              id="reputationPenalty"
              type="number"
              min="0"
              value={form.reputationPenalty}
              onChange={(e) => setForm({ ...form, reputationPenalty: Number(e.target.value) })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating || isUpdating}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isCreating || isUpdating}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintReasonDialog;

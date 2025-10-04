import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { type IMilestoneTemplate, MilestoneTemplateType } from '@/services/types/appsetting.type';
import {
  useLazyGetMilestoneTemplateQuery,
  useRemoveMilestoneTemplateMutation,
} from '@/services/apis/appsetting.api';
import MilestoneDialog from './milestone-dialog';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

interface Props {
  // keep component controlled for the selected type (parent can still pass props later if needed)
  milestoneType: MilestoneTemplateType;
  setMilestoneType: (v: MilestoneTemplateType) => void;
}

export const MilestoneTemplatesTab: React.FC<Props> = ({ milestoneType, setMilestoneType }) => {
  const [_page] = useState(0);
  const [triggerGetMilestoneTemplate] = useLazyGetMilestoneTemplateQuery();
  const [removeMilestoneTemplate] = useRemoveMilestoneTemplateMutation();
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<IMilestoneTemplate | null>(null);
  const [items, setItems] = useState<IMilestoneTemplate[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await triggerGetMilestoneTemplate({
        type: milestoneType,
      }).unwrap();
      console.log('Loaded milestone templates:', res);
      if (isSuccess(res.statusCode)) {
        setItems(res.item);
      }
    } catch (err) {
      console.error('Error loading milestone templates', err);
    }
  }, [triggerGetMilestoneTemplate, milestoneType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpen = (m?: IMilestoneTemplate) => {
    setEditing(m ?? null);
    setShowDialog(true);
  };

  const handleRemoveType = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tất cả mốc thời gian cho loại ${milestoneType}?`))
      return;
    try {
      const res = await removeMilestoneTemplate({ type: milestoneType }).unwrap();
      if (isSuccess(res.statusCode)) {
        toast('Đã xóa mốc thời gian');
        load();
      } else {
        toast.error(res.message || 'Không thể xóa mốc thời gian');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa mốc thời gian');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mốc thời gian mẫu</CardTitle>
              <CardDescription>Quản lý các mốc thời gian cho từng loại đơn hàng</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={milestoneType}
                onValueChange={(value) => setMilestoneType(value as MilestoneTemplateType)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MilestoneTemplateType.SELL}>Bán</SelectItem>
                  <SelectItem value={MilestoneTemplateType.RENT}>Thuê</SelectItem>
                  <SelectItem value={MilestoneTemplateType.CUSTOM}>Đặt may</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleOpen()}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm mốc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Khoảng thời gian (ngày)</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có mốc thời gian nào cho loại này
                  </TableCell>
                </TableRow>
              ) : (
                items.map((milestone) => (
                  <TableRow key={milestone.id}>
                    <TableCell>{milestone.index}</TableCell>
                    <TableCell className="font-medium">{milestone.title}</TableCell>
                    <TableCell className="max-w-md truncate">{milestone.description}</TableCell>
                    <TableCell>{milestone.timeGap} ngày</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(milestone)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {items.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="destructive" onClick={handleRemoveType}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả mốc loại {milestoneType}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MilestoneDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        editing={editing}
        type={milestoneType}
        onSaved={load}
      />
    </>
  );
};

export default MilestoneTemplatesTab;

import React, { useEffect, useState, useCallback } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ComplaintReasonType, type IComplaintReason } from '@/services/types/appsetting.type';
import {
  useLazyGetComplaintReasonsQuery,
  useDeleteComplaintReasonMutation,
} from '@/services/apis/appsetting.api';
import ComplaintReasonDialog from './complaint-reason-dialog';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

export const ComplaintReasonsTab: React.FC = () => {
  const [page, setPage] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<IComplaintReason | null>(null);
  const [triggerGetComplaintReasons, { data, isLoading: _isLoading }] =
    useLazyGetComplaintReasonsQuery();
  const [deleteComplaintReason] = useDeleteComplaintReasonMutation();

  const load = useCallback(async () => {
    try {
      await triggerGetComplaintReasons({ page, size: 10, filter: '', sort: '' }).unwrap();
    } catch (err) {
      console.error('Error loading complaint reasons', err);
    }
  }, [triggerGetComplaintReasons, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpen = (r?: IComplaintReason) => {
    setEditing(r ?? null);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lý do khiếu nại này?')) return;
    try {
      const res = await deleteComplaintReason(id).unwrap();
      if (isSuccess(res.statusCode)) {
        toast('Đã xóa lý do khiếu nại');
        load();
      } else {
        toast.error(res.message || 'Không thể xóa lý do khiếu nại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa lý do khiếu nại');
    }
  };

  const items = data?.items || [];
  const total = data?.totalItems || 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lý do khiếu nại</CardTitle>
              <CardDescription>Quản lý các lý do khiếu nại trong hệ thống</CardDescription>
            </div>
            <Button onClick={() => handleOpen()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm lý do
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Phạt uy tín</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có lý do khiếu nại nào
                  </TableCell>
                </TableRow>
              ) : (
                items.map((reason) => (
                  <TableRow key={reason.id}>
                    <TableCell className="font-mono">{reason.code}</TableCell>
                    <TableCell>{reason.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={reason.type === ComplaintReasonType.SHOP ? 'default' : 'secondary'}
                      >
                        {reason.type === ComplaintReasonType.SHOP ? 'Cửa hàng' : 'Khách hàng'}
                      </Badge>
                    </TableCell>
                    <TableCell>{reason.reputationPenalty} điểm</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(reason)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(reason.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {total > 10 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {page * 10 + 1} - {Math.min((page + 1) * 10, total)} của {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * 10 >= total}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ComplaintReasonDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        editing={editing}
        onSaved={load}
      />
    </>
  );
};

export default ComplaintReasonsTab;

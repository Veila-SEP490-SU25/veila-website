'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Settings, AlertCircle, Calendar, Percent, Plus, Edit, Trash2, Save } from 'lucide-react';
import {
  useLazyGetCancelPenaltyQuery,
  useSetCancelPenaltyMutation,
  useLazyGetDelayPenaltyQuery,
  useSetDelayPenaltyMutation,
  useLazyGetDaysToComplaintQuery,
  useSetDaysToComplaintMutation,
  useLazyGetDaysToReviewUpdateRequestQuery,
  useSetDaysToReviewUpdateRequestMutation,
  useLazyGetComplaintReasonsQuery,
  useCreateComplaintReasonMutation,
  useUpdateComplaintReasonMutation,
  useDeleteComplaintReasonMutation,
  useLazyGetMilestoneTemplateQuery,
  useAddMilestoneTemplateMutation,
  useUpdateMilestoneTemplateMutation,
  useRemoveMilestoneTemplateMutation,
} from '@/services/apis/appsetting.api';
import {
  ComplaintReasonType,
  MilestoneTemplateType,
  type IComplaintReason,
  type IMilestoneTemplate,
} from '@/services/types/appsetting.type';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

export default function AppSettingsPage() {
  // General Settings States
  const [cancelPenalty, setCancelPenalty] = useState<number>(0);
  const [delayPenalty, setDelayPenalty] = useState<number>(0);
  const [daysToComplaint, setDaysToComplaint] = useState<number>(0);
  const [daysToReviewUpdateRequest, setDaysToReviewUpdateRequest] = useState<number>(0);

  // Complaint Reasons States
  const [complaintReasons, setComplaintReasons] = useState<IComplaintReason[]>([]);
  const [complaintPage, setComplaintPage] = useState(0);
  const [complaintTotal, setComplaintTotal] = useState(0);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [editingComplaintReason, setEditingComplaintReason] = useState<IComplaintReason | null>(
    null,
  );
  const [complaintReasonForm, setComplaintReasonForm] = useState({
    code: '',
    reason: '',
    reputationPenalty: 0,
    type: ComplaintReasonType.SHOP,
  });

  // Milestone Templates States
  const [milestoneType, setMilestoneType] = useState<MilestoneTemplateType>(
    MilestoneTemplateType.SELL,
  );
  const [milestoneTemplates, setMilestoneTemplates] = useState<IMilestoneTemplate[]>([]);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<IMilestoneTemplate | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    timeGap: 0,
  });

  // API Hooks (use [trigger/mutate, { isLoading }] pattern)
  const [triggerGetCancelPenalty, { isLoading: _isLoadingGetCancelPenalty }] =
    useLazyGetCancelPenaltyQuery();
  const [setCancelPenaltyMutation, { isLoading: _isLoadingSetCancelPenalty }] =
    useSetCancelPenaltyMutation();

  const [triggerGetDelayPenalty, { isLoading: _isLoadingGetDelayPenalty }] =
    useLazyGetDelayPenaltyQuery();
  const [setDelayPenaltyMutation, { isLoading: _isLoadingSetDelayPenalty }] =
    useSetDelayPenaltyMutation();

  const [triggerGetDaysToComplaint, { isLoading: _isLoadingGetDaysToComplaint }] =
    useLazyGetDaysToComplaintQuery();
  const [setDaysToComplaintMutation, { isLoading: _isLoadingSetDaysToComplaint }] =
    useSetDaysToComplaintMutation();

  const [
    triggerGetDaysToReviewUpdateRequest,
    { isLoading: _isLoadingGetDaysToReviewUpdateRequest },
  ] = useLazyGetDaysToReviewUpdateRequestQuery();
  const [
    setDaysToReviewUpdateRequestMutation,
    { isLoading: _isLoadingSetDaysToReviewUpdateRequest },
  ] = useSetDaysToReviewUpdateRequestMutation();

  const [triggerGetComplaintReasons, { isLoading: _isLoadingGetComplaintReasons }] =
    useLazyGetComplaintReasonsQuery();
  const [createComplaintReason, { isLoading: _isCreatingComplaintReason }] =
    useCreateComplaintReasonMutation();
  const [updateComplaintReason, { isLoading: _isUpdatingComplaintReason }] =
    useUpdateComplaintReasonMutation();
  const [deleteComplaintReason, { isLoading: _isDeletingComplaintReason }] =
    useDeleteComplaintReasonMutation();

  const [triggerGetMilestoneTemplate, { isLoading: _isLoadingGetMilestoneTemplate }] =
    useLazyGetMilestoneTemplateQuery();
  const [addMilestoneTemplate, { isLoading: _isAddingMilestoneTemplate }] =
    useAddMilestoneTemplateMutation();
  const [updateMilestoneTemplate, { isLoading: _isUpdatingMilestoneTemplate }] =
    useUpdateMilestoneTemplateMutation();
  const [removeMilestoneTemplate, { isLoading: _isRemovingMilestoneTemplate }] =
    useRemoveMilestoneTemplateMutation();

  // Load General Settings
  const loadGeneralSettings = useCallback(async () => {
    try {
      const [cancelRes, delayRes, daysComplaintRes, daysReviewRes] = await Promise.all([
        triggerGetCancelPenalty().unwrap(),
        triggerGetDelayPenalty().unwrap(),
        triggerGetDaysToComplaint().unwrap(),
        triggerGetDaysToReviewUpdateRequest().unwrap(),
      ]);

      if (isSuccess(cancelRes.statusCode)) {
        if (cancelRes.item !== undefined) setCancelPenalty(cancelRes.item);
      } else {
        toast.error(cancelRes.message || 'Lỗi tải cấu hình phí hủy');
      }

      if (isSuccess(delayRes.statusCode)) {
        if (delayRes.item !== undefined) setDelayPenalty(delayRes.item);
      } else {
        toast.error(delayRes.message || 'Lỗi tải cấu hình phí trễ hạn');
      }

      if (isSuccess(daysComplaintRes.statusCode)) {
        if (daysComplaintRes.item !== undefined) setDaysToComplaint(daysComplaintRes.item);
      } else {
        toast.error(daysComplaintRes.message || 'Lỗi tải số ngày khiếu nại');
      }

      if (isSuccess(daysReviewRes.statusCode)) {
        if (daysReviewRes.item !== undefined) setDaysToReviewUpdateRequest(daysReviewRes.item);
      } else {
        toast.error(daysReviewRes.message || 'Lỗi tải số ngày xem xét yêu cầu cập nhật');
      }
    } catch (error) {
      console.error('Error loading general settings:', error);
    }
  }, [
    triggerGetCancelPenalty,
    triggerGetDelayPenalty,
    triggerGetDaysToComplaint,
    triggerGetDaysToReviewUpdateRequest,
  ]);

  useEffect(() => {
    loadGeneralSettings();
  }, [loadGeneralSettings]);

  // Load Complaint Reasons
  const loadComplaintReasons = useCallback(async () => {
    try {
      const response = await triggerGetComplaintReasons({
        page: complaintPage,
        size: 10,
        filter: '',
        sort: '',
      }).unwrap();

      if (isSuccess(response.statusCode)) {
        setComplaintReasons(response.items || []);
        setComplaintTotal(response.totalItems || 0);
      } else {
        toast.error(response.message || 'Lỗi tải lý do khiếu nại');
      }
    } catch (error) {
      console.error('Error loading complaint reasons:', error);
    }
  }, [triggerGetComplaintReasons, complaintPage]);

  useEffect(() => {
    loadComplaintReasons();
  }, [loadComplaintReasons]);

  // Load Milestone Templates
  const loadMilestoneTemplates = useCallback(async () => {
    try {
      const response = await triggerGetMilestoneTemplate({ type: milestoneType }).unwrap();
      if (isSuccess(response.statusCode)) {
        setMilestoneTemplates(response.items || []);
      } else {
        toast.error(response.message || 'Lỗi tải mốc thời gian');
      }
    } catch (error) {
      console.error('Error loading milestone templates:', error);
    }
  }, [triggerGetMilestoneTemplate, milestoneType]);

  useEffect(() => {
    loadMilestoneTemplates();
  }, [loadMilestoneTemplates]);

  // General Settings Handlers
  const handleSaveCancelPenalty = async () => {
    try {
      const { statusCode, message } = await setCancelPenaltyMutation({
        penalty: cancelPenalty,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast('Thành công');
      } else {
        toast.error(message || 'Không thể cập nhật phí hủy đơn hàng');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật phí hủy đơn hàng');
    }
  };

  const handleSaveDelayPenalty = async () => {
    try {
      const { statusCode, message } = await setDelayPenaltyMutation({
        penalty: delayPenalty,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast('Đã cập nhật phí trễ hạn');
      } else {
        toast.error(message || 'Không thể cập nhật phí trễ hạn');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật phí trễ hạn');
    }
  };

  const handleSaveDaysToComplaint = async () => {
    try {
      const { statusCode, message } = await setDaysToComplaintMutation({
        days: daysToComplaint,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast('Đã cập nhật số ngày khiếu nại');
      } else {
        toast.error(message || 'Không thể cập nhật số ngày khiếu nại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật số ngày khiếu nại');
    }
  };

  const handleSaveDaysToReviewUpdateRequest = async () => {
    try {
      const { statusCode, message } = await setDaysToReviewUpdateRequestMutation({
        days: daysToReviewUpdateRequest,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast('Đã cập nhật số ngày xem xét yêu cầu cập nhật');
      } else {
        toast.error(message || 'Không thể cập nhật số ngày xem xét yêu cầu cập nhật');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật số ngày xem xét yêu cầu cập nhật');
    }
  };

  // Complaint Reason Handlers
  const handleOpenComplaintDialog = (reason?: IComplaintReason) => {
    if (reason) {
      setEditingComplaintReason(reason);
      setComplaintReasonForm({
        code: reason.code,
        reason: reason.reason,
        reputationPenalty: reason.reputationPenalty,
        type: reason.type,
      });
    } else {
      setEditingComplaintReason(null);
      setComplaintReasonForm({
        code: '',
        reason: '',
        reputationPenalty: 0,
        type: ComplaintReasonType.SHOP,
      });
    }
    setIsComplaintDialogOpen(true);
  };

  const handleSaveComplaintReason = async () => {
    try {
      if (editingComplaintReason) {
        const { statusCode, message } = await updateComplaintReason({
          id: editingComplaintReason.id,
          code: complaintReasonForm.code,
          reason: complaintReasonForm.reason,
          complaintReputationPenalty: complaintReasonForm.reputationPenalty,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast('Đã cập nhật lý do khiếu nại');
        } else {
          toast.error(message || 'Không thể cập nhật lý do khiếu nại');
        }
      } else {
        const { statusCode, message } = await createComplaintReason({
          code: complaintReasonForm.code,
          reason: complaintReasonForm.reason,
          complaintReputationPenalty: complaintReasonForm.reputationPenalty,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast('Đã thêm lý do khiếu nại mới');
        } else {
          toast.error(message || 'Không thể thêm lý do khiếu nại mới');
        }
      }
      setIsComplaintDialogOpen(false);
      loadComplaintReasons();
    } catch (error) {
      console.error(error);
      toast.error('Không thể lưu lý do khiếu nại');
    }
  };

  const handleDeleteComplaintReason = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lý do khiếu nại này?')) return;

    try {
      const { statusCode, message } = await deleteComplaintReason(id).unwrap();
      if (isSuccess(statusCode)) {
        toast('Đã xóa lý do khiếu nại');
        loadComplaintReasons();
      } else {
        toast.error(message || 'Không thể xóa lý do khiếu nại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể xóa lý do khiếu nại');
    }
  };

  // Milestone Template Handlers
  const handleOpenMilestoneDialog = (milestone?: IMilestoneTemplate) => {
    if (milestone) {
      setEditingMilestone(milestone);
      setMilestoneForm({
        title: milestone.title,
        description: milestone.description,
        timeGap: milestone.timeGap,
      });
    } else {
      setEditingMilestone(null);
      setMilestoneForm({
        title: '',
        description: '',
        timeGap: 0,
      });
    }
    setIsMilestoneDialogOpen(true);
  };

  const handleSaveMilestone = async () => {
    try {
      if (editingMilestone) {
        const { statusCode, message } = await updateMilestoneTemplate({
          id: editingMilestone.id,
          title: milestoneForm.title,
          description: milestoneForm.description,
          timeGap: milestoneForm.timeGap,
          type: milestoneType,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast('Đã cập nhật mốc thời gian');
        } else {
          toast.error(message || 'Không thể cập nhật mốc thời gian');
        }
      } else {
        const { statusCode, message } = await addMilestoneTemplate({
          title: milestoneForm.title,
          description: milestoneForm.description,
          timeGap: milestoneForm.timeGap,
          type: milestoneType,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast('Đã thêm mốc thời gian mới');
        } else {
          toast.error(message || 'Không thể thêm mốc thời gian mới');
        }
      }
      setIsMilestoneDialogOpen(false);
      loadMilestoneTemplates();
    } catch (error) {
      console.error(error);
      toast.error('Không thể lưu mốc thời gian');
    }
  };

  const handleRemoveMilestoneType = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tất cả mốc thời gian cho loại ${milestoneType}?`))
      return;

    try {
      const { statusCode, message } = await removeMilestoneTemplate({
        type: milestoneType,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast('Đã xóa mốc thời gian');
        loadMilestoneTemplates();
      } else {
        toast.error(message || 'Không thể xóa mốc thời gian');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể xóa mốc thời gian');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Quản lý các cài đặt chung của nền tảng</p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="complaints">Lý do khiếu nại</TabsTrigger>
          <TabsTrigger value="milestones">Mốc thời gian</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cancel Penalty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Phí hủy đơn hàng
                </CardTitle>
                <CardDescription>
                  Phần trăm phí phạt khi khách hàng hủy đơn hàng đã xác nhận
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cancelPenalty">Phí phạt (%)</Label>
                  <Input
                    id="cancelPenalty"
                    type="number"
                    min="0"
                    max="100"
                    value={cancelPenalty}
                    onChange={(e) => setCancelPenalty(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSaveCancelPenalty} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>

            {/* Delay Penalty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Phí trễ hạn
                </CardTitle>
                <CardDescription>Điểm uy tín bị trừ khi cửa hàng trễ hạn giao đơn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delayPenalty">Điểm uy tín</Label>
                  <Input
                    id="delayPenalty"
                    type="number"
                    min="0"
                    value={delayPenalty}
                    onChange={(e) => setDelayPenalty(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSaveDelayPenalty} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>

            {/* Days to Complaint */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thời gian khiếu nại
                </CardTitle>
                <CardDescription>
                  Số ngày khách hàng có thể khiếu nại sau khi nhận đơn hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="daysToComplaint">Số ngày</Label>
                  <Input
                    id="daysToComplaint"
                    type="number"
                    min="0"
                    value={daysToComplaint}
                    onChange={(e) => setDaysToComplaint(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSaveDaysToComplaint} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>

            {/* Days to Review Update Request */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Xem xét yêu cầu cập nhật
                </CardTitle>
                <CardDescription>Số ngày để xem xét yêu cầu cập nhật thông tin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="daysToReviewUpdateRequest">Số ngày</Label>
                  <Input
                    id="daysToReviewUpdateRequest"
                    type="number"
                    min="0"
                    value={daysToReviewUpdateRequest}
                    onChange={(e) => setDaysToReviewUpdateRequest(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSaveDaysToReviewUpdateRequest} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Complaint Reasons Tab */}
        <TabsContent value="complaints" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lý do khiếu nại</CardTitle>
                  <CardDescription>Quản lý các lý do khiếu nại trong hệ thống</CardDescription>
                </div>
                <Button onClick={() => handleOpenComplaintDialog()}>
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
                  {complaintReasons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Chưa có lý do khiếu nại nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    complaintReasons.map((reason) => (
                      <TableRow key={reason.id}>
                        <TableCell className="font-mono">{reason.code}</TableCell>
                        <TableCell>{reason.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reason.type === ComplaintReasonType.SHOP ? 'default' : 'secondary'
                            }
                          >
                            {reason.type === ComplaintReasonType.SHOP ? 'Cửa hàng' : 'Khách hàng'}
                          </Badge>
                        </TableCell>
                        <TableCell>{reason.reputationPenalty} điểm</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenComplaintDialog(reason)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteComplaintReason(reason.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {complaintTotal > 10 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {complaintPage * 10 + 1} -{' '}
                    {Math.min((complaintPage + 1) * 10, complaintTotal)} của {complaintTotal}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setComplaintPage((p) => Math.max(0, p - 1))}
                      disabled={complaintPage === 0}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setComplaintPage((p) => p + 1)}
                      disabled={(complaintPage + 1) * 10 >= complaintTotal}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestone Templates Tab */}
        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mốc thời gian mẫu</CardTitle>
                  <CardDescription>
                    Quản lý các mốc thời gian cho từng loại đơn hàng
                  </CardDescription>
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
                  <Button onClick={() => handleOpenMilestoneDialog()}>
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
                  {milestoneTemplates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Chưa có mốc thời gian nào cho loại này
                      </TableCell>
                    </TableRow>
                  ) : (
                    milestoneTemplates
                      .sort((a, b) => a.index - b.index)
                      .map((milestone) => (
                        <TableRow key={milestone.id}>
                          <TableCell>{milestone.index}</TableCell>
                          <TableCell className="font-medium">{milestone.title}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {milestone.description}
                          </TableCell>
                          <TableCell>{milestone.timeGap} ngày</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenMilestoneDialog(milestone)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>

              {milestoneTemplates.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="destructive" onClick={handleRemoveMilestoneType}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tất cả mốc loại {milestoneType}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complaint Reason Dialog */}
      <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingComplaintReason ? 'Chỉnh sửa lý do khiếu nại' : 'Thêm lý do khiếu nại mới'}
            </DialogTitle>
            <DialogDescription>Nhập thông tin cho lý do khiếu nại</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã lý do</Label>
              <Input
                id="code"
                value={complaintReasonForm.code}
                onChange={(e) =>
                  setComplaintReasonForm({ ...complaintReasonForm, code: e.target.value })
                }
                placeholder="VD: LATE_DELIVERY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Lý do</Label>
              <Textarea
                id="reason"
                value={complaintReasonForm.reason}
                onChange={(e) =>
                  setComplaintReasonForm({ ...complaintReasonForm, reason: e.target.value })
                }
                placeholder="Mô tả chi tiết lý do khiếu nại"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <Select
                value={complaintReasonForm.type}
                onValueChange={(value) =>
                  setComplaintReasonForm({
                    ...complaintReasonForm,
                    type: value as ComplaintReasonType,
                  })
                }
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
                value={complaintReasonForm.reputationPenalty}
                onChange={(e) =>
                  setComplaintReasonForm({
                    ...complaintReasonForm,
                    reputationPenalty: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComplaintDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveComplaintReason}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Milestone Template Dialog */}
      <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMilestone ? 'Chỉnh sửa mốc thời gian' : 'Thêm mốc thời gian mới'}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin cho mốc thời gian loại {milestoneType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                placeholder="VD: Xác nhận đơn hàng"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={milestoneForm.description}
                onChange={(e) =>
                  setMilestoneForm({ ...milestoneForm, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về mốc thời gian này"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeGap">Khoảng thời gian (ngày)</Label>
              <Input
                id="timeGap"
                type="number"
                min="0"
                value={milestoneForm.timeGap}
                onChange={(e) =>
                  setMilestoneForm({ ...milestoneForm, timeGap: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveMilestone}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

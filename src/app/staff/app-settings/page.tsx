'use client';

import { useState, useEffect, useCallback } from 'react';
// Button not used in this parent; specific tabs render their own buttons
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import GeneralSettingsTab from '@/components/staff/app-settings/GeneralSettingsTab';
import ComplaintReasonsTab from '@/components/staff/app-settings/ComplaintReasonsTab';
import MilestoneTemplatesTab from '@/components/staff/app-settings/MilestoneTemplatesTab';
import {
  useLazyGetCancelPenaltyQuery,
  useSetCancelPenaltyMutation,
  useLazyGetDelayPenaltyQuery,
  useSetDelayPenaltyMutation,
  useLazyGetDaysToComplaintQuery,
  useSetDaysToComplaintMutation,
  useLazyGetDaysToReviewUpdateRequestQuery,
  useSetDaysToReviewUpdateRequestMutation,
} from '@/services/apis/appsetting.api';
import { MilestoneTemplateType } from '@/services/types/appsetting.type';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

export default function AppSettingsPage() {
  // General Settings States
  const [cancelPenalty, setCancelPenalty] = useState<number>(0);
  const [delayPenalty, setDelayPenalty] = useState<number>(0);
  const [daysToComplaint, setDaysToComplaint] = useState<number>(0);
  const [daysToReviewUpdateRequest, setDaysToReviewUpdateRequest] = useState<number>(0);

  // Complaint Reasons are managed inside ComplaintReasonsTab

  // Milestone Templates selection is passed down to MilestoneTemplatesTab
  const [milestoneType, setMilestoneType] = useState<MilestoneTemplateType>(
    MilestoneTemplateType.SELL,
  );

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

  // Complaint reasons and milestone templates are managed inside their respective tab components

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

  // data fetching for complaint reasons and milestone templates is handled in the tab components

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

  // handlers for complaint reasons are now implemented in ComplaintReasonsTab

  // milestone template handlers are implemented in MilestoneTemplatesTab

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
          <GeneralSettingsTab
            cancelPenalty={cancelPenalty}
            setCancelPenalty={setCancelPenalty}
            delayPenalty={delayPenalty}
            setDelayPenalty={setDelayPenalty}
            daysToComplaint={daysToComplaint}
            setDaysToComplaint={setDaysToComplaint}
            daysToReviewUpdateRequest={daysToReviewUpdateRequest}
            setDaysToReviewUpdateRequest={setDaysToReviewUpdateRequest}
            handleSaveCancelPenalty={handleSaveCancelPenalty}
            handleSaveDelayPenalty={handleSaveDelayPenalty}
            handleSaveDaysToComplaint={handleSaveDaysToComplaint}
            handleSaveDaysToReviewUpdateRequest={handleSaveDaysToReviewUpdateRequest}
          />
        </TabsContent>

        {/* Complaint Reasons Tab */}
        <TabsContent value="complaints" className="space-y-6">
          <ComplaintReasonsTab />
        </TabsContent>

        {/* Milestone Templates Tab */}
        <TabsContent value="milestones" className="space-y-6">
          <MilestoneTemplatesTab
            milestoneType={milestoneType}
            setMilestoneType={setMilestoneType}
          />
        </TabsContent>
      </Tabs>

      {/* Complaint reasons and milestone dialogs are now owned by their tab components */}
    </div>
  );
}

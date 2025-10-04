import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Percent, AlertCircle } from 'lucide-react';

interface Props {
  cancelPenalty: number;
  setCancelPenalty: (v: number) => void;
  delayPenalty: number;
  setDelayPenalty: (v: number) => void;
  daysToComplaint: number;
  setDaysToComplaint: (v: number) => void;
  daysToReviewUpdateRequest: number;
  setDaysToReviewUpdateRequest: (v: number) => void;
  handleSaveCancelPenalty: () => Promise<void>;
  handleSaveDelayPenalty: () => Promise<void>;
  handleSaveDaysToComplaint: () => Promise<void>;
  handleSaveDaysToReviewUpdateRequest: () => Promise<void>;
}

export const GeneralSettingsTab: React.FC<Props> = ({
  cancelPenalty,
  setCancelPenalty,
  delayPenalty,
  setDelayPenalty,
  daysToComplaint,
  setDaysToComplaint,
  daysToReviewUpdateRequest,
  setDaysToReviewUpdateRequest,
  handleSaveCancelPenalty,
  handleSaveDelayPenalty,
  handleSaveDaysToComplaint,
  handleSaveDaysToReviewUpdateRequest,
}) => {
  return (
    <>
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
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GeneralSettingsTab;

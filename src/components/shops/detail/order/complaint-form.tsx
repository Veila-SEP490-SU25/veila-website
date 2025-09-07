'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  useGetComplaintReasonsQuery,
  useCreateComplaintMutation,
  useConfirmNoComplaintMutation,
} from '@/services/apis';
import { ICreateComplaint, ComplaintStatus } from '@/services/types';

interface ComplaintFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export const ComplaintForm = ({ orderId, onSuccess }: ComplaintFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string>('');

  const { data: reasonsData, isLoading: isLoadingReasons } = useGetComplaintReasonsQuery();
  const [createComplaint, { isLoading: isCreating }] = useCreateComplaintMutation();
  const [confirmNoComplaint, { isLoading: isConfirmingNoComplaint }] =
    useConfirmNoComplaintMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Trong thực tế, bạn sẽ upload images lên server và lấy URLs
      // Ở đây tôi giả định đã có URLs
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
      setImageUrls((prev) => (prev ? `${prev},${newImages.join(',')}` : newImages.join(',')));
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newImages.join(','));
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Vui lòng chọn lý do khiếu nại');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả khiếu nại');
      return;
    }

    const complaintData: ICreateComplaint = {
      orderId,
      title: selectedReason, // Sử dụng code từ reason
      description: description.trim(),
      reason: selectedReason,
      images: imageUrls,
      status: ComplaintStatus.DRAFT,
    };

    try {
      const response = await createComplaint(complaintData).unwrap();
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success('Gửi khiếu nại thành công');
        setIsExpanded(false);
        setSelectedReason('');
        setDescription('');
        setImages([]);
        setImageUrls('');
        onSuccess?.();
      } else {
        toast.error('Không thể gửi khiếu nại', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast.error('Có lỗi xảy ra khi gửi khiếu nại');
    }
  };

  const handleConfirmNoComplaint = async () => {
    try {
      const response = await confirmNoComplaint(orderId).unwrap();
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success('Đã xác nhận không có khiếu nại!');
        setIsExpanded(false);
        onSuccess?.();
      } else {
        toast.error('Không thể xác nhận', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Error confirming no complaint:', error);
      toast.error('Có lỗi xảy ra khi xác nhận');
    }
  };

  const selectedReasonData = reasonsData?.items?.find((r) => r.code === selectedReason);

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          <span>Khiếu nại đơn hàng</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Báo cáo vấn đề với đơn hàng
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lý do khiếu nại *</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lý do khiếu nại" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingReasons ? (
                    <SelectItem value="loading" disabled>
                      Đang tải...
                    </SelectItem>
                  ) : (
                    reasonsData?.items?.map((reason) => (
                      <SelectItem key={reason.id} value={reason.code}>
                        {reason.reason}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedReasonData && (
                <div className="text-sm text-muted-foreground">
                  <p>Mức phạt uy tín: {selectedReasonData.reputationPenalty} điểm</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Mô tả chi tiết *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh (tùy chọn)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImages([]);
                    setImageUrls('');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa tất cả
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Hình ảnh ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                disabled={isCreating || isConfirmingNoComplaint}
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmNoComplaint}
                disabled={isCreating || isConfirmingNoComplaint}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                {isConfirmingNoComplaint ? 'Đang xác nhận...' : 'Xác nhận không có khiếu nại'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isCreating || isConfirmingNoComplaint || !selectedReason || !description.trim()
                }
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCreating ? 'Đang gửi...' : 'Gửi khiếu nại'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

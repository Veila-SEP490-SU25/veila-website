'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Ruler, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCreateCustomRequestMutation,
  ICustomRequest,
  ICreateCustomRequest,
} from '@/services/apis';

interface CreateCustomRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  _editData?: ICustomRequest | null;
  _onSuccess?: () => void;
}

export const CreateCustomRequestDialog = ({
  open,
  onOpenChange,
  _editData,
  _onSuccess,
}: CreateCustomRequestDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createCustomRequest] = useCreateCustomRequestMutation();

  // Initialize form data with _editData if editing
  const [_formData, _setFormData] = useState<ICreateCustomRequest>({
    title: '',
    description: '',
    images: '',
    height: 0,
    weight: 0,
    bust: 0,
    waist: 0,
    hip: 0,
    armpit: 0,
    bicep: 0,
    neck: 0,
    shoulderWidth: 0,
    sleeveLength: 0,
    backLength: 0,
    lowerWaist: 0,
    waistToFloor: 0,
    material: '',
    color: '',
    length: '',
    neckline: '',
    sleeve: '',
    status: 'DRAFT',
    isPrivate: false,
  });

  // Form data states
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    images: '',
    height: 165,
    weight: 55,
    bust: 85,
    waist: 65,
    hip: 90,
    armpit: 40,
    bicep: 28,
    neck: 35,
    shoulderWidth: 38,
    sleeveLength: 60,
    backLength: 40,
    lowerWaist: 85,
    waistToFloor: 100,
    material: '',
    color: '',
    length: '',
    neckline: '',
    sleeve: '',
    status: 'DRAFT' as 'DRAFT' | 'SUBMIT',
    isPrivate: false,
  });

  const measurementFields = [
    { key: 'height', label: 'Chiều cao', unit: 'cm', min: 130, max: 200 },
    { key: 'weight', label: 'Cân nặng', unit: 'kg', min: 30, max: 100 },
    { key: 'bust', label: 'Vòng ngực', unit: 'cm', min: 50, max: 150 },
    { key: 'waist', label: 'Vòng eo', unit: 'cm', min: 40, max: 100 },
    { key: 'hip', label: 'Vòng hông', unit: 'cm', min: 40, max: 150 },
    { key: 'armpit', label: 'Nách', unit: 'cm', min: 10, max: 40 },
    { key: 'bicep', label: 'Vòng tay', unit: 'cm', min: 10, max: 40 },
    { key: 'neck', label: 'Vòng cổ', unit: 'cm', min: 20, max: 50 },
    { key: 'shoulderWidth', label: 'Rộng vai', unit: 'cm', min: 20, max: 50 },
    { key: 'sleeveLength', label: 'Dài tay áo', unit: 'cm', min: 0, max: 100 },
    { key: 'backLength', label: 'Dài lưng', unit: 'cm', min: 30, max: 60 },
    { key: 'lowerWaist', label: 'Eo dưới', unit: 'cm', min: 5, max: 30 },
    {
      key: 'waistToFloor',
      label: 'Eo xuống sàn',
      unit: 'cm',
      min: 0,
      max: 200,
    },
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!requestData.title || !requestData.description) {
          toast.error('Vui lòng điền đầy đủ thông tin yêu cầu');
          return false;
        }
        return true;
      case 2:
        // Validate all measurements are within range
        for (const field of measurementFields) {
          const value = requestData[field.key as keyof typeof requestData];
          if (typeof value === 'number' && (value < field.min || value > field.max)) {
            toast.error(`${field.label} phải từ ${field.min}-${field.max}${field.unit}`);
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCustomRequest(requestData).unwrap();

      if (result.statusCode === 201) {
        toast.success('Tạo yêu cầu đặt may thành công!');
        onOpenChange(false);
        setCurrentStep(1);
        // Reset form data
        setRequestData({
          title: '',
          description: '',
          images: '',
          height: 165,
          weight: 55,
          bust: 85,
          waist: 65,
          hip: 90,
          armpit: 40,
          bicep: 28,
          neck: 35,
          shoulderWidth: 38,
          sleeveLength: 60,
          backLength: 40,
          lowerWaist: 85,
          waistToFloor: 100,
          material: '',
          color: '',
          length: '',
          neckline: '',
          sleeve: '',
          status: 'DRAFT' as 'DRAFT' | 'SUBMIT',
          isPrivate: false,
        });
      } else {
        toast.error('Tạo yêu cầu thất bại', { description: result.message });
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo yêu cầu');
      console.error('Create request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tạo yêu cầu đặt may mới
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết để tạo yêu cầu đặt may tùy chỉnh
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {[
            { step: 1, title: 'Yêu cầu', icon: FileText },
            { step: 2, title: 'Số đo', icon: Ruler },
            { step: 3, title: 'Xác nhận', icon: Info },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-rose-600' : 'text-gray-400'
                }`}
              >
                {title}
              </span>
              {step < 3 && <div className="w-12 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin yêu cầu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tiêu đề yêu cầu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ví dụ: May váy cưới theo thiết kế riêng"
                      value={requestData.title}
                      onChange={(e) =>
                        setRequestData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về váy bạn muốn may: kiểu dáng, chất liệu, màu sắc, hoa văn, kích thước..."
                      rows={4}
                      value={requestData.description}
                      onChange={(e) =>
                        setRequestData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images">Hình ảnh tham khảo</Label>
                    <Input
                      id="images"
                      placeholder="Link hình ảnh tham khảo (cách nhau bằng dấu phẩy)"
                      value={requestData.images}
                      onChange={(e) =>
                        setRequestData((prev) => ({
                          ...prev,
                          images: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Có thể nhập nhiều link hình ảnh, cách nhau bằng dấu phẩy
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Trạng thái</Label>
                      <select
                        value={requestData.status}
                        onChange={(e) =>
                          setRequestData((prev) => ({
                            ...prev,
                            status: e.target.value as 'DRAFT' | 'SUBMIT',
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="DRAFT">Nháp</option>
                        <option value="SUBMIT">Đăng</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        DRAFT: Lưu nháp, SUBMIT: Đăng để shop thấy
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={requestData.isPrivate}
                          onChange={(e) =>
                            setRequestData((prev) => ({
                              ...prev,
                              isPrivate: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        Riêng tư
                      </Label>
                      <p className="text-xs text-gray-500">
                        Bật: Chỉ bạn thấy, Tắt: Shop có thể thấy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Số đo cơ thể
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Info className="h-4 w-4" />
                    Vui lòng cung cấp số đo chính xác để đảm bảo váy vừa vặn
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {measurementFields.map(({ key, label, unit, min, max }) => {
                      const value = requestData[key as keyof typeof requestData];
                      const isValid = typeof value === 'number' && value >= min && value <= max;

                      return (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key}>
                            {label} ({unit}){' '}
                            <span className="text-xs text-gray-500">
                              ({min}-{max})
                            </span>
                          </Label>
                          <Input
                            id={key}
                            type="number"
                            min={min}
                            max={max}
                            value={String(value)}
                            onChange={(e) => {
                              const newValue = Number(e.target.value);
                              if (newValue >= min && newValue <= max) {
                                setRequestData((prev) => ({
                                  ...prev,
                                  [key]: newValue,
                                }));
                              }
                            }}
                            onBlur={(e) => {
                              const newValue = Number(e.target.value);
                              if (newValue < min) {
                                setRequestData((prev) => ({
                                  ...prev,
                                  [key]: min,
                                }));
                              } else if (newValue > max) {
                                setRequestData((prev) => ({
                                  ...prev,
                                  [key]: max,
                                }));
                              }
                            }}
                            className={`text-center ${
                              !isValid && 'border-red-300 focus:border-red-500'
                            }`}
                          />
                          {!isValid && (
                            <p className="text-xs text-red-500">
                              {label} phải từ {min}-{max}
                              {unit}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Xác nhận yêu cầu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Request Info */}
                  <div>
                    <h4 className="font-medium mb-2">Thông tin yêu cầu</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Tiêu đề:</span> {requestData.title}
                      </p>
                      <p>
                        <span className="font-medium">Mô tả:</span> {requestData.description}
                      </p>
                      {requestData.images && (
                        <p>
                          <span className="font-medium">Hình ảnh:</span> {requestData.images}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Measurements Summary */}
                  <div>
                    <h4 className="font-medium mb-2">Số đo cơ thể</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {measurementFields.map(({ key, label, unit }) => (
                        <div key={key} className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600">{label}</p>
                          <p className="font-medium text-blue-900">
                            {requestData[key as keyof typeof requestData]}
                            {unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} disabled={isSubmitting}>
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-rose-600 hover:bg-rose-700">
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Tạo yêu cầu'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

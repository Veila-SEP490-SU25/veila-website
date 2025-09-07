'use client';

import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, FileText, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ICreateTask, useCreateTaskMutation, useLazyGetMilestoneTasksQuery } from '@/services/apis';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateTaskDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  milestoneId: string;
}

export function CreateTaskDialog({ milestoneId, onSuccess, trigger }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [getMilestoneTasks] = useLazyGetMilestoneTasksQuery();
  const [existingTasks, setExistingTasks] = useState<any[]>([]);
  const [dateError, setDateError] = useState<string>('');

  const [taskData, setTaskData] = useState<ICreateTask>({
    milestoneId: milestoneId,
    title: '',
    description: '',
    dueDate: '',
  });

  const fetchExistingTasks = useCallback(async () => {
    try {
      const response = await getMilestoneTasks({
        id: milestoneId,
        sort: 'index:asc',
        page: 0,
        size: 1000,
      }).unwrap();
      if (response.statusCode === 200) {
        setExistingTasks(response.items);
      }
    } catch (error) {
      console.error('Error fetching existing tasks:', error);
    }
  }, [getMilestoneTasks, milestoneId]);

  const validateDate = (newDate: string): boolean => {
    if (!newDate) return true;

    const newDateObj = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Kiểm tra ngày không được trong quá khứ
    if (newDateObj < today) {
      setDateError('Ngày hạn hoàn thành không được trong quá khứ');
      return false;
    }

    // Kiểm tra ngày phải tăng dần so với task cuối cùng
    if (existingTasks.length > 0) {
      const lastTask = existingTasks[existingTasks.length - 1];
      if (lastTask.dueDate) {
        const lastTaskDate = new Date(lastTask.dueDate);
        if (newDateObj <= lastTaskDate) {
          setDateError('Ngày hạn hoàn thành phải lớn hơn ngày của công việc trước đó');
          return false;
        }
      }
    }

    setDateError('');
    return true;
  };

  const handleInputChange = (key: keyof ICreateTask, value: string) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));

    // Validate ngày khi thay đổi
    if (key === 'dueDate') {
      validateDate(value);
    }
  };

  // Fetch existing tasks when dialog opens
  useEffect(() => {
    if (open) {
      fetchExistingTasks();
    }
  }, [open, milestoneId, fetchExistingTasks]);

  const onSubmit = async (data: ICreateTask) => {
    // Validate ngày trước khi submit
    if (!validateDate(data.dueDate)) {
      toast.error('Vui lòng kiểm tra lại ngày hạn hoàn thành');
      return;
    }

    try {
      const response = await createTask(data).unwrap();

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success('Tạo công việc thành công');
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error('Không thể tạo công việc', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi tạo công việc');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo giai đoạn mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Tạo công viêc mới</span>
          </DialogTitle>
          <DialogDescription>
            Tạo công việc mới trong giai đoạn để quản lý tiến độ thực hiện đơn hàng.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label>Tiêu đề công việc *</Label>
            <Input
              value={taskData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề công việc"
            />
          </div>
          <div className="space-y-2">
            <Label>Mô tả công việc *</Label>
            <Textarea
              value={taskData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả công việc"
            />
          </div>
          <div className="space-y-2">
            <Label>Hạn hoàn thành *</Label>
            <DatePicker
              date={taskData.dueDate ? new Date(taskData.dueDate) : undefined}
              setDate={(date) => handleInputChange('dueDate', date?.toISOString() || '')}
            />
            {dateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{dateError}</AlertDescription>
              </Alert>
            )}
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
          <Button type="submit" disabled={isLoading} onClick={() => onSubmit(taskData)}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tạo giai đoạn
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

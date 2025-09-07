'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2 } from 'lucide-react';
import { IOrder } from '@/services/types';
import { toast } from 'sonner';
import { useUpdateOrderInformationMutation } from '@/services/apis';

const editOrderSchema = z.object({
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  dueDate: z
    .string()
    .min(1, 'Ngày giao hàng là bắt buộc')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 3); // Thêm 3 ngày

      return selectedDate >= minDate;
    }, 'Ngày giao hàng phải cách ngày hiện tại ít nhất 3 ngày'),
  price: z.string().min(1, 'Giá là bắt buộc'),
});

type EditOrderFormData = z.infer<typeof editOrderSchema>;

interface EditOrderDialogProps {
  order: IOrder;
  trigger?: React.ReactNode;
  onUpdate?: () => void;
}

export function EditOrderDialog({ order, trigger, onUpdate }: EditOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateOrder, { isLoading }] = useUpdateOrderInformationMutation();

  const form = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      phone: order.phone || '',
      email: order.email || '',
      address: order.address || '',
      dueDate: order.dueDate ? new Date(order.dueDate).toISOString().split('T')[0] : '',
      price: order.amount?.toString() || '',
    },
  });

  const onSubmit = async (data: EditOrderFormData) => {
    try {
      const updateData = {
        id: order.id,
        phone: data.phone,
        email: data.email,
        address: data.address,
        dueDate: data.dueDate,
        returnDate: null, // CUSTOM orders không có ngày trả hàng
        price: parseFloat(data.price),
      };

      await updateOrder(updateData).unwrap();

      toast.success('Cập nhật thông tin đơn hàng thành công!');
      setIsOpen(false);
      onUpdate?.();
    } catch (error: any) {
      // Xử lý error message an toàn
      let errorMessage = 'Có lỗi xảy ra khi cập nhật.';
      if (error?.data?.message) {
        errorMessage =
          typeof error.data.message === 'string'
            ? error.data.message
            : 'Có lỗi xảy ra khi cập nhật.';
      } else if (error?.message) {
        errorMessage =
          typeof error.message === 'string' ? error.message : 'Có lỗi xảy ra khi cập nhật.';
      }

      toast.error('Không thể cập nhật thông tin đơn hàng', {
        description: errorMessage,
      });
    }
  };

  // Chỉ hiển thị khi đơn hàng là CUSTOM và đang PENDING
  if (order.type !== 'CUSTOM' || order.status !== 'PENDING') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Chỉnh sửa thông tin đơn hàng
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Cập nhật thông tin khách hàng và chi tiết đơn hàng
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập địa chỉ giao hàng"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => {
                // Tính ngày tối thiểu (3 ngày từ hôm nay)
                const today = new Date();
                const minDate = new Date(today);
                minDate.setDate(today.getDate() + 3);
                const minDateString = minDate.toISOString().split('T')[0];

                return (
                  <FormItem>
                    <FormLabel>Ngày giao hàng *</FormLabel>
                    <FormControl>
                      <Input type="date" min={minDateString} {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Ngày giao hàng phải cách ngày hiện tại ít nhất 3 ngày
                    </p>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Nhập giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

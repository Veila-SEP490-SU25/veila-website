"use client";

import type React from "react";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, X, Calendar, FileText, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateMilestoneMutation } from "@/services/apis";
import {
  MilestoneStatus,
  TaskStatus,
  type ICreateMilestone,
} from "@/services/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const taskSchema = z.object({
  title: z.string().min(1, "Tiêu đề công việc là bắt buộc"),
  description: z.string().min(1, "Mô tả công việc là bắt buộc"),
  dueDate: z.string().min(1, "Hạn hoàn thành là bắt buộc"),
});

const createMilestoneSchema = z.object({
  title: z.string().min(1, "Tiêu đề giai đoạn là bắt buộc"),
  description: z.string().min(1, "Mô tả giai đoạn là bắt buộc"),
  dueDate: z.string().min(1, "Hạn hoàn thành là bắt buộc"),
  tasks: z.array(taskSchema).min(1, "Phải có ít nhất một công việc"),
});

type CreateMilestoneFormData = z.infer<typeof createMilestoneSchema>;

interface CreateMilestoneDialogProps {
  orderId: string;
  milestoneCount?: number;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateMilestoneDialog({
  orderId,
  milestoneCount = 0,
  onSuccess,
  trigger,
}: CreateMilestoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [createMilestone, { isLoading }] = useCreateMilestoneMutation();

  const form = useForm<CreateMilestoneFormData>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      tasks: [
        {
          title: "",
          description: "",
          dueDate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const onSubmit = async (data: CreateMilestoneFormData) => {
    try {
      const payload = {
        name: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      const response = await createMilestone(payload).unwrap();

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success("Tạo giai đoạn thành công", {
          description: `Giai đoạn "${data.title}" đã được tạo với ${data.tasks.length} công việc`,
        });
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Không thể tạo giai đoạn", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo giai đoạn");
      console.error("Error creating milestone:", error);
    }
  };

  const addTask = () => {
    append({
      title: "",
      description: "",
      dueDate: "",
    });
  };

  const removeTask = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

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
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[calc(90vh-2rem)] p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Tạo giai đoạn mới</span>
            </DialogTitle>
            <DialogDescription>
              Tạo một giai đoạn mới với các công việc cụ thể để theo dõi tiến độ
              đơn hàng.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Milestone Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Thông tin giai đoạn</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề giai đoạn *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: Thiết kế và chuẩn bị"
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hạn hoàn thành *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              min={today}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả giai đoạn *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả chi tiết về giai đoạn này..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mô tả tổng quan về những gì sẽ được thực hiện trong
                          giai đoạn này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Separator />

              {/* Tasks Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Danh sách công việc ({fields.length})</span>
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTask}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm công việc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="border-l-4 border-l-blue-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-base">
                            Công việc #{index + 1}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTask(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tiêu đề công việc *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ví dụ: May cổ áo"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.dueDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hạn hoàn thành *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="datetime-local"
                                    min={today}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`tasks.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả công việc *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Mô tả chi tiết về công việc này..."
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <DialogFooter className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
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
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  useCompleteTaskMutation,
  useLazyGetMilestoneTasksQuery,
} from "@/services/apis";
import { type ITask, TaskStatus, UserRole } from "@/services/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  Clock,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CreateTaskDialog } from "@/components/shops/detail/order/create-task-dialog";
import { ComplaintForm } from "@/components/shops/detail/order/complaint-form";
import { useAuth } from "@/providers/auth.provider";

interface Props {
  milestoneId: string;
  milestoneTitle?: string;
  autoExpand?: boolean;
  onChange: () => Promise<void>;
  orderStatus?: string; // Thêm prop để kiểm tra trạng thái đơn hàng
  isLastMilestone?: boolean; // Thêm prop để kiểm tra có phải milestone cuối không
  orderId?: string; // Thêm prop để truyền orderId cho complaint form
}

const getTaskStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case TaskStatus.IN_PROGRESS:
      return <PlayCircle className="h-4 w-4 text-blue-600" />;
    case TaskStatus.CANCELLED:
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getTaskStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "Hoàn thành";
    case TaskStatus.IN_PROGRESS:
      return "Đang thực hiện";
    case TaskStatus.CANCELLED:
      return "Đã hủy";
    case TaskStatus.PENDING:
      return "Chờ thực hiện";
    default:
      return status;
  }
};

const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case TaskStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    case TaskStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const _formatDateTime = (date: Date | string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const MilestoneTask = ({
  milestoneId,
  milestoneTitle,
  autoExpand = false,
  onChange,
  orderStatus,
  isLastMilestone = false,
  orderId,
}: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isOpen, setIsOpen] = useState(autoExpand);
  const [getMilestoneTasks, { isLoading }] = useLazyGetMilestoneTasksQuery();
  const { currentUser } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getMilestoneTasks({
        id: milestoneId,
        sort: "index:asc",
        page: 0,
        size: 1000,
      }).unwrap();
      if (response.statusCode === 200) {
        setTasks(response.items);
      } else {
        toast.error("Không thể tải danh sách công việc", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải công việc");
      console.error("Error fetching tasks:", error);
    }
  }, [getMilestoneTasks, milestoneId]);

  const [completeTask, { isLoading: isUpdating }] = useCompleteTaskMutation();

  const handleMarkComplete = async (taskId: string) => {
    try {
      const response = await completeTask({ milestoneId, taskId }).unwrap();
      if (response.statusCode === 200) {
        toast.success("Công việc đã được đánh dấu hoàn thành");
        fetchTasks();
      } else {
        toast.error("Không thể cập nhật công việc", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật công việc");
      console.error("Error completing task:", error);
    }
  };

  useEffect(() => {
    if (isOpen && tasks.length === 0) {
      fetchTasks();
    }
  }, [isOpen, milestoneId, fetchTasks, tasks.length]);

  // Calculate task statistics
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === TaskStatus.IN_PROGRESS
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === TaskStatus.PENDING
  ).length;
  const cancelledTasks = tasks.filter(
    (task) => task.status === TaskStatus.CANCELLED
  ).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Sort tasks by index and status priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by index
    if (a.index !== b.index) {
      return a.index - b.index;
    }
    // Then by status priority (in progress > pending > completed > cancelled)
    const statusPriority = {
      [TaskStatus.IN_PROGRESS]: 1,
      [TaskStatus.PENDING]: 2,
      [TaskStatus.COMPLETED]: 3,
      [TaskStatus.CANCELLED]: 4,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <FileText className="h-4 w-4" />
              <span className="font-medium">
                Công việc {milestoneTitle ? `- ${milestoneTitle}` : ""} (
                {totalTasks})
              </span>
            </div>
          </div>
          {totalTasks > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                {completedTasks}/{totalTasks} hoàn thành
              </div>
              <div className="w-16">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 border rounded-lg"
              >
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {/* Task Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-green-600">Hoàn thành</p>
                  <p className="font-semibold text-green-800">
                    {completedTasks}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <PlayCircle className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600">Đang làm</p>
                  <p className="font-semibold text-blue-800">
                    {inProgressTasks}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-yellow-600">Chờ làm</p>
                  <p className="font-semibold text-yellow-800">
                    {pendingTasks}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs text-red-600">Đã hủy</p>
                  <p className="font-semibold text-red-800">{cancelledTasks}</p>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {sortedTasks.map((task, _index) => (
                <Card key={task.id} className="border-l-4 border-l-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-mono text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                            #{task.index}
                          </span>
                          {getTaskStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-base leading-tight">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Hạn: {formatDate(task.dueDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Tạo: {formatDate(task.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Badge
                          variant="outline"
                          className={getTaskStatusColor(task.status)}
                        >
                          {getTaskStatusText(task.status)}
                        </Badge>
                        {task.status === TaskStatus.IN_PROGRESS && (
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-xs text-blue-600 font-medium">
                              Đang thực hiện
                            </div>
                            {!isLastMilestone && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkComplete(task.id)}
                                disabled={isUpdating}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                {isUpdating ? "Đang cập nhật..." : "Hoàn thành"}
                              </Button>
                            )}
                          </div>
                        )}
                        {task.status === TaskStatus.COMPLETED && (
                          <div className="text-xs text-green-600">
                            Hoàn thành: {formatDate(task.updatedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {currentUser?.role === UserRole.SHOP &&
              orderStatus !== "IN_PROCESS" && (
                <CreateTaskDialog
                  milestoneId={milestoneId}
                  trigger={
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm công việc
                    </Button>
                  }
                  onSuccess={fetchTasks}
                />
              )}

            {/* Progress Summary */}
            <Card className="bg-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tiến độ tổng thể</span>
                  <span className="text-sm font-semibold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{completedTasks} hoàn thành</span>
                  <span>{totalTasks} tổng cộng</span>
                </div>
              </CardContent>
            </Card>

            {/* Complaint Form - Chỉ hiển thị ở milestone cuối cùng khi đơn hàng IN_PROCESS và user là khách hàng */}
            {isLastMilestone &&
              orderStatus === "IN_PROCESS" &&
              orderId &&
              currentUser?.role === UserRole.CUSTOMER && (
                <ComplaintForm
                  orderId={orderId}
                  onSuccess={() => {
                    // Refresh data nếu cần
                    fetchTasks();
                  }}
                />
              )}
          </div>
        ) : (
          <Card className="flex items-center justify-center">
            {currentUser?.role === UserRole.SHOP &&
              orderStatus !== "IN_PROCESS" && (
                <CreateTaskDialog
                  milestoneId={milestoneId}
                  trigger={
                    <Button
                      className="w-fit justify-start bg-transparent"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm công việc
                    </Button>
                  }
                  onSuccess={fetchTasks}
                />
              )}
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Chưa có công việc</h3>
              <p className="text-muted-foreground">
                Chưa có công việc nào được tạo cho giai đoạn này.
              </p>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

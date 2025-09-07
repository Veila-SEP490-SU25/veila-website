"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { IMilestone, MilestoneStatus } from "@/services/types";
import {
  formatDateShort,
  getMilestoneStatusColor,
  getMilestoneStatusText,
} from "@/lib/order-util";
import { MilestoneTask } from "@/components/staff/orders/milestone-task";

interface MilestonesTabProps {
  milestones: IMilestone[];
  isMilestonesLoading: boolean;
}

const getMilestoneStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case MilestoneStatus.IN_PROGRESS:
      return <PlayCircle className="h-5 w-5 text-blue-600" />;
    case MilestoneStatus.CANCELLED:
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

export const MilestonesTab = ({
  milestones,
  isMilestonesLoading,
}: MilestonesTabProps ) => {
  if (isMilestonesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Chưa có giai đoạn nào</h3>
          <p className="text-muted-foreground">
            Các giai đoạn sẽ được tạo khi đơn hàng được xử lý.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getMilestoneStatusIcon(milestone.status)}
                <div>
                  <span className="text-lg">
                    Giai đoạn {milestone.index}: {milestone.title}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Hạn: {formatDateShort(milestone.dueDate)}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getMilestoneStatusColor(milestone.status)}
              >
                {getMilestoneStatusText(milestone.status)}
              </Badge>
            </CardTitle>
            {milestone.description && (
              <CardDescription className="text-base">
                {milestone.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <MilestoneTask
                milestoneId={milestone.id}
                milestoneTitle={milestone.title}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

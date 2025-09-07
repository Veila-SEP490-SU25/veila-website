import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IMilestone, MilestoneStatus } from '@/services/types';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface OrderProgressCardProps {
  milestones: IMilestone[];
}

export const OrderProgressCard = ({ milestones }: OrderProgressCardProps) => {
  const completedMilestones = milestones.filter(
    (m) => m.status === MilestoneStatus.COMPLETED,
  ).length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          <span>Tiến độ thực hiện</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Hoàn thành {completedMilestones}/{totalMilestones} giai đoạn
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          {totalMilestones === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Chưa có giai đoạn nào được thiết lập cho đơn hàng này.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

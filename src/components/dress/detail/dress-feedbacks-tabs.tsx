import { FeedbackCard } from "@/components/dress/detail/feedback-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDress } from "@/services/types";

interface DressFeedbackTabsProps {
  dress: IDress;
}

export const DressFeedbackTabs = ({ dress }: DressFeedbackTabsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá từ khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        {dress.feedbacks && dress.feedbacks.length > 0 ? (
          <div className="space-y-6">
            {dress.feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedbackId={feedback.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import { getImages } from "@/lib/products-utils";
import { IDress } from "@/services/types";

interface DressFeedbackTabsProps {
  dress: IDress;
}

export const DressFeedbackTabs = ({ dress }: DressFeedbackTabsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Đánh giá từ khách hàng ({dress.feedbacks?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dress.feedbacks && dress.feedbacks.length > 0 ? (
          <div className="space-y-6">
            {dress.feedbacks.map((feedback) => (
              <Card key={feedback.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={feedback.customer?.avatarUrl || "/placeholder.svg"}
                        alt={feedback.customer?.username || "Khách hàng"}
                      />
                      <AvatarFallback className="bg-rose-100 text-rose-600">
                        {feedback.customer?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "K"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">
                            {feedback.customer?.username ||
                              "Khách hàng ẩn danh"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700"
                          >
                            {feedback.rating}/5
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Number(feedback.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {feedback.content}
                      </p>

                      {feedback.images && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {getImages(feedback.images).map((url, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                            >
                              <Image
                                alt={`Hình ảnh đánh giá ${index + 1}`}
                                src={url || "/placeholder.svg"}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có đánh giá nào
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Sản phẩm này chưa nhận được đánh giá từ khách hàng. Hãy là người
              đầu tiên đánh giá!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

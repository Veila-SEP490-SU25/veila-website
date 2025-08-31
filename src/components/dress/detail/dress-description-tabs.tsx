import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImages } from "@/lib/products-utils";
import { IDress } from "@/services/types";

interface DressDescriptionTabsProps {
  dress: IDress;
}

export const DressDescriptionTabs = ({ dress }: DressDescriptionTabsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mô tả sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {dress.description || "Không có mô tả chi tiết cho sản phẩm này."}
          </p>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Thông tin sản phẩm</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="outline">{dress.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Có thể mua:</span>
                <span>{dress.isSellable ? "Có" : "Không"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Có thể thuê:</span>
                <span>{dress.isRentable ? "Có" : "Không"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng ảnh:</span>
                <span>{getImages(dress.images).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chất liệu:</span>
                <span>{dress.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Màu sắc:</span>
                <span>{dress.color}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-transparent">mmmm</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số đo ngực:</span>
                <span>{dress.bust} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số đo eo:</span>
                <span>{dress.waist} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số đo hông:</span>
                <span>{dress.hip} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ dài:</span>
                <span>{dress.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loại cổ áo:</span>
                <span>{dress.neckline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loại tay váy:</span>
                <span>{dress.sleeve}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

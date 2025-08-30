import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { IOrderDressDetail } from "@/services/types";
import {
  Ruler,
  Weight,
  User,
  Shirt,
  MinusCircle as Muscle,
  Circle,
} from "lucide-react";

interface MeasurementsTabProps {
  currentOrderDressDetail: IOrderDressDetail | null;
}

export const MeasurementsTab = ({
  currentOrderDressDetail,
}: MeasurementsTabProps) => {
  if (!currentOrderDressDetail) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Ruler className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Không yêu cầu số đo</h3>
          <p className="text-muted-foreground">
            Đơn hàng này không cần thông tin số đo cơ thể.
          </p>
        </CardContent>
      </Card>
    );
  }

  const measurements = [
    {
      label: "Chiều cao",
      value: currentOrderDressDetail.height,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Cân nặng",
      value: currentOrderDressDetail.weight,
      unit: "kg",
      icon: <Weight className="h-4 w-4 text-green-500" />,
    },
    {
      label: "Vòng ngực",
      value: currentOrderDressDetail.bust,
      unit: "cm",
      icon: <User className="h-4 w-4 text-purple-500" />,
    },
    {
      label: "Vòng eo",
      value: currentOrderDressDetail.waist,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-orange-500" />,
    },
    {
      label: "Vòng hông",
      value: currentOrderDressDetail.hip,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-pink-500" />,
    },
    {
      label: "Nách",
      value: currentOrderDressDetail.armpit,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-indigo-500" />,
    },
    {
      label: "Bắp tay",
      value: currentOrderDressDetail.bicep,
      unit: "cm",
      icon: <Muscle className="h-4 w-4 text-red-500" />,
    },
    {
      label: "Cổ",
      value: currentOrderDressDetail.neck,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-teal-500" />,
    },
    {
      label: "Vai",
      value: currentOrderDressDetail.shoulderWidth,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-cyan-500" />,
    },
    {
      label: "Tay áo",
      value: currentOrderDressDetail.sleeveLength,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-amber-500" />,
    },
    {
      label: "Dài lưng",
      value: currentOrderDressDetail.backLength,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: "Eo thấp",
      value: currentOrderDressDetail.lowerWaist,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-violet-500" />,
    },
    {
      label: "Eo xuống sàn",
      value: currentOrderDressDetail.waistToFloor,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-rose-500" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Ruler className="h-5 w-5" />
          <span>Số đo cơ thể</span>
        </CardTitle>
        <CardDescription>
          Thông tin số đo chi tiết cho việc may đo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {measurements.map((measurement) => (
            <div
              key={measurement.label}
              className="p-3 border rounded-lg bg-gray-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                {measurement.icon}
                <label className="text-sm font-medium text-muted-foreground">
                  {measurement.label}
                </label>
              </div>
              <p className="font-semibold text-lg">
                {measurement.value ? (
                  <span className="text-blue-600">
                    {measurement.value} {measurement.unit}
                  </span>
                ) : (
                  <span className="text-gray-400">Chưa đo</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

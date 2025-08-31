import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const ErrorCard = ({ message }: { message: string }) => {
  return (
    <Alert variant={"destructive"} className="mb-4 h-full">
      <AlertCircleIcon />
      <AlertTitle>Đã có lỗi xảy ra trong quá trình lấy dữ liệu</AlertTitle>
      <AlertDescription>
        <p>Chi tiết lỗi:</p>
        <ul className="list-inside list-disc text-sm">
          <li>{message}</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

import { PlaceholderImage } from "@/components/placeholder-image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Xác thực tài khoản",
  description: "Xác thực tài khoản của bạn",
};

const VerifyOtpLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="max-h-[95vh] shadow-xl overflow-hidden border-0 max-w-[80vw] w-[80vw] md:w-3xl h-fit p-0 grid grid-cols-1 md:grid-cols-2 gap-2 absolute top-1/2 left-1/2 -translate-1/2">
      <CardHeader className="w-full col-span-1 p-0 hidden md:block">
          <PlaceholderImage className="w-full h-full" />
      </CardHeader>
      <CardContent className="w-full col-span-1 p-0">{children}</CardContent>
    </Card>
  );
};

export default VerifyOtpLayout;

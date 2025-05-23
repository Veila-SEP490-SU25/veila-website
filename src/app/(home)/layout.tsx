import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Veila - Trang chủ",
}

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full">{children}</div>;
};

export default HomeLayout;

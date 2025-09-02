import { Header } from "@/components/header/header";
import { ShopStatusGuard } from "@/components/shops/shop-status-guard";
import { Metadata } from "next";
import { ReactNode } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";

export const metadata: Metadata = {
  title: "Veila - Trang chủ",
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutWrapper>
      <div className="w-full relative">
        <Header />
        <ShopStatusGuard>{children}</ShopStatusGuard>
      </div>
    </LayoutWrapper>
  );
};

export default HomeLayout;

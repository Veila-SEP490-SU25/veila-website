import Footer from "@/components/footer";
import { Header } from "@/components/header/header";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Veila - Trang chủ",
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;

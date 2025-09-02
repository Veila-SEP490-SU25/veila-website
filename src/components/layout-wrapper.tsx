"use client";

import { useAuth } from "@/providers/auth.provider";
import { UserRole } from "@/services/types";
import Footer from "./footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { currentUser } = useAuth();
  const isShop = currentUser?.role === UserRole.SHOP;

  return (
    <>
      {children}
      {!isShop && <Footer />}
    </>
  );
};

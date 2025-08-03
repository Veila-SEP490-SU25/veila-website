"use client";

import { UserNav } from "@/components/header/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-playfair">
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/browse"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Duyệt Váy Cưới
        </Link>
        <Link
          href="/designers"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Tìm Nhà Thiết Kế
        </Link>
        <Link
          href="/services"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Dịch Vụ
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Giới Thiệu
        </Link>
        <Link
          href="/shop/register"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Cửa Hàng Của Tôi
        </Link>
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] font-playfair">
          <div className="flex flex-col space-y-4 mt-8 p-3">
            <Link
              href="/browse"
              className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Duyệt Váy Cưới
            </Link>
            <Link
              href="/designers"
              className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tìm Nhà Thiết Kế
            </Link>
            <Link
              href="/services"
              className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dịch Vụ
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Giới Thiệu
            </Link>
            <Link
              href="/shop/register"
              className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cửa Hàng Của Tôi
            </Link>
            <UserNav />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

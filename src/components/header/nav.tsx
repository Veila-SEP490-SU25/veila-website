"use client";

import { UserNav } from "@/components/header/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UnreadBadge } from "@/components/chat/unread-badge";

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="font-playfair">
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Trang chủ
        </Link>
        <Link
          href="/browse"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Duyệt Váy Cưới
        </Link>
        <Link
          href="/shops"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Tìm Cửa Hàng
        </Link>
        <Link
          href="/blog"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Bài Viết
        </Link>
        <Link
          href="/shops/my"
          className="text-gray-700 hover:text-crimson-700 transition-colors"
        >
          Cửa Hàng Của Tôi
        </Link>
        <Link
          href="/chat"
          className="text-gray-700 hover:text-crimson-700 transition-colors relative"
        >
          Tin Nhắn
          <UnreadBadge />
        </Link>
      </nav>

      {isMounted ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] font-playfair"
          >
            <div className="flex flex-col space-y-4 mt-8 p-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-crimson-700 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/browse"
                className="text-gray-700 hover:text-crimson-700 transition-colors"
              >
                Duyệt Váy Cưới
              </Link>
              <Link
                href="/shops"
                className="text-gray-700 hover:text-crimson-700 transition-colors"
              >
                Tìm Cửa Hàng
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-crimson-700 transition-colors"
              >
                Bài Viết
              </Link>
              <Link
                href="/shops/my"
                className="text-gray-700 hover:text-crimson-700 transition-colors"
              >
                Cửa Hàng Của Tôi
              </Link>
              <Link
                href="/chat"
                className="text-gray-700 hover:text-crimson-700 transition-colors relative"
              >
                <MessageCircle className="h-4 w-4 inline mr-1" />
                Tin Nhắn
                <UnreadBadge />
              </Link>
              <UserNav />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="md:hidden">
          <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
        </div>
      )}
    </div>
  );
};

"use client";

import { TextLogo } from "@/components/text-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth.provider";
import { UserRole } from "@/services/types";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Store,
  TrendingUpDown,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const allowedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF];

const staffRoutes = [
  {
    name: "Tổng Quan",
    href: "/staff",
    icon: LayoutDashboard,
  },
  {
    name: "Cửa Hàng",
    href: "/staff/shops",
    icon: Store,
  },
  {
    name: "Blog",
    href: "/staff/blogs",
    icon: FileText,
  },
  {
    name: "Khiếu Nại",
    href: "/staff/complaints",
    icon: MessageSquare,
  },
  {
    name: "Cài Đặt",
    href: "/staff/settings",
    icon: Settings,
  },
];

const adminRoutes = [
  {
    name: "Tổng Quan",
    href: "/staff",
    icon: LayoutDashboard,
  },
  {
    name: "Cửa Hàng",
    href: "/staff/shops",
    icon: Store,
  },
  {
    name: "Giao Dịch",
    href: "/staff/transactions",
    icon: TrendingUpDown,
  },
  {
    name: "Blog",
    href: "/staff/blogs",
    icon: FileText,
  },
  {
    name: "Khiếu Nại",
    href: "/staff/complaints",
    icon: MessageSquare,
  },
  {
    name: "Người Dùng",
    href: "/staff/users",
    icon: Users,
  },
  {
    name: "Báo Cáo",
    href: "/staff/analytics",
    icon: BarChart3,
  },
  {
    name: "Cài Đặt",
    href: "/staff/settings",
    icon: Settings,
  },
];

export const Navigation = ({ children }: { children: ReactNode }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [routes, setRoutes] = useState<typeof staffRoutes>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/staff") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
  // Wait for auth to be loaded
  if (!isAuthenticated || !currentUser) return;

  // Block non-admin/staff users
  if (!allowedRoles.includes(currentUser.role)) {
    toast.error("Bạn không có quyền truy cập vào trang này.");
    router.replace("/"); // ✅ Use replace to avoid stacking history
    return;
  }

  // Set sidebar routes based on role
  if (currentUser.role === UserRole.STAFF) {
    setRoutes(staffRoutes);
  } else {
    setRoutes(adminRoutes);
  }
}, [currentUser, router, isAuthenticated]);


  return (
    <div className="min-h-screen">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 border-b items-center justify-center">
              <TextLogo />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {routes.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-rose-100 text-rose-700"
                        : "text-gray-600 hover:bg-rose-100 hover:text-rose-700"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>

        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex h-16 border-b items-center justify-center">
              <TextLogo />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {routes.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-rose-100 text-rose-700"
                        : "text-gray-600 hover:bg-rose-100 hover:text-rose-700"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-rose-100 text-rose-600">
                    {currentUser?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.firstName} {currentUser?.middleName}{" "}
                    {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email}
                  </p>
                </div>
                <Button
                  variant="link"
                  size="icon"
                  onClick={logout}
                  className="hover:cursor-pointer hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="md:pl-64">
          <div className="md:hidden flex items-center justify-between flex-1">
            <SheetTrigger asChild className="">
              <Button
                variant="link"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <TextLogo />
          </div>
          <main className="flex-1 md:p-6">{children}</main>
        </div>
      </Sheet>
    </div>
  );
};

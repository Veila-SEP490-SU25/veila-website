"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth.provider";
import { LogOut, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserNav: React.FC = () => {
  const { currentUser, isAuthenticating, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (isAuthenticating) {
    return (
      <div className="flex items-center space-x-1">
        <div className="h-8 w-20 animate-pulse bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return isAuthenticated && currentUser ? (
    <div className="flex items-center space-x-1">
      <Button
        variant="link"
        className="hover:cursor-pointer"
        onClick={() => router.push("/profile")}
      >
        <User2 className="h-5 w-5 text-gray-700" />
        <span className="inline-block">
          {[currentUser.firstName, currentUser.middleName, currentUser.lastName]
            .filter(Boolean)
            .join(" ") || "User"}
        </span>
      </Button>
      <Button
        variant="link"
        size="icon"
        onClick={logout}
        className="hover:cursor-pointer hover:text-red-600"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  ) : (
    <Button
      disabled={isAuthenticating}
      onClick={() => {
        router.push("/login");
      }}
      className="bg-maroon-400 text-white hover:bg-maroon-400/50 cursor-pointer rounded-full w-fit px-10 py-2"
    >
      Đăng nhập
    </Button>
  );
};

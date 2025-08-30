"use client";

import { useAuth } from "@/providers/auth.provider";
import { UserRole } from "@/services/types";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

type RouteContextType = unknown;

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAuthenticating, currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const _normalRoles = [UserRole.CUSTOMER, UserRole.SHOP];
  const adminRoles = useMemo(
    () => [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF],
    []
  );

  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      if (currentUser && currentUser.role) {
        if (adminRoles.includes(currentUser.role)) {
          if (!pathname.startsWith("/staff")) {
            router.push("/staff");
          } else return;
        } else {
          if (pathname.startsWith("/staff")) {
            router.push("/");
          } else return;
        }
      }
    }
  }, [
    isAuthenticating,
    isAuthenticated,
    pathname,
    router,
    adminRoles,
    currentUser,
  ]);

  return (
    <RouteContext.Provider value={undefined}>{children}</RouteContext.Provider>
  );
};

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

const RouteContext = createContext<null>(null);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (context === null) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAuthenticating, currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const adminRoles = useMemo(
    () => [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF],
    []
  );

  useEffect(() => {
    if (
      isAuthenticating ||
      !isAuthenticated ||
      !pathname ||
      !currentUser ||
      !currentUser.role
    ) {
      return;
    }

    const isAdmin = adminRoles.includes(currentUser.role);
    const isOnStaffRoute = pathname.startsWith("/staff");
    
    // ✅ Only redirect if not already on the correct route
    if (isAdmin && !isOnStaffRoute) {
      router.replace("/staff"); // Use replace to prevent history stacking
    } else if (!isAdmin && isOnStaffRoute) {
      router.replace("/"); // Redirect normal users away from staff
    }

  }, [
    isAuthenticated,
    isAuthenticating,
    pathname,
    currentUser,
    adminRoles,
    router,
  ]);

  return (
    <RouteContext.Provider value={null}>
      {children}
    </RouteContext.Provider>
  );
};

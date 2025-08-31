"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth.provider";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { useCallback } from "react";

export const UserCard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
=======
import { Skeleton } from "@/components/ui/skeleton";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";

export const UserCard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { openPopup } = useVerifyPhonePopup();
>>>>>>> Stashed changes

  const goToPhoneVerify = useCallback(() => {
    openPopup();
  }, [openPopup]);

  return currentUser ? (
    <Card className="w-full h-full">
      <CardContent className="p-6">
        <div className="grid items-center space-x-4 grid-cols-5">
          <Avatar className="w-16 h-16 aspect-square col-span-1">
            <AvatarImage
              className="aspect-square"
              src={currentUser.avatarUrl || "/placeholder.svg"}
            />
            <AvatarFallback className="bg-rose-100 text-rose-600 aspect-square">
              {(currentUser.firstName?.charAt(0) || "") +
                (currentUser.lastName?.charAt(0) || "") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="col-span-4 space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {currentUser.firstName} {currentUser.middleName}{" "}
              {currentUser.lastName}
              <Badge className="" variant="info">
                {currentUser.role}
              </Badge>
            </h3>
            {currentUser.isIdentified ? (
              <Badge
                className="w-fit text-wrap block h-fit cursor-pointer"
                variant="success"
              >
                Đã xác minh
              </Badge>
            ) : (
              <Badge
                className="w-fit text-wrap block h-fit cursor-pointer"
                variant="danger"
                onClick={goToPhoneVerify}
              >
                Vui lòng nhấn vào đây để xác thực số điện thoại
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <VerifyPhonePopup />
    </Card>
  ) : (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={"/placeholder.svg"} />
            <AvatarFallback className="bg-rose-100 text-rose-600">
              {"U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">User</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

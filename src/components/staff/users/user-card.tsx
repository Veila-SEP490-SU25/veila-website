import { DeleteUserDialog } from "@/components/staff/users/delete-user-dialog";
import { RestoreUserDialog } from "@/components/staff/users/restore-user-dialog";
import { UpdateUserDialog } from "@/components/staff/users/update-user-dialog";
import { UpdateUserStatusDialog } from "@/components/staff/users/update-user-status-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/order-util";
import { cn } from "@/lib/utils";
import { formatPhoneNumber } from "@/lib/utils/user-utils";
import { IUser, UserRole, UserStatus } from "@/services/types";
import {
  ArchiveRestore,
  Ban,
  Cake,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Trash,
} from "lucide-react";
import Image from "next/image";

interface UserCardProps {
  user: IUser;
  onUpdate: () => void;
}

const StatusBadge = ({ status }: { status: UserStatus }) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500 rounded-full">
          Hoạt động
        </Badge>
      );
    case UserStatus.INACTIVE:
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500 rounded-full">
          Ngừng hoạt động
        </Badge>
      );
    case UserStatus.BANNED:
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500 rounded-full">
          Bị cấm
        </Badge>
      );
    case UserStatus.SUSPENDED:
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500 rounded-full">
          Bị đình chỉ
        </Badge>
      );
    default:
      return null;
  }
};

const RoleBadge = ({ role }: { role: UserRole }) => {
  switch (role) {
    case UserRole.ADMIN:
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500 rounded-full">
          Quản trị viên
        </Badge>
      );
    case UserRole.STAFF:
      return (
        <Badge className="bg-sky-500/10 text-sky-500 border-sky-500 rounded-full">
          Nhân viên
        </Badge>
      );
    case UserRole.CUSTOMER:
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500 rounded-full">
          Khách hàng
        </Badge>
      );
    case UserRole.SHOP:
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500 rounded-full">
          Chủ cửa hàng
        </Badge>
      );
    default:
      break;
  }
};

export const UserCard = ({ user, onUpdate }: UserCardProps) => {
  return (
    <Card className="w-full h-full bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-0 pt-1 hover:shadow-lg overflow-hidden">
      <div className="bg-white rounded-t-lg space-y-4 w-full h-full overflow-hidden pb-4">
        <div className="w-full relative mb-[16.66%]">
          {user.deletedAt ? (
            <RestoreUserDialog user={user} onUpdate={onUpdate}>
              <Button
                className="absolute top-2 right-2 bg-emerald-500 text-white hover:bg-emerald-700"
                size="icon"
              >
                <ArchiveRestore />
              </Button>
            </RestoreUserDialog>
          ) : (
            <DeleteUserDialog user={user} onUpdate={onUpdate}>
              <Button
                className="absolute top-2 right-2 bg-rose-500 text-white hover:bg-rose-700"
                size="icon"
              >
                <Trash />
              </Button>
            </DeleteUserDialog>
          )}
          <Image
            src={user.coverUrl || "/placeholder.svg"}
            alt={user.username}
            layout="responsive"
            width={500}
            height={300}
            className="size-full object-cover aspect-[2/1]"
          />
          <div
            className={cn(
              "w-1/3 aspect-square absolute z-10 rounded-full border-4",
              "overflow-hidden bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2",
              `border-white`
            )}
          >
            <Avatar className="size-full relative">
              <AvatarImage
                src={user.avatarUrl || ""}
                alt="Shop Avatar"
                className="size-full object-cover"
              />
              <AvatarFallback className="size-full text-7xl">
                {user.username.toUpperCase().charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <CardTitle className="text-center">
            {user.firstName} {user.middleName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-center">
            {user.username}
          </CardDescription>
        </div>
        <div className="w-full items-center justify-center gap-1 flex">
          <RoleBadge role={user.role} /> <StatusBadge status={user.status} />{" "}
          {user.isVerified ? (
            <ShieldCheck className="size-4 text-emerald-500" />
          ) : (
            <Shield className="size-4 text-gray-500" />
          )}
          {user.isIdentified ? (
            <ShieldCheck className="size-4 text-emerald-500" />
          ) : (
            <Shield className="size-4 text-gray-500" />
          )}
        </div>
        <div className="space-y-2 px-4">
          <div className="flex items-center w-full justify-between">
            <Mail className="size-4 text-rose-500" />
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>

          <div className="flex items-center w-full justify-between">
            <Phone className="size-4 text-rose-500" />
            <span className="text-sm text-muted-foreground">
              {user.phone && formatPhoneNumber(user.phone)}
            </span>
          </div>

          <div className="flex items-start w-full justify-between">
            <MapPin className="size-4 text-rose-500" />
            <span className="text-sm text-muted-foreground max-w-[80%] truncate">
              {user.address}
            </span>
          </div>

          <div className="flex items-start w-full justify-between">
            <Cake className="size-4 text-rose-500" />
            <span className="text-sm text-muted-foreground max-w-[80%] truncate">
              {user.birthDate && formatDate(user.birthDate)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 gap-2">
          <UpdateUserDialog onUpdate={onUpdate} user={user}>
            <Button
              variant="outline"
              className=" flex items-center justify-center gap-2"
            >
              <Edit3 className="size-4" />
              Cập nhật
            </Button>
          </UpdateUserDialog>

          {user.status === UserStatus.ACTIVE ||
          user.status === UserStatus.INACTIVE ? (
            <div className="flex items-center justify-center gap-2">
              <UpdateUserStatusDialog
                user={user}
                status={UserStatus.SUSPENDED}
                onUpdate={onUpdate}
                title="Hạn chế người dùng"
                description="Bạn có chắc chắn muốn hạn chế người dùng này không?"
                successMessage="Hạn chế người dùng thành công"
              >
                <Button
                  variant="outline"
                  className=" flex items-center justify-center gap-2 border-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                >
                  <Ban className="size-4" />
                  Hạn chế
                </Button>
              </UpdateUserStatusDialog>
              <UpdateUserStatusDialog
                user={user}
                status={UserStatus.BANNED}
                onUpdate={onUpdate}
                title="Cấm người dùng"
                description="Bạn có chắc chắn muốn cấm người dùng này không?"
                successMessage="Cấm người dùng thành công"
              >
                <Button
                  variant="outline"
                  className=" flex items-center justify-center gap-2 border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                >
                  <Ban className="size-4" />
                  Cấm
                </Button>
              </UpdateUserStatusDialog>
            </div>
          ) : user.status === UserStatus.SUSPENDED ? (
            <UpdateUserStatusDialog
              user={user}
              status={UserStatus.ACTIVE}
              onUpdate={onUpdate}
              title="Ngừng hạn chế người dùng"
              description="Bạn có chắc chắn muốn ngừng hạn chế người dùng này không?"
              successMessage="Ngừng hạn chế người dùng thành công"
            >
              <Button
                variant="outline"
                className=" flex items-center justify-center gap-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
              >
                <Ban className="size-4" />
                Ngừng hạn chế
              </Button>
            </UpdateUserStatusDialog>
          ) : (
            <UpdateUserStatusDialog
              user={user}
              status={UserStatus.ACTIVE}
              onUpdate={onUpdate}
              title="Ngừng cấm người dùng"
              description="Bạn có chắc chắn muốn ngừng cấm người dùng này không?"
              successMessage="Ngừng cấm người dùng thành công"
            >
              <Button
                variant="outline"
                className=" flex items-center justify-center gap-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
              >
                <Ban className="size-4" />
                Ngừng cấm
              </Button>
            </UpdateUserStatusDialog>
          )}
        </div>
      </div>
    </Card>
  );
};

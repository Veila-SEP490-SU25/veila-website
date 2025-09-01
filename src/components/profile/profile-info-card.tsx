"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/image";
import { useAuth } from "@/providers/auth.provider";
import { Calendar, MapPin, Mail, Phone, User } from "lucide-react";

export const ProfileInfoCard: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Đang tải thông tin...</p>
        </CardContent>
      </Card>
    );
  }

  const getFullName = () => {
    const parts = [
      currentUser.firstName,
      currentUser.middleName,
      currentUser.lastName,
    ].filter(Boolean);
    return parts.join(" ") || "Chưa có tên";
  };

  const getInitials = () => {
    const parts = [
      currentUser.firstName?.charAt(0),
      currentUser.middleName?.charAt(0),
      currentUser.lastName?.charAt(0),
    ].filter(Boolean);
    return parts.join("").toUpperCase() || "U";
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Chưa cập nhật";
    try {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Chưa cập nhật";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {currentUser.coverUrl && (
        <Card>
          <CardContent className="p-0">
            <div className="relative h-48">
              <Image
                src={currentUser.coverUrl}
                alt="Cover"
                className="w-full h-full object-cover rounded-t-lg"
                width={800}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser.avatarUrl || ""} />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {getFullName()}
                </h3>
                <p className="text-gray-600">
                  @{currentUser.username || "user"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentUser.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    ✓ Đã xác thực
                  </Badge>
                )}
                {currentUser.role && (
                  <Badge variant="outline">{currentUser.role}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {currentUser.email || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">
                  {currentUser.phone || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-medium">
                  {formatDate(currentUser.birthDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium">
                  {currentUser.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

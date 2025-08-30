"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image } from "@/components/image";
import { useAuth } from "@/providers/auth.provider";
import { IUser, IUpdateProfile } from "@/services/types";
import { useUpdateProfileMutation } from "@/services/apis/auth.api";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { LocationInput } from "@/components/location-input";
import { PhoneVerification } from "@/components/phone-verification";
import { toast } from "sonner";
import { Camera, Save, X, Phone, CheckCircle } from "lucide-react";

interface ProfileEditFormProps {
  onSave?: (user: IUser) => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onSave }) => {
  const { currentUser, reloadProfile } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    birthDate: "",
    avatarUrl: "",
    coverUrl: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        middleName: currentUser.middleName || "",
        lastName: currentUser.lastName || "",
        address: currentUser.address || "",
        birthDate: currentUser.birthDate
          ? new Date(currentUser.birthDate).toISOString().split("T")[0]
          : "",
        avatarUrl: currentUser.avatarUrl || "",
        coverUrl: currentUser.coverUrl || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName?.trim()) {
      toast.error("Vui lòng nhập tên!");
      return;
    }

    if (!formData.lastName?.trim()) {
      toast.error("Vui lòng nhập họ!");
      return;
    }

    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13 || age > 120) {
        toast.error("Ngày sinh không hợp lệ! Tuổi phải từ 13-120.");
        return;
      }
    }

    try {
      if (!formData.firstName?.trim()) {
        toast.error("Vui lòng nhập tên!");
        return;
      }

      if (!formData.lastName?.trim()) {
        toast.error("Vui lòng nhập họ!");
        return;
      }

      // Validate birthDate format
      if (formData.birthDate) {
        try {
          const birthDate = new Date(formData.birthDate);
          if (isNaN(birthDate.getTime())) {
            toast.error("Ngày sinh không hợp lệ!");
            return;
          }
        } catch {
          toast.error("Ngày sinh không hợp lệ!");
          return;
        }
      }

      const updateData: IUpdateProfile = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName?.trim() || null,
        lastName: formData.lastName.trim(),
        address: formData.address?.trim() || null,
        birthDate: formData.birthDate
          ? new Date(formData.birthDate).toISOString().split("T")[0]
          : null,
        avatarUrl: formData.avatarUrl?.trim() || null,
        coverUrl: formData.coverUrl?.trim() || null,
      };

      console.log("Sending update data:", JSON.stringify(updateData, null, 2));
      console.log("birthDate format:", updateData.birthDate);

      const response = await updateProfile(updateData).unwrap();

      toast.success("Cập nhật thông tin thành công!");
      setShowEditForm(false);

      if (reloadProfile) {
        reloadProfile();
      }

      if (onSave) {
        onSave(response.item);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        error: error?.error,
      });

      let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin!";

      if (error?.data?.message) {
        errorMessage = String(error.data.message);
      } else if (error?.error?.data?.message) {
        errorMessage = String(error.error.data.message);
      } else if (error?.message) {
        errorMessage = String(error.message);
      } else if (error?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau!";
      } else if (error?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!";
      } else if (error?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        middleName: currentUser.middleName || "",
        lastName: currentUser.lastName || "",
        address: currentUser.address || "",
        birthDate: currentUser.birthDate
          ? new Date(currentUser.birthDate).toISOString().split("T")[0]
          : "",
        avatarUrl: currentUser.avatarUrl || "",
        coverUrl: currentUser.coverUrl || "",
      });
    }
    setShowEditForm(false);
  };

  const getFullName = () => {
    const parts = [
      formData.firstName,
      formData.middleName,
      formData.lastName,
    ].filter(Boolean);
    return parts.join(" ") || "Chưa có tên";
  };

  const getInitials = () => {
    const parts = [
      formData.firstName?.charAt(0),
      formData.middleName?.charAt(0),
      formData.lastName?.charAt(0),
    ].filter(Boolean);
    return parts.join("").toUpperCase() || "U";
  };

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <div className="h-48 bg-gradient-to-r from-rose-100 to-pink-100 animate-pulse"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showEditForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            Chỉnh sửa thông tin
          </Button>
        </div>
        <ProfileInfoCard />
      </div>
    );
  }

  // Show phone verification modal
  if (showPhoneVerification) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <PhoneVerification
            phone={currentUser.phone || ""}
            onSuccess={() => {
              setShowPhoneVerification(false);
              if (reloadProfile) {
                reloadProfile();
              }
              toast.success("Xác thực số điện thoại thành công!");
            }}
            onCancel={() => setShowPhoneVerification(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-r from-rose-100 to-pink-100">
            {formData.coverUrl && (
              <Image
                src={formData.coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
                width={800}
                height={300}
              />
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button variant="secondary" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Thay đổi ảnh bìa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chỉnh sửa thông tin cá nhân</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatarUrl || ""} />
                <AvatarFallback className="text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Tên *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Nhập tên"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Tên đệm</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    placeholder="Nhập tên đệm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Họ *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Nhập họ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={getFullName()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={currentUser.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <LocationInput
              location={formData.address}
              setLocation={(address) => handleInputChange("address", address)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Tên đăng nhập</Label>
              <Input
                value={currentUser.username || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <div className="flex gap-2">
                <Input
                  value={currentUser.phone || ""}
                  disabled
                  className="bg-gray-50 flex-1"
                />
                {!currentUser.isIdentified && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPhoneVerification(true)}
                    className="shrink-0"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Xác thực
                  </Button>
                )}
                {currentUser.isIdentified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Đã xác thực
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

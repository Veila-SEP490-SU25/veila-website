"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Mail, Globe, Database, Store, CreditCard, Save, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Veila",
    siteDescription: "Nền tảng váy cưới hàng đầu Việt Nam",
    contactEmail: "support@veila.com",
    contactPhone: "+84 (028) 123-4567",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // Business Settings
    commissionRate: "5",
    minOrderAmount: "500000",
    maxOrderAmount: "50000000",
    autoApproveShops: false,

    // Payment Settings
    paymentMethods: ["credit_card", "bank_transfer", "momo", "zalopay"],
    refundPolicy: "7",

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    // Simulate API call
    console.log("Saving settings:", settings)
    // Show success message
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
          <p className="text-gray-600 mt-2">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700">
          <Save className="h-4 w-4 mr-2" />
          Lưu Thay Đổi
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="security">Bảo Mật</TabsTrigger>
          <TabsTrigger value="business">Kinh Doanh</TabsTrigger>
          <TabsTrigger value="payment">Thanh Toán</TabsTrigger>
          <TabsTrigger value="system">Hệ Thống</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Thông Tin Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Tên Website</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Mô Tả Website</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Thông Tin Liên Hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Email Liên Hệ</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Số Điện Thoại</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài Đặt Thông Báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông Báo Email</Label>
                  <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông Báo SMS</Label>
                  <p className="text-sm text-gray-600">Nhận thông báo qua SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông Báo Push</Label>
                  <p className="text-sm text-gray-600">Nhận thông báo đẩy trên trình duyệt</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Marketing</Label>
                  <p className="text-sm text-gray-600">Nhận email khuyến mãi và tin tức</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Bảo Mật Tài Khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Xác Thực 2 Bước</Label>
                    <p className="text-sm text-gray-600">Bật xác thực 2 bước cho tài khoản admin</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Thời Gian Hết Phiên (phút)</Label>
                  <Select
                    value={settings.sessionTimeout}
                    onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 phút</SelectItem>
                      <SelectItem value="30">30 phút</SelectItem>
                      <SelectItem value="60">1 giờ</SelectItem>
                      <SelectItem value="120">2 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Hết Hạn Mật Khẩu (ngày)</Label>
                  <Select
                    value={settings.passwordExpiry}
                    onValueChange={(value) => handleSettingChange("passwordExpiry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 ngày</SelectItem>
                      <SelectItem value="60">60 ngày</SelectItem>
                      <SelectItem value="90">90 ngày</SelectItem>
                      <SelectItem value="never">Không bao giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Cài Đặt Kinh Doanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commissionRate">Tỷ Lệ Hoa Hồng (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleSettingChange("commissionRate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="minOrderAmount">Giá Trị Đơn Hàng Tối Thiểu (₫)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => handleSettingChange("minOrderAmount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxOrderAmount">Giá Trị Đơn Hàng Tối Đa (₫)</Label>
                  <Input
                    id="maxOrderAmount"
                    type="number"
                    value={settings.maxOrderAmount}
                    onChange={(e) => handleSettingChange("maxOrderAmount", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tự Động Duyệt Cửa Hàng</Label>
                    <p className="text-sm text-gray-600">Tự động phê duyệt cửa hàng mới</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveShops}
                    onCheckedChange={(checked) => handleSettingChange("autoApproveShops", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cài Đặt Thanh Toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Phương Thức Thanh Toán</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { id: "credit_card", label: "Thẻ Tín Dụng" },
                    { id: "bank_transfer", label: "Chuyển Khoản" },
                    { id: "momo", label: "MoMo" },
                    { id: "zalopay", label: "ZaloPay" },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={method.id}
                        checked={settings.paymentMethods.includes(method.id)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...settings.paymentMethods, method.id]
                            : settings.paymentMethods.filter((m) => m !== method.id)
                          handleSettingChange("paymentMethods", methods)
                        }}
                      />
                      <Label htmlFor={method.id}>{method.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="refundPolicy">Chính Sách Hoàn Tiền (ngày)</Label>
                <Select
                  value={settings.refundPolicy}
                  onValueChange={(value) => handleSettingChange("refundPolicy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 ngày</SelectItem>
                    <SelectItem value="7">7 ngày</SelectItem>
                    <SelectItem value="14">14 ngày</SelectItem>
                    <SelectItem value="30">30 ngày</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cài Đặt Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chế Độ Bảo Trì</Label>
                    <p className="text-sm text-gray-600">Tạm khóa truy cập website</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chế Độ Debug</Label>
                    <p className="text-sm text-gray-600">Hiển thị thông tin debug</p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bật Cache</Label>
                    <p className="text-sm text-gray-600">Sử dụng cache để tăng tốc</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange("cacheEnabled", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Tần Suất Sao Lưu</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Mỗi giờ</SelectItem>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Cảnh Báo Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Cảnh báo</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Một số thay đổi có thể ảnh hưởng đến hoạt động của hệ thống. Vui lòng cân nhắc kỹ trước khi lưu.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    Hệ thống hoạt động bình thường
                  </Badge>
                  <Badge variant="outline" className="text-blue-700 border-blue-200">
                    Phiên bản: v2.1.0
                  </Badge>
                  <Badge variant="outline" className="text-purple-700 border-purple-200">
                    Cập nhật cuối: 25/01/2024
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

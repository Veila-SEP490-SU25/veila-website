"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Home, ArrowLeft, Lock, AlertTriangle, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Forbidden() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          {/* 403 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-red-100 select-none">403</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-16 w-16 md:h-20 md:w-20 text-red-400" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-500 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Truy cập bị từ chối</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên hoặc đăng nhập với tài khoản có
              quyền phù hợp.
            </p>
          </div>

          {/* Permission Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="font-medium text-amber-800">Yêu cầu quyền truy cập</span>
            </div>
            <p className="text-sm text-amber-700">
              Trang này yêu cầu quyền đặc biệt. Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với bộ phận hỗ trợ.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => router.back()} variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                <Home className="h-5 w-5 mr-2" />
                Trang chủ
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cần hỗ trợ?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <Mail/> Email:{" "}
                <a href="mailto:veila.studio.mail@gmail.com" className="text-red-600 hover:underline">
                  veila.studio.mail@gmail.com
                </a>
              </p>
              <p>
                <Phone/> Hotline:{" "}
                <a href="tel:+84966316803" className="text-red-600 hover:underline">
                  +84 966 316 803
                </a>
              </p>
            </div>
          </div>

          {/* Common Access Levels */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-3">Các cấp độ truy cập phổ biến:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded">👤 Khách hàng</div>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🏪 Chủ cửa hàng</div>
              <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">👨‍💼 Quản trị viên</div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-red-200 rounded-full opacity-20"></div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-orange-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 left-12 w-6 h-6 bg-red-300 rounded-full opacity-25"></div>
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-orange-200 rounded-full opacity-20"></div>
        </CardContent>
      </Card>
    </div>
  )
}

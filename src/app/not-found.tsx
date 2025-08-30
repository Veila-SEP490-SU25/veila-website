"use client"

import { TextLogo } from "@/components/text-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-rose-100 select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <TextLogo />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trang không tồn tại</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy thử tìm kiếm những chiếc váy
              cưới tuyệt đẹp khác nhé!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => router.back()} variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-rose-600 hover:bg-rose-700">
                <Home className="h-5 w-5 mr-2" />
                Trang chủ
              </Button>
            </Link>

            <Link href="/browse" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent"
              >
                <Search className="h-5 w-5 mr-2" />
                Khám phá váy cưới
              </Button>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-rose-200 rounded-full opacity-20"></div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-pink-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 left-12 w-6 h-6 bg-rose-300 rounded-full opacity-25"></div>
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-pink-200 rounded-full opacity-20"></div>
        </CardContent>
      </Card>
    </div>
  )
}

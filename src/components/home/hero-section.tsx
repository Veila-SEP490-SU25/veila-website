"use client";

import { Image } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Search,
  Star,
  Sparkles,
  Users,
  Award,
  Shield,
} from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-ivory-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1 text-sm font-medium"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Nền Tảng Liên Kết Hàng Đầu
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Kết Nối
                <span className="text-rose-600 block">
                  Cô Dâu & Nhà Thiết Kế
                </span>
                <span className="text-2xl md:text-3xl text-gray-600 font-normal mt-2 block">
                  Tạo Nên Những Chiếc Váy Cưới Mơ Ước
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Veila - Nền tảng kết nối trực tiếp giữa cô dâu và các nhà thiết
                kế chuyên nghiệp. Từ thiết kế riêng đến thuê mua, chúng tôi đảm
                bảo mọi chiếc váy cưới đều là tác phẩm nghệ thuật hoàn hảo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Khám Phá Váy Cưới
                </Button>
              </Link>
              <Link href="/request-order">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-rose-200 text-rose-700 hover:bg-rose-50 px-8 py-3 text-base font-semibold bg-white/80 backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Đặt May Riêng
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  1000+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Cô Dâu Hạnh Phúc
                </div>
                <div className="flex justify-center mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  100+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Nhà Thiết Kế Uy Tín
                </div>
                <div className="flex justify-center mt-1">
                  <Award className="w-3 h-3 text-amber-500" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">4.9</div>
                <div className="text-sm text-gray-600 font-medium">
                  Đánh Giá Trung Bình
                </div>
                <div className="flex justify-center mt-1">
                  <Shield className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero.jpg"
                alt="Beautiful wedding dress"
                width={500}
                height={600}
                priority
                className="w-full h-auto object-cover"
                style={{ height: "auto" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    Thiết Kế Riêng
                  </div>
                  <div className="text-sm text-gray-600">100% theo ý muốn</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Tư Vấn Miễn Phí
                  </div>
                  <div className="text-xs text-gray-600">24/7 hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

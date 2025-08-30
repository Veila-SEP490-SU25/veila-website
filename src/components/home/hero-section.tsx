"use client";

import { Image } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Search, Star, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-rose-100 text-rose-700 hover:bg-rose-200"
              >
                ✨ Váy Cưới Mơ Ước Của Bạn Đang Chờ Đón
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Tìm Kiếm Chiếc
                <span className="text-rose-600 block">Váy Cưới Hoàn Hảo</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kết nối với các nhà thiết kế chuyên nghiệp để tạo ra những chiếc
                váy cưới được thiết kế riêng, hoặc khám phá bộ sưu tập cho thuê
                và mua bán được tuyển chọn kỹ lưỡng. Chiếc váy cưới mơ ước của
                bạn chỉ cách một cuộc tư vấn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3"
              >
                <Heart className="w-5 h-5 mr-2" />
                Bắt Đầu Hành Trình
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-rose-200 text-rose-700 hover:bg-rose-50 px-8 py-3 bg-transparent"
              >
                <Search className="w-5 h-5 mr-2" />
                Xem Thiết Kế
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Cô Dâu Hạnh Phúc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">
                  Nhà Thiết Kế Chuyên Nghiệp
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">Đánh Giá</span>
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
                className="w-full h-auto aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Váy cưới</div>
                  <div className="text-sm text-gray-600">
                    Được thiết kế hoàn hảo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

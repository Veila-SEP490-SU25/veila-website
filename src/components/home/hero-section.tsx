'use client';

import { Image } from '@/components/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative   px-4 md:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-ivory-50 min-h-screen flex items-center">
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
                <span className="text-rose-600 block">Cô Dâu & Nhà Thiết Kế</span>
                <span className="text-2xl md:text-3xl text-gray-600 font-normal mt-2 block">
                  Tạo Nên Những Chiếc Váy Cưới Mơ Ước
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Veila - Nền tảng kết nối trực tiếp giữa cô dâu và các nhà thiết kế chuyên nghiệp. Từ
                thiết kế riêng đến thuê mua, chúng tôi đảm bảo mọi chiếc váy cưới đều là tác phẩm
                nghệ thuật hoàn hảo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
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
                style={{ height: 'auto' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

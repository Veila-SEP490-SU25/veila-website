import { Button } from '@/components/ui/button';
import { Search, Scissors, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-rose-600 via-rose-700 to-pink-700 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Sẵn Sàng Tìm Chiếc
              <span className="block text-rose-100">Váy Cưới Mơ Ước?</span>
            </h2>
            <p className="text-lg md:text-xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
              Tham gia cùng hàng nghìn cô dâu hạnh phúc đã tìm thấy chiếc váy cưới hoàn hảo thông
              qua nền tảng kết nối Veila
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/browse">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Khám Phá Váy Cưới
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/custom-order">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-rose-600 px-8 py-3 text-base font-semibold bg-transparent backdrop-blur-sm group"
              >
                <Scissors className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Đặt May Riêng
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Users, Palette } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-rose-600">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Sẵn Sàng Tìm Chiếc Váy Mơ Ước?
        </h2>
        <p className="text-xl text-rose-100">
          Tham gia cùng hàng nghìn cô dâu hạnh phúc đã tìm thấy chiếc váy cưới
          hoàn hảo thông qua Veila
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-3"
          >
            <Users className="w-5 h-5 mr-2" />
            Tham Gia Với Tư Cách Cô Dâu
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-rose-600 px-8 py-3 bg-transparent"
          >
            <Palette className="w-5 h-5 mr-2" />
            Trở Thành Nhà Thiết Kế
          </Button>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export const Testimonials: React.FC = () => {
  return <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Cô Dâu Nói Gì Về Chúng Tôi</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Veila đã biến chiếc váy mơ ước của tôi thành hiện thực. Nhà thiết kế hiểu hoàn hảo tầm nhìn của tôi
                  và tạo ra thứ gì đó vượt ngoài mong đợi.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-semibold">L</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Linh Nguyễn</div>
                    <div className="text-sm text-gray-600">Cô Dâu 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Dịch vụ cho thuê thật tuyệt vời! Tôi có được một chiếc váy thiết kế với giá cả không thể tin được.
                  Chất lượng và dịch vụ đều xuất sắc.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-semibold">H</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Hương Trần</div>
                    <div className="text-sm text-gray-600">Cô Dâu 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Từ tư vấn đến thử váy cuối cùng, đội ngũ Veila đều chuyên nghiệp và chu đáo. Họ làm cho toàn bộ quá
                  trình không có căng thẳng.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-semibold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mai Phạm</div>
                    <div className="text-sm text-gray-600">Cô Dâu 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
}
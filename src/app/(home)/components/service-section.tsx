import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageCircle, Palette, ShoppingBag } from "lucide-react"

export const ServiceSection: React.FC = () => {
  return <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Giải Pháp Váy Cưới Toàn Diện</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ thiết kế riêng đến cho thuê, chúng tôi cung cấp mọi thứ bạn cần cho vẻ đẹp hoàn hảo trong ngày cưới
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Thiết Kế Riêng</CardTitle>
                <CardDescription>
                  Làm việc với các nhà thiết kế chuyên nghiệp để tạo ra chiếc váy mơ ước từ ý tưởng
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Mua & Bán</CardTitle>
                <CardDescription>Mua váy cưới mới hoặc bán chiếc váy cưới đã qua sử dụng nhẹ của bạn</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Cho Thuê Váy</CardTitle>
                <CardDescription>Thuê váy thiết kế với giá chỉ bằng một phần nhỏ so với giá bán lẻ</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Tư Vấn</CardTitle>
                <CardDescription>Nhận lời khuyên cá nhân hóa từ các chuyên gia thời trang cô dâu</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
}
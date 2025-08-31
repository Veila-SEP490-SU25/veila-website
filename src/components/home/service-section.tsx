import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Palette,
  ShoppingBag,
  Users,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ServiceSection: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="secondary"
            className="bg-rose-100 text-rose-700 px-3 py-1 text-sm font-medium"
          >
            <Zap className="w-3 h-3 mr-2" />
            Dịch Vụ Toàn Diện
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-rose-600 block">Giải Pháp Kết Nối</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Veila cung cấp nền tảng kết nối hoàn chỉnh, từ thiết kế riêng đến
            thuê mua, đảm bảo mọi cô dâu đều tìm được chiếc váy cưới mơ ước của
            mình
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-rose-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                Thiết Kế Riêng
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Làm việc trực tiếp với nhà thiết kế chuyên nghiệp để tạo ra
                chiếc váy độc đáo theo ý muốn
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>100% tùy chỉnh</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                Mua & Bán
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Mua váy cưới mới từ các shop uy tín hoặc bán chiếc váy đã qua sử
                dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Đảm bảo chất lượng</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                Cho Thuê Váy
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Thuê váy thiết kế cao cấp với giá chỉ bằng một phần nhỏ so với
                mua mới
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Tiết kiệm chi phí</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                Tư Vấn Chuyên Nghiệp
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Nhận lời khuyên cá nhân hóa từ các chuyên gia thời trang cô dâu
                hàng đầu
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Users className="w-3 h-3 text-blue-500" />
                <span>24/7 hỗ trợ</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Tại Sao Chọn Veila?
            </h3>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho cả cô dâu và
              nhà thiết kế
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                An Toàn & Bảo Mật
              </h4>
              <p className="text-sm text-gray-600">
                Giao dịch an toàn, thông tin được bảo mật tuyệt đối
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Chất Lượng Đảm Bảo
              </h4>
              <p className="text-sm text-gray-600">
                Tất cả shop đều được kiểm duyệt và đánh giá chất lượng
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Hỗ Trợ 24/7
              </h4>
              <p className="text-sm text-gray-600">
                Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ mọi lúc
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MessageCircle, Heart, Users, Star, Shield } from 'lucide-react';

export const HowItWorkSection: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-ivory-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="secondary"
            className="bg-rose-100 text-rose-700 px-3 py-1 text-sm font-medium"
          >
            <Users className="w-3 h-3 mr-2" />
            Quy Trình Đơn Giản
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-rose-600 block">Kết Nối Cô Dâu & Cửa Hàng Váy Cưới</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chỉ với 3 bước đơn giản, bạn sẽ tìm được chiếc váy cưới mơ ước và nhà thiết kế phù hợp
            nhất
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">Khám Phá & Tìm Kiếm</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Duyệt qua hàng trăm mẫu váy cưới và kết nối với các nhà thiết kế chuyên nghiệp phù
                hợp với phong cách và ngân sách của bạn
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-rose-600 font-medium">
                <span>Hàng trăm mẫu đẹp</span>
                <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white relative">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">Tư Vấn & Thiết Kế</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nhận tư vấn chuyên nghiệp và làm việc trực tiếp với nhà thiết kế để tạo ra chiếc váy
                độc đáo theo ý muốn của bạn
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium">
                <span>Tư vấn miễn phí</span>
                <Shield className="w-3 h-3 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white relative">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">Nhận Váy Hoàn Hảo</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nhận chiếc váy cưới mơ ước được thiết kế riêng, mua mới hoặc thuê với chất lượng đảm
                bảo và giao hàng tận nơi
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                <span>Giao hàng tận nơi</span>
                <Heart className="w-3 h-3 fill-green-600 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lợi Ích Khi Sử Dụng Veila</h3>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm mua sắm váy cưới hoàn toàn mới với nhiều ưu đãi đặc biệt
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-5 h-5 text-rose-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Chất Lượng Cao</h4>
              <p className="text-sm text-gray-600">Tất cả shop đều được kiểm duyệt nghiêm ngặt</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">An Toàn Tuyệt Đối</h4>
              <p className="text-sm text-gray-600">Giao dịch bảo mật, thông tin được bảo vệ</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Hỗ Trợ 24/7</h4>
              <p className="text-sm text-gray-600">Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng</p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Giá Cả Hợp Lý</h4>
              <p className="text-sm text-gray-600">Nhiều lựa chọn với mức giá phù hợp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

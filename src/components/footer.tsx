import { TextLogo } from "@/components/text-logo"
import { Heart, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 text-white border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TextLogo />
            </div>
            <p className="text-black leading-relaxed">
              Kết nối cô dâu với các nhà thiết kế chuyên nghiệp để tạo ra chiếc váy cưới hoàn hảo cho ngày đặc biệt của
              họ.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-black hover:text-rose-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-black hover:text-rose-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-black hover:text-rose-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dịch Vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Thiết Kế Riêng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Cho Thuê Váy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Mua & Bán
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Tư Vấn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Chỉnh Sửa
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Công Ty</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Nhà Thiết Kế
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Báo Chí
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black hover-text-gray-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-rose-600" />
                <span className="text-black">vaila.studio.mail@</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-rose-600" />
                <span className="text-black">+84 (028) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-rose-600 mt-1" />
                <span className="text-black">
                  123 Đường Nguyễn Huệ
                  <br />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-black text-sm">© {new Date().getFullYear()} Veila. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-black hover-text-gray-500 text-sm transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="#" className="text-black hover-text-gray-500 text-sm transition-colors">
                Điều Khoản Dịch Vụ
              </Link>
              <Link href="#" className="text-black hover-text-gray-500 text-sm transition-colors">
                Chính Sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

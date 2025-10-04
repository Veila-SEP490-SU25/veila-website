import { TextLogo } from '@/components/text-logo';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TextLogo />
            </div>
            <p className="text-gray-700 leading-relaxed text-justify">
              Kết nối cô dâu với các nhà thiết kế chuyên nghiệp để tạo ra chiếc váy cưới hoàn hảo
              cho ngày đặc biệt của họ.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-700 hover:text-rose-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-700 hover:text-rose-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-700 hover:text-rose-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <p className="font-semibold text-red-900 font-cormorant text-2xl">Dịch vụ</p>
            <ul className="space-y-2">
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/">Trang chủ</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/dresses">Váy cưới</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/shops">Cửa hàng</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/blogs">Bài viết</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-red-900 font-cormorant text-2xl">Điều khoản</p>
            <ul className="space-y-2">
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/terms/privacies">Chính sách bảo mật</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/terms/services">Điều khoản dịch vụ</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="/terms/uses">Điều khoản sử dụng</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-red-900 font-cormorant text-2xl">Liên Hệ</h3>
            <ul className="space-y-2">
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="mailto:support@veila.com">support@veila.studio</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="tel:+84966316803">(+84) 966 316 803</Link>
              </li>
              <li className="text-gray-700 hover:text-rose-500 transition-colors flex items-center gap-2">
                <Link href="https://www.google.com/maps?q=Nhà+văn+hoá+sinh+viên,+Phường+Đông+Hoà,+TP.+Hồ+Chí+Minh">
                  Nhà văn hoá sinh viên, Phường Đông Hoà, TP. Hồ Chí Minh
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-black text-sm">
              © {new Date().getFullYear()} Veila Studio. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

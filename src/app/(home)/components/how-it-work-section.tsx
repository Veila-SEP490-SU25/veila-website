export const HowItWorkSection: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-rose-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Veila Hoạt Động Như Thế Nào
          </h2>
          <p className="text-xl text-gray-600">
            Hành trình đến chiếc váy cưới hoàn hảo trong những bước đơn giản
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Duyệt & Kết Nối
            </h3>
            <p className="text-gray-600">
              Khám phá mạng lưới nhà thiết kế của chúng tôi và kết nối với người
              phù hợp với phong cách và ngân sách của bạn
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Tư Vấn Cá Nhân Hóa
            </h3>
            <p className="text-gray-600">
              Nhận hướng dẫn chuyên nghiệp phù hợp với sở thích, dáng người và
              chủ đề đám cưới của bạn
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Váy Hoàn Hảo
            </h3>
            <p className="text-gray-600">
              Nhận chiếc váy mơ ước thông qua thiết kế riêng, mua hoặc thuê -
              được giao tận tay với tình yêu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

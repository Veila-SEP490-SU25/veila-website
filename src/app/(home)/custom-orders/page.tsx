import { Metadata } from 'next';
import { CustomOrdersList } from '@/components/custom-orders/custom-orders-list';

export const metadata: Metadata = {
  title: 'Tìm yêu cầu đặt may | Veila',
  description: 'Quản lý yêu cầu đặt may từ khách hàng',
};

export default function CustomOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tìm yêu cầu đặt may</h1>
            <p className="text-gray-600">Quản lý các yêu cầu đặt may từ khách hàng</p>
          </div>

          <CustomOrdersList />
        </div>
      </div>
    </div>
  );
}

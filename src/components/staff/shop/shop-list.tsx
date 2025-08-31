import { EmptyCard } from "@/components/empty-card";
import { ShopCard } from "@/components/staff/shop/shop-card";
import { IShop } from "@/services/types";

interface ShopListProps {
  shops: IShop[];
  onUpdate?: () => void;
}

export const ShopList = ({ shops, onUpdate }: ShopListProps) => {
  return (
    <div className="space-y-4">
      {shops.length === 0 ? (
        <EmptyCard
          title="Không có cửa hàng"
          message="Hiện không có cửa hàng nào để hiển thị."
        />
      ) : (
        shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} onUpdate={onUpdate} />
        ))
      )}
    </div>
  );
};

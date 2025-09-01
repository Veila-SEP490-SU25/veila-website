"use client";

import { AccessoriesTabs } from "@/components/staff/shop/detail/tabs/accessories-tabs";
import { DressesTabs } from "@/components/staff/shop/detail/tabs/dresses-tabs";
import { InformationTabs } from "@/components/staff/shop/detail/tabs/information-tabs";
import { OrdersTabs } from "@/components/staff/shop/detail/tabs/orders-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IShop } from "@/services/types";

interface ShopTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const ShopTabs = ({ shop, onUpdate }: ShopTabsProps) => {
  return (
    <Tabs defaultValue="info">
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="info">Thông tin cửa hàng</TabsTrigger>
        <TabsTrigger value="dresses">Váy cưới</TabsTrigger>
        <TabsTrigger value="accessories">Phụ kiện</TabsTrigger>
        <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
      </TabsList>
      <InformationTabs shop={shop} onUpdate={onUpdate} />
      <DressesTabs shop={shop} onUpdate={onUpdate} />
      <AccessoriesTabs shop={shop} onUpdate={onUpdate} />
      <OrdersTabs shop={shop} onUpdate={onUpdate} />
    </Tabs>
  );
};

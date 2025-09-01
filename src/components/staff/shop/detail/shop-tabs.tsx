"use client";

import { InformationTabs } from "@/components/staff/shop/detail/tabs/information-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IShop } from "@/services/types";

interface ShopTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const ShopTabs = ({ shop, onUpdate }: ShopTabsProps) => {
  return (
    <Tabs defaultValue="info">
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="info">Thông tin cửa hàng</TabsTrigger>
        <TabsTrigger value="dresses">Váy cưới</TabsTrigger>
        <TabsTrigger value="accessories">Phụ kiện</TabsTrigger>
        <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
        <TabsTrigger value="blogs">Bài đăng</TabsTrigger>
      </TabsList>
      <InformationTabs shop={shop} onUpdate={onUpdate} />
    </Tabs>
  );
};

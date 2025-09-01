"use client";

import { HeroSection } from "@/components/home/hero-section";
import { HowItWorkSection } from "@/components/home/how-it-work-section";
import { ServiceSection } from "@/components/home/service-section";
import { CTASection } from "@/components/home/cta-section";
import { ShopDashboard } from "@/components/shops/my/shop-dashboard";
import { useAuth } from "@/providers/auth.provider";
import { UserRole } from "@/services/types/user.type";
import { useLazyGetMyShopQuery } from "@/services/apis";
import { useEffect, useState } from "react";
import { IShop } from "@/services/types";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  const { currentUser } = useAuth();
  const [shop, setShop] = useState<IShop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [getMyShop] = useLazyGetMyShopQuery();

  const isShop = currentUser?.role === UserRole.SHOP;

  useEffect(() => {
    if (isShop) {
      setIsLoading(true);
      const fetchShop = async () => {
        try {
          const response = await getMyShop().unwrap();
          if (response.statusCode === 200) {
            setShop(response.item);
          }
        } catch (error) {
          console.error("Error fetching shop:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchShop();
    }
  }, [isShop, getMyShop]);

  // Show loading for SHOP role while fetching data
  if (isShop && isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Metrics Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-[300px] bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show Dashboard for SHOP role
  if (isShop && shop) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <ShopDashboard shop={shop} />
      </div>
    );
  }

  // Show regular home page for other roles
  return (
    <div className="w-full">
      <HeroSection />
      <ServiceSection />
      <HowItWorkSection />
      <CTASection />
    </div>
  );
};

export default HomePage;

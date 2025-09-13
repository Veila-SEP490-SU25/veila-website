'use client';

import { HeroSection } from '@/components/home/hero-section';
import { HowItWorkSection } from '@/components/home/how-it-work-section';
import { ServiceSection } from '@/components/home/service-section';
import { CTASection } from '@/components/home/cta-section';
import { ShopDashboard } from '@/components/shops/my/shop-dashboard';
import { useAuth } from '@/providers/auth.provider';
import { UserRole } from '@/services/types/user.type';

const HomePage = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const isShop = currentUser?.role === UserRole.SHOP;

  // Show Dashboard for SHOP role
  if (isShop) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <ShopDashboard />
      </div>
    );
  }

  // Show regular home page for other roles
  return (
    <div className="w-full">
      <HeroSection isAuthenticated={isAuthenticated} />
      <ServiceSection />
      <HowItWorkSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default HomePage;

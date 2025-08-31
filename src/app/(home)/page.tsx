import { HeroSection } from "@/components/home/hero-section";
import { HowItWorkSection } from "@/components/home/how-it-work-section";
import { ServiceSection } from "@/components/home/service-section";
import { CTASection } from "@/components/home/cta-section";

const HomePage = () => {
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

import { CTASection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorkSection } from "@/components/home/how-it-work-section";
import { ServiceSection } from "@/components/home/service-section";
import { Testimonials } from "@/components/home/testimonials";

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <ServiceSection />
      <HowItWorkSection />
      <Testimonials />
      <CTASection />
    </div>
  );
};
export default HomePage;

import { CTASection } from "@/app/(home)/components/cta-section";
import { HeroSection } from "@/app/(home)/components/hero-section";
import { HowItWorkSection } from "@/app/(home)/components/how-it-work-section";
import { ServiceSection } from "@/app/(home)/components/service-section";
import { Testimonials } from "@/app/(home)/components/testimonials";

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

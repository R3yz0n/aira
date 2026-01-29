import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      {/* <HeroSection />
      <StatsSection /> */}
      <ServicesPreview />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

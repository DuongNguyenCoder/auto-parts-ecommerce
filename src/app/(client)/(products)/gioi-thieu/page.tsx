import { AboutCompanySection } from "@/components/client/gioi-thieu/AboutCompanySection";
import { AboutHeroSection } from "@/components/client/gioi-thieu/AboutHeroSection";
import { AboutWhyChooseUsSection } from "@/components/client/gioi-thieu/AboutWhyChooseUsSection";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-3 xs:px-5">
      <AboutHeroSection />
      <AboutCompanySection />
      <AboutWhyChooseUsSection />
    </div>
  );
}

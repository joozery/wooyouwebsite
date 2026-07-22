import HeroSection from "@/components/website/HeroSection";
import ServiceSection from "@/components/website/ServiceSection";
import TechStackSection from "@/components/website/TechStackSection";
import ERPServiceSection from "@/components/website/ERPServiceSection";
import RecentWorkSection from "@/components/website/RecentWorkSection";
import CustomerSection from "@/components/website/CustomerSection";
import BlogSection from "@/components/website/BlogSection";
import CTASection from "@/components/website/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <HeroSection />
      <ServiceSection />
      <TechStackSection />
      <ERPServiceSection />
      <RecentWorkSection />
      <CustomerSection />
      <BlogSection />
      <CTASection />
    </main>
  );
}

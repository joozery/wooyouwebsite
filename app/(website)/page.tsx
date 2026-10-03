import HeroSection from "@/components/website/HeroSection";
import ServiceSection from "@/components/website/ServiceSection";
import TechStackSection from "@/components/website/TechStackSection";
import ERPServiceSection from "@/components/website/ERPServiceSection";
import RecentWorkSection from "@/components/website/RecentWorkSection";
import CustomerSection from "@/components/website/CustomerSection";
import BlogSection from "@/components/website/BlogSection";
import OurStorySection from "@/components/website/OurStorySection";
import CTASection from "@/components/website/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <HeroSection />
      <ServiceSection />
      <CustomerSection />
      <TechStackSection />
      <ERPServiceSection />
      <RecentWorkSection />
      <BlogSection />
      <OurStorySection />
      <CTASection />
    </main>
  );
}

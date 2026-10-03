import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import CookieBanner from "@/components/website/CookieBanner";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-canvas text-ink">
      <Navbar />
      {children}
      <Footer />
      <FloatingContact />
      <CookieBanner />
    </div>
  );
}

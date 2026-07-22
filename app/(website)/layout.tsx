import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

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
    </div>
  );
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  image: string;
  gallery: string[];
  tags: string;
  isVisible: boolean;
}

export const defaultPortfolioProjects: PortfolioProject[] = [
  { id: "sistomat", title: "Sistomat", category: "erp", subtitle: "ERP & Business Systems", image: "/port/03.png", gallery: ["/port/03.png", "/covererp.png", "/navbaricon/erp.webp", "/warehouse.png", "/hr.png"], description: "", isVisible: true, tags: "ERP · Business Systems" },
  { id: "gography", title: "Gography", category: "website", subtitle: "Tour & Booking Platform", image: "/port/01.png", gallery: ["/port/01.png", "/navbaricon/webdevelopment-cutout.webp", "/port/01.png", "/coeve.png", "/coverwork.png"], description: "", isVisible: true, tags: "Website · Travel · Booking" },
  { id: "sacit", title: "SACIT Symposium", category: "website", subtitle: "Event Website & Digital Experience", image: "/port/02.png", gallery: ["/port/02.png", "/navbaricon/uxui-cutout.webp", "/port/02.png", "/coverser.png", "/covercon.png"], description: "", isVisible: true, tags: "Website · Event" },
  { id: "caraway", title: "CAR AWAY", category: "website", subtitle: "Automotive Website", image: "/port/04.png", gallery: ["/port/04.png", "/coverwork.png", "/port/04.png", "/coeve.png", "/navbaricon/webdevelopment-cutout.webp"], description: "", isVisible: true, tags: "Website · Automotive" },
  { id: "preview", title: "Project 05", category: "mobile", subtitle: "Mobile App · Preview", image: "/navbaricon/mobileapp.webp", gallery: ["/navbaricon/mobileapp.webp", "/navbaricon/service.webp", "/navbaricon/uxui-cutout.webp", "/navbaricon/mobileapp.webp", "/coeve.png"], description: "", isVisible: true, tags: "Preview · Mobile App" },
];
export const portfolioCategories = [
  { id: "all", label: "ALL" },
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile App" },
  { id: "erp", label: "ERP & System" },
  { id: "design", label: "UI/UX" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "game", label: "Game Development" },
];

export function validPortfolioImage(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try {
    const url = new URL(value);
    const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    const r2 = publicBase ? new URL(publicBase.endsWith("/") ? publicBase : `${publicBase}/`) : null;
    return url.protocol === "https:" && (["res.cloudinary.com", "images.unsplash.com", "wooyoucreative.com"].includes(url.hostname) || Boolean(r2 && url.origin === r2.origin && url.pathname.startsWith(r2.pathname)));
  } catch { return false; }
}

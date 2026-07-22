export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "why-your-business-needs-a-website-2026",
    title: "ทำไมธุรกิจของคุณถึงต้องมีเว็บไซต์ในปี 2026",
    excerpt:
      "เว็บไซต์ไม่ใช่แค่หน้าร้านออนไลน์ แต่คือเครื่องมือสร้างความน่าเชื่อถือและช่องทางขายที่ทำงานให้คุณตลอด 24 ชั่วโมง",
    date: "2026-06-15",
    category: "Web Development",
    readTime: "5 นาที",
    author: "Wooyou Creative",
    featured: true,
  },
  {
    id: 2,
    slug: "erp-system-for-small-business",
    title: "ระบบ ERP สำหรับธุรกิจขนาดเล็ก เริ่มต้นอย่างไรดี",
    excerpt:
      "แนะนำแนวทางเลือกและวางระบบ ERP ให้เหมาะกับขนาดธุรกิจ ตั้งแต่ใบเสนอราคาไปจนถึงบัญชีรายรับ-รายจ่าย",
    date: "2026-05-28",
    category: "ERP Systems",
    readTime: "7 นาที",
    author: "Wooyou Creative",
    featured: false,
  },
  {
    id: 3,
    slug: "seo-basics-for-thai-business",
    title: "พื้นฐาน SEO ที่ธุรกิจไทยควรรู้ก่อนเริ่มทำการตลาดออนไลน์",
    excerpt:
      "เข้าใจหลักการทำงานของ search engine และเทคนิคเบื้องต้นที่ช่วยให้เว็บไซต์ของคุณติดอันดับการค้นหา",
    date: "2026-05-10",
    category: "Digital Marketing",
    readTime: "6 นาที",
    author: "Wooyou Creative",
    featured: false,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogs(slug: string, count = 3): BlogPost[] {
  const current = getBlogBySlug(slug);
  if (!current) return blogPosts.slice(0, count);
  return blogPosts
    .filter((post) => post.slug !== slug)
    .sort((a, b) =>
      a.category === current.category ? -1 : b.category === current.category ? 1 : 0,
    )
    .slice(0, count);
}

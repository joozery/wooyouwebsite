export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  authorImage?: string;
  image?: string;
  views?: number;
  likes?: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "why-your-business-needs-a-website-2026",
    title: "ทำไมธุรกิจของคุณถึงต้องมีเว็บไซต์ในปี 2026",
    excerpt:
      "เว็บไซต์ไม่ใช่แค่หน้าร้านออนไลน์ แต่คือเครื่องมือสร้างความน่าเชื่อถือและช่องทางขายที่ทำงานให้คุณตลอด 24 ชั่วโมง",
    date: "22 กรกฎาคม 2026",
    category: "Web Development",
    readTime: "5 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/01.png",
    image: "/serveicepic/01.png",
    views: 8,
    likes: 0,
    featured: true,
  },
  {
    id: 2,
    slug: "erp-system-for-small-business",
    title: "ระบบ ERP สำหรับธุรกิจขนาดเล็ก เริ่มต้นอย่างไรดี",
    excerpt:
      "แนะนำแนวทางเลือกและวางระบบ ERP ให้เหมาะกับขนาดธุรกิจ ตั้งแต่ใบเสนอราคาไปจนถึงบัญชีรายรับ-รายจ่าย",
    date: "10 มีนาคม 2026",
    category: "ERP Systems",
    readTime: "7 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/02.png",
    image: "/serveicepic/02.png",
    views: 184,
    likes: 0,
    featured: false,
  },
  {
    id: 3,
    slug: "seo-basics-for-thai-business",
    title: "พื้นฐาน SEO ที่ธุรกิจไทยควรรู้ก่อนเริ่มทำการตลาดออนไลน์",
    excerpt:
      "เข้าใจหลักการทำงานของ search engine และเทคนิคเบื้องต้นที่ช่วยให้เว็บไซต์ของคุณติดอันดับการค้นหา",
    date: "2 มีนาคม 2026",
    category: "Digital Marketing",
    readTime: "6 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/03.png",
    image: "/serveicepic/03.png",
    views: 400,
    likes: 0,
    featured: false,
  },
  {
    id: 4,
    slug: "ui-ux-design-trends-2026",
    title: "เทรนด์การออกแบบ UI/UX ที่มาแรงในปี 2026",
    excerpt:
      "อัปเดตเทรนด์การออกแบบเว็บไซต์และแอปพลิเคชันที่ช่วยเพิ่มยอด Engagement",
    date: "15 กุมภาพันธ์ 2026",
    category: "Web Development",
    readTime: "4 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/04.png",
    image: "/serveicepic/04.png",
    views: 120,
    likes: 0,
    featured: false,
  },
  {
    id: 5,
    slug: "game-dev-for-marketing",
    title: "Gamification: ใช้เกมมัดใจลูกค้าได้อย่างไร?",
    excerpt:
      "การนำระบบเกมมาใช้ในแคมเปญการตลาดเพื่อสร้างความภักดีต่อแบรนด์",
    date: "8 มกราคม 2026",
    category: "Game Development",
    readTime: "8 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/05.png",
    image: "/serveicepic/05.png",
    views: 310,
    likes: 0,
    featured: false,
  },
  {
    id: 6,
    slug: "mobile-app-vs-web-app",
    title: "Mobile App vs Web App เลือกแบบไหนดีให้เหมาะกับธุรกิจ",
    excerpt:
      "เปรียบเทียบข้อดีและข้อเสียของการพัฒนาแอปพลิเคชันทั้งสองรูปแบบ",
    date: "20 ธันวาคม 2025",
    category: "Mobile Apps",
    readTime: "5 นาที",
    author: "Wooyou Creative",
    authorImage: "/serveicepic/06.png",
    image: "/serveicepic/06.png",
    views: 250,
    likes: 0,
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

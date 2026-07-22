// โลโก้ใน public/tech/ สร้างจากแพ็กเกจ thesvg ด้วย scripts/extract-tech-icons.mjs
export interface TechItem {
  name: string;
  description: string;
  icon: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    title: "Frontend & Mobile",
    items: [
      {
        name: "React",
        description: "สร้าง UI แบบ component ยืดหยุ่นสูง",
        icon: "/tech/react.svg",
      },
      {
        name: "Next.js",
        description: "เว็บเร็ว SEO ดี ด้วย SSR/SSG",
        icon: "/tech/nextjs.svg",
      },
      {
        name: "TypeScript",
        description: "โค้ดปลอดภัย ลด bug ด้วย type",
        icon: "/tech/typescript.svg",
      },
      {
        name: "Tailwind CSS",
        description: "ออกแบบ UI ได้เร็วและสม่ำเสมอ",
        icon: "/tech/tailwindcss.svg",
      },
      {
        name: "Flutter",
        description: "แอปมือถือ iOS/Android โค้ดเดียว",
        icon: "/tech/flutter.svg",
      },
    ],
  },
  {
    title: "Backend & Database",
    items: [
      {
        name: "Node.js",
        description: "API ประสิทธิภาพสูงฝั่งเซิร์ฟเวอร์",
        icon: "/tech/nodejs.svg",
      },
      {
        name: "MongoDB",
        description: "ฐานข้อมูล NoSQL ยืดหยุ่น",
        icon: "/tech/mongodb.svg",
      },
      {
        name: "MySQL",
        description: "ฐานข้อมูล SQL มาตรฐานองค์กร",
        icon: "/tech/mysql.svg",
      },
      {
        name: "Firebase",
        description: "Auth, Realtime DB และ Hosting",
        icon: "/tech/firebase.svg",
      },
    ],
  },
  {
    title: "Platform & Tools",
    items: [
      {
        name: "AWS",
        description: "โครงสร้างพื้นฐานคลาวด์ระดับโลก",
        icon: "/tech/aws.svg",
      },
      {
        name: "Docker",
        description: "Deploy สม่ำเสมอทุก environment",
        icon: "/tech/docker.svg",
      },
      {
        name: "WordPress",
        description: "เว็บไซต์ CMS จัดการเองได้",
        icon: "/tech/wordpress.svg",
      },
      {
        name: "Figma",
        description: "ออกแบบ UI/UX ร่วมกันแบบ realtime",
        icon: "/tech/figma.svg",
      },
      {
        name: "Framer",
        description: "Animation ลื่นไหลระดับโปร",
        icon: "/tech/framer.svg",
      },
    ],
  },
];

export const techList: TechItem[] = techCategories.flatMap(
  (category) => category.items,
);

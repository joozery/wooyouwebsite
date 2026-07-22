import {
  aws,
  docker,
  figma,
  firebase,
  flutter,
  framer,
  mongodb,
  mysql,
  nextjs,
  nodejs,
  react,
  tailwindcss,
  typescript,
  wordpress,
} from "thesvg";

export interface TechItem {
  name: string;
  description: string;
  svg: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

// ตัด XML prolog ออกเพื่อ inline ใน HTML ได้สะอาดๆ
const clean = (svg: string) => svg.replace(/<\?xml[^>]*\?>\s*/, "");

const item = (
  icon: { title: string; svg: string },
  description: string,
): TechItem => ({
  name: icon.title,
  description,
  svg: clean(icon.svg),
});

export const techCategories: TechCategory[] = [
  {
    title: "Frontend & Mobile",
    items: [
      item(react, "สร้าง UI แบบ component ยืดหยุ่นสูง"),
      item(nextjs, "เว็บเร็ว SEO ดี ด้วย SSR/SSG"),
      item(typescript, "โค้ดปลอดภัย ลด bug ด้วย type"),
      item(tailwindcss, "ออกแบบ UI ได้เร็วและสม่ำเสมอ"),
      item(flutter, "แอปมือถือ iOS/Android โค้ดเดียว"),
    ],
  },
  {
    title: "Backend & Database",
    items: [
      item(nodejs, "API ประสิทธิภาพสูงฝั่งเซิร์ฟเวอร์"),
      item(mongodb, "ฐานข้อมูล NoSQL ยืดหยุ่น"),
      item(mysql, "ฐานข้อมูล SQL มาตรฐานองค์กร"),
      item(firebase, "Auth, Realtime DB และ Hosting"),
    ],
  },
  {
    title: "Platform & Tools",
    items: [
      item(aws, "โครงสร้างพื้นฐานคลาวด์ระดับโลก"),
      item(docker, "Deploy สม่ำเสมอทุก environment"),
      item(wordpress, "เว็บไซต์ CMS จัดการเองได้"),
      item(figma, "ออกแบบ UI/UX ร่วมกันแบบ realtime"),
      item(framer, "Animation ลื่นไหลระดับโปร"),
    ],
  },
];

export const techList: TechItem[] = techCategories.flatMap(
  (category) => category.items,
);

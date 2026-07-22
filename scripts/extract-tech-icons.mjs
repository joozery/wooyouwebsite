// ดึง SVG โลโก้จาก thesvg มาเป็นไฟล์ static ใน public/tech/
// (import thesvg ตรงๆ ในแอปไม่ได้ — barrel file ของ @thesvg/icons ใช้
// `export type` ในไฟล์ .js ทำให้ Turbopack parse ไม่ผ่าน)
// รัน: node scripts/extract-tech-icons.mjs
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const icons = require("thesvg");

const wanted = [
  "react",
  "nextjs",
  "typescript",
  "tailwindcss",
  "flutter",
  "nodejs",
  "mongodb",
  "mysql",
  "firebase",
  "aws",
  "docker",
  "wordpress",
  "figma",
  "framer",
];

const outDir = join(import.meta.dirname, "..", "public", "tech");
mkdirSync(outDir, { recursive: true });

for (const slug of wanted) {
  const icon = icons[slug];
  if (!icon) {
    console.error(`missing icon: ${slug}`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(join(outDir, `${slug}.svg`), icon.svg);
  console.log(`${slug}.svg ← ${icon.title}`);
}

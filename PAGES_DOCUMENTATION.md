# Wooyou Creative — เอกสารประกอบทุกหน้าเว็บไซต์

> เอกสารนี้สร้างขึ้นเพื่อใช้ประกอบการย้าย (migrate) โปรเจค React + Vite ไปยัง **Next.js**  
> ครอบคลุมทั้งส่วน **Public Website** และ **Admin Panel (ERP System)**

---

## ภาพรวมโปรเจค

| รายการ | รายละเอียด |
|--------|------------|
| Framework (ปัจจุบัน) | React 18 + Vite |
| Framework (เป้าหมาย) | Next.js (App Router แนะนำ) |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui (Radix UI) |
| Animation | Framer Motion |
| Routing | React Router DOM → Next.js File-based Routing |
| Backend | Node.js + Express + MongoDB |
| API Base URL | `https://api.wooyoucreative.com/api` |
| Auth | localStorage (`adminUser`) — JWT ควรย้ายเป็น httpOnly cookie |
| SEO | react-helmet → next/head หรือ Metadata API |

---

## โครงสร้าง Routes

### Public Website
```
/                    → หน้าแรก (Home)
/about               → เกี่ยวกับเรา
/service             → บริการทั้งหมด
/service/:serviceType → รายละเอียดบริการ (6 ประเภท)
/customer            → ลูกค้าของเรา / Case Studies
/contact             → ติดต่อเรา
/portfolio           → ผลงานทั้งหมด
/article/:slug       → รายละเอียดบทความ
/privacy-policy      → นโยบายความเป็นส่วนตัว
```

### Admin Panel (Protected — ต้องล็อกอิน)
```
/admin/login                          → หน้าล็อกอิน
/admin                                → Dashboard
/admin/customers                      → รายชื่อลูกค้า
/admin/projects                       → รายการโปรเจค
/admin/projects/new                   → สร้างโปรเจคใหม่
/admin/projects/edit/:id              → แก้ไขโปรเจค
/admin/projects/:id                   → รายละเอียดโปรเจค
/admin/quotations                     → รายการใบเสนอราคา
/admin/quotations/new                 → สร้างใบเสนอราคาใหม่
/admin/quotations/edit/:id            → แก้ไขใบเสนอราคา
/admin/invoices                       → รายการใบแจ้งหนี้
/admin/invoices/new                   → สร้างใบแจ้งหนี้ใหม่
/admin/invoices/new/:quotationId      → สร้างจากใบเสนอราคา
/admin/invoices/edit/:id              → แก้ไขใบแจ้งหนี้
/admin/tax-invoices                   → รายการใบกำกับภาษี
/admin/tax-invoices/new               → สร้างใบกำกับภาษีใหม่
/admin/tax-invoices/new/:quotationId  → สร้างจากใบเสนอราคา
/admin/tax-invoices/edit/:id          → แก้ไขใบกำกับภาษี
/admin/receipts                       → รายการใบเสร็จรับเงิน
/admin/receipts/new                   → สร้างใบเสร็จใหม่
/admin/receipts/new/:taxInvoiceId     → สร้างจากใบกำกับภาษี
/admin/receipts/new/quote/:quotationId → สร้างจากใบเสนอราคา
/admin/receipts/edit/:id              → แก้ไขใบเสร็จ
/admin/receipts/print/:id             → พิมพ์ใบเสร็จ
/admin/employees                      → รายชื่อพนักงาน
/admin/admins                         → รายชื่อผู้ดูแลระบบ
/admin/settings                       → การตั้งค่าระบบ
/admin/account-settings               → การตั้งค่าบัญชีตัวเอง
/admin/customer-credentials           → รายการ credential ลูกค้า
/admin/customer-credentials/new       → เพิ่ม credential ใหม่
/admin/customer-credentials/edit/:id  → แก้ไข credential
/admin/accounting                     → บัญชี รายรับ-รายจ่าย
/admin/client-logos                   → จัดการโลโก้ลูกค้า (website)
/admin/migrate-data                   → Migration Tool
```

---

# ส่วนที่ 1: Public Website Pages

---

## 1. หน้าแรก (Home)
**Route:** `/`  
**File:** `src/pages/website/Home.jsx`  
**Next.js Path:** `app/page.tsx`

### คำอธิบาย
หน้าหลักของเว็บไซต์ Wooyou Creative รวม section ต่างๆ ของเว็บไซต์ทั้งหมด เป็น landing page หลัก

### Sections ที่มีในหน้า (เรียงตามลำดับ)
| Component | ไฟล์ | คำอธิบาย |
|-----------|------|---------|
| `<HeroSection>` | `components/website/HeroSection.jsx` | แบนเนอร์หลัก hero พร้อม CTA |
| `<MarqueeSlider>` | `components/website/MarqueeSlider.jsx` | แถบเลื่อนโลโก้เทคโนโลยี/พันธมิตร |
| `<ServiceSection>` | `components/website/ServiceSection.jsx` | แสดงบริการหลัก 6 หมวด |
| `<IntroTechSection>` | `components/website/IntroTechSection.jsx` | แนะนำเทคโนโลยีที่ใช้ |
| `<ERPServiceSection>` | `components/website/ERPServiceSection.jsx` | ส่วนโปรโมต ERP System |
| `<RecentWorkSection>` | `components/website/RecentWorkSection.jsx` | ผลงานล่าสุด |
| `<CustomerSection>` | `components/website/CustomerSection.jsx` | โลโก้ลูกค้า (ดึงจาก API `/client-logos/public`) |
| `<BlogSection>` | `components/website/BlogSection.jsx` | บทความล่าสุด |
| `<GameSection>` | `components/website/GameSection.jsx` | ส่วน interactive/game |

### SEO (Structured Data)
- Title: `รับทำเว็บไซต์ ระบบ ERP และการตลาดออนไลน์ | Wooyou Creative`
- Description: บริการรับทำเว็บไซต์ WordPress, Web Application, ระบบ ERP และการตลาดออนไลน์ SEO ครบวงจร
- Schema.org: Organization, WebSite, Service

### การย้ายไป Next.js
- ใช้ `export const metadata` แทน `react-helmet`
- `<CustomerSection>` ดึงข้อมูลจาก API → ใช้ `fetch` ใน Server Component ได้เลย
- `<BlogSection>` ดึงจาก static data (`blogData.js`) → import ตรงได้

---

## 2. เกี่ยวกับเรา (About)
**Route:** `/about`  
**File:** `src/pages/website/About.jsx`  
**Next.js Path:** `app/about/page.tsx`

### คำอธิบาย
หน้าแนะนำบริษัท Wooyou Creative แสดงพันธกิจ วิสัยทัศน์ ค่านิยม บริการหลัก สถิติ และ CTA

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero | ชื่อหน้า "เกี่ยวกับเรา" + คำอธิบายทีม |
| Mission & Vision | 2 card — พันธกิจ / วิสัยทัศน์ |
| Core Values | 4 card — นวัตกรรม, ทีมงานมืออาชีพ, คุณภาพสูง, การเติบโต |
| Services Overview | 3 card — Web Development, UI/UX Design, Digital Marketing |
| Stats | 4 ตัวเลข — 50+ โปรเจกต์, 30+ ลูกค้า, 5+ ปีประสบการณ์, 15+ ทีมงาน |
| CTA | ปุ่ม "ติดต่อเรา" → `/contact`, "ดูผลงานของเรา" → `/customer` |

### Feature พิเศษ
- **Mouse Follower Background**: เอฟเฟกต์ orb ตามเมาส์ (ใช้ `useState` track `mousePosition`) — ต้องเป็น Client Component ใน Next.js
- **Animated Background**: floating orbs, grid lines, light rays, geometric shapes ด้วย CSS animation
- **Framer Motion**: animate-in สำหรับทุก section

### การย้ายไป Next.js
- ทั้งหน้าเป็น Client Component (`"use client"`) เพราะมี mouse event listener และ Framer Motion
- Static content ทั้งหมด ไม่มี API call

---

## 3. บริการทั้งหมด (Service)
**Route:** `/service`  
**File:** `src/pages/website/Service.jsx`  
**Next.js Path:** `app/service/page.tsx`

### คำอธิบาย
หน้าแสดงบริการทั้งหมด 6 ประเภท พร้อม process และ pricing packages

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero | ชื่อหน้า "บริการของเรา" |
| Services Grid | 6 card บริการ |
| Process Section | 4 ขั้นตอน — Discovery → Design → Development → Launch |
| Pricing Section | 3 แพ็กเกจ — Starter (฿25,000), Professional (฿75,000), Enterprise (฿150,000+) |
| CTA | ปุ่มเริ่มโปรเจค / ปรึกษาฟรี |

### บริการ 6 ประเภท (พร้อม slug)
| บริการ | Slug | สี |
|--------|------|-----|
| Web Development | `web-development` | blue-cyan |
| UI/UX Design | `ui-ux-design` | purple-pink |
| Digital Marketing | `digital-marketing` | green-teal |
| ERP Systems | `erp-systems` | orange-red |
| Game Development | `game-development` | indigo-purple |
| Mobile Apps | `mobile-apps` | pink-rose |

### Link ที่ต้องระวัง
แต่ละ card ลิงก์ไปที่ `/website/service/${slug}` — **ตรงนี้ผิด URL** ควรเป็น `/service/${slug}` สำหรับ Next.js

### การย้ายไป Next.js
- Client Component เพราะมี mouse tracker
- Pricing ยังไม่มี backend เชื่อมต่อ → static data

---

## 4. รายละเอียดบริการ (ServiceDetail)
**Route:** `/service/:serviceType`  
**File:** `src/pages/website/ServiceDetail.jsx`  
**Next.js Path:** `app/service/[serviceType]/page.tsx`

### คำอธิบาย
หน้าแสดงรายละเอียดบริการแต่ละประเภท ดึงข้อมูลจาก object `serviceData` ตาม param `serviceType`

### Sections ทุกบริการมีเหมือนกัน
| Section | เนื้อหา |
|---------|---------|
| Hero | icon, ชื่อ, subtitle, description ของบริการ |
| Features | grid ของ feature ที่ได้รับ (8 รายการ) |
| Technologies | pills แสดงเทคโนโลยีที่ใช้ (8 รายการ) |
| Process | 4 ขั้นตอน เฉพาะของแต่ละบริการ |
| Pricing | 3 tier pricing เฉพาะบริการ |
| Testimonials | testimonial จาก mock ลูกค้า 1 รายการ |
| CTA | "เริ่มต้นโปรเจค" → `/contact`, "ขอใบเสนอราคา" |

### รายละเอียด Pricing แต่ละบริการ
**Web Development:**
- Basic Website: ฿25,000–50,000 (2–4 สัปดาห์)
- Business Website: ฿50,000–150,000 (1–2 เดือน)
- Web Application: ฿150,000+ (2–6 เดือน)

**UI/UX Design:**
- UI Design: ฿15,000–30,000
- UX Research + Design: ฿30,000–80,000
- Complete Design System: ฿80,000+

**Digital Marketing:**
- SEO Package: ฿15,000–30,000/เดือน
- Ads Management: ฿20,000–50,000/เดือน
- Full Digital Marketing: ฿50,000+/เดือน

**ERP Systems:**
- Small Business: ฿200,000–500,000
- Medium Business: ฿500,000–1,500,000
- Enterprise: ฿1,500,000+

**Game Development:**
- Simple 2D Game: ฿100,000–300,000
- Advanced Mobile Game: ฿300,000–800,000
- Custom Solution: ฿800,000+

**Mobile Apps:**
- Simple App: ฿80,000–200,000
- Business App: ฿200,000–500,000
- Enterprise App: ฿500,000+

### การย้ายไป Next.js
- `useParams()` → `props.params.serviceType`
- ข้อมูล `serviceData` เป็น static object → สามารถเป็น Server Component ได้ ยกเว้น mouse tracker
- ควรสร้าง `generateStaticParams()` เพื่อ pre-render ทั้ง 6 หน้า
- 404 จัดการด้วย `notFound()` จาก next/navigation

---

## 5. ลูกค้าของเรา (Customer)
**Route:** `/customer`  
**File:** `src/pages/website/Customer.jsx`  
**Next.js Path:** `app/customer/page.tsx`

### คำอธิบาย
หน้าแสดงลูกค้าของบริษัท พร้อม testimonials และ case studies เพื่อสร้างความน่าเชื่อถือ

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero + Stats | ชื่อหน้า + 4 ตัวเลข (150+ ลูกค้า, 98% พึงพอใจ, 24/7 สนับสนุน, 5 ปีประสบการณ์) |
| Featured Clients | 6 card ลูกค้าหลัก (mock data) |
| Industries | 6 อุตสาหกรรม พร้อมจำนวนโปรเจค |
| Testimonials | 4 testimonials พร้อมชื่อ ตำแหน่ง บริษัท ดาว 5 ดาว |
| Case Studies | 3 case study — TechCorp, Fashion Forward, Green Energy |
| CTA | "เริ่มต้นร่วมงาน", "ดูผลงานเพิ่มเติม" |

### Case Studies รายละเอียด
| ลูกค้า | โปรเจค | ผลลัพธ์ | เทคโนโลยี |
|--------|--------|---------|-----------|
| TechCorp Thailand | Digital Transformation | +300% ประสิทธิภาพ, -40% ต้นทุน | React, Node.js, MongoDB, AWS |
| Fashion Forward | E-commerce Platform | +250% ยอดขาย, -35% abandon cart | Next.js, Shopify Plus, AI/ML, Stripe |
| Green Energy Co. | IoT Monitoring | +45% production, -60% maintenance | IoT, Python, TensorFlow, Azure |

### การย้ายไป Next.js
- ทั้งหน้าเป็น mock data → Server Component ได้
- Mouse tracker ต้องแยกเป็น Client Component เล็กๆ

---

## 6. ติดต่อเรา (Contact)
**Route:** `/contact`  
**File:** `src/pages/website/Contact.jsx`  
**Next.js Path:** `app/contact/page.tsx`

### คำอธิบาย
หน้าติดต่อ มี form ส่งข้อความ, ข้อมูลติดต่อ, เวลาทำการ, social links, แผนที่ (placeholder), FAQ

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero | "ติดต่อเรา" |
| Contact Form | form 6 fields + dropdown บริการ |
| Contact Info | 4 card — โทรศัพท์, อีเมล, ที่อยู่, WhatsApp |
| Office Hours | จ-ศ 09:00-18:00, ส 09:00-16:00, อา ปิด |
| Social Media | Facebook, Twitter, Instagram, LinkedIn |
| Map | placeholder (Google Maps ยังไม่ได้ embed จริง) |
| FAQ | 4 คำถาม-คำตอบ |
| CTA | WhatsApp / ขอใบเสนอราคา |

### Form Fields
| Field | Type | Required |
|-------|------|----------|
| ชื่อ-นามสกุล | text | ✅ |
| อีเมล | email | ✅ |
| บริษัท/องค์กร | text | ❌ |
| เบอร์โทรศัพท์ | tel | ❌ |
| บริการที่สนใจ | select | ❌ |
| รายละเอียดโปรเจค | textarea | ✅ |

### ปัญหาที่ต้องแก้ตอนย้าย
- Form submission ปัจจุบันเป็น `setTimeout` จำลอง — **ยังไม่ได้ส่งจริง** ต้องเชื่อมกับ API หรือ email service
- Google Maps ยังเป็น placeholder
- Social links ชี้ไป `href="#"` ต้องใส่ลิงก์จริง

### การย้ายไป Next.js
- Form submit → Next.js Server Actions หรือ API Route
- `"use client"` เพราะมี form state และ mouse tracker

---

## 7. ผลงาน (Portfolio)
**Route:** `/portfolio`  
**File:** `src/pages/website/Portfolio.jsx`  
**Next.js Path:** `app/portfolio/page.tsx`

### คำอธิบาย
หน้าแสดงผลงานทั้งหมด มีระบบ filter ตามหมวดหมู่และ search

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero | parallax scroll effect พร้อม scroll indicator |
| Stats Bar | 50+ โปรเจค, 30+ ลูกค้า, 5+ ปีประสบการณ์, 100% ตรงเวลา |
| Filter + Search | filter 4 หมวด + search input |
| Portfolio Grid | grid 3 คอลัมน์ พร้อม hover effect |
| CTA | ติดต่อเรา / บริการทั้งหมด |

### หมวดหมู่ Portfolio
- ทั้งหมด
- เว็บไซต์
- Web Application
- Corporate Website

### ผลงานปัจจุบัน (6 รายการ)
| ชื่อ | ประเภท | Featured | เทคโนโลยี |
|------|--------|----------|-----------|
| Vista Thailand | เว็บไซต์ | ✅ | React, UI/UX, Responsive |
| Gography | Web Application | ✅ | React, Node.js, MongoDB |
| Devdechawatd | เว็บไซต์ | ❌ | Portfolio, Minimal, Animation |
| Respect Engineering | Corporate Website | ❌ | Corporate, SEO, Responsive |
| Gaining Travels | Web Application | ❌ | Travel, Booking, UI/UX |
| เช็คช่างก่อนโอน | Web Application | ✅ | React, Firebase, UX |

### Portfolio Card Features
- hover image zoom (scale 1.08)
- featured badge (amber)
- category badge
- hover overlay "เยี่ยมชมเว็บ" link
- tag pills สีน้ำเงิน
- bottom gradient line animation on hover

### การย้ายไป Next.js
- Filter/Search ต้องเป็น Client Component
- ภาพจาก Cloudinary → ใช้ `next/image` กำหนด `domains: ['res.cloudinary.com']`
- Parallax scroll ใช้ `framer-motion` → Client Component
- `useScroll`, `useTransform` → ต้องเป็น Client Component

---

## 8. รายละเอียดบทความ (ArticleDetail)
**Route:** `/article/:slug`  
**File:** `src/pages/website/ArticleDetail.jsx`  
**Next.js Path:** `app/article/[slug]/page.tsx`

### คำอธิบาย
หน้าแสดงเนื้อหาบทความเต็ม ดึงข้อมูลจาก `blogData.js` ตาม slug

### Layout
- **Hero Image**: ภาพ full-width 55-65vh พร้อม gradient overlay, category badge, ชื่อบทความ, meta
- **Article Body**: 2 คอลัมน์ — content หลัก + sidebar
- **Sidebar**: author card, article meta, link กลับ
- **Related Articles**: บทความที่เกี่ยวข้อง 3 รายการ

### Content Block Types
| Type | การแสดงผล |
|------|----------|
| `intro` | text ใหญ่ + border-left blue |
| `heading` | h2 ขาว |
| `paragraph` | text ปกติ gray-300 |
| `highlight` | blockquote สีน้ำเงิน |
| `list` | ul พร้อม icon checkmark |
| `tip` | box สีเขียว พร้อม title |
| `image` | img + caption |
| `conclusion` | box สีเทา |

### Social Share
- Facebook share link
- Twitter share link
- Copy link button (`navigator.clipboard`)

### Blog Data Structure (blogData.js)
```js
{
  id, slug, title, subtitle, excerpt,
  date, category, readTime,
  author, authorRole,
  image, tags,
  featured: boolean,
  content: [{ type, text, items?, src?, caption?, title? }]
}
```

### ฟังก์ชันใน blogData.js
- `getBlogBySlug(slug)` → คืน blog object หรือ undefined
- `getRelatedBlogs(slug, count)` → คืนบทความอื่นในหมวดเดียวกัน

### การย้ายไป Next.js
- ใช้ `generateStaticParams()` เพื่อ pre-render ทุก slug
- `generateMetadata()` สำหรับ OG tags เฉพาะบทความ
- `useNavigate(-1)` → ต้องเป็น Client Component
- `window.location.href` สำหรับ share → ต้อง handle SSR

---

## 9. นโยบายความเป็นส่วนตัว (PrivacyPolicy)
**Route:** `/privacy-policy`  
**File:** `src/pages/website/PrivacyPolicy.jsx`  
**Next.js Path:** `app/privacy-policy/page.tsx`

### คำอธิบาย
หน้านโยบายความเป็นส่วนตัว ตามกฎหมาย PDPA ของไทย

### Sections
| Section | เนื้อหา |
|---------|---------|
| Hero | ชื่อนโยบาย + วันที่อัปเดต (dynamic `new Date()`) |
| Introduction | ข้อความแนะนำนโยบาย |
| 4 หัวข้อหลัก | ข้อมูลที่เก็บ, คุกกี้, วัตถุประสงค์, การแบ่งปัน |
| สิทธิเจ้าของข้อมูล | 6 สิทธิ ตาม PDPA |
| ความปลอดภัย | มาตรการรักษาความปลอดภัย |
| ติดต่อ | privacy@wooyoucreative.com, โทรศัพท์, ที่อยู่ |

### 4 หัวข้อหลัก
1. **ข้อมูลที่เราเก็บรวบรวม** — ชื่อ, อีเมล, เบอร์โทร, พฤติกรรมเว็บ, IP, cookies
2. **การใช้คุกกี้** — จำเป็น, วิเคราะห์ (GA), การตลาด, ปรับแต่ง
3. **วัตถุประสงค์การใช้ข้อมูล** — บริการ, ปรับปรุง, การตลาด, ป้องกัน, กฎหมาย
4. **การแบ่งปันข้อมูล** — ไม่ขาย/ให้บุคคลที่สาม ยกเว้นผู้ให้บริการและกฎหมาย

### การย้ายไป Next.js
- ส่วน `new Date()` ต้องระวัง hydration mismatch → ใช้ `suppressHydrationWarning` หรือ format ฝั่ง server
- เนื้อหา static ทั้งหมด → Server Component ได้

---

# ส่วนที่ 2: Global Layout Components (Website)

---

## Navbar
**File:** `src/components/website/Navbar.jsx`  
**Next.js:** `app/layout.tsx` หรือ `components/Navbar.tsx`

- Fixed top navigation
- เมนู: หน้าแรก, บริการ, ผลงาน, ลูกค้า, บทความ, ติดต่อ
- ต้องเป็น Client Component (scroll detection, mobile menu state)

## Footer
**File:** `src/components/website/Footer.jsx`  
**Next.js:** `app/layout.tsx`

- ลิงก์บริษัท, บริการ, ติดต่อ, social media
- สามารถเป็น Server Component ได้

## ScrollToTopButton
**File:** `src/components/website/ScrollToTopButton.jsx`  
- Client Component (scroll position state)

## CookieConsent
**File:** `src/components/website/CookieConsent.jsx`  
**Hook:** `src/hooks/useCookieConsent.js`
- แสดง banner ขอความยินยอม cookies
- บันทึกใน localStorage
- Client Component

## Analytics
**File:** `src/components/website/Analytics.jsx`  
- Google Analytics / tracking scripts
- ใน Next.js → ใช้ `next/script` ใน `app/layout.tsx`

---

# ส่วนที่ 3: Admin Panel Pages

ทุกหน้าใน `/admin/*` ต้องผ่าน `<ProtectedRoute>` ซึ่งตรวจ `localStorage.getItem('adminUser')`

---

## Admin Layout
**File:** `src/components/Layout.jsx`, `src/components/layout/Header.jsx`, `src/components/layout/Sidebar.jsx`

- **Sidebar**: เมนูนำทางด้านซ้าย
- **Header**: แถบบนพร้อม user info และ logout
- **Next.js**: ใช้ `app/admin/layout.tsx` + Middleware สำหรับ auth check

### เมนู Sidebar
- Dashboard
- ลูกค้า
- โปรเจค
- ใบเสนอราคา
- ใบแจ้งหนี้
- ใบกำกับภาษี
- ใบเสร็จ
- พนักงาน
- บัญชีรายรับ-รายจ่าย
- Client Logos
- ผู้ดูแลระบบ
- ตั้งค่า

---

## A1. Login
**Route:** `/admin/login`  
**File:** `src/pages/Login.jsx`  
**Next.js Path:** `app/admin/login/page.tsx`

### คำอธิบาย
หน้าล็อกอินสำหรับ admin เท่านั้น ไม่มี layout wrapper

### Features
- Background animation: PixelBlast component (canvas-based particle effect) สีม่วง `#B19EEF`
- Form: email + password
- Error handling ด้วย toast

### API Call
```
POST /api/admins/login
Body: { email, password }
Response: { name, role, token?, ... }
```

### Auth Flow
1. POST login → รับ user object
2. บันทึกใน `localStorage.setItem('adminUser', JSON.stringify(data))`
3. Redirect → `/admin/dashboard`

### การย้ายไป Next.js
- ใช้ Server Action หรือ API Route
- เปลี่ยน localStorage เป็น httpOnly cookie เพื่อความปลอดภัย
- PixelBlast เป็น Client Component

---

## A2. Dashboard
**Route:** `/admin` (index)  
**File:** `src/pages/Dashboard.jsx`  
**Next.js Path:** `app/admin/page.tsx`

### คำอธิบาย
ภาพรวมธุรกิจ แสดง KPI, chart รายได้, และโปรเจคล่าสุด

### Components
| Component | ไฟล์ | คำอธิบาย |
|-----------|------|---------|
| `<StatCard>` | `components/dashboard/StatCard.jsx` | card KPI พร้อม icon และ gradient |
| `<RevenueChart>` | `components/dashboard/RevenueChart.jsx` | กราฟรายได้รายเดือน |
| `<RecentProjects>` | `components/dashboard/RecentProjects.jsx` | โปรเจคล่าสุด 5-10 รายการ |

### KPI Cards
| Card | ข้อมูล | Icon | สี |
|------|--------|------|-----|
| รายได้เดือนนี้ | `revenue.currentMonth` | DollarSign | green-emerald |
| ลูกค้าทั้งหมด | `customers.total` | Users | blue-indigo |
| โปรเจคที่กำลังดำเนินการ | `projects.active` | FolderKanban | purple-pink |
| หนี้ค้างชำระ | `revenue.unpaid` | AlertCircle | orange-red |

### API Call
```
GET /api/dashboard/stats
Response: {
  revenue: { yearly, currentMonth, unpaid },
  customers: { total },
  projects: { active },
  quotations: { pending }
}
```

### การย้ายไป Next.js
- สามารถ fetch ใน Server Component และ pass data ลง client components
- RevenueChart ต้องเป็น Client Component (recharts)

---

## A3. ลูกค้า (Customers)
**Route:** `/admin/customers`  
**File:** `src/pages/Customers.jsx`  
**Next.js Path:** `app/admin/customers/page.tsx`

### คำอธิบาย
รายการลูกค้าทั้งหมดพร้อม CRUD

### Features
- ตาราง search/filter ลูกค้า
- เพิ่ม/แก้ไขลูกค้าผ่าน `<CustomerDialog>` (modal)
- ลบลูกค้า

### API Calls
```
GET    /api/customers          → ดึงรายการ
POST   /api/customers          → สร้างใหม่
PUT    /api/customers/:id      → แก้ไข
DELETE /api/customers/:id      → ลบ
```

### Customer Fields (สันนิษฐานจาก schema)
- ชื่อบริษัท/ลูกค้า
- อีเมล
- เบอร์โทร
- ที่อยู่
- เลขประจำตัวผู้เสียภาษี

---

## A4. โปรเจค (Projects)
**Route:** `/admin/projects`  
**File:** `src/pages/Projects.jsx`  
**Next.js Path:** `app/admin/projects/page.tsx`

### คำอธิบาย
รายการโปรเจคทั้งหมด มี search และ status badge

### Status Values
| Status | Label | สี |
|--------|-------|-----|
| `planning` | วางแผน | blue |
| `in-progress` | กำลังดำเนินการ | yellow |
| `on-hold` | พักชั่วคราว | orange |
| `completed` | เสร็จสิ้น | green |
| `cancelled` | ยกเลิก | red |

### Table Columns
- ชื่อโปรเจค
- ลูกค้า
- สถานะ (badge)
- ความคืบหน้า (Progress bar)
- งบประมาณ
- วันที่สิ้นสุด
- Actions (View/Edit/Delete dropdown)

### API Calls
```
GET    /api/projects          → รายการ
POST   /api/projects          → สร้าง
GET    /api/projects/:id      → รายละเอียด
PUT    /api/projects/:id      → แก้ไข
DELETE /api/projects/:id      → ลบ
```

---

## A5. รายละเอียดโปรเจค (ProjectDetail)
**Route:** `/admin/projects/:id`  
**File:** `src/pages/ProjectDetail.jsx`  
**Next.js Path:** `app/admin/projects/[id]/page.tsx`

### คำอธิบาย
แสดงรายละเอียดโปรเจคครบถ้วน พร้อม timeline, tasks, ไฟล์แนบ

---

## A6. ฟอร์มโปรเจค (ProjectForm)
**Routes:** `/admin/projects/new`, `/admin/projects/edit/:id`  
**File:** `src/pages/ProjectForm.jsx`  
**Next.js Path:** `app/admin/projects/new/page.tsx`, `app/admin/projects/edit/[id]/page.tsx`

### Project Fields
- ชื่อโปรเจค
- ลูกค้า (select จาก customers)
- ประเภทบริการ
- สถานะ
- งบประมาณ
- วันเริ่ม / วันสิ้นสุด
- รายละเอียด
- ความคืบหน้า (%)

---

## A7. ใบเสนอราคา (Quotations)
**Route:** `/admin/quotations`  
**File:** `src/pages/Quotations.jsx`  
**Next.js Path:** `app/admin/quotations/page.tsx`

### คำอธิบาย
รายการใบเสนอราคาทั้งหมด มีการสร้าง Invoice/TaxInvoice/Receipt จากใบเสนอราคาได้โดยตรง

### Status ใบเสนอราคา
- pending → รอการพิจารณา
- approved → อนุมัติแล้ว
- rejected → ปฏิเสธ
- invoiced → ออกใบแจ้งหนี้แล้ว

### Actions (Dropdown)
- แก้ไข
- สร้างใบแจ้งหนี้ → `/admin/invoices/new/:quotationId`
- สร้างใบกำกับภาษี → `/admin/tax-invoices/new/:quotationId`
- สร้างใบเสร็จ → `/admin/receipts/new/quote/:quotationId`
- ลบ

### API Calls
```
GET    /api/quotations          → รายการ
POST   /api/quotations          → สร้าง
PUT    /api/quotations/:id      → แก้ไข (เปลี่ยน status)
DELETE /api/quotations/:id      → ลบ
```

---

## A8. ฟอร์มใบเสนอราคา (QuotationForm)
**Routes:** `/admin/quotations/new`, `/admin/quotations/edit/:id`  
**File:** `src/pages/QuotationForm.jsx`  

### Quotation Fields
- เลขที่ใบเสนอราคา (auto-generate)
- วันที่
- ลูกค้า (select)
- รายการสินค้า/บริการ (multiple line items)
  - ชื่อรายการ, จำนวน, ราคา/หน่วย
- ส่วนลด (%)
- ภาษีมูลค่าเพิ่ม (%)
- ยอดรวม (คำนวณอัตโนมัติ)
- หมายเหตุ
- เงื่อนไขการชำระ

---

## A9. ใบแจ้งหนี้ (Invoices)
**Route:** `/admin/invoices`  
**File:** `src/pages/Invoices.jsx`  
**Next.js Path:** `app/admin/invoices/page.tsx`

### คำอธิบาย
รายการใบแจ้งหนี้ สร้างได้จากใบเสนอราคาหรือสร้างใหม่

### Invoice Status
- draft, sent, paid, overdue, cancelled

### API Calls
```
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices
PUT    /api/invoices/:id
DELETE /api/invoices/:id
```

---

## A10. ใบกำกับภาษี (TaxInvoices)
**Route:** `/admin/tax-invoices`  
**File:** `src/pages/TaxInvoices.jsx`  
**Next.js Path:** `app/admin/tax-invoices/page.tsx`

### คำอธิบาย
ใบกำกับภาษีมูลค่าเพิ่ม (VAT Invoice) สำหรับกิจการจดทะเบียน VAT

### ข้อมูลเพิ่มเติมจาก Invoice ปกติ
- เลขประจำตัวผู้เสียภาษีของลูกค้า
- VAT 7%
- ราคาก่อนภาษี / ภาษี / ราคารวมภาษี

### API Calls
```
GET    /api/tax-invoices
GET    /api/tax-invoices/:id
POST   /api/tax-invoices
PUT    /api/tax-invoices/:id
DELETE /api/tax-invoices/:id
```

---

## A11. ใบเสร็จรับเงิน (Receipts)
**Routes:** `/admin/receipts`, `/admin/receipts/new`, etc.  
**File:** `src/pages/Receipts.jsx`, `src/pages/ReceiptForm.jsx`  
**Next.js Path:** `app/admin/receipts/...`

### คำอธิบาย
ออกใบเสร็จรับเงินหลังจากได้รับชำระ สร้างได้จาก TaxInvoice หรือ Quotation หรือสร้างใหม่

### Receipt Routes พิเศษ
- `/receipts/new/:taxInvoiceId` → สร้างจากใบกำกับภาษี
- `/receipts/new/quote/:quotationId` → สร้างจากใบเสนอราคา
- `/receipts/print/:id` → โหมดพิมพ์ (ไม่มี layout)

### API Calls
```
GET    /api/receipts
GET    /api/receipts/:id
POST   /api/receipts
PUT    /api/receipts/:id
DELETE /api/receipts/:id
```

---

## A12. พนักงาน (Employees)
**Route:** `/admin/employees`  
**File:** `src/pages/Employees.jsx`  
**Next.js Path:** `app/admin/employees/page.tsx`

### คำอธิบาย
จัดการข้อมูลพนักงาน เพิ่ม/แก้ไข/ลบ ผ่าน `<EmployeeDialog>` modal

### Employee Fields (สันนิษฐาน)
- ชื่อ-นามสกุล
- ตำแหน่ง
- แผนก
- อีเมล
- เบอร์โทร
- วันเริ่มงาน
- เงินเดือน

### API Calls
```
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

---

## A13. ผู้ดูแลระบบ (Admins)
**Route:** `/admin/admins`  
**File:** `src/pages/Admins.jsx`  
**Next.js Path:** `app/admin/admins/page.tsx`

### คำอธิบาย
จัดการ admin accounts เพิ่ม/แก้ไข/ลบ admin

### Admin Fields
- ชื่อ
- อีเมล
- รหัสผ่าน (hash)
- บทบาท (role: super-admin / admin)

### API Calls
```
GET    /api/admins
POST   /api/admins
PUT    /api/admins/:id
DELETE /api/admins/:id
```

---

## A14. Credential ลูกค้า (CustomerCredentials)
**Routes:** `/admin/customer-credentials`, `/admin/customer-credentials/new`, `/admin/customer-credentials/edit/:id`  
**Files:** `src/pages/CustomerCredentials.jsx`, `src/pages/CustomerCredentialForm.jsx`  
**Next.js Path:** `app/admin/customer-credentials/...`

### คำอธิบาย
เก็บข้อมูล login/credentials ของลูกค้า เช่น Hosting, cPanel, FTP, Database

### Credential Fields (สันนิษฐาน)
- ลูกค้า (relation)
- ประเภท (hosting/cpanel/ftp/database/etc.)
- URL/Host
- Username
- Password (ควร encrypt)
- หมายเหตุ

### API Calls
```
GET    /api/customer-credentials
GET    /api/customer-credentials/:id
GET    /api/customer-credentials/customer/:customerId
POST   /api/customer-credentials
PUT    /api/customer-credentials/:id
DELETE /api/customer-credentials/:id
```

---

## A15. บัญชีรายรับ-รายจ่าย (Accounting)
**Route:** `/admin/accounting`  
**File:** `src/pages/Accounting.jsx`  
**Next.js Path:** `app/admin/accounting/page.tsx`

### คำอธิบาย
ระบบบัญชีรายรับ-รายจ่ายแบบง่าย สามารถ export Excel ได้

### หมวดรายรับ (incomeCategories)
- รับเงินโปรเจค (`project_payment`)
- ค่าบริการ (`service_fee`)
- ที่ปรึกษา (`consultation`)
- ดูแลรักษา (`maintenance`)
- รายรับอื่นๆ (`other_income`)

### หมวดรายจ่าย (expenseCategories)
- เงินเดือน/ค่าจ้าง (`salary`)
- ซอฟต์แวร์/ลิขสิทธิ์ (`software`)
- อุปกรณ์/Hardware (`equipment`)
- การตลาด (`marketing`)
- ค่าเช่า (`rent`)
- สาธารณูปโภค (`utilities`)
- ภาษี (`tax`)
- รายจ่ายอื่นๆ (`other_expense`)

### วิธีชำระเงิน
- โอนธนาคาร, เงินสด, บัตรเครดิต, เช็ค, อื่นๆ

### ประเภทไฟล์แนบ
- สลิปโอนเงิน (payment_slip)
- หัก ณ ที่จ่าย (withholding_tax)
- เอกสารอื่นๆ (other)

### Features พิเศษ
- Summary card: รายรับ / รายจ่าย / กำไรสุทธิ
- Filter ตามปี/เดือน
- **Export Excel** (ใช้ `xlsx` library)
- Upload ไฟล์แนบ (multipart/form-data)

### API Calls
```
GET    /api/accounting                    → รายการ (รับ params filter)
GET    /api/accounting/summary?year=      → summary ต่อปี
GET    /api/accounting/:id
POST   /api/accounting
PUT    /api/accounting/:id
DELETE /api/accounting/:id
POST   /api/accounting/:id/attachments    → อัปโหลดไฟล์แนบ
DELETE /api/accounting/:id/attachments/:attachmentId
```

---

## A16. Client Logos (ClientLogos)
**Route:** `/admin/client-logos`  
**File:** `src/pages/ClientLogos.jsx`  
**Next.js Path:** `app/admin/client-logos/page.tsx`

### คำอธิบาย
จัดการโลโก้ลูกค้าที่แสดงใน `<CustomerSection>` บนเว็บไซต์หน้าแรก

### Features
- อัปโหลดภาพโลโก้ (multipart/form-data)
- toggle แสดง/ซ่อน
- เรียงลำดับ
- ลบ

### API Calls
```
GET    /api/client-logos           → admin view
GET    /api/client-logos/public    → public (เว็บไซต์)
POST   /api/client-logos           → อัปโหลด (multipart)
PUT    /api/client-logos/:id       → แก้ไข (multipart)
DELETE /api/client-logos/:id       → ลบ
```

---

## A17. ตั้งค่าระบบ (Settings)
**Route:** `/admin/settings`  
**File:** `src/pages/Settings.jsx`  
**Next.js Path:** `app/admin/settings/page.tsx`

### คำอธิบาย
ตั้งค่าข้อมูลบริษัทที่ใช้ในเอกสาร (ใบเสนอราคา, ใบแจ้งหนี้, ใบเสร็จ)

### Settings Fields (สันนิษฐาน)
- ชื่อบริษัท
- ที่อยู่
- เลขประจำตัวผู้เสียภาษี
- โทรศัพท์
- อีเมล
- โลโก้บริษัท (upload)
- เงื่อนไขการชำระเงิน default
- ข้อความท้ายเอกสาร

### API Calls
```
GET    /api/settings
POST   /api/settings          → save
POST   /api/settings/upload   → อัปโหลดโลโก้ (multipart)
```

---

## A18. การตั้งค่าบัญชี (AccountSettings)
**Route:** `/admin/account-settings`  
**File:** `src/pages/AccountSettings.jsx`  
**Next.js Path:** `app/admin/account-settings/page.tsx`

### คำอธิบาย
ตั้งค่าบัญชีส่วนตัวของ admin ที่ล็อกอินอยู่ — เปลี่ยนชื่อ, อีเมล, รหัสผ่าน

---

## A19. Migrate Data
**Route:** `/admin/migrate-data`  
**File:** `src/pages/MigrateData.jsx`  
**Next.js Path:** `app/admin/migrate-data/page.tsx`

### คำอธิบาย
เครื่องมือ migrate ข้อมูล — ใช้สำหรับ one-time data import/export หรือ database migration

---

# ส่วนที่ 4: สถาปัตยกรรมที่ควรเปลี่ยนตอนย้าย Next.js

---

## 1. Authentication

### ปัจจุบัน (React)
```js
localStorage.setItem('adminUser', JSON.stringify(data))
```
ตรวจใน `<ProtectedRoute>` ทุกครั้งที่ render

### แนะนำสำหรับ Next.js
- เปลี่ยนเป็น httpOnly cookie
- ใช้ Next.js Middleware (`middleware.ts`) ตรวจ auth ก่อน render หน้า admin
- ใช้ `next-auth` หรือ custom session handler

```ts
// middleware.ts
import { NextResponse } from 'next/server'
export function middleware(request) {
  const token = request.cookies.get('admin_token')
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

---

## 2. SEO — จาก react-helmet → Next.js Metadata

### ปัจจุบัน
```jsx
<Helmet>
  <title>...</title>
  <meta name="description" content="..." />
</Helmet>
```

### Next.js App Router
```ts
// app/page.tsx
export const metadata = {
  title: '...',
  description: '...',
}

// หรือ dynamic
export async function generateMetadata({ params }) {
  return { title: `...${params.slug}` }
}
```

---

## 3. Client vs Server Components

| Component/Page | ประเภท | เหตุผล |
|----------------|--------|--------|
| หน้า Home | Server + Client children | ต้องการ Client สำหรับ animation |
| HeroSection | Client | animation, state |
| CustomerSection | Server | fetch API ได้เลย |
| BlogSection | Server | static data |
| About, Service, ServiceDetail | Client | mouse tracker |
| Contact | Client | form state |
| Portfolio | Client | filter/search state, parallax |
| ArticleDetail | Client | share URL, navigate(-1) |
| PrivacyPolicy | Server | static content |
| Dashboard | Client | chart, real-time data |
| ทุกหน้า Admin | Client | form, toast, state |

---

## 4. Images — จาก `<img>` → `next/image`

```jsx
// ก่อน
<img src={item.image} alt={item.title} />

// หลัง
import Image from 'next/image'
<Image src={item.image} alt={item.title} width={800} height={500} />
```

เพิ่มใน `next.config.js`:
```js
images: {
  remotePatterns: [
    { hostname: 'res.cloudinary.com' },
    { hostname: 'images.unsplash.com' },
    { hostname: 'wooyoucreative.com' },
  ]
}
```

---

## 5. API Service Layer

ปัจจุบัน `src/services/api.js` ใช้ axios กับ `VITE_API_URL`

### Next.js
- เปลี่ยน `import.meta.env.VITE_API_URL` → `process.env.NEXT_PUBLIC_API_URL`
- Server Components ใช้ `fetch()` โดยตรง (พร้อม caching)
- Client Components ยังใช้ axios ได้ หรือเปลี่ยนเป็น SWR/TanStack Query

---

## 6. ไฟล์ที่ต้องย้าย/สร้างใหม่

| ปัจจุบัน | Next.js |
|---------|---------|
| `src/App.jsx` (routing) | `app/` directory structure |
| `src/main.jsx` | `app/layout.tsx` |
| `src/index.css` | `app/globals.css` |
| `src/lib/utils.js` | `lib/utils.ts` |
| `src/data/blogData.js` | `lib/blogData.ts` |
| `src/services/api.js` | `lib/api.ts` |
| `src/hooks/useCookieConsent.js` | `hooks/useCookieConsent.ts` |
| `public/` | `public/` |

---

## 7. Dependencies ที่ต้องตรวจสอบ

| Package | ใช้ใน | Next.js Compatible? |
|---------|-------|---------------------|
| `framer-motion` | animation ทุกที่ | ✅ (ต้อง `"use client"`) |
| `react-helmet` | SEO | ❌ → ใช้ Metadata API แทน |
| `react-router-dom` | routing | ❌ → ใช้ Next.js routing |
| `axios` | API calls | ✅ |
| `@radix-ui/*` (shadcn) | UI components | ✅ |
| `react-icons` | icons | ✅ |
| `recharts` | charts | ✅ (Client Component) |
| `xlsx` | export Excel | ✅ (Client Component) |
| `three.js` / `@react-three/fiber` | 3D Model | ✅ (Client Component) |

---

## 8. Environment Variables

| Variable | ปัจจุบัน | Next.js |
|----------|---------|---------|
| API URL | `VITE_API_URL` | `NEXT_PUBLIC_API_URL` |
| (server-side secrets) | N/A | ใช้ `API_SECRET` (ไม่ต้อง NEXT_PUBLIC_) |

---

*เอกสารนี้สร้างเมื่อ 22 กรกฎาคม 2568 — ครอบคลุม 9 หน้า Public Website และ 19 หน้า Admin Panel*

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Cookie,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  Share2,
  Shield,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | Wooyou Creative",
  description:
    "นโยบายความเป็นส่วนตัวตามกฎหมาย PDPA ของ Wooyou Creative",
};

const sections = [
  { id: "intro",          label: "บทนำ" },
  { id: "data-collected", label: "ข้อมูลที่เก็บรวบรวม" },
  { id: "purpose",        label: "วัตถุประสงค์การใช้ข้อมูล" },
  { id: "disclosure",     label: "การเปิดเผยข้อมูล" },
  { id: "retention",      label: "ระยะเวลาการเก็บข้อมูล" },
  { id: "rights",         label: "สิทธิของเจ้าของข้อมูล" },
  { id: "cookies",        label: "นโยบายคุกกี้" },
  { id: "security",       label: "ความปลอดภัยของข้อมูล" },
  { id: "contact",        label: "ช่องทางติดต่อ" },
];

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #05050f 0%, #0c0c1e 40%, #0a0818 100%)",
      }}
    >

      {/* ── ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-20 size-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -right-40 top-60 size-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 size-[400px] -translate-x-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="relative">
        {/* ── Hero ── */}
        <div
          className="border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "#6e6e8a" }}
            >
              <ArrowLeft className="size-4" />
              <span className="hover:text-[#a3a3bd] transition-colors">กลับหน้าหลัก</span>
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                {/* PDPA badge */}
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
                  style={{
                    background: "rgba(37,99,235,0.12)",
                    border: "1px solid rgba(37,99,235,0.3)",
                  }}
                >
                  <Shield className="size-3.5" style={{ color: "#60a5fa" }} />
                  <span className="text-xs font-semibold" style={{ color: "#93c5fd" }}>
                    PDPA Compliant
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  นโยบาย{" "}
                  <span
                    style={{
                      backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #818cf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ความเป็นส่วนตัว
                  </span>
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "#6e6e8a" }}>
                  Wooyou Creative ให้ความสำคัญสูงสุดกับการปกป้องข้อมูลส่วนบุคคลของคุณ
                  เอกสารนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ และคุ้มครองข้อมูลของคุณ
                </p>
              </div>

              {/* meta info */}
              <div
                className="rounded-xl px-4 py-3 text-right text-xs"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#6e6e8a",
                }}
              >
                <div className="flex flex-col gap-1">
                  <span>อัปเดตล่าสุด <strong className="font-semibold" style={{ color: "#a3a3bd" }}>26 ก.ค. 2568</strong></span>
                  <span>มีผลบังคับใช้ <strong className="font-semibold" style={{ color: "#a3a3bd" }}>26 ก.ค. 2568</strong></span>
                  <span>เวอร์ชัน <strong className="font-semibold" style={{ color: "#a3a3bd" }}>1.0.0</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex gap-10 lg:gap-14">

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block lg:w-52 xl:w-60">
              <div className="sticky top-24">
                <p
                  className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#6e6e8a" }}
                >
                  สารบัญ
                </p>
                <nav className="flex flex-col">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="border-l-2 border-white/[0.06] py-2 pl-3 text-sm text-[#6e6e8a] transition-all hover:border-blue-400 hover:text-[#93c5fd]"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>

                <div
                  className="mt-8 rounded-xl p-4 text-xs"
                  style={{
                    background: "rgba(37,99,235,0.06)",
                    border: "1px solid rgba(37,99,235,0.15)",
                    color: "#6e6e8a",
                  }}
                >
                  <p className="mb-2 font-semibold" style={{ color: "#93c5fd" }}>อ้างอิงกฎหมาย</p>
                  <p className="leading-relaxed">
                    พ.ร.บ.คุ้มครองข้อมูล
                    <br />ส่วนบุคคล พ.ศ. 2562
                    <br />(PDPA Thailand)
                  </p>
                </div>
              </div>
            </aside>

            {/* ── Content ── */}
            <div className="min-w-0 flex-1 space-y-2">

              <Section id="intro" num="01" icon={<FileText className="size-4" />} title="บทนำ">
                <p>
                  บริษัท วูยู ครีเอทีฟ จำกัด (&ldquo;บริษัท&rdquo; หรือ &ldquo;เรา&rdquo;) ดำเนินกิจการภายใต้เว็บไซต์{" "}
                  <Highlight>wooyoucreative.com</Highlight>{" "}
                  ให้บริการออกแบบและพัฒนาเว็บไซต์ ระบบ ERP และการตลาดดิจิทัล
                </p>
                <p>
                  นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                  เพื่อแจ้งให้คุณทราบถึงแนวทางปฏิบัติของเราในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล
                </p>
                <p>
                  การเข้าใช้งานเว็บไซต์หรือบริการของเรา ถือว่าคุณได้อ่านและยอมรับนโยบายฉบับนี้แล้ว
                </p>
              </Section>

              <Section id="data-collected" num="02" icon={<Database className="size-4" />} title="ข้อมูลที่เก็บรวบรวม">
                <p>เราเก็บรวบรวมข้อมูลส่วนบุคคลหลายประเภทตามบริบทการใช้งาน ดังนี้</p>
                <DataTable
                  headers={["ประเภทข้อมูล", "รายละเอียด"]}
                  rows={[
                    ["ข้อมูลติดต่อ",        "ชื่อ นามสกุล อีเมล เบอร์โทรศัพท์"],
                    ["ข้อมูลธุรกิจ",        "ชื่อบริษัท ประเภทธุรกิจ ขนาดองค์กร"],
                    ["ข้อมูลการใช้งาน",     "IP address, cookies, หน้าที่เยี่ยมชม, เวลาที่ใช้"],
                    ["ข้อมูลอุปกรณ์",       "ประเภทเบราว์เซอร์ ระบบปฏิบัติการ ความละเอียดหน้าจอ"],
                    ["ข้อความจากแบบฟอร์ม", "เนื้อหาที่คุณส่งผ่านช่องทางติดต่อ"],
                  ]}
                />
              </Section>

              <Section id="purpose" num="03" icon={<Eye className="size-4" />} title="วัตถุประสงค์การใช้ข้อมูล">
                <p>เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้</p>
                <BulletList items={[
                  "ติดต่อกลับและให้บริการตามที่คุณร้องขอ",
                  "จัดทำใบเสนอราคาและเอกสารที่เกี่ยวข้อง",
                  "พัฒนาและปรับปรุงบริการของเรา",
                  "วิเคราะห์พฤติกรรมการใช้งานเพื่อ UX ที่ดีขึ้น",
                  "ส่งข้อมูลข่าวสารหรือโปรโมชัน (เฉพาะกรณีที่ได้รับความยินยอม)",
                  "ปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง",
                ]} />
              </Section>

              <Section id="disclosure" num="04" icon={<Share2 className="size-4" />} title="การเปิดเผยข้อมูล">
                <p>
                  เราไม่ขาย ไม่ให้เช่า และไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สาม
                  เพื่อวัตถุประสงค์ทางการตลาดโดยไม่ได้รับความยินยอม อาจมีการเปิดเผยในกรณีดังนี้
                </p>
                <div className="space-y-2">
                  {[
                    { title: "ผู้ให้บริการระบบ",   desc: "Google Analytics, Vercel, Hostinger เพื่อประมวลผลทางเทคนิค ภายใต้สัญญา DPA" },
                    { title: "ข้อกำหนดทางกฎหมาย", desc: "หน่วยงานรัฐหรือศาลที่มีอำนาจตามกฎหมาย เมื่อมีคำสั่งที่ชอบด้วยกฎหมาย" },
                    { title: "การโอนกิจการ",       desc: "ในกรณีที่มีการควบรวม ซื้อกิจการ หรือโอนทรัพย์สิน คุณจะได้รับแจ้งล่วงหน้า" },
                  ].map((item) => (
                    <InfoCard key={item.title} title={item.title} desc={item.desc} />
                  ))}
                </div>
              </Section>

              <Section id="retention" num="05" icon={<Clock className="size-4" />} title="ระยะเวลาการเก็บข้อมูล">
                <DataTable
                  headers={["ประเภทข้อมูล", "ระยะเวลา"]}
                  rows={[
                    ["ข้อมูลลูกค้า",    "ตลอดระยะเวลาที่ใช้บริการ + 5 ปี"],
                    ["บันทึกการติดต่อ", "3 ปีนับจากวันที่ติดต่อ"],
                    ["ข้อมูล Analytics", "26 เดือน (ค่า default ของ GA4)"],
                    ["Cookies",         "ตาม session หรือสูงสุด 13 เดือน"],
                    ["เอกสารทางบัญชี", "5 ปีตามกฎหมายบัญชี"],
                  ]}
                />
                <p>
                  เมื่อพ้นระยะเวลาดังกล่าว เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้ภายใน{" "}
                  <Highlight>30 วัน</Highlight>
                </p>
              </Section>

              <Section id="rights" num="06" icon={<UserCheck className="size-4" />} title="สิทธิของเจ้าของข้อมูล">
                <p>ภายใต้กฎหมาย PDPA คุณมีสิทธิดังต่อไปนี้</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { right: "สิทธิในการเข้าถึง",     desc: "ขอสำเนาข้อมูลที่เราเก็บไว้เกี่ยวกับคุณ" },
                    { right: "สิทธิในการแก้ไข",       desc: "ขอให้แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน" },
                    { right: "สิทธิในการลบ",           desc: "ขอให้ลบข้อมูลเมื่อไม่จำเป็นต้องเก็บอีกต่อไป" },
                    { right: "สิทธิในการโอนย้าย",     desc: "ขอรับข้อมูลในรูปแบบที่อ่านได้ด้วยเครื่อง" },
                    { right: "สิทธิในการคัดค้าน",     desc: "คัดค้านการประมวลผลที่อ้างฐาน legitimate interest" },
                    { right: "สิทธิถอนความยินยอม",   desc: "ถอนได้ตลอดเวลา โดยไม่กระทบการใช้งานก่อนหน้า" },
                  ].map((item) => (
                    <div
                      key={item.right}
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                      }}
                    >
                      <p className="mb-1 text-sm font-semibold text-white">{item.right}</p>
                      <p className="text-sm" style={{ color: "#8888aa" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p>
                  หากต้องการใช้สิทธิ กรุณาติดต่อเราผ่านช่องทางด้านล่าง
                  เราจะดำเนินการภายใน <Highlight>30 วัน</Highlight> นับจากวันที่ได้รับคำร้อง
                </p>
              </Section>

              <Section id="cookies" num="07" icon={<Cookie className="size-4" />} title="นโยบายคุกกี้">
                <p>เราใช้คุกกี้และเทคโนโลยีที่คล้ายกัน แบ่งเป็น 3 ประเภท</p>
                <DataTable
                  headers={["ประเภทคุกกี้", "วัตถุประสงค์", "ความยินยอม"]}
                  rows={[
                    ["คุกกี้ที่จำเป็น", "Session, CSRF token, การทำงานพื้นฐาน", "ไม่ต้องการ"],
                    ["คุกกี้วิเคราะห์", "Google Analytics 4 (anonymized)", "ต้องการ"],
                    ["คุกกี้การตลาด",   "Facebook Pixel, Google Ads", "ต้องการ"],
                  ]}
                />
                <p>คุณสามารถจัดการคุกกี้ได้จากแบนเนอร์บนเว็บไซต์ หรือตั้งค่าในเบราว์เซอร์ของคุณ</p>
              </Section>

              <Section id="security" num="08" icon={<Lock className="size-4" />} title="ความปลอดภัยของข้อมูล">
                <p>เราใช้มาตรการรักษาความปลอดภัยหลายชั้น</p>
                <BulletList items={[
                  "เข้ารหัสข้อมูลระหว่างการส่งผ่าน HTTPS / TLS 1.3",
                  "จำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะพนักงานที่จำเป็น (least privilege)",
                  "ตรวจสอบและ audit log การเข้าถึงข้อมูลสำคัญ",
                  "อัปเดต security patch อย่างสม่ำเสมอ",
                  "สำรองข้อมูลและทดสอบการกู้คืนเป็นประจำ",
                ]} />
                <div
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(234,179,8,0.06)",
                    border: "1px solid rgba(234,179,8,0.2)",
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "#fde68a" }}>
                    <span className="font-semibold">หมายเหตุ:</span>{" "}
                    แม้เราจะใช้มาตรการรักษาความปลอดภัยอย่างเต็มที่
                    การส่งข้อมูลผ่านอินเทอร์เน็ตไม่สามารถรับประกันความปลอดภัย 100% ได้
                    หากพบการละเมิดข้อมูล เราจะแจ้งให้ทราบภายใน 72 ชั่วโมง
                  </p>
                </div>
              </Section>

              <Section id="contact" num="09" icon={<Mail className="size-4" />} title="ช่องทางติดต่อ">
                <p>
                  หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการใช้สิทธิของเจ้าของข้อมูล
                  กรุณาติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ของเรา
                </p>
                <div
                  className="overflow-hidden rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(124,58,237,0.1) 100%)",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  <div className="px-5 py-5">
                    <p className="mb-0.5 font-semibold text-white">บริษัท วูยู ครีเอทีฟ จำกัด</p>
                    <p className="mb-5 text-sm" style={{ color: "#6e6e8a" }}>กรุงเทพมหานคร ประเทศไทย</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="mailto:privacy@wooyoucreative.co.th"
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-[#a3a3bd] transition-all hover:border-blue-400/40 hover:text-[#93c5fd]"
                      >
                        <Mail className="size-4" />
                        privacy@wooyoucreative.co.th
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex h-9 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                          boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                        }}
                      >
                        แบบฟอร์มติดต่อ
                      </Link>
                    </div>
                    <p className="mt-4 text-xs" style={{ color: "#6e6e8a" }}>ตอบกลับภายใน 2 วันทำการ</p>
                  </div>
                </div>
              </Section>

            </div>
          </div>

          {/* footer note */}
          <div
            className="mt-14 border-t pt-8 text-center"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm" style={{ color: "#6e6e8a" }}>
              นโยบายนี้อาจมีการปรับปรุงเป็นครั้งคราว เราจะแจ้งให้ทราบเมื่อมีการเปลี่ยนแปลงสำคัญ
            </p>
            <p className="mt-1 text-xs" style={{ color: "#3d3d5a" }}>
              © 2568 Wooyou Creative · อัปเดตล่าสุด 26 กรกฎาคม 2568
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Primitives ── */

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-white">
      {children}
    </span>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      <p className="mb-1 text-sm font-semibold text-white">{title}</p>
      <p className="text-sm" style={{ color: "#8888aa" }}>{desc}</p>
    </div>
  );
}

function Section({
  id, num, icon, title, children,
}: {
  id: string;
  num: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {/* header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "rgba(37,99,235,0.2)",
            color: "#93c5fd",
          }}
        >
          {icon}
        </span>
        <h2 className="flex-1 text-[15px] font-semibold text-white">
          {title}
        </h2>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-mono tabular-nums"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {num}
        </span>
      </div>

      {/* body */}
      <div
        className="space-y-4 px-5 py-5 text-sm leading-[1.85]"
        style={{ color: "#b8b8d0" }}
      >
        {children}
      </div>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div
      className="overflow-x-auto rounded-xl"
      style={{ border: "1px solid rgba(255,255,255,0.09)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              background: "linear-gradient(90deg, rgba(37,99,235,0.18) 0%, rgba(124,58,237,0.12) 100%)",
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3"
                  style={{
                    color: j === 0 ? "#ffffff" : "#b8b8d0",
                    fontWeight: j === 0 ? 600 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3" style={{ color: "#a3a3bd" }}>
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

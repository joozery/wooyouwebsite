/* eslint-disable @next/next/no-img-element */

import { getTranslations } from "next-intl/server";

interface ClientLogo {
  _id?: string;
  name?: string;
  imageUrl?: string;
  image?: string;
  logoUrl?: string;
}

const fallbackLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Netflix", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Spotify", src: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
  { name: "Stripe", src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
];

async function getClientLogos(): Promise<ClientLogo[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client-logos/public`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch {
    return [];
  }
}

function LogoCard({ src, name }: { src: string; name: string }) {
  return (
    <div className="flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <img src={src} alt={name} className="max-h-8 w-auto object-contain" />
    </div>
  );
}

export default async function CustomerSection() {
  const t = await getTranslations("customers");
  const logos = await getClientLogos();

  // build item list — real logos or styled fallback cards
  let items: { key: string; src: string; name: string }[] = [];
  
  if (logos.length > 0) {
    items = logos
      .filter((l) => l.imageUrl ?? l.image ?? l.logoUrl)
      .map((l, i) => ({
        key: l._id ?? String(i),
        src: (l.imageUrl ?? l.image ?? l.logoUrl) as string,
        name: l.name ?? "client",
      }));
  }
  
  if (items.length === 0) {
    items = fallbackLogos.map((c) => ({ key: c.name, src: c.src, name: c.name }));
  }

  // triple so both rows loop seamlessly
  const row1 = [...items, ...items, ...items, ...items];
  const row2 = [...items, ...items, ...items, ...items].reverse();

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* hairline borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* heading */}
      <div className="mb-14 text-center">
        <span className="text-xs font-semibold tracking-[2px] text-gray-400 uppercase">
          Our Clients
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-gray-900 sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-base text-gray-500">
          {t("subtitle")}
        </p>
        <div className="mt-5 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 sm:text-3xl">{t("gov")}</p>
            <p className="mt-1 text-xs font-medium tracking-wide text-gray-400 uppercase">Government</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-600 sm:text-3xl">{t("private")}</p>
            <p className="mt-1 text-xs font-medium tracking-wide text-gray-400 uppercase">Private Sector</p>
          </div>
        </div>
      </div>

      {/* marquee rows */}
      <div className="flex flex-col gap-6">
        {/* Row 1 — scrolls left */}
        <div className="relative flex overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-white to-transparent" />
          <div className="flex animate-[marquee_80s_linear_infinite] gap-6 pr-6">
            {row1.map((item, i) => (
              <LogoCard key={`r1-${item.key}-${i}`} src={item.src} name={item.name} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="relative flex overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-white to-transparent" />
          <div className="flex animate-[marquee_80s_linear_infinite] gap-6 pr-6 [animation-direction:reverse]">
            {row2.map((item, i) => (
              <LogoCard key={`r2-${item.key}-${i}`} src={item.src} name={item.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

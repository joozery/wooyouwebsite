/* eslint-disable @next/next/no-img-element */

interface ClientLogo {
  _id?: string;
  name?: string;
  imageUrl?: string;
  image?: string;
  logoUrl?: string;
}

const fallbackClients = [
  "Vista Thailand",
  "Gography",
  "Respect Engineering",
  "Gaining Travels",
  "Devdechawatd",
  "เช็คช่างก่อนโอน",
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

export default async function CustomerSection() {
  const logos = await getClientLogos();

  return (
    <section className="border-y border-hairline bg-surface-soft py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="text-xs font-semibold tracking-[1.5px] text-brand-lavender uppercase">
          Our Clients
        </span>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink">
          ลูกค้าที่ไว้วางใจเรา
        </h2>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.length > 0
            ? logos.map((logo, i) => {
                const src = logo.imageUrl ?? logo.image ?? logo.logoUrl;
                if (!src) return null;
                return (
                  <img
                    key={logo._id ?? i}
                    src={src}
                    alt={logo.name ?? "client logo"}
                    className="h-10 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    loading="lazy"
                  />
                );
              })
            : fallbackClients.map((name) => (
                <span
                  key={name}
                  className="text-lg font-semibold tracking-tight text-muted-soft"
                >
                  {name}
                </span>
              ))}
        </div>
      </div>
    </section>
  );
}

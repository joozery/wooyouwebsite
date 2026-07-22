import type { Metadata } from "next";
import { notFound } from "next/navigation";

const serviceTypes = [
  "web-development",
  "ui-ux-design",
  "digital-marketing",
  "erp-systems",
  "game-development",
  "mobile-apps",
] as const;

export function generateStaticParams() {
  return serviceTypes.map((serviceType) => ({ serviceType }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceType: string }>;
}): Promise<Metadata> {
  const { serviceType } = await params;
  return {
    title: `${serviceType} | Wooyou Creative`,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceType: string }>;
}) {
  const { serviceType } = await params;

  if (!serviceTypes.includes(serviceType as (typeof serviceTypes)[number])) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">{serviceType}</h1>
    </main>
  );
}

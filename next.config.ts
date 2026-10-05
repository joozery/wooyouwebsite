import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  experimental: { turbopackFileSystemCacheForDev: false },
  images: {
    remotePatterns: [
      ...(r2PublicUrl ? [new URL(`${r2PublicUrl.replace(/\/$/, "")}/**`)] : []),
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "wooyoucreative.com" },
    ],
  },
};

export default withNextIntl(nextConfig);

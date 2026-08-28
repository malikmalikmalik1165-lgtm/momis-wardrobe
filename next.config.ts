import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.markaz.app",
      },
      // Excel/Markaz/WooCommerce import se aati hui product images kisi bhi CDN par
      // ho sakti hain — agar sirf specific hosts allow hoti hain to imported
      // products ki pics render nahi hotin (next/image 400 deta hai). Is liye
      // har https host allow hai.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Momis Wardrobe — Elegant Women's Fashion",
  description:
    "Discover curated women's fashion at Momis Wardrobe. Shop elegant dresses, luxury bags, designer shoes, and premium tops. Free shipping on orders over Rs. 15,000.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Momis Wardrobe",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "Momis Wardrobe — Elegant Women's Fashion",
    description: "Shop elegant dresses, bags, shoes & more. Ghar baithay shopping karein!",
    type: "website",
    locale: "ur_PK",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ur">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        {/* PWA / App Icons */}
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Momis Wardrobe" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className="bg-cream text-warm-gray-900 antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <InstallPrompt />
      </body>
    </html>
  );
}

"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { ToastContainer } from "@/components/Toast";
import AlertInterceptor from "@/components/AlertInterceptor";

// Lazy load heavy components — website loads FAST
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), { ssr: false });
const AiChat = dynamic(() => import("@/components/AiChat"), { ssr: false });
const InstallPrompt = dynamic(() => import("@/components/InstallPrompt"), { ssr: false });

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <AlertInterceptor />
        <ToastContainer />
        {children}
      </>
    );
  }

  return (
    <>
      <AlertInterceptor />
      <Header />
      <CartDrawer />
      <main className="pb-14 sm:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <WhatsAppFloat />
      <AiChat />
      <InstallPrompt />
      <ToastContainer />
    </>
  );
}

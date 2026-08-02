"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import InstallPrompt from "@/components/InstallPrompt";
import MobileNav from "@/components/MobileNav";
import { ToastContainer } from "@/components/Toast";
import AlertInterceptor from "@/components/AlertInterceptor";

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
      <InstallPrompt />
      <ToastContainer />
    </>
  );
}

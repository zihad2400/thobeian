import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/layout/AuthInitializer";
import CartInitializer from "@/components/layout/CartInitializer";
import WishlistInitializer from "@/components/layout/WishlistInitializer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "THOBEIAN — Premium Islamic Fashion",
    template: "%s | THOBEIAN",
  },
  description:
    "Premium Thobe & Panjabi — Sunnah in Style. Custom-made Islamic fashion for the modern gentleman.",
  keywords: ["thobe", "panjabi", "islamic fashion", "bangladesh"],
  icons: {
    icon: [
      { url: "/images/logo/thobeian-favicon.png", sizes: "any" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "THOBEIAN — Premium Islamic Fashion",
    description: "Sunnah in Style. Premium Thobes, Jubbas & Panjabis.",
    images: ["/images/logo/thobeian-logo-optimized.png"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo/thobeian-favicon.png" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="theme-color" content="#1F2A44" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthInitializer />
        <CartInitializer />
        <WishlistInitializer />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton
          phoneNumber="8801350888080"
          message="Hello THOBEIAN! I need help with my order."
          position="bottom-right"
        />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1F1F1F",
              color: "#fff",
              borderRadius: 0,
            },
          }}
        />
      </body>
    </html>
  );
}

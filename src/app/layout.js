import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/layout/AuthInitializer";
import CartInitializer from "@/components/layout/CartInitializer";
import WishlistInitializer from "@/components/layout/WishlistInitializer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    default: "THOBEIAN — Premium Islamic Fashion",
    template: "%s | THOBEIAN",
  },
  description:
    "Premium Thobe & Panjabi — Sunnah in Style. Custom-made Islamic fashion for the modern gentleman.",
  keywords: ["thobe", "panjabi", "islamic fashion", "bangladesh"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <AuthInitializer />
        <CartInitializer />
        <WishlistInitializer />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
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

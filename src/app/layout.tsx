import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/components/auth/NextAuthProvider";

export const metadata: Metadata = {
  title: "BloomShop - Hoa Tươi Mỗi Ngày | Đặt Hoa Online",
  description:
    "BloomShop - Shop hoa tươi trực tuyến hàng đầu. Giao hoa nhanh trong 2 giờ. Hoa sinh nhật, hoa chúc mừng, hoa cưới, hoa chia buồn. Miễn phí giao hàng đơn từ 500K.",
  keywords: "hoa tươi, đặt hoa online, hoa sinh nhật, hoa valentine, shop hoa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col">
        <NextAuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "16px",
                background: "#fff",
                color: "var(--color-dark)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              },
            }}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}

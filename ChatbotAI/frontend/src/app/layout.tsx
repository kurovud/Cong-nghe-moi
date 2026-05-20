import "../styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingChat from "@/components/chat/FloatingChat";

export const metadata: Metadata = {
  title: "PC Builder Shop - Linh kiện PC, Laptop & Build PC",
  description:
    "Mua linh kiện PC, laptop gaming, bộ PC build sẵn. Chatbot AI tư vấn cấu hình, hướng dẫn lắp ráp chi tiết.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingChat />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;

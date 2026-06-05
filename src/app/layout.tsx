import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Auto Thọ Xuân",
  description:
    "Chuyên cung cấp phụ tùng xe tải chính hãng cho nhiều dòng xe phổ biến tại Việt Nam. Hỗ trợ tra mã phụ tùng, tư vấn kỹ thuật và giao hàng nhanh toàn quốc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

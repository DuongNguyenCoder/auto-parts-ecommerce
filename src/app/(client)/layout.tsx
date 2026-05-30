import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <main className="pb-16">{children}</main>

      <Footer />
    </>
  );
}

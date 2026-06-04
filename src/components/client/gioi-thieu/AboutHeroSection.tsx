import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-14 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="mb-5 inline-flex gap-2 items-center rounded-full border bg-muted px-4 py-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary shrink-0" />
              Hệ thống phụ tùng ô tô chính hãng
            </div>

            <h1 className="max-w-3xl text-4xl text-center font-black tracking-tight text-balance md:text-5xl lg:text-6xl">
              VỀ <span className="text-primary">AUTO&nbsp;THỌ&nbsp;XUÂN</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Chuyên cung cấp phụ tùng xe tải chính hãng cho nhiều dòng xe phổ
              biến tại Việt Nam. Hỗ trợ tra mã phụ tùng, tư vấn kỹ thuật và giao
              hàng nhanh toàn quốc.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Đúng mã phụ tùng",
                "Hỗ trợ kỹ thuật tận tâm",
                "Giá tốt cho gara & doanh nghiệp",
                "Giao hàng toàn quốc",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/san-pham"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Tìm phụ tùng ngay
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background px-6 font-semibold transition hover:bg-muted"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-primary bg-muted">
              <Image
                src="/logo-1080x1080-autotx.png"
                alt="Phụ tùng ô tô tải"
                width={1000}
                height={800}
                className="aspect-[16/12] h-full w-full object-cover"
              />
            </div>

            {/* floating cards */}
            <div className="absolute border-amber-200/50 -right-4 -top-2 rounded-2xl border bg-background p-4 shadow-xl">
              <div className="text-lg xs:text-2xl font-black">2500+</div>
              <div className="text-xs xs:text-sm text-muted-foreground">
                Khách hàng
              </div>
            </div>

            <div className="absolute border-amber-200/50 -left-4 top-10 rounded-2xl border bg-background p-4 shadow-xl">
              <div className="text-lg xs:text-2xl font-black">5000+</div>
              <div className="text-xs xs:text-sm text-muted-foreground">
                Sản phẩm sẵn kho
              </div>
            </div>

            <div className="absolute border-amber-200/50 -bottom-4 right-4 rounded-2xl border bg-background p-4 shadow-xl">
              <div className="text-lg xs:text-2xl font-black">63 tỉnh</div>
              <div className="text-xs xs:text-sm text-muted-foreground">
                Giao hàng toàn quốc
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

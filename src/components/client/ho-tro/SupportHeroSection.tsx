import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";

const socials = [
  {
    label: "Zalo",
    href: "https://zalo.com",
    icon: "/icon/zalo.png",
  },
  {
    label: "Messenger",
    href: "https://messenger.com",
    icon: "/icon/messenger.png",
  },
  {
    label: "Youtube",
    href: "https://youtube.com",
    icon: "/icon/youtube.png",
  },
];

export function SupportHeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm font-medium">
              Trung tâm hỗ trợ
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl space-y-2">
              Chúng tôi luôn{" "}
              <span className="text-primary">sẵn&nbsp;sàng hỗ&nbsp;trợ</span>{" "}
              bạn
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Liên hệ nhanh để được tư vấn phụ tùng phù hợp, kiểm tra mã sản
              phẩm, hỗ trợ đặt hàng, vận chuyển hoặc các vấn đề sau mua hàng.
            </p>

            {/* trust points */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Hỗ trợ nhanh chóng",
                "Tư vấn đúng nhu cầu",
                "Đồng hành sau mua hàng",
                "Hỗ trợ toàn quốc",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="tel:0982575404"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Phone className="mr-2 size-4" />
                Gọi hotline
              </Link>

              <Link
                href="https://zalo.com"
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background px-6 font-semibold transition hover:bg-muted"
              >
                Chat Zalo
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="rounded-[32px] border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Hỗ trợ nhanh
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  Liên hệ với chúng tôi
                </h2>
              </div>

              {/* contact list */}
              <div className="space-y-4">
                <Link
                  href="tel:0982575404"
                  className="flex items-start gap-4 rounded-2xl border p-4 transition hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold">Hotline chính</div>

                    <div className="text-muted-foreground">0982 575 404</div>
                  </div>
                </Link>

                <Link
                  href="tel:0367200596"
                  className="flex items-start gap-4 rounded-2xl border p-4 transition hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold">Hotline hỗ trợ</div>

                    <div className="text-muted-foreground">0367 200 596</div>
                  </div>
                </Link>

                <Link
                  href="mailto:thoxuanautopart@gmail.com"
                  className="flex items-start gap-4 rounded-2xl border p-4 transition hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold">Email</div>

                    <div className="break-all text-muted-foreground">
                      thoxuanautopart@gmail.com
                    </div>
                  </div>
                </Link>

                <div className="flex items-start gap-4 rounded-2xl border p-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold">Địa chỉ</div>

                    <div className="text-muted-foreground">
                      Tu Hoàng, Xuân Phương, Nam Từ Liêm, Hà Nội
                    </div>
                  </div>
                </div>
              </div>

              {/* socials */}
              <div className="mt-8 border-t pt-6">
                <div className="mb-4 text-sm font-medium text-muted-foreground">
                  Kênh hỗ trợ khác
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {socials.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition hover:border-primary/30 hover:bg-muted/50"
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={36}
                        height={36}
                        className="size-9 object-contain"
                      />

                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

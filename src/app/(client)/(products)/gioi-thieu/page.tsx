"use client";

import {
  BadgeCheck,
  CarFront,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute left-1/2 top-24
            h-[420px] w-[420px]
            -translate-x-1/2 rounded-full
            bg-primary/10 blur-[120px]
            animate-pulse
          "
        />

        <div
          className="
            absolute right-0 top-0
            h-72 w-72 rounded-full
            bg-sky-500/10 blur-[100px]
          "
        />

        <div
          className="
            absolute bottom-0 left-0
            h-72 w-72 rounded-full
            bg-orange-500/10 blur-[100px]
          "
        />
      </div>

      <div
        className="
          container relative z-10
          flex min-h-[75vh]
          flex-col items-center
          justify-center px-4 py-20
          text-center
        "
      >
        {/* Badge */}
        <div
          className="
            mb-6 inline-flex items-center
            gap-2 rounded-full border
            bg-background/80 px-4 py-2
            text-sm shadow-sm
            backdrop-blur-md
          "
        >
          <Sparkles className="size-4 text-primary" />

          <span className="font-medium">Hệ thống phụ tùng ô tô chính hãng</span>
        </div>

        {/* Main icon */}
        <div
          className="
            group mb-8 flex size-28
            items-center justify-center
            rounded-[2rem]
            border bg-background
            shadow-lg transition-transform
            duration-500 hover:scale-105
          "
        >
          <CarFront
            className="
              size-14 text-primary
              transition-transform duration-500
              group-hover:scale-110
              group-hover:-translate-y-1
            "
          />
        </div>

        {/* Title */}
        <h1
          className="
            max-w-4xl text-balance
            text-4xl font-black
            tracking-tight sm:text-6xl
          "
        >
          Auto Thọ Xuân
        </h1>

        {/* Subtitle */}
        <p
          className="
            mt-5 max-w-2xl
            text-pretty text-lg
            leading-8 text-muted-foreground
          "
        >
          Cung cấp{" "}
          <span className="font-semibold text-foreground">
            phụ tùng chính hãng
          </span>
          , <span className="font-semibold text-foreground">giá tốt</span>. Ship
          COD{" "}
          <span className="font-semibold text-foreground">
            mọi miền tổ quốc
          </span>
          .
        </p>

        {/* Features */}
        <div
          className="
            mt-12 grid w-full
            max-w-4xl gap-4
            sm:grid-cols-3
          "
        >
          <FeatureCard
            icon={ShieldCheck}
            title="Chính Hãng"
            description="Nguồn hàng rõ ràng, chất lượng đảm bảo."
          />

          <FeatureCard
            icon={BadgeCheck}
            title="Giá Tốt"
            description="Giá cạnh tranh, tối ưu chi phí cho khách hàng."
          />

          <FeatureCard
            icon={Truck}
            title="Ship COD"
            description="Giao hàng toàn quốc, kiểm tra trước khi nhận."
          />
        </div>

        {/* Coming soon */}
        <div
          className="
            mt-14 inline-flex items-center
            gap-2 rounded-2xl border
            border-dashed px-5 py-3
            text-sm text-muted-foreground
          "
        >
          <PackageCheck className="size-4" />
          Nội dung giới thiệu chi tiết đang được cập nhật...
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="
        group rounded-[2rem]
        border bg-background/80
        p-6 text-left
        shadow-sm backdrop-blur-md
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div
        className="
          mb-4 flex size-12
          items-center justify-center
          rounded-2xl bg-primary/10
          text-primary
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        <Icon className="size-6" />
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p
        className="
          mt-2 text-sm
          leading-6 text-muted-foreground
        "
      >
        {description}
      </p>
    </div>
  );
}

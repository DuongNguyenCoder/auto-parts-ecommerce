"use client";

import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import { FOOTER_COMPANY, FOOTER_SOCIALS } from "./footer-config";

type FooterBrandProps = {
  className?: string;
  logo?: React.ReactNode;
};

export function FooterBrand({ className, logo }: FooterBrandProps) {
  return (
    <section
      aria-labelledby="footer-brand"
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Brand */}
      <div className="space-y-5">
        <div id="footer-brand" className="flex items-center gap-3">
          {logo ? logo : <DefaultLogo />}
        </div>

        <p className="max-w-sm text-sm leading-6 text-button-danger-foreground">
          {FOOTER_COMPANY.description}
        </p>
      </div>

      {/* Trust highlights */}
      <div className="space-y-3">
        <TrustBadge
          icon={ShieldCheck}
          title="100% Linh kiện Chính Hãng"
          description="Linh kiện ô tô chất lượng cao với hỗ trợ bảo hành."
        />

        <TrustBadge
          icon={Wrench}
          title="Hỗ trợ ô tô chuyên nghiệp"
          description="Nhận trợ giúp từ các chuyên gia bất cứ lúc nào."
        />
      </div>

      {/* Socials */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-button-danger-foreground">
          Follow us
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {FOOTER_SOCIALS.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  "group flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/50",
                  "text-button-danger-foreground backdrop-blur-sm transition-all duration-300",
                  "hover:-translate-y-1 hover:border-primary/20 hover:text-primary",
                  "hover:shadow-md",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-ring",
                  "focus-visible:ring-offset-2",
                )}
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Small trust statement */}
      <div className="rounded-2xl border border-border/60 bg-background/20 p-4 backdrop-blur-sm">
        <p className="text-sm leading-6 text-button-danger-foreground">
          Được tin tưởng bởi hàng nghìn chủ xe nhờ các phụ tùng chính hãng, giao
          hàng nhanh và hỗ trợ khách hàng đáng tin cậy.
        </p>
      </div>
    </section>
  );
}

function DefaultLogo() {
  return (
    <Link
      href="/"
      aria-label={FOOTER_COMPANY.name}
      className="group inline-flex items-center gap-3"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          "bg-primary/10 text-primary ring-1 ring-primary/20",
          "transition-transform duration-300",
          "group-hover:scale-105",
        )}
      >
        <Wrench className="h-6 w-6" />
      </div>

      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-button-danger-foreground">
          {FOOTER_COMPANY.name}
        </span>

        <span className="text-xs text-accent-foreground">
          Phụ tùng chính hãng giá tốt
        </span>
      </div>
    </Link>
  );
}

type TrustBadgeProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function TrustBadge({ icon: Icon, title, description }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-2xl border border-border/50",
        "bg-background/20 p-4 backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/20 hover:bg-background/30",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-medium text-primary-foreground">{title}</h4>

        <p className="mt-1 text-sm leading-5 text-shadow-primary-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

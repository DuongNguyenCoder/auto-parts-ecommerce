"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { FOOTER_CONTACTS, type FooterContactItem } from "./footer-config";

type FooterContactProps = {
  className?: string;
  title?: string;
};

export function FooterContact({
  className,
  title = "Contact",
}: FooterContactProps) {
  return (
    <section
      aria-labelledby="footer-contact-heading"
      className={cn("flex flex-col gap-5", className)}
    >
      <div>
        <h3
          id="footer-contact-heading"
          className="text-sm font-semibold uppercase tracking-wide text-button-danger-foreground"
        >
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-100">
          Cần giúp lựa chọn phụ tùng ô tô phù hợp? Đội ngũ của chúng tôi sẵn
          sàng hỗ trợ.
        </p>
      </div>

      <div className="space-y-3">
        {FOOTER_CONTACTS.map((item) => (
          <FooterContactCard key={`${item.label}-${item.value}`} item={item} />
        ))}
      </div>
    </section>
  );
}

type FooterContactCardProps = {
  item: FooterContactItem;
};

function FooterContactCard({ item }: FooterContactCardProps) {
  const Icon = item.icon;

  const content = (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-2xl border border-border/50",
        "bg-background/30 p-4 backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/20 hover:bg-background/20",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          "bg-primary/10 text-primary transition-transform duration-300",
          "group-hover:scale-105",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-button-danger-foreground">
          {item.label}
        </p>

        <div className="mt-1 flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-6 text-button-ghost-hover">
            {item.value}
          </p>

          {item.href && (
            <ArrowUpRight
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground",
                "transition-transform duration-300",
                "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                "group-hover:text-primary",
              )}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={`${item.label}: ${item.value}`}
        className={cn(
          "block rounded-2xl",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
        )}
      >
        {content}
      </Link>
    );
  }

  return content;
}

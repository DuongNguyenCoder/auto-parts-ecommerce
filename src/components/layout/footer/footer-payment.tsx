"use client";

import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoItem = {
  label: string;
  src: string;
};

type FooterPaymentProps = {
  className?: string;
  payments?: LogoItem[];
  shippings?: LogoItem[];
};

export function FooterPayment({
  className,
  payments = [],
  shippings = [],
}: FooterPaymentProps) {
  return (
    <section
      aria-labelledby="footer-payment-heading"
      className={cn("flex flex-col gap-8", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3
            id="footer-payment-heading"
            className="text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            Secure Shopping
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Safe payments, trusted delivery partners, and worry-free purchases.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid gap-3 sm:grid-cols-3">
        <TrustCard
          icon={ShieldCheck}
          title="Secure Payment"
          description="Encrypted checkout protection."
        />

        <TrustCard
          icon={Truck}
          title="Fast Delivery"
          description="Reliable shipping nationwide."
        />

        <TrustCard
          icon={RotateCcw}
          title="Easy Returns"
          description="Simple replacement process."
        />
      </div>

      {/* Payment Methods */}
      {payments.length > 0 && (
        <LogoSection title="Payment Methods" items={payments} />
      )}

      {/* Shipping Partners */}
      {shippings.length > 0 && (
        <LogoSection title="Shipping Partners" items={shippings} />
      )}
    </section>
  );
}

type LogoSectionProps = {
  title: string;
  items: LogoItem[];
};

function LogoSection({ title, items }: LogoSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h4>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <LogoCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

type LogoCardProps = {
  item: LogoItem;
};

function LogoCard({ item }: LogoCardProps) {
  return (
    <div
      aria-label={item.label}
      className={cn(
        "group relative flex h-14 min-w-[84px] items-center justify-center overflow-hidden rounded-2xl",
        "border border-border/60 bg-background/40 px-4 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:border-primary/20",
        "hover:bg-background/80",
        "hover:shadow-md",
      )}
    >
      <Image
        src={item.src}
        alt={item.label}
        width={70}
        height={28}
        className={cn(
          "h-auto max-h-8 w-auto object-contain opacity-80",
          "transition duration-300 group-hover:opacity-100",
        )}
      />
    </div>
  );
}

type TrustCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function TrustCard({ icon: Icon, title, description }: TrustCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border border-border/50",
        "bg-background/40 p-4 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-primary/20",
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
        <h4 className="text-sm font-medium text-foreground">{title}</h4>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

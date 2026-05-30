import { cn } from "@/lib/utils";

import {
  FOOTER_LINK_SECTIONS,
  FOOTER_PAYMENT_METHODS,
  FOOTER_SHIPPING_PARTNERS,
} from "./footer-config";

import { FooterBrand } from "./footer-brand";
import { FooterLinks } from "./footer-links";
import { FooterContact } from "./footer-contact";
import { FooterPayment } from "./footer-payment";
import { FooterBottom } from "./footer-bottom";
import { FooterNewsletter } from "./footer-newsletter";

type FooterOption = {
  label: string;
  value: string;
};

type FooterProps = {
  className?: string;

  locale?: string;
  currency?: string;

  locales?: FooterOption[];
  currencies?: FooterOption[];

  onLocaleChange?: (value: string) => void;

  onCurrencyChange?: (value: string) => void;

  onNewsletterSubmit?: (values: { email: string }) => Promise<void>;

  logo?: React.ReactNode;

  showNewsletter?: boolean;
  showPayments?: boolean;
};

export function Footer({
  className,

  locale,
  currency,

  locales = [],
  currencies = [],

  onLocaleChange,
  onCurrencyChange,

  onNewsletterSubmit,

  logo,

  showNewsletter = true,
  showPayments = true,
}: FooterProps) {
  const paymentLogos = FOOTER_PAYMENT_METHODS.map((method) => ({
    label: method,
    src: `/payments/${method}.svg`,
  }));

  const shippingLogos = FOOTER_SHIPPING_PARTNERS.map((partner) => ({
    label: partner,
    src: `/shipping/${partner}.svg`,
  }));

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-border/50 bg-slate-950 text-accent-foreground",
        className,
      )}
    >
      {/* Background glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%)]",
        )}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Newsletter */}
        {showNewsletter && (
          <section className="py-10 md:py-14">
            <FooterNewsletter onSubmit={onNewsletterSubmit} />
          </section>
        )}

        {/* Main Footer */}
        <section
          className={cn(
            "grid gap-10 border-t border-border/30 py-10 md:py-14",
            "lg:grid-cols-[1.3fr_1.5fr_1fr]",
          )}
        >
          {/* Brand */}
          <div className="min-w-0">
            <FooterBrand logo={logo} />
          </div>

          {/* Links */}
          <div className="min-w-0">
            <FooterLinks sections={FOOTER_LINK_SECTIONS} />
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <FooterContact />
          </div>
        </section>

        {/* Payment & Shipping */}
        {/* {showPayments && (
          <section className="border-t border-border/30 py-10 md:py-12">
            <FooterPayment payments={paymentLogos} shippings={shippingLogos} />
          </section>
        )} */}

        {/* Bottom */}
        <FooterBottom
          className="border-border/30"
          locale={locale}
          currency={currency}
          locales={locales}
          currencies={currencies}
          onLocaleChange={onLocaleChange}
          onCurrencyChange={onCurrencyChange}
          legalLinks={
            FOOTER_LINK_SECTIONS.find((section) => section.id === "legal")
              ?.links ?? []
          }
        />
      </div>
    </footer>
  );
}

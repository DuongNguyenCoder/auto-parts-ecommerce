"use client";

import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { FOOTER_COMPANY } from "./footer-config";

type FooterBottomProps = {
  className?: string;

  legalLinks?: {
    label: string;
    href: string;
  }[];

  locales?: {
    label: string;
    value: string;
  }[];

  currencies?: {
    label: string;
    value: string;
  }[];

  locale?: string;
  currency?: string;

  onLocaleChange?: (value: string) => void;

  onCurrencyChange?: (value: string) => void;
};

export function FooterBottom({
  className,
  legalLinks = [],
  locales = [],
  currencies = [],
  locale,
  currency,
  onLocaleChange,
  onCurrencyChange,
}: FooterBottomProps) {
  const currentYear = new Date().getFullYear();

  return (
    <section
      aria-label="Footer bottom"
      className={cn("border-t border-border/50 py-6", className)}
    >
      <div
        className={cn(
          "flex flex-col gap-5",
          "lg:flex-row lg:items-center lg:justify-between",
        )}
      >
        {/* Left */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            © {currentYear}{" "}
            <span className="font-medium text-accent-foreground">
              {FOOTER_COMPANY.name}
            </span>
            . {FOOTER_COMPANY.copyright}
          </p>

          {legalLinks.length > 0 && (
            <nav aria-label="Legal navigation">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors duration-200",
                        "hover:text-primary",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-ring",
                        "focus-visible:ring-offset-2 rounded-sm",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {locales.length > 0 && (
            <FooterSelect
              icon={Globe}
              value={locale}
              options={locales}
              onChange={onLocaleChange}
              ariaLabel="Select language"
            />
          )}

          {currencies.length > 0 && (
            <FooterSelect
              value={currency}
              options={currencies}
              onChange={onCurrencyChange}
              ariaLabel="Select currency"
            />
          )}
        </div>
      </div>
    </section>
  );
}

type FooterSelectProps = {
  value?: string;

  options: {
    label: string;
    value: string;
  }[];

  onChange?: (value: string) => void;

  icon?: React.ElementType;

  ariaLabel: string;
};

function FooterSelect({
  value,
  options,
  onChange,
  icon: Icon,
  ariaLabel,
}: FooterSelectProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}

      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "h-11 min-w-[160px] appearance-none rounded-2xl border border-border/60",
          "bg-background/50 px-4 pr-10 text-sm text-foreground",
          "backdrop-blur-sm transition-colors duration-200",
          "hover:border-primary/20",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-ring",
        )}
        style={{
          paddingLeft: Icon ? 42 : undefined,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2",
          "text-muted-foreground",
        )}
      />
    </div>
  );
}

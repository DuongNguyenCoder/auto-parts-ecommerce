"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { FooterLinkSection } from "./footer-config";
import { cn } from "@/lib/utils";

type FooterLinksProps = {
  sections: FooterLinkSection[];
  className?: string;
};

export function FooterLinks({ sections, className }: FooterLinksProps) {
  return (
    <nav aria-label="Footer navigation" className={cn("w-full", className)}>
      {/* Desktop / Tablet */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {sections.map((section) => (
          <FooterDesktopSection key={section.id} section={section} />
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <FooterMobileSection key={section.id} section={section} />
          ))}
        </Accordion>
      </div>
    </nav>
  );
}

type FooterSectionProps = {
  section: FooterLinkSection;
};

function FooterDesktopSection({ section }: FooterSectionProps) {
  return (
    <section aria-labelledby={`footer-${section.id}`}>
      <h3
        id={`footer-${section.id}`}
        className="mb-5 text-sm md:text-[16px] font-semibold uppercase tracking-wide text-button-danger-foreground"
      >
        {section.title}
      </h3>

      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.label}>
            <FooterLinkItem {...link} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FooterMobileSection({ section }: FooterSectionProps) {
  return (
    <AccordionItem value={section.id} className="border-b border-border/50">
      <AccordionTrigger className="group py-4 text-left hover:no-underline">
        <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {section.title}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
            "group-data-[state=open]:rotate-180",
          )}
        />
      </AccordionTrigger>

      <AccordionContent className="pb-4 pt-1">
        <ul className="space-y-3">
          {section.links.map((link) => (
            <li key={link.label}>
              <FooterLinkItem {...link} />
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

type FooterLinkItemProps = {
  label: string;
  href: string;
  external?: boolean;
};

function FooterLinkItem({ label, href, external }: FooterLinkItemProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex text-sm text-button-ghost-hover transition-all duration-200",
        "hover:text-primary",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "rounded-sm",
      )}
    >
      <span className="relative">
        {label}

        <span
          className={cn(
            "absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300",
            "group-hover:w-full",
          )}
        />
      </span>
    </Link>
  );
}

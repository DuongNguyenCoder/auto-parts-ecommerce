import Link from "next/link";

import { BadgeHelp, Mail, MapPinned, PhoneCall, Truck } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { HEADER_CONTACT, HEADER_TOP_LINKS } from "./constants";

export function TopHeader() {
  return (
    <div className="hidden sm:flex border-b border-white/10 bg-sidebar text-sidebar-foreground">
      <div className="container-page flex h-10 items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4 text-xs md:text-sm">
          {/* Shipping */}
          {/* <div className="hidden md:flex items-center gap-2 text-sidebar-foreground/90">
            <Truck className="size-4 shrink-0" />

            <span className="font-medium">
              Free shipping for orders over $100
            </span>
          </div> */}

          <Link
            href={`mailto:${HEADER_CONTACT.supportEmail}`}
            className="hidden md:flex items-center gap-2 transition-colors hover:text-primary
            "
          >
            <Mail className="size-4 shrink-0" />

            <span className="font-semibold">{HEADER_CONTACT.supportEmail}</span>
          </Link>

          <Separator
            orientation="vertical"
            className="hidden h-5 bg-sidebar-foreground/20 md:block"
          />

          {/* Hotline */}
          <Link
            href={`tel:${HEADER_CONTACT.phone1}`}
            className="
              flex items-center gap-2
              transition-colors
              hover:text-primary
            "
          >
            <PhoneCall className="size-4 shrink-0" />

            <span className="font-semibold">{HEADER_CONTACT.phone1}</span>
          </Link>

          <Link
            href={`tel:${HEADER_CONTACT.phone2}`}
            className="
              flex items-center gap-2
              transition-colors
              hover:text-primary
            "
          >
            <PhoneCall className="size-4 shrink-0" />

            <span className="font-semibold">{HEADER_CONTACT.phone2}</span>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 text-xs md:text-sm">
          {/* <Link
            href="/store-location"
            className="
              hidden md:flex
              items-center gap-2
              text-sidebar-foreground/90
              transition-colors
              hover:text-primary
            "
          >
            <MapPinned className="size-4" />

            <span>Vị trí showroom</span>
          </Link> */}

          <Separator
            orientation="vertical"
            className="hidden h-5 bg-sidebar-foreground/20 md:block"
          />

          {HEADER_TOP_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex items-center gap-2
                transition-colors
                hover:text-primary
              "
            >
              <BadgeHelp className="size-4 sm:hidden md:block" />

              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

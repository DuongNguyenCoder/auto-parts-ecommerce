// components/layout/footer/footer-config.ts

import type { LucideIcon } from "lucide-react";
import { MessageSquare, MapPin, Mail, Phone, Clock3 } from "lucide-react";

export type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkSection = {
  id: string;
  title: string;
  links: FooterLinkItem[];
};

export type FooterSocialItem = {
  label: string;
  href: string;
  icon: string;
};

export type FooterContactItem = {
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon;
};

export const FOOTER_LINK_SECTIONS: FooterLinkSection[] = [
  {
    id: "category",
    title: "Danh mục phụ tùng sản phẩm",
    links: [
      {
        label: "Brake Pads",
        href: "/products/brake-pads",
      },
      {
        label: "Tires",
        href: "/products/tires",
      },
      {
        label: "Engine Parts",
        href: "/products/engine-parts",
      },
      {
        label: "Oil & Fluids",
        href: "/products/oil-fluids",
      },
      {
        label: "Accessories",
        href: "/products/accessories",
      },
    ],
  },

  {
    id: "support",
    title: "Support",
    links: [
      {
        label: "Help Center",
        href: "/help-center",
      },
      {
        label: "Shipping Information",
        href: "/shipping",
      },
      {
        label: "Returns & Refunds",
        href: "/returns",
      },
      {
        label: "Warranty Policy",
        href: "/warranty",
      },
      {
        label: "Track Your Order",
        href: "/track-order",
      },
    ],
  },

  {
    id: "company",
    title: "Company",
    links: [
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "Contact Us",
        href: "/contact",
      },
      {
        label: "Careers",
        href: "/careers",
      },
      {
        label: "Become a Partner",
        href: "/partners",
      },
    ],
  },

  {
    id: "legal",
    title: "Legal",
    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        href: "/terms",
      },
      {
        label: "Cookie Policy",
        href: "/cookies",
      },
      {
        label: "Sitemap",
        href: "/sitemap",
      },
    ],
  },
];

export const FOOTER_SOCIALS: FooterSocialItem[] = [
  {
    label: "Zalo",
    href: "https://zalo.me/0982575404",
    icon: "/icon/zalo.png",
  },
  {
    label: "Messenger",
    href: "https://www.facebook.com/messages/t/1186874014505680",
    icon: "/icon/messenger.png",
  },
  {
    label: "Faccbook",
    href: "https://www.facebook.com/profile.php?id=61591526999516",
    icon: "/icon/facebook.png",
  },
];

export const FOOTER_CONTACTS: FooterContactItem[] = [
  {
    label: "Hotline",
    value: "0982 575 404",
    href: "tel:0982575404",
    icon: Phone,
  },
  {
    label: "Hotline",
    value: "0367 200 596",
    href: "tel:0367200596",
    icon: Phone,
  },
  {
    label: "Email",
    value: "thoxuanautopart@gmail.com",
    href: "mailto:thoxuanautopart@gmail.com",
    icon: Mail,
  },
  {
    label: "Địa chỉ",
    value: "Tu Hoàng, Xuân Phương, Nam Từ Liêm, Hà Nội ",
    icon: MapPin,
  },
];

export const FOOTER_PAYMENT_METHODS = [
  "visa",
  "mastercard",
  "paypal",
  "momo",
  "zalopay",
] as const;

export const FOOTER_SHIPPING_PARTNERS = [
  "ghn",
  "ghtk",
  "viettel-post",
] as const;

export const FOOTER_TRUST_ITEMS = [
  {
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    title: "Genuine Parts",
    description: "100% authentic products",
  },
  {
    title: "Expert Support",
    description: "Technical help available",
  },
] as const;

export const FOOTER_NEWSLETTER = {
  title: "Nhận chương trình khuyến mãi",
  description:
    "Đăng ký để biết các chương trình khuyến mãi, hàng mới về và mẹo bảo trì các loại phụ tùng.",
  placeholder: "Nhập email",
  buttonLabel: "Gửi thông tin",
};

export const FOOTER_COMPANY = {
  name: "Auto Thọ Xuân",
  description:
    "Điểm đến tin cậy của bạn cho các phụ tùng ô tô chính hãng, phụ kiện và dịch vụ hỗ trợ ô tô chuyên nghiệp.",
  copyright: "All rights reserved.",
};

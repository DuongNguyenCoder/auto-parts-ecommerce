// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_APP_URL || "https://autothoxuan.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/admin/"],
      },
    ],
    sitemap: [
      `${domain}/sitemap.xml`,
      `${domain}/san-pham/sitemap.xml`,
      `${domain}/tin-tuc-khuyen-mai/sitemap.xml`,
      `${domain}/blog/sitemap.xml`,
      `${domain}/hang-xe/sitemap.xml`,
      `${domain}/dong-xe/sitemap.xml`,
    ],
  };
}

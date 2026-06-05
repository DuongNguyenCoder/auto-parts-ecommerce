import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://autothoxuan.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://autothoxuan.com/tin-tuc-khuyen-mai",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://autothoxuan.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },

    {
      url: "https://autothoxuan.com/ho-tro",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://autothoxuan.com/gioi-thieu",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: "https://autothoxuan.com/san-pham",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://autothoxuan.com/thanh-toan",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: "https://autothoxuan.com/gio-hang",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];
}

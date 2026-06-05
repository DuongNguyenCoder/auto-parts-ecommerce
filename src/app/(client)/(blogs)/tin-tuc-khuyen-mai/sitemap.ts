import { postService } from "@/server/services/posts.service";
import { Post } from "@/types";
import type { MetadataRoute } from "next";

const domain = process.env.NEXT_PUBLIC_APP_URL || "https:/autothoxuan.com";
const SITEMAP_SIZE = 50;

const safeMap = <T, R>(data: unknown, mapper: (item: T) => R): R[] => {
  if (!Array.isArray(data)) return [];
  return data.map(mapper);
};

export async function generateSitemaps() {
  try {
    const response = await postService.list({}, { take: 1 });

    const total = response?.pagination.total || 0;

    const sitemapCount = Math.ceil(total / SITEMAP_SIZE);

    return Array.from({ length: sitemapCount }, (_, index) => ({
      id: index,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = Number(await id);
  const now = new Date();

  try {
    const skip = SITEMAP_SIZE * sitemapId;

    const response = await postService.list(
      {},
      { take: SITEMAP_SIZE, skip: skip },
    );

    return safeMap<Post, MetadataRoute.Sitemap[number]>(
      response?.items,
      (article) => ({
        url: `${domain}/hang-xe/${article.slug}`,
        lastModified: article.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );
  } catch {
    return [];
  }
}

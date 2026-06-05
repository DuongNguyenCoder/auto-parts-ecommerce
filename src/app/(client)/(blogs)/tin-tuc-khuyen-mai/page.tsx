import { PostListSection } from "@/components/blog/post-list-section";
import { postCategoryService } from "@/server/services/post-categories.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức và sự kiên khuyến mãi",
  description:
    "Chuyên cung cấp phụ tùng xe tải chính hãng cho nhiều dòng xe phổ biến tại Việt Nam. Hỗ trợ tra mã phụ tùng, tư vấn kỹ thuật và giao hàng nhanh toàn quốc.",
};

export default async function PromotionNewsPage() {
  const postCategoriesRes = await postCategoryService.list({}, { take: 100 });

  const postCategories = postCategoriesRes?.items ?? [];

  if (!postCategories.length) return <div>Không có danh mục tin tức</div>;
  return (
    <div className="space-y-8">
      {postCategories.map((category) => (
        <PostListSection key={category.id} postCategory={category} take={2} />
      ))}
    </div>
  );
}

import { PostListSection } from "@/components/blog/post-list-section";
import { postCategoryService } from "@/server/services/post-categories.service";
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

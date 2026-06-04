import { PostListFilter } from "@/components/blog/post-list-filter";
import { postCategoryService } from "@/server/services/post-categories.service";

export default async function BlogPostpage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const postCategory = await postCategoryService.getBySlug(slug);

  if (!postCategory) return <div>Thư mục tin tức không tồn tại...</div>;

  return (
    <PostListFilter
      key={postCategory.id}
      postCategory={postCategory}
      take={2}
    />
  );
}

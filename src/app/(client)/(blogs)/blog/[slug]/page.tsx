import { PostListFilter } from "@/components/blog/post-list-filter";
import { postCategoryApi, postApi } from "@/features/api";

export default async function BlogPostpage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await postCategoryApi.getBySlug(slug);

  const postCategory = response.data;

  if (!postCategory) return <div>Thư mục tin tức không tồn tại...</div>;

  return (
    <PostListFilter
      key={postCategory.id}
      postCategory={postCategory}
      take={2}
    />
  );
}

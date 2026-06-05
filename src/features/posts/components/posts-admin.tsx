"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { postApi } from "@/features/posts/api/post.api";
import { postCategoryApi } from "@/features/post-categories/api/post-category.api";
import type { Post } from "@/types";
import type { PostListQuery } from "@/types/query/post-query.type";
import { useRouter } from "next/navigation";

export const PostsAdmin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "DRAFT" | "PUBLISHED" | "ARCHIVED" | ""
  >("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  const query: PostListQuery = useMemo(
    () => ({
      page,
      limit: 10,
      title: search || undefined,
      status: statusFilter || undefined,
      postCategoryId: selectedCategoryId,
    }),
    [page, search, statusFilter, selectedCategoryId],
  );

  const postsQuery = useQuery({
    queryKey: ["posts", query],
    queryFn: () => postApi.getAll(query),
  });

  const categoriesQuery = useQuery({
    queryKey: ["post-categories", "admin"],
    queryFn: () => postCategoryApi.getAll({ take: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => postApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleOpenCreate = () => {
    router.push("/admin/posts/build");
  };

  const handleEdit = (post: Post) => {
    router.push(`/admin/posts/build?slug=${post.slug}`);
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    await deleteMutation.mutateAsync(post.slug);
  };

  const posts = postsQuery.data?.data?.items ?? [];
  const totalPages = postsQuery.data?.data?.pagination.totalPages ?? 1;
  const categories = categoriesQuery.data?.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-950">
              Trang quản lý bài viết
            </h1>
            <p className="text-sm text-zinc-600">
              Quản lý tất cả các bài viết từ title, nội dung, meta SEO, đường
              dẫn,... trên toàn hệ thống.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo title..."
              className="max-w-md"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as any)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
            >
              <option value="">Trạng thái</option>
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
            <select
              value={selectedCategoryId ?? ""}
              onChange={(event) =>
                setSelectedCategoryId(
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
            >
              <option value="">Tất cả danh mục bài viết</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleOpenCreate}>Thêm bài viết mới</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-3">Bài viết</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Tác giả</th>
                <th className="px-4 py-3">Ngày xuất bản</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={6}
                  >
                    {postsQuery.isFetching
                      ? "Loading posts..."
                      : "No posts found."}
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-zinc-200 last:border-b-0"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        {post.thumbnail ? (
                          <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-zinc-100">
                            <Image
                              src={post.thumbnail}
                              alt={post.title}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {post.title}
                          </p>
                          <p className="text-xs text-zinc-500">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-700">
                      {post.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "outline" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">{post.author?.email}</td>
                    <td className="px-4 py-4">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="delete"
                        onClick={() => handleDelete(post)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4">
          <PaginationCustom
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

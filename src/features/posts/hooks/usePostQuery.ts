import { useQuery } from "@tanstack/react-query";

import { postApi } from "@/features/posts/api/post.api";

import type { PostListQuery } from "@/types";

type LockedFilters = {
  postCategoryId?: number;
};

export function usePostsQuery(
  filters: PostListQuery = {},
  locked?: LockedFilters,
  initialData?: any,
) {
  const queryKey = ["posts", filters, locked];

  return useQuery({
    queryKey,

    queryFn: () =>
      postApi.getAll({
        ...filters,
        ...locked,
      }),

    initialData,

    staleTime: 1000 * 60 * 5, // 1 minute
  });
}

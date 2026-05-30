// import { ApiResponse, PaginatedData } from "@/types";

// type TransformPaginatedResponseOptions = {
//   take?: number;
//   skip?: number;
// };

// export const transformPaginatedResponse = <T>(
//   response: ApiResponse<PaginatedData<T>>,
//   options?: TransformPaginatedResponseOptions,
// ) => {
//   const take = options?.take ?? 10;
//   const skip = options?.skip ?? 0;

//   const items = response.data?.items ?? [];
//   const pagination = response.data?.pagination ?? {};

//   return {
//     success: response.success,
//     message: response.message,

//     data: items,

//     pagination: {
//       page: pagination?.page ?? Math.floor(skip / take) + 1,

//       totalpage: pagination.totalPages ?? 1,

//       totalPages: pagination.totalPages ?? 1,

//       total: pagination.total ?? 0,

//       take: pagination.take ?? take,

//       skip: pagination.skip ?? skip,
//     },
//   } satisfies ApiResponse<T[]> & {
//     pagination: PaginationMeta & {
//       totalpage: number;
//     };
//   };
// };

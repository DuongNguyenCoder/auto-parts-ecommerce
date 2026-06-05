"use client";

import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostFormFields, PostCategory } from "./post-form.types";
import FormSection, { FormField } from "@/components/forms/form-custom";
import { cn, inputCls, inputErrorCls } from "@/lib/utils";
import TinyEditor from "@/components/common/tiny-editor";
import { Textarea } from "@/components/ui/textarea";
import BuilderUploadImage from "@/components/common/upload-image-main";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import { Product, ProductListQuery } from "@/types";
import { productApi } from "@/features/products/api/product.api";

import { Check, Loader2, Search, X } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
  Badge,
} from "@/components/ui";
import { ProductToPost } from "@/types/post.type";

export const PostFormBasicGroup = ({
  register,
  errors,
  thumbnail,
  setValue,
  initialContent,
}: {
  register: UseFormRegister<PostFormFields>;
  errors: FieldErrors<PostFormFields>;
  thumbnail: string;
  setValue: UseFormSetValue<PostFormFields>;
  initialContent?: string;
}) => (
  <FormSection badge="Thông tin cơ bản">
    <div className="grid gap-4 lg:grid-cols-2">
      <FormField label="Title" required error={errors.title?.message}>
        <Input
          {...register("title")}
          className={cn(inputCls, errors.title && inputErrorCls)}
        />
      </FormField>

      <FormField label="Slug" required error={errors.slug?.message}>
        <Input
          {...register("slug")}
          placeholder="https://example.vn"
          className={cn(inputCls, errors.slug && inputErrorCls)}
        />
      </FormField>
    </div>

    <FormField label="Content" error={errors.content?.message}>
      <TinyEditor
        initialValue={initialContent ?? ""}
        onChange={(content) =>
          setValue("content", content, { shouldValidate: true })
        }
        folder="posts-content"
      />
    </FormField>

    <FormField
      label="Trích đoạn"
      hint="Nội dung ngắn hiển thị ở các thẻ bài viết"
      error={errors.excerpt?.message}
    >
      <Textarea
        rows={4}
        className="resize-none rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none transition focus:border-zinc-950"
        {...register("excerpt")}
      />
    </FormField>

    <FormSection
      badge="Ảnh chính bài viết"
      description="Hình ảnh nên có kích thước 16:9, ví dụ 1920x1080px để hiển thị tốt trên đa thiết bị."
    >
      <BuilderUploadImage
        imageUrl={thumbnail}
        folder="banners"
        error={errors.thumbnail?.message}
        onUploadSuccess={(url) => {
          setValue("thumbnail", url, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />
    </FormSection>
  </FormSection>
);

export const PostFormPublishGroup = ({
  control,
  register,
  errors,
  setValue,
  postCategories,
  initialProducts,
}: {
  control: Control<PostFormFields>;
  register: UseFormRegister<PostFormFields>;
  errors: FieldErrors<PostFormFields>;
  setValue: UseFormSetValue<PostFormFields>;
  postCategories: PostCategory[];
  // initialProducts?: ProductToPost[];
  initialProducts?: any[];
}) => {
  const statusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

  const [keyword, setKeyword] = useState("");

  const relatedProductIds =
    useWatch({
      control,
      name: "relatedProductIds",
    }) ?? [];

  const initialProductMap = useMemo(() => {
    if (!initialProducts?.length) return {};

    return Object.fromEntries(
      initialProducts.map((product) => [product.id, product]),
    );
  }, [initialProducts]);

  const [productMap, setProductMap] =
    useState<Record<number, ProductToPost>>(initialProductMap);

  const debouncedKeyword = useDebounce(keyword, 400);

  const productsQuery = useQuery({
    queryKey: ["products-search", debouncedKeyword],
    queryFn: async () => {
      const query: ProductListQuery = {
        take: 10,
        skip: 0,
        name: debouncedKeyword.trim() || undefined,
      };
      return productApi.getAll(query);
    },
    enabled: debouncedKeyword.trim().length >= 3,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const products: ProductToPost[] = productsQuery.data?.data?.items ?? [];

  useEffect(() => {
    setProductMap((prev) => ({
      ...initialProductMap,
      ...prev,
    }));
  }, [initialProductMap]);

  const selectedProducts = useMemo(() => {
    return relatedProductIds
      .map((id) => productMap[id])
      .filter((product): product is ProductToPost => Boolean(product));
  }, [relatedProductIds, productMap]);

  const selectedIdSet = useMemo(() => {
    return new Set(relatedProductIds);
  }, [relatedProductIds]);

  const handleSelect = (product: ProductToPost) => {
    const exists = relatedProductIds.includes(product.id);

    if (exists) return;

    setValue("relatedProductIds", [...relatedProductIds, product.id], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setProductMap((prev) => ({
      ...prev,
      [product.id]: product,
    }));

    setKeyword("");
  };

  const removeProduct = (id: number) => {
    const nextIds = relatedProductIds.filter((productId) => productId !== id);

    setValue("relatedProductIds", nextIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => !selectedIdSet.has(product.id));
  }, [products, selectedIdSet]);

  return (
    <>
      <FormSection badge="Thông tin xuất bản">
        <div className="grid gap-4 lg:grid-cols-3 justify-between">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
                <span>Status</span>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status ? (
                  <span className="text-sm font-normal text-red-600">
                    {errors.status.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
            Published at
            <Input type="date" {...register("publishedAt")} />
            {errors.publishedAt ? (
              <span className="text-sm font-normal text-red-600">
                {errors.publishedAt.message}
              </span>
            ) : null}
          </label>

          <Controller
            control={control}
            name="postCategoryId"
            render={({ field }) => (
              <div className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
                <span>Post category</span>
                <Select
                  value={
                    field.value !== undefined ? String(field.value) : "none"
                  }
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? undefined : Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {postCategories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.postCategoryId ? (
                  <span className="text-sm font-normal text-red-600">
                    {errors.postCategoryId.message}
                  </span>
                ) : null}
              </div>
            )}
          />
        </div>
      </FormSection>

      <FormSection badge="Sản phẩm có liên quan" className="space-y-2">
        {/* selected */}
        <FormField
          label="Related products"
          hint="Tìm kiến và chọn sản phẩm liên quan đến bài viết (không bắt buộc)"
        >
          {selectedProducts && !!selectedProducts.length && (
            <div className="flex flex-wrap gap-2 rounded-md border p-3">
              {selectedProducts.map((product) => (
                <Badge
                  key={product.id}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-md px-3 py-1"
                >
                  <span className="max-w-[180px] truncate">{product.name}</span>

                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="rounded-sm p-0.5 hover:bg-zinc-300"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </FormField>

        <Popover open={!!keyword}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={keyword}
                placeholder="Search related products..."
                className={cn(inputCls, "pl-9", errors.title && inputErrorCls)}
                onChange={(e) => setKeyword(e.target.value)}
              />

              {productsQuery.isFetching && (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] p-0"
          >
            <Command shouldFilter={false}>
              <CommandList>
                <ScrollArea className="max-h-72">
                  {!productsQuery.isFetching && !filteredProducts.length && (
                    <CommandEmpty>No products found</CommandEmpty>
                  )}

                  <CommandGroup>
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        className="cursor-pointer"
                        onSelect={() => handleSelect(product)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {product.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              ID: {product.id}
                            </p>
                          </div>

                          {relatedProductIds.includes(product.id) && (
                            <Check className="size-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormSection>
    </>
  );
};

export const PostFormSeoGroup = ({
  register,
  errors,
}: {
  register: UseFormRegister<PostFormFields>;
  errors: FieldErrors<PostFormFields>;
}) => (
  <FormSection badge="Thông tin Meta SEO" className="grid gap-4 lg:grid-cols-2">
    <FormField label="Meta Title" error={errors.metaTitle?.message}>
      <Input
        {...register("metaTitle")}
        className={cn(inputCls, errors.metaTitle && inputErrorCls)}
      />
    </FormField>

    <FormField label="Meta Description" error={errors.metaDesc?.message}>
      <Textarea
        {...register("metaDesc")}
        className={cn(inputCls, "h-26", errors.metaDesc && inputErrorCls)}
      />
    </FormField>
  </FormSection>
);

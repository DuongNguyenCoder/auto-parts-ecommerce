"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategorySchema,
  type CreateCategoryDTO,
  type UpdateCategoryDTO,
} from "@/validations/categories.schema";

type CategoryFormProps = {
  initialData?: Partial<CreateCategoryDTO>;
  onSubmit: (
    values: CreateCategoryDTO | UpdateCategoryDTO,
  ) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};

export const CategoryForm = ({
  initialData,
  onSubmit,
  submitLabel = "Save category",
  title = "Category details",
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryDTO>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm text-zinc-600">
          Enter the category name and URL slug.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Name
        <Input {...register("name")} />
        {errors.name ? (
          <span className="text-sm font-normal text-red-600">
            {errors.name.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Slug
        <Input {...register("slug")} />
        {errors.slug ? (
          <span className="text-sm font-normal text-red-600">
            {errors.slug.message}
          </span>
        ) : null}
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

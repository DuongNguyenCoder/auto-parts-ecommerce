"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBrandSchema,
  type CreateBrandDTO,
  type UpdateBrandDTO,
} from "@/validations/brands.schema";

type BrandFormProps = {
  initialData?: Partial<CreateBrandDTO>;
  onSubmit: (values: CreateBrandDTO | UpdateBrandDTO) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};

export const BrandForm = ({
  initialData,
  onSubmit,
  submitLabel = "Save brand",
  title = "Brand details",
}: BrandFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBrandDTO>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: initialData?.name ?? "",
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
          Add or update a brand used for car models.
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

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCarModelSchema,
  type CreateCarModelDTO,
  type UpdateCarModelDTO,
} from "@/validations/car-models.schema";
import type { Brand } from "@/types";

const brandOptions = (brands: Brand[]) =>
  brands.map((brand) => ({ id: brand.id, label: `${brand.name}` }));

type CarModelFormProps = {
  initialData?: Partial<CreateCarModelDTO>;
  brands?: Brand[];
  onSubmit: (
    values: CreateCarModelDTO | UpdateCarModelDTO,
  ) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};

export const CarModelForm = ({
  initialData,
  brands = [],
  onSubmit,
  submitLabel = "Save car model",
  title = "Car model details",
}: CarModelFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateCarModelDTO>({
    resolver: zodResolver(createCarModelSchema),
    defaultValues: {
      brandId: initialData?.brandId ?? undefined,
      name: initialData?.name ?? "",
      year: initialData?.year ?? "",
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
          Create or update a vehicle model for product fitments.
        </p>
      </div>

      <Controller
        control={control}
        name="brandId"
        render={({ field }) => (
          <div className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
            <span>Brand</span>
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brandOptions(brands).map((brand) => (
                  <SelectItem key={brand.id} value={String(brand.id)}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brandId ? (
              <span className="text-sm font-normal text-red-600">
                {errors.brandId.message}
              </span>
            ) : null}
          </div>
        )}
      />

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Model name
        <Input {...register("name")} />
        {errors.name ? (
          <span className="text-sm font-normal text-red-600">
            {errors.name.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Year
        <Input {...register("year")} />
        {errors.year ? (
          <span className="text-sm font-normal text-red-600">
            {errors.year.message}
          </span>
        ) : null}
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

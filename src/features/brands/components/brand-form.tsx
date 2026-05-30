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
import FormSection, { FormField } from "@/components/forms/form-custom";
import { cn, inputCls, inputErrorCls } from "@/lib/utils";
import BuilderUploadImage from "@/components/common/upload-image-main";

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
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBrandDTO>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      slug: initialData?.slug ?? "",
    },
  });
  console.log("eerorore", errors);

  const imageUrl = watch("imageUrl");

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

      <FormSection badge="Thông tin hãng xe">
        <FormField label="Tên hãng xe" error={errors.name?.message}>
          <Input
            {...register("name")}
            className={cn(inputCls, errors?.name && inputErrorCls)}
          />
        </FormField>

        <FormField label="slug" error={errors.slug?.message}>
          <Input
            {...register("slug")}
            placeholder="ví dụ: dongfeng"
            className={cn(inputCls, errors.slug && inputErrorCls)}
          />
        </FormField>

        <FormField
          label="Ảnh hiển thị"
          hint="Nên chọn ảnh có tỉ lệ 1:1"
          error={errors.name?.message}
        >
          <BuilderUploadImage
            imageUrl={imageUrl}
            folder="brands"
            error={errors.imageUrl?.message}
            onUploadSuccess={(url) => {
              setValue("imageUrl", url, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
        </FormField>
      </FormSection>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

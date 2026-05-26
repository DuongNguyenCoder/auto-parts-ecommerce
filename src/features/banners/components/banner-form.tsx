"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CloudinaryUploadWidget } from "@/features/upload/components/cloudinary-upload-widget";
import {
  createBannerSchema,
  type CreateBannerDTO,
  type UpdateBannerDTO,
} from "@/validations/banners.schema";
import FormSection, { FormField } from "@/components/forms/form-custom";
import { cn, inputCls, inputErrorCls } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import BuilderUploadImage from "@/components/common/upload-image-main";

type BannerFormFields = z.input<typeof createBannerSchema>;

export const BannerForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save banner",
  title = "Banner details",
}: {
  initialData?: Partial<CreateBannerDTO>;
  onSubmit: (values: CreateBannerDTO | UpdateBannerDTO) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BannerFormFields>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      link: initialData?.link ?? "",
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" }) ?? "";

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as CreateBannerDTO))}
      className="relative mx-auto flex w-full max-w-4xl flex-col gap-5 pb-24"
    >
      <div className="mb-1 flex flex-col gap-1">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-600">
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h8M2 12h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Banner Management
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <FormSection
        badge="Thông tin cơ bản"
        description="Đặt tiêu đề và các thông tin cơ bản cho banner."
      >
        <FormField label="Title" required error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="banner sale off"
            className={cn(inputCls, errors.title && inputErrorCls)}
          />
        </FormField>

        <div className="flex justify-between gap-10">
          <FormField
            label="Link chuyển hướng khi click vào banner"
            required
            error={errors.link?.message}
          >
            <input
              {...register("link")}
              placeholder="https://example.com/sale"
              className={cn(inputCls, errors.link && inputErrorCls)}
            />
          </FormField>
          <FormField label="Kích hoạt" hint="Banner sẽ hiển thị ngoài website">
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch
                    className="data-[state=checked]:bg-sky-600 rounded-4xl"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Active
                </label>
              )}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        badge="Hình ảnh banner"
        description="Hình ảnh nên có kích thước 16:9, ví dụ 1920x1080px để hiển thị tốt trên đa thiết bị."
      >
        <BuilderUploadImage
          imageUrl={imageUrl}
          folder="banners"
          error={errors.imageUrl?.message}
          onUploadSuccess={(url) => {
            setValue("imageUrl", url, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        />
      </FormSection>

      {/* ── Sticky Footer ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "border-t border-sky-100 bg-white/90 px-6 py-4 backdrop-blur-xl",
          "shadow-[0_-4px_24px_rgba(56,189,248,0.08)]",
        )}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="text-[12px] text-slate-400">
            {isSubmitting
              ? "Saving…"
              : "All changes are saved automatically on submit"}
          </p>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className={cn(
                  "h-11 rounded-2xl border-[1.5px] border-sky-100 bg-transparent px-6",
                  "text-[13.5px] font-semibold text-slate-600 transition-all duration-200",
                  "hover:border-sky-200 hover:bg-sky-50 hover:text-slate-800",
                  "disabled:opacity-50",
                )}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "relative h-11 overflow-hidden rounded-2xl px-8",
                "bg-gradient-to-r from-sky-500 to-blue-600",
                "text-[13.5px] font-semibold text-white",
                "shadow-[0_4px_16px_rgba(37,99,235,0.3)]",
                "transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]",
                "active:scale-[0.98] active:translate-y-0",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13 5l-6 6-3-3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {submitLabel}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

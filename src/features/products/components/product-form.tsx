"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { cn, inputCls, inputErrorCls } from "@/lib/utils";
import {
  createProductSchema,
  type CreateProductDTO,
  type UpdateProductDTO,
} from "@/validations/products.schema";
import type { Category, CarModel } from "@/types";
import { UploadImageDialog } from "@/features/upload/components";
import FormSection, { FormField } from "@/components/forms/form-custom";
import BuilderUploadImage from "@/components/common/upload-image-main";

// ─── Schema ──────────────────────────────────────────────────────────────────

const productFormSchema = createProductSchema
  .omit({ fitmentIds: true })
  .extend({ fitmentIdsInput: z.string().optional() });

type ProductFormValues = z.input<typeof productFormSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductFormProps = {
  initialData?: Partial<CreateProductDTO>;
  categories?: Category[];
  fitments?: CarModel[];
  onSubmit?: (
    values: CreateProductDTO | UpdateProductDTO,
  ) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
  subtitle?: string;
};

type FitmentOption = { id: number; label: string };

type MultipleSelectorProps<T> = {
  options: T[];
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  hasError?: boolean;
};

function MultipleSelector({
  options,
  selected,
  onChange,
  placeholder = "Chọn một hoặc nhiều ...",
  hasError,
}: MultipleSelectorProps<FitmentOption>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(
    (o) =>
      !selected.includes(o.id) &&
      o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedOptions = options.filter((o) => selected.includes(o.id));

  const addId = (id: number) => {
    onChange([...selected, id]);
    setQuery("");
    inputRef.current?.focus();
  };

  const removeId = (id: number) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <div className="relative">
      {/* Tag container */}
      <div
        className={cn(
          "min-h-[44px] cursor-text rounded-2xl border-[1.5px] border-sky-100 bg-slate-50 p-2 transition-all duration-200",
          "focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100/70",
          "hover:border-sky-200",
          hasError && inputErrorCls,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] font-medium text-sky-700"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeId(opt.id);
                }}
                className="ml-0.5 rounded-full text-sky-400 transition-colors hover:text-sky-700"
                aria-label={`Remove ${opt.label}`}
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-[0_8px_24px_rgba(56,189,248,0.14)] backdrop-blur-xl">
          <ul className="max-h-52 overflow-y-auto py-1.5">
            {filtered.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onMouseDown={() => addId(opt.id)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export const ProductForm = ({
  initialData,
  categories = [],
  fitments = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
  title = "Product details",
  subtitle = "Manage pricing, media and compatibility.",
}: ProductFormProps) => {
  // Parse initial fitment IDs
  const initialFitmentIds = useMemo(
    () => initialData?.fitmentIds?.filter((id) => id > 0) ?? [],
    [],
  );

  const [selectedFitmentIds, setSelectedFitmentIds] =
    useState<number[]>(initialFitmentIds);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      name: initialData?.name ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      price: initialData?.price ? Number(initialData.price) : undefined,
      categoryId: initialData?.categoryId ?? undefined,
      fitmentIdsInput: initialData?.fitmentIds?.join(",") ?? "",
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" }) ?? "";

  const fitmentOptions = useMemo(
    () =>
      fitments.map((fitment) => ({
        id: fitment.id,
        label: `${fitment?.brand?.name ?? ""} ${fitment.name}`,
      })),
    [fitments],
  );

  const handleFitmentsChange = (ids: number[]) => {
    setSelectedFitmentIds(ids);
    setValue("fitmentIdsInput", ids.join(","), { shouldValidate: true });
    console.log("selected fitment ids: ", ids);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    const payload: CreateProductDTO = {
      slug: values.slug,
      name: values.name,
      imageUrl: values.imageUrl,
      price: Number(values.price),
      categoryId: values.categoryId,
      fitmentIds:
        selectedFitmentIds.length > 0 ? selectedFitmentIds : undefined,
    };

    await onSubmit?.(payload);
  };

  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @keyframes slideError {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="relative mx-auto flex w-full max-w-4xl flex-col gap-5 pb-24"
      >
        {/* ── Page Header ──────────────────────────────────────────── */}
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
            Product Management
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        {/* ── Section 1: Basic Information ─────────────────────────── */}
        <FormSection
          badge="Thông tin cơ bản"
          badgeIcon={
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 7v4M8 5.5v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
          description="Đặt tên, slug và các thông tin cơ bản cho sản phẩm của bạn."
        >
          <FormField label="Tên sản phẩm" required error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="Nước mát động cơ"
              className={cn(inputCls, errors.name && inputErrorCls)}
            />
          </FormField>

          <FormField label="Slug" required error={errors.slug?.message}>
            <input
              {...register("slug")}
              placeholder="nuoc-mat-dong-co"
              className={cn(inputCls, errors.slug && inputErrorCls)}
            />
          </FormField>
        </FormSection>

        {/* ── Section 2: Media & Pricing ───────────────────────────── */}
        <FormSection
          badge="Ảnh & Giá tiền"
          badgeIcon={
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
              <rect
                x="1.5"
                y="3"
                width="13"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="5.5"
                cy="7"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M1.5 11l3.5-2.5 3 2 3-3 3 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          title=""
          description=""
        >
          {/* Image Upload */}
          <FormField label="Ảnh sản phẩm" error={errors.imageUrl?.message}>
            <BuilderUploadImage
              imageUrl={imageUrl}
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

          {/* Price */}
          <FormField label="Giá tiền" required error={errors.price?.message}>
            <div
              className={cn(
                "flex h-11 overflow-hidden rounded-2xl border-[1.5px] border-sky-100 bg-slate-50 transition-all duration-200",
                "focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100/70",
                "hover:border-sky-200",
                errors.price &&
                  "border-rose-300 bg-rose-50/50 focus-within:border-rose-400 focus-within:ring-rose-100/70",
              )}
            >
              <span className="flex items-center border-r border-sky-100 bg-sky-50 px-4 text-[14px] font-semibold text-sky-500">
                đ
              </span>
              <input
                type="number"
                step="5000"
                min="0"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="flex-1 bg-transparent px-4 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </FormField>
        </FormSection>

        {/* ── Section 3: Organization ──────────────────────────────── */}
        <FormSection
          badge="Phân loại"
          badgeIcon={
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h4v4H2zM10 4h4v4h-4zM6 10h4v4H6z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          }
          // title="Category"
          description="Gán sản phẩm vào một danh mục để khách hàng dễ dàng tìm kiếm và lọc sản phẩm."
        >
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormField
                label="Danh mục"
                required
                error={errors.categoryId?.message}
              >
                <div className="relative">
                  <select
                    value={field.value ? String(field.value) : ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={cn(
                      inputCls,
                      "appearance-none pr-10",
                      !field.value && "text-slate-400",
                      errors.categoryId && inputErrorCls,
                    )}
                  >
                    <option value="" disabled>
                      Chọn danh mục
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </FormField>
            )}
          />
        </FormSection>

        {/* ── Section 4: Vehicle Compatibility ─────────────────────── */}
        <FormSection
          badge="Phương tiện tương thích"
          badgeIcon={
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 10V8l2-4h8l2 4v2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="4.5"
                cy="11"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <circle
                cx="11.5"
                cy="11"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M6 11h4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          description="Chọn các loại xe mà sản phẩm này tương thích để khách hàng có thể lọc sản phẩm dựa trên loại xe của họ."
        >
          {/* Hidden input for RHF validation */}
          <input type="hidden" {...register("fitmentIdsInput")} />

          <FormField
            label="Loại xe"
            hint={
              selectedFitmentIds.length > 0
                ? `${selectedFitmentIds.length} vehicle${selectedFitmentIds.length > 1 ? "s" : ""} selected · submits as number[]`
                : "Chọn các loại xe mà sản phẩm này tương thích"
            }
            error={errors.fitmentIdsInput?.message}
          >
            <MultipleSelector
              options={fitmentOptions}
              selected={selectedFitmentIds}
              onChange={handleFitmentsChange}
              hasError={!!errors.fitmentIdsInput}
            />
          </FormField>

          {fitmentOptions.length === 0 && (
            <p className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-[12.5px] text-slate-400">
              Không có loại xe nào khả dụng. Vui lòng thêm loại xe (đời xe)
              trước khi gán sản phẩm vào loại xe đó.
            </p>
          )}
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
    </>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  PostFormBasicGroup,
  PostFormPublishGroup,
  PostFormSeoGroup,
} from "./post-form-sections";
import {
  PostFormOutput,
  postFormSchema,
  type PostFormFields,
  type PostFormProps,
} from "./post-form.types";
import { useEffect } from "react";
import {
  EMPTY_POST_FORM_VALUES,
  mapPostToFormValues,
} from "@/features/posts/mappers/post.mapper";
import { cn } from "@/lib/utils";

export const PostForm = ({
  initialData,
  postCategories = [],
  onSubmit,
  onCancel,
  submitLabel = "Save post",
  title = "Post details",
}: PostFormProps) => {
  const form = useForm<PostFormFields, unknown, PostFormOutput>({
    resolver: zodResolver(postFormSchema),

    defaultValues: EMPTY_POST_FORM_VALUES,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!initialData) return;

    reset(mapPostToFormValues(initialData));
  }, [initialData, reset]);

  console.log("Initial form values: ", initialData);

  const thumbnail = useWatch({ control, name: "thumbnail" }) ?? "";

  const handleSubmitData = async (values: PostFormFields) => {
    console.log(values.publishedAt);
    console.log(typeof values.publishedAt);
    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      excerpt: values.excerpt,
      thumbnail: values.thumbnail,
      status: values.status,
      publishedAt:
        values.publishedAt instanceof Date ? values.publishedAt : undefined,
      metaTitle: values.metaTitle,
      metaDesc: values.metaDesc,
      postCategoryId: values.postCategoryId,
      relatedProductIds: values.relatedProductIds,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitData)}
      className="relative mx-auto flex w-full max-w-[1100px] flex-col gap-5 pb-24"
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
          Posts Management
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      <PostFormBasicGroup
        register={register}
        errors={errors}
        thumbnail={thumbnail}
        setValue={setValue}
        initialContent={initialData?.content}
      />

      <PostFormPublishGroup
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
        postCategories={postCategories}
        initialProducts={initialData?.relatedProducts ?? []}
      />
      <PostFormSeoGroup register={register} errors={errors} />

      <div
        className={cn(
          "sticky bottom-0 left-0 right-0 z-40",
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

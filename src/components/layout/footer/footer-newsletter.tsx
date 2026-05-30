"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FOOTER_NEWSLETTER } from "./footer-config";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

type FooterNewsletterProps = {
  className?: string;

  onSubmit?: (values: NewsletterFormValues) => Promise<void>;
};

export function FooterNewsletter({
  className,
  onSubmit,
}: FooterNewsletterProps) {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleSubmit(values: NewsletterFormValues) {
    try {
      setSubmitState("idle");

      if (onSubmit) {
        await onSubmit(values);
      } else {
        // fallback demo delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      setSubmitState("success");

      form.reset();
    } catch (error) {
      console.error(error);

      setSubmitState("error");
    }
  }

  return (
    <section
      aria-labelledby="footer-newsletter"
      className={cn(
        "relative overflow-hidden rounded-[2rem]",
        "border border-border/60",
        "bg-background/60",
        "backdrop-blur-xl",
        "p-6 md:p-8",
        className,
      )}
    >
      {/* Background glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
        )}
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Content */}
        <div className="max-w-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-7 w-7" />
          </div>

          <h2
            id="footer-newsletter"
            className="text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            {FOOTER_NEWSLETTER.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-button-outline">
            {FOOTER_NEWSLETTER.description}
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-xl">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
            noValidate
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={FOOTER_NEWSLETTER.placeholder}
                  aria-invalid={!!form.formState.errors.email}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 rounded-2xl border-border/60",
                    "bg-background/70",
                    "px-4",
                    "focus-visible:ring-primary",
                  )}
                  {...form.register("email")}
                />

                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "h-12 rounded-2xl px-6 font-medium",
                  "sm:min-w-[170px]",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  FOOTER_NEWSLETTER.buttonLabel
                )}
              </Button>
            </div>

            {/* Status */}
            {submitState === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />

                <span>
                  Successfully subscribed! {"You'll"} receive promotions and
                  product updates soon.
                </span>
              </div>
            )}

            {submitState === "error" && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Something went wrong. Please try again.
              </div>
            )}

            <p className="text-xs leading-5 text-foreground/80">
              Bằng cách đăng ký, bạn đồng ý nhận email khuyến mãi. Bạn có thể
              hủy đăng ký bất cứ lúc nào.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

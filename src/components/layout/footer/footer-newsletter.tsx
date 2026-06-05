"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createConsulationSchema } from "@/validations/consulations.schema";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";

const CONTENT = {
  title: "Đăng ký nhận tư vấn miễn phí",
  description:
    "Điền thông tin bên dưới — chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để hỗ trợ tìm đúng phụ tùng theo nhu cầu.",
  buttonLabel: "Gửi yêu cầu tư vấn",
  success:
    "Yêu cầu tư vấn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
  error: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
  privacy:
    "Bằng cách gửi yêu cầu, bạn đồng ý để chúng tôi liên hệ qua số điện thoại hoặc email. Thông tin của bạn được bảo mật tuyệt đối.",
};

const inputBase = cn(
  // size & shape
  "h-11 w-full rounded-xl px-4",
  // colors — muted bg, transparent border by default
  "border border-transparent bg-muted text-foreground",
  "placeholder:text-muted-foreground/55",
  // transitions
  "transition-[border-color,background-color,box-shadow] duration-150 ease-out",
  // hover
  "hover:border-border hover:bg-[hsl(210_40%_94%)]",
  // focus
  "focus-visible:border-primary focus-visible:bg-background",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/15",
  // disabled
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const inputError = cn(
  "border-destructive bg-destructive/[0.04]",
  "hover:border-destructive/80",
  "focus-visible:border-destructive focus-visible:ring-destructive/15",
);

type ConsultationFormValues = {
  phone: string;
  name: string;
  email?: string;
  note?: string;
};

type FooterNewsletterProps = {
  className?: string;

  onSubmit?: (values: ConsultationFormValues) => Promise<void>;
};

export function FooterNewsletter({
  className,
  onSubmit,
}: FooterNewsletterProps) {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const { session, isAuthenticated } = useAuth();

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(createConsulationSchema),
    defaultValues: {
      phone: "",
      name: "",
      email: "",
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function submitForm(values: ConsultationFormValues) {
    try {
      setSubmitState("idle");
      if (!isAuthenticated) {
        setSubmitState("error");
        toast.warning("Vui lòng đăng nhập.");
      }

      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default: call API endpoint
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: values.phone,
            name: values.name,
            email: values.email || undefined,
            note: values.note || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create consultation");
        }
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
      aria-labelledby="newsletter-title"
      className={cn(
        "relative overflow-hidden rounded-[1.75rem]",
        "border border-border/60 bg-card",
        "p-6 md:p-8 lg:p-10",
        className,
      )}
    >
      {/* Top accent bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-[1.75rem]"
        style={{
          background:
            "linear-gradient(90deg, hsl(207 90% 54%), hsl(199 89% 48%))",
        }}
      />

      {/* Subtle corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(207 90% 54% / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-7">
        {/* ── Header ── */}
        <div className="max-w-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[13px] bg-primary/10 text-primary">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>

          <h2
            id="newsletter-title"
            className="text-xl font-semibold leading-tight tracking-tight text-foreground md:text-[1.35rem]"
          >
            {CONTENT.title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {CONTENT.description}
          </p>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-4"
          noValidate
        >
          {/* Row: Name + Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <FieldLabel htmlFor="f-name">
                Tên của bạn
                <RequiredDot />
                <span className="sr-only">(bắt buộc)</span>
              </FieldLabel>
              <Input
                id="f-name"
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
                className={cn(inputBase, errors.name && inputError)}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Phone */}
            <div>
              <FieldLabel htmlFor="f-phone">
                Số điện thoại
                <RequiredDot />
                <span className="sr-only">(bắt buộc)</span>
              </FieldLabel>
              <Input
                id="f-phone"
                type="tel"
                placeholder="0912 345 678"
                autoComplete="tel"
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                className={cn(inputBase, errors.phone && inputError)}
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          {/* Email */}
          <div>
            <FieldLabel htmlFor="f-email">
              Email{" "}
              <span className="font-normal text-muted-foreground/55">
                (tùy chọn)
              </span>
            </FieldLabel>
            <Input
              id="f-email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              className={cn(inputBase, errors.email && inputError)}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Note */}
          <div>
            <FieldLabel htmlFor="f-note">
              Ghi chú{" "}
              <span className="font-normal text-muted-foreground/55">
                (tùy chọn)
              </span>
            </FieldLabel>
            <textarea
              id="f-note"
              placeholder="Ví dụ: cần phanh Toyota Camry 2020…"
              disabled={isSubmitting}
              className={cn(
                "min-h-[100px] w-full resize-y rounded-xl px-4 py-3",
                "border border-transparent bg-muted",
                "text-sm text-foreground placeholder:text-muted-foreground/55",
                "transition-[border-color,background-color,box-shadow] duration-150 ease-out",
                "hover:border-border hover:bg-[hsl(210_40%_94%)]",
                "focus-visible:border-primary focus-visible:bg-background",
                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/15",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.note && inputError,
              )}
              {...register("note")}
            />
            <FieldError message={errors.note?.message} />
          </div>

          <Separator className="opacity-50" />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-11 w-full rounded-[14px] font-semibold",
              "transition-[background-color,box-shadow,transform] duration-150",
              "hover:shadow-[0_4px_16px_hsl(207_90%_54%/0.25)]",
              "active:scale-[0.985]",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Đang gửi...
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                {CONTENT.buttonLabel}
              </>
            )}
          </Button>

          {/* Status banners */}
          {submitState === "success" && (
            <StatusBanner type="success" message={CONTENT.success} />
          )}
          {submitState === "error" && (
            <StatusBanner type="error" message={CONTENT.error} />
          )}

          {/* Privacy note */}
          <p className="text-[0.715rem] leading-relaxed text-foreground/45">
            {CONTENT.privacy}
          </p>
        </form>
      </div>
    </section>
  );
}

function RequiredDot() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle"
    />
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[0.775rem] font-medium tracking-wide text-muted-foreground"
    >
      {children}
    </label>
  );
}

/** Inline error message */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-destructive">
      <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/** Success / error status banner */
function StatusBanner({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const ok = type === "success";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        ok
          ? "border-[hsl(142_72%_40%/0.22)] bg-[hsl(142_72%_40%/0.08)] text-[hsl(142_72%_28%)]"
          : "border-destructive/20 bg-destructive/[0.07] text-destructive",
      )}
    >
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{message}</span>
    </div>
  );
}

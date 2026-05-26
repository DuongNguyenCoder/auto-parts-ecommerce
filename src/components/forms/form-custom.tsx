import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

type FormSectionProps = {
  badge: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormSection({
  badge,
  badgeIcon,
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "group rounded-[28px] border border-sky-100/70 bg-white/85 p-6",
        "shadow-[0_4px_24px_rgba(56,189,248,0.07),0_1px_4px_rgba(148,163,184,0.06)]",
        "backdrop-blur-xl transition-shadow duration-300",
        "hover:shadow-[0_8px_32px_rgba(56,189,248,0.12),0_1px_4px_rgba(148,163,184,0.08)]",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-sky-600">
          {badgeIcon}
          {badge}
        </span>
        {title && (
          <h3 className="text-[15px] font-semibold text-slate-900 mt-3">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {/* Divider */}
      <div className="mb-5 h-px bg-linear-to-r from-sky-200/80 via-sky-100/50 to-transparent" />

      {/* Content */}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function FormField({
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-[12.5px] font-semibold tracking-wide text-slate-600">
        {label}
        {required && <span className="text-sky-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-slate-400">{hint}</p>}
      {error && <FormError message={error} />}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p className="flex animate-[slideError_0.18s_ease] items-center gap-1.5 text-[12px] text-rose-500">
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 5v3.5M8 10.5v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </p>
  );
}

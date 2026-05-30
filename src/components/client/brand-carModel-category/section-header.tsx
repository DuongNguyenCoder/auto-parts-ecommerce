import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string;
};

export function SectionHeader({ title, className }: Props) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative flex items-center gap-3">
        {/* Left accent line */}
        <span className="h-px w-10 xs:w-15 md:w-24 bg-linear-to-r from-transparent to-accent" />

        <h3 className="text-lg font-semibold tracking-wide uppercase text-foreground px-1">
          {title}
        </h3>

        {/* Right accent line */}
        <span className="h-px w-10 xs:w-15 md:w-24 bg-linear-to-l from-transparent to-accent" />
      </div>
    </div>
  );
}

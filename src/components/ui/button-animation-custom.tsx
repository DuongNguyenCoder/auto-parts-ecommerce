"use client";

import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";

type ButtonProps = {
  content: string;
  url?: string;
};

export default function ButtonBase({ content, url = "#" }: ButtonProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Arrow */}
      <div className="animate-bounce text-red-600">
        <ChevronsDownIcon size={28} />
      </div>

      {/* Button */}
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center justify-center
          rounded-full px-8 py-3
          font-bold text-white
          shadow-lg transition-all duration-300
          hover:-translate-y-0.5 hover:shadow-xl
          active:translate-y-0 active:scale-[0.98]
          bg-linear-to-br
          from-foreground to-primary
        "
      >
        {content}
      </Link>
    </div>
  );
}

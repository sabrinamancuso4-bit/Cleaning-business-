import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Temporary wordmark. Text comes from siteConfig so renaming is one edit. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} – home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className={cn(
          "relative grid size-9 place-items-center rounded-[10px] transition-transform duration-500 group-hover:rotate-[8deg]",
          tone === "dark" ? "bg-navy" : "bg-paper",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5">
          <path d="M5 4h14v4H9v3h8v4H9v5H5z" fill={tone === "dark" ? "#FAFAF7" : "#142638"} />
          <circle cx="17.5" cy="18" r="2.2" fill="#3F817D" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-extrabold tracking-[0.18em]",
            tone === "dark" ? "text-navy" : "text-paper",
          )}
        >
          {siteConfig.shortName}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em]",
            tone === "dark" ? "text-muted" : "text-paper/60",
          )}
        >
          {siteConfig.descriptor}
        </span>
      </span>
    </Link>
  );
}
